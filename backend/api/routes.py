import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse

from ai_modules.business_ai import BusinessAI
from ai_modules.chat_ai import ChatAI
from ai_modules.coding_ai import CodingAI
from api.schemas import AskRequest
from core.attachment_utils import build_attachments_context
from core.ollama_client import list_available_models
from router.ai_router import AIRouter

router = APIRouter()
router_ai = AIRouter()

chat_ai = ChatAI()
coding_ai = CodingAI()
business_ai = BusinessAI()


def build_reverse_geocode_url(latitude: float, longitude: float, language: str) -> str:
    params = urlencode(
        {
            "lat": f"{latitude:.6f}",
            "lon": f"{longitude:.6f}",
            "format": "jsonv2",
            "addressdetails": 1,
            "zoom": 10,
            "accept-language": language or "id",
        }
    )
    return f"https://nominatim.openstreetmap.org/reverse?{params}"


def extract_location_label(payload: dict[str, Any] | None) -> str:
    address = payload.get("address", {}) if isinstance(payload, dict) else {}
    for value in (
        address.get("city"),
        address.get("town"),
        address.get("municipality"),
        address.get("city_district"),
        address.get("county"),
        address.get("state"),
    ):
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def parse_preferences(raw_preferences: str | None) -> dict[str, Any] | None:
    if not raw_preferences:
        return None

    try:
        parsed = json.loads(raw_preferences)
    except json.JSONDecodeError:
        return None

    return parsed if isinstance(parsed, dict) else None


@router.post("/chat")
def chat(prompt: str, session_id: str):
    return {"result": chat_ai.generate(prompt, session_id)}


@router.post("/coding")
def coding(prompt: str, session_id: str):
    return {"result": coding_ai.generate(prompt, session_id)}


@router.post("/business")
def business(prompt: str, session_id: str):
    return {"result": business_ai.generate(prompt, session_id)}


@router.post("/reset")
def reset():
    return {"message": "Gunakan session_id baru untuk memulai percakapan yang benar-benar bersih."}


@router.post("/ask")
def ask(request: AskRequest):
    result = router_ai.smart_route(
        request.prompt,
        request.session_id,
        request.mode,
        request.preferences,
    )
    return {"result": result}


@router.post("/reset-db")
def reset_db():
    return {"message": "Gunakan session_id baru untuk memulai konteks yang segar."}


@router.get("/models")
def get_models():
    return {"models": list_available_models()}


@router.get("/ambient-location")
def get_ambient_location(latitude: float, longitude: float, language: str = "id"):
    request = Request(
        build_reverse_geocode_url(latitude, longitude, language),
        headers={"User-Agent": "Byronz Offline AI Workspace/1.0"},
    )

    try:
        with urlopen(request, timeout=6) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
        return {"label": ""}

    return {"label": extract_location_label(payload)}


@router.post("/ask-stream")
def ask_stream(request: AskRequest):
    def event_stream():
        for chunk in router_ai.smart_route_stream(
            request.prompt,
            request.session_id,
            request.mode,
            request.preferences,
        ):
            yield chunk

    return StreamingResponse(event_stream(), media_type="text/plain")


@router.post("/ask-stream-upload")
async def ask_stream_upload(
    prompt: str = Form(""),
    session_id: str = Form(...),
    mode: str | None = Form(None),
    preferences: str | None = Form(None),
    files: list[UploadFile] | None = File(default=None),
):
    attachment_context = await build_attachments_context(files or [])
    request_prompt = prompt.strip() or "Analisis lampiran ini sesuai mode aktif Byronz dan bantu user dengan jawaban terbaik."
    parsed_preferences = parse_preferences(preferences)

    def event_stream():
        for chunk in router_ai.smart_route_stream(
            request_prompt,
            session_id,
            mode,
            parsed_preferences,
            attachment_context,
        ):
            yield chunk

    return StreamingResponse(event_stream(), media_type="text/plain")

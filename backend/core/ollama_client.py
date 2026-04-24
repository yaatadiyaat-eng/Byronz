import json
import os
from typing import Any

import requests

SESSION = requests.Session()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_URL = f"{OLLAMA_BASE_URL}/api/generate"
OLLAMA_TAGS_URL = f"{OLLAMA_BASE_URL}/api/tags"

OLLAMA_OPTIONS = {
    "temperature": 0.42,
    "top_p": 0.9,
    "num_ctx": 3072,
    "num_predict": 512,
    "repeat_penalty": 1.1,
}

OPENAI_COMPAT_OPTIONS = {
    "temperature": 0.42,
    "max_tokens": 768,
}


def get_llm_provider() -> str:
    raw_provider = os.getenv("BYRONZ_LLM_PROVIDER", "ollama").strip().lower()
    aliases = {
        "ollama": "ollama",
        "groq": "groq",
        "openai-compatible": "openai_compatible",
        "openai_compatible": "openai_compatible",
    }
    return aliases.get(raw_provider, "ollama")


def use_remote_provider() -> bool:
    return get_llm_provider() in {"groq", "openai_compatible"}


def get_remote_base_url() -> str:
    explicit_base_url = os.getenv("OPENAI_COMPATIBLE_BASE_URL", "").strip().rstrip("/")
    if explicit_base_url:
        return explicit_base_url

    if get_llm_provider() == "groq":
        return "https://api.groq.com/openai/v1"

    return ""


def get_remote_api_key() -> str:
    for env_name in ("OPENAI_COMPATIBLE_API_KEY", "GROQ_API_KEY", "LLAMA_API_KEY"):
        value = os.getenv(env_name, "").strip()
        if value:
            return value
    return ""


def get_default_model_name() -> str:
    explicit_model = os.getenv("OPENAI_COMPATIBLE_DEFAULT_MODEL", "").strip()
    if explicit_model:
        return explicit_model

    if get_llm_provider() == "groq":
        return "openai/gpt-oss-20b"

    return "mistral:latest"


def build_config_error() -> str:
    if not use_remote_provider():
        return ""

    missing = []
    if not get_remote_base_url():
        missing.append("OPENAI_COMPATIBLE_BASE_URL")
    if not get_remote_api_key():
        missing.append("OPENAI_COMPATIBLE_API_KEY")

    if not missing:
        return ""

    fields = ", ".join(missing)
    return (
        "Provider AI cloud Byronz belum lengkap. "
        f"Isi environment berikut di server: {fields}."
    )


def prettify_model_name(model_name: str) -> str:
    if not model_name:
        return "Unknown"

    normalized_name = str(model_name).strip()
    providerless_name = normalized_name.split("/", 1)[-1]
    base_name = providerless_name.split(":", 1)[0].replace("-", " ").replace("_", " ")
    normalized_base = base_name.strip()

    aliases = {
        "llama3": "Llama 3",
        "mistral": "Mistral",
        "openai/gpt-oss-20b": "GPT OSS 20B",
        "openai/gpt-oss-120b": "GPT OSS 120B",
        "llama-3.1-8b-instant": "Llama 3.1 8B Instant",
        "llama-3.3-70b-versatile": "Llama 3.3 70B Versatile",
        "qwen/qwen3-32b": "Qwen3 32B",
        "groq/compound-mini": "Groq Compound Mini",
    }

    alias = aliases.get(normalized_name.lower()) or aliases.get(providerless_name.lower())
    if alias:
        return alias

    return normalized_base.title() if normalized_base else normalized_name


def parse_configured_remote_models() -> list[dict[str, str]]:
    raw_models = os.getenv("OPENAI_COMPATIBLE_MODELS", "").strip()
    if not raw_models:
        return []

    models = []
    for item in raw_models.split(","):
        spec = item.strip()
        if not spec:
            continue

        if "|" in spec:
            model_name, label = spec.split("|", 1)
            model_name = model_name.strip()
            label = label.strip()
        else:
            model_name = spec
            label = prettify_model_name(spec)

        if not model_name:
            continue

        models.append(
            {
                "name": model_name,
                "label": label or prettify_model_name(model_name),
                "family": "openai-compatible",
                "parameter_size": "",
                "quantization_level": "",
            }
        )

    return models


def build_ollama_payload(model: str, prompt: str, stream: bool) -> dict[str, Any]:
    return {
        "model": model,
        "prompt": prompt,
        "stream": stream,
        "options": OLLAMA_OPTIONS,
        "keep_alive": "20m",
    }


def build_remote_headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {get_remote_api_key()}",
        "Content-Type": "application/json",
    }


def build_openai_compatible_payload(model: str, prompt: str, stream: bool) -> dict[str, Any]:
    return {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
        "stream": stream,
        **OPENAI_COMPAT_OPTIONS,
    }


def normalize_openai_content(content: Any) -> str:
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
                continue

            if not isinstance(item, dict):
                continue

            item_type = str(item.get("type") or "").strip().lower()
            if item_type in {"text", "output_text"}:
                text_value = item.get("text") or item.get("content")
                if isinstance(text_value, str) and text_value.strip():
                    parts.append(text_value)

        return "".join(parts)

    return ""


def normalize_remote_choices(payload: dict[str, Any]) -> str:
    choices = payload.get("choices") or []
    if not choices:
        return ""

    first_choice = choices[0] if isinstance(choices[0], dict) else {}
    message = first_choice.get("message") or {}
    content = normalize_openai_content(message.get("content"))
    if content:
        return content

    delta = first_choice.get("delta") or {}
    return normalize_openai_content(delta.get("content"))


def list_available_models_from_ollama() -> list[dict[str, str]]:
    try:
        response = SESSION.get(OLLAMA_TAGS_URL, timeout=10)
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        return []

    models = []
    for item in payload.get("models", []):
        model_name = item.get("name") or item.get("model")
        if not model_name:
            continue

        details = item.get("details") or {}
        models.append(
            {
                "name": model_name,
                "label": prettify_model_name(model_name),
                "family": details.get("family") or "",
                "parameter_size": details.get("parameter_size") or "",
                "quantization_level": details.get("quantization_level") or "",
            }
        )

    return models


def list_available_models_from_remote() -> list[dict[str, str]]:
    configured_models = parse_configured_remote_models()
    if configured_models:
        return configured_models

    config_error = build_config_error()
    if config_error:
        return []

    base_url = get_remote_base_url()
    try:
        response = SESSION.get(
            f"{base_url}/models",
            headers=build_remote_headers(),
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        fallback_model = get_default_model_name()
        if use_remote_provider() and fallback_model:
            return [
                {
                    "name": fallback_model,
                    "label": prettify_model_name(fallback_model),
                    "family": "openai-compatible",
                    "parameter_size": "",
                    "quantization_level": "",
                }
            ]
        return []

    models = []
    for item in payload.get("data", []):
        model_name = item.get("id") or item.get("name")
        if not model_name:
            continue

        models.append(
            {
                "name": model_name,
                "label": prettify_model_name(model_name),
                "family": item.get("owned_by") or "openai-compatible",
                "parameter_size": "",
                "quantization_level": "",
            }
        )

    return models


def list_available_models() -> list[dict[str, str]]:
    if use_remote_provider():
        return list_available_models_from_remote()
    return list_available_models_from_ollama()


def list_available_model_names() -> list[str]:
    return [item["name"] for item in list_available_models() if item.get("name")]


def generate_response_from_ollama(model: str, prompt: str) -> str:
    try:
        response = SESSION.post(
            OLLAMA_URL,
            json=build_ollama_payload(model, prompt, False),
            timeout=180,
        )
        response.raise_for_status()
        return response.json().get("response", "")
    except requests.RequestException as exc:
        return f"Terjadi masalah saat menghubungi Ollama: {exc}"


def generate_response_from_remote(model: str, prompt: str) -> str:
    config_error = build_config_error()
    if config_error:
        return config_error

    base_url = get_remote_base_url()
    resolved_model = model or get_default_model_name()

    try:
        response = SESSION.post(
            f"{base_url}/chat/completions",
            headers=build_remote_headers(),
            json=build_openai_compatible_payload(resolved_model, prompt, False),
            timeout=180,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException as exc:
        return f"Terjadi masalah saat menghubungi provider AI cloud: {exc}"

    text = normalize_remote_choices(payload)
    return text or "Provider AI cloud tidak mengembalikan jawaban."


def generate_response(model: str, prompt: str) -> str:
    if use_remote_provider():
        return generate_response_from_remote(model, prompt)
    return generate_response_from_ollama(model, prompt)


def generate_stream_from_ollama(model: str, prompt: str):
    try:
        response = SESSION.post(
            OLLAMA_URL,
            json=build_ollama_payload(model, prompt, True),
            stream=True,
            timeout=(10, 300),
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        yield f"Terjadi masalah saat menghubungi Ollama: {exc}"
        return

    for line in response.iter_lines():
        if not line:
            continue

        try:
            data = json.loads(line.decode("utf-8"))
            yield data.get("response", "")
        except Exception:
            continue


def generate_stream_from_remote(model: str, prompt: str):
    config_error = build_config_error()
    if config_error:
        yield config_error
        return

    base_url = get_remote_base_url()
    resolved_model = model or get_default_model_name()

    try:
        response = SESSION.post(
            f"{base_url}/chat/completions",
            headers=build_remote_headers(),
            json=build_openai_compatible_payload(resolved_model, prompt, True),
            stream=True,
            timeout=(10, 300),
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        yield f"Terjadi masalah saat menghubungi provider AI cloud: {exc}"
        return

    for raw_line in response.iter_lines():
        if not raw_line:
            continue

        try:
            line = raw_line.decode("utf-8").strip()
        except UnicodeDecodeError:
            continue

        if not line.startswith("data:"):
            continue

        data_text = line[5:].strip()
        if not data_text or data_text == "[DONE]":
            continue

        try:
            payload = json.loads(data_text)
        except json.JSONDecodeError:
            continue

        text_chunk = normalize_remote_choices(payload)
        if text_chunk:
            yield text_chunk


def generate_stream(model: str, prompt: str):
    if use_remote_provider():
        yield from generate_stream_from_remote(model, prompt)
        return

    yield from generate_stream_from_ollama(model, prompt)

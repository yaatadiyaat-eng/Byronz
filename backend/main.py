import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware

from api.routes import router
from database.models import create_tables

app = FastAPI(title="Byronz Backend")
create_tables()

BASE_DIR = Path(__file__).resolve().parent


def resolve_frontend_dist_dir() -> Path | None:
    candidates = [
        BASE_DIR / "frontend-dist",
        BASE_DIR.parent / "frontend" / "dist",
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    return None


FRONTEND_DIST_DIR = resolve_frontend_dist_dir()

app.include_router(router)


def parse_cors_origins() -> list[str]:
    raw_value = os.getenv("CORS_ALLOWED_ORIGINS", "*").strip()
    if not raw_value or raw_value == "*":
        return ["*"]

    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


def should_allow_cors_credentials(origins: list[str]) -> bool:
    return origins != ["*"]


def parse_trusted_hosts() -> list[str]:
    raw_value = os.getenv("TRUSTED_HOSTS", "*").strip()
    if not raw_value or raw_value == "*":
        return ["*"]

    return [host.strip() for host in raw_value.split(",") if host.strip()]


cors_origins = parse_cors_origins()
trusted_hosts = parse_trusted_hosts()


@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=should_allow_cors_credentials(cors_origins),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=trusted_hosts,
)

if FRONTEND_DIST_DIR and FRONTEND_DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST_DIR, html=True), name="frontend")
else:
    @app.get("/")
    def root():
        return {
            "message": "AI Backend Running",
            "detail": "Frontend build belum ditemukan. Jalankan frontend build terlebih dahulu.",
        }

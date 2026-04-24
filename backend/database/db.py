import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DB_PATH = BASE_DIR / "chat.db"


def resolve_db_path() -> Path:
    raw_path = os.getenv("BYRONZ_DB_PATH", "").strip()
    if not raw_path:
        return DEFAULT_DB_PATH

    candidate = Path(raw_path)
    if not candidate.is_absolute():
        candidate = (BASE_DIR / candidate).resolve()

    candidate.parent.mkdir(parents=True, exist_ok=True)
    return candidate


def get_connection():
    conn = sqlite3.connect(str(resolve_db_path()))
    conn.row_factory = sqlite3.Row
    return conn

from typing import Any, Optional

from pydantic import BaseModel


class AskRequest(BaseModel):
    prompt: str
    session_id: str
    mode: Optional[str] = None
    preferences: Optional[dict[str, Any]] = None

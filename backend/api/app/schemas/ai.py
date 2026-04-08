from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class HintCreateRequest(BaseModel):
    code: str = Field(default="")
    level: int = Field(ge=1, le=3)
    submission_id: Optional[UUID] = None


class HintResponseRead(BaseModel):
    id: UUID
    level: int
    response_text: str
    remaining_hints: int

    model_config = {"from_attributes": True}

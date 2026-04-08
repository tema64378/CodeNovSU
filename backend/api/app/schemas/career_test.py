from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class CareerTestOptionRead(BaseModel):
    value: str
    label: str


class CareerTestQuestionRead(BaseModel):
    id: str
    prompt: str
    options: List[CareerTestOptionRead]


class CareerTestResultRead(BaseModel):
    recommended_track_slug: str
    recommended_track_title: str
    recommended_path_title: str
    foundation_track_slug: Optional[str] = None
    explanation: str
    created_at: Optional[str] = None


class CareerTestStateRead(BaseModel):
    questions: List[CareerTestQuestionRead]
    has_attempt: bool
    can_retake: bool
    next_available_at: Optional[str] = None
    result: Optional[CareerTestResultRead] = None
    answers: Dict[str, str] = Field(default_factory=dict)


class CareerTestSubmitRequest(BaseModel):
    answers: Dict[str, str]

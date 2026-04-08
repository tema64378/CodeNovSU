from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class DashboardStatRead(BaseModel):
    label: str
    value: str


class RecentSubmissionRead(BaseModel):
    id: UUID
    task_id: UUID
    language: str
    status: str
    score: int
    created_at: str

    model_config = {"from_attributes": True}


class DashboardRead(BaseModel):
    stats: List[DashboardStatRead]
    recent_submissions: List[RecentSubmissionRead]


class LessonProgressUpdateRequest(BaseModel):
    status: str = "completed"


class ProgressEntryRead(BaseModel):
    id: UUID
    track_id: UUID
    lesson_id: Optional[UUID]
    task_id: Optional[UUID]
    status: str
    score: int

    model_config = {"from_attributes": True}


class LessonProgressSnapshotRead(BaseModel):
    lesson_id: UUID
    lesson_slug: str
    status: str
    score: int


class TrackProgressRead(BaseModel):
    track_slug: str
    total_lessons: int
    completed_lessons: int
    current_lesson_slug: Optional[str]
    lessons: List[LessonProgressSnapshotRead]


class AchievementRead(BaseModel):
    id: str
    title: str
    description: str
    reward: str
    status: str
    progress_current: int
    progress_target: int


class AchievementListRead(BaseModel):
    achievements: List[AchievementRead]

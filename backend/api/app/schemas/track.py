from typing import List
from uuid import UUID

from pydantic import BaseModel


class LessonSummaryRead(BaseModel):
    id: UUID
    slug: str
    title: str
    summary: str
    estimated_minutes: int
    access_tier: str
    order_index: int
    task_count: int
    has_project_task: bool
    has_boss_task: bool

    model_config = {"from_attributes": True}


class LevelRead(BaseModel):
    id: UUID
    title: str
    difficulty: str
    order_index: int
    theme_color: str
    icon: str
    lessons: List[LessonSummaryRead] = []

    model_config = {"from_attributes": True}


class TrackListItemRead(BaseModel):
    id: UUID
    slug: str
    title: str
    description: str
    category: str
    is_premium: bool
    is_published: bool

    model_config = {"from_attributes": True}


class TrackDetailRead(TrackListItemRead):
    levels: List[LevelRead] = []

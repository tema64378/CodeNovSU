from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class TaskSummaryRead(BaseModel):
    id: UUID
    slug: str
    title: str
    language: str
    difficulty: str
    access_tier: str
    estimated_minutes: int
    max_hints: int
    is_project_step: bool
    is_boss: bool

    model_config = {"from_attributes": True}


class LessonDetailRead(BaseModel):
    id: UUID
    slug: str
    title: str
    summary: str
    theory_md: str
    estimated_minutes: int
    access_tier: str
    order_index: int
    tasks: List[TaskSummaryRead] = []

    model_config = {"from_attributes": True}


class TaskTestCaseRead(BaseModel):
    id: UUID
    kind: str
    input_payload: str
    expected_output: str
    weight: int

    model_config = {"from_attributes": True}


class TaskDetailRead(BaseModel):
    id: UUID
    slug: str
    title: str
    description_md: str
    language: str
    difficulty: str
    starter_code: str
    solution_template: Optional[str]
    max_hints: int
    access_tier: str
    estimated_minutes: int
    is_project_step: bool
    is_boss: bool
    visible_test_cases: List[TaskTestCaseRead] = []

    model_config = {"from_attributes": True}


class SubmissionCreateRequest(BaseModel):
    source_code: str
    language: str


class SubmissionRead(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    language: str
    status: str
    score: int
    stdout: Optional[str]
    stderr: Optional[str]
    execution_time_ms: Optional[int]
    memory_kb: Optional[int]

    model_config = {"from_attributes": True}

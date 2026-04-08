from __future__ import annotations

import uuid
from typing import Optional

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import AccessTier, DifficultyLevel, TaskLanguage


class Track(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "tracks"

    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    levels: Mapped[list["Level"]] = relationship(back_populates="track", cascade="all, delete-orphan")


class Level(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "levels"

    track_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    difficulty: Mapped[DifficultyLevel] = mapped_column(nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    theme_color: Mapped[str] = mapped_column(String(20), nullable=False)
    icon: Mapped[str] = mapped_column(String(16), nullable=False)

    track: Mapped[Track] = relationship(back_populates="levels")
    lessons: Mapped[list["Lesson"]] = relationship(back_populates="level", cascade="all, delete-orphan")


class Lesson(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "lessons"

    level_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("levels.id", ondelete="CASCADE"), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    theory_md: Mapped[str] = mapped_column(Text, default="", nullable=False)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=20, nullable=False)
    access_tier: Mapped[AccessTier] = mapped_column(default=AccessTier.FREE, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    level: Mapped[Level] = relationship(back_populates="lessons")
    tasks: Mapped[list["Task"]] = relationship(back_populates="lesson", cascade="all, delete-orphan")


class Task(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "tasks"

    lesson_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description_md: Mapped[str] = mapped_column(Text, default="", nullable=False)
    language: Mapped[TaskLanguage] = mapped_column(nullable=False)
    difficulty: Mapped[DifficultyLevel] = mapped_column(nullable=False)
    starter_code: Mapped[str] = mapped_column(Text, default="", nullable=False)
    solution_template: Mapped[Optional[str]] = mapped_column(Text)
    max_hints: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    access_tier: Mapped[AccessTier] = mapped_column(default=AccessTier.FREE, nullable=False)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    is_project_step: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_boss: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    lesson: Mapped[Lesson] = relationship(back_populates="tasks")
    test_cases: Mapped[list["TaskTestCase"]] = relationship(back_populates="task", cascade="all, delete-orphan")


class TaskTestCase(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "task_test_cases"

    task_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    input_payload: Mapped[str] = mapped_column(Text, default="", nullable=False)
    expected_output: Mapped[str] = mapped_column(Text, default="", nullable=False)
    is_hidden: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    weight: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    task: Mapped[Task] = relationship(back_populates="test_cases")

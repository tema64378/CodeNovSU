from __future__ import annotations

from datetime import datetime
import uuid
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import ProgressStatus, SubscriptionStatus, TaskLanguage


class CareerTestAttempt(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "career_test_attempts"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    answers_json: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    recommended_track_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id", ondelete="SET NULL"))


class Submission(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "submissions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    language: Mapped[TaskLanguage] = mapped_column(nullable=False)
    source_code: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="queued")
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    stdout: Mapped[Optional[str]] = mapped_column(Text)
    stderr: Mapped[Optional[str]] = mapped_column(Text)
    execution_time_ms: Mapped[Optional[int]] = mapped_column(Integer)
    memory_kb: Mapped[Optional[int]] = mapped_column(Integer)


class HintRequest(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "hint_requests"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    submission_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("submissions.id", ondelete="SET NULL"))
    level: Mapped[int] = mapped_column(Integer, nullable=False)
    response_text: Mapped[str] = mapped_column(Text, nullable=False)
    response_rating: Mapped[Optional[int]] = mapped_column(Integer)


class ProgressEntry(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "progress_entries"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    track_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"))
    task_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"))
    status: Mapped[ProgressStatus] = mapped_column(default=ProgressStatus.AVAILABLE, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Subscription(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "subscriptions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(40), nullable=False)
    plan_code: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(default=SubscriptionStatus.TRIALING, nullable=False)
    starts_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    auto_renew: Mapped[bool] = mapped_column(default=True, nullable=False)


class Entitlement(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "entitlements"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(40), nullable=False)
    resource_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True))
    starts_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

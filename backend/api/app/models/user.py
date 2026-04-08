from __future__ import annotations

import uuid
from typing import Optional

from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import UserRole


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    role: Mapped[UserRole] = mapped_column(default=UserRole.LEARNER, nullable=False)
    locale: Mapped[str] = mapped_column(String(10), default="ru", nullable=False)
    avatar_config: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    settings: Mapped[Optional["UserSettings"]] = relationship(back_populates="user", uselist=False)
    external_accounts: Mapped[list["ExternalAccount"]] = relationship(back_populates="user")


class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    notification_email_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notification_push_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    marketing_opt_in: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    theme: Mapped[str] = mapped_column(String(20), default="system", nullable=False)

    user: Mapped[User] = relationship(back_populates="settings")


class ExternalAccount(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "external_accounts"
    __table_args__ = (
        UniqueConstraint("provider", "provider_user_id", name="uq_external_accounts_provider_provider_user_id"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    access_token_encrypted: Mapped[Optional[str]] = mapped_column(String(2048))
    refresh_token_encrypted: Mapped[Optional[str]] = mapped_column(String(2048))

    user: Mapped[User] = relationship(back_populates="external_accounts")

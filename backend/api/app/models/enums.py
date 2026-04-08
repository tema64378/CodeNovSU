from enum import Enum


class UserRole(str, Enum):
    LEARNER = "learner"
    PREMIUM_LEARNER = "premium_learner"
    MODERATOR = "moderator"
    MANAGER = "manager"
    ADMIN = "admin"


class AccessTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    MODULE_PAID = "module_paid"


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class TaskLanguage(str, Enum):
    PYTHON = "python"
    CPP = "cpp"
    JAVASCRIPT = "javascript"
    HTML_CSS = "html_css"


class ProgressStatus(str, Enum):
    LOCKED = "locked"
    AVAILABLE = "available"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class SubscriptionStatus(str, Enum):
    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    EXPIRED = "expired"

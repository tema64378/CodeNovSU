from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def healthcheck() -> dict:
    return {
        "status": "ok",
        "service": "codenovsu-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

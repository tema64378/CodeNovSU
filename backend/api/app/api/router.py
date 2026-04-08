from fastapi import APIRouter

from app.api.routes import ai, auth, career_test, health, lessons, progress, tasks, tracks

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(tracks.router, prefix="/tracks", tags=["tracks"])
api_router.include_router(lessons.router, prefix="/tracks", tags=["lessons"])
api_router.include_router(tasks.router, prefix="/tracks", tags=["tasks"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(career_test.router, prefix="/career-test", tags=["career-test"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])

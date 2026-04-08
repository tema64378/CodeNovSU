from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.models.content import Lesson, Track
from app.schemas.content import LessonDetailRead

router = APIRouter()


@router.get("/{track_slug}/lessons/{lesson_slug}", response_model=LessonDetailRead)
def get_lesson(track_slug: str, lesson_slug: str, db: Session = Depends(get_db)) -> LessonDetailRead:
    query = (
        select(Lesson)
        .join(Lesson.level)
        .join(Track)
        .where(
            Track.slug == track_slug,
            Track.is_published.is_(True),
            Lesson.slug == lesson_slug,
            Lesson.is_published.is_(True),
        )
        .options(selectinload(Lesson.tasks))
    )
    lesson = db.execute(query).scalar_one_or_none()

    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found.")

    lesson.tasks.sort(key=lambda task: task.title.lower())
    return LessonDetailRead.model_validate(lesson)

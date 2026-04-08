from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.models.content import Level, Lesson, Track
from app.schemas.track import TrackDetailRead, TrackListItemRead

router = APIRouter()


@router.get("", response_model=list[TrackListItemRead])
def list_tracks(db: Session = Depends(get_db)) -> list[TrackListItemRead]:
    query = (
        select(Track)
        .where(Track.is_published.is_(True))
        .order_by(Track.title.asc())
    )
    tracks = db.execute(query).scalars().all()
    return [TrackListItemRead.model_validate(track) for track in tracks]


@router.get("/{track_slug}", response_model=TrackDetailRead)
def get_track(track_slug: str, db: Session = Depends(get_db)) -> TrackDetailRead:
    query = (
        select(Track)
        .where(Track.slug == track_slug, Track.is_published.is_(True))
        .options(
            selectinload(Track.levels)
            .selectinload(Level.lessons)
            .selectinload(Lesson.tasks)
        )
    )
    track = db.execute(query).scalar_one_or_none()
    if track is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Track not found.",
        )

    for level in track.levels:
        level.lessons.sort(key=lambda lesson: lesson.order_index)
    track.levels.sort(key=lambda level: level.order_index)

    return TrackDetailRead.model_validate(track)

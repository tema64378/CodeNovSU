from datetime import timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from app.models.content import Lesson, Level, Track
from app.models.learning import HintRequest, ProgressEntry, Submission
from app.models.user import User
from app.schemas.progress import (
    AchievementListRead,
    AchievementRead,
    DashboardRead,
    DashboardStatRead,
    LessonProgressUpdateRequest,
    LessonProgressSnapshotRead,
    ProgressEntryRead,
    RecentSubmissionRead,
    TrackProgressRead,
)

router = APIRouter()


@router.get("/dashboard", response_model=DashboardRead)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardRead:
    total_submissions = db.scalar(
        select(func.count()).select_from(Submission).where(Submission.user_id == current_user.id)
    ) or 0
    completed_lessons = db.scalar(
        select(func.count())
        .select_from(ProgressEntry)
        .where(
            ProgressEntry.user_id == current_user.id,
            ProgressEntry.lesson_id.is_not(None),
            ProgressEntry.status == "completed",
        )
    ) or 0
    avg_score = db.scalar(
        select(func.avg(Submission.score)).where(Submission.user_id == current_user.id)
    )
    hint_count = db.scalar(
        select(func.count()).select_from(HintRequest).where(HintRequest.user_id == current_user.id)
    ) or 0

    submissions = (
        db.execute(
            select(Submission)
            .where(Submission.user_id == current_user.id)
            .order_by(Submission.created_at.desc())
            .limit(5)
        )
        .scalars()
        .all()
    )

    stats = [
        DashboardStatRead(label="Отправок", value=str(total_submissions)),
        DashboardStatRead(label="Уроков завершено", value=str(completed_lessons)),
        DashboardStatRead(label="Средний score", value=str(int(avg_score)) if avg_score is not None else "—"),
        DashboardStatRead(label="Использовано hints", value=str(hint_count)),
    ]
    recent = [
        RecentSubmissionRead(
            id=submission.id,
            task_id=submission.task_id,
            language=submission.language.value,
            status=submission.status,
            score=submission.score,
            created_at=submission.created_at.astimezone(timezone.utc).isoformat(),
        )
        for submission in submissions
    ]
    return DashboardRead(stats=stats, recent_submissions=recent)


@router.post("/lessons/{lesson_id}/complete", response_model=ProgressEntryRead)
def complete_lesson(
    lesson_id: str,
    payload: LessonProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProgressEntryRead:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found.")

    existing = db.execute(
        select(ProgressEntry).where(
            ProgressEntry.user_id == current_user.id,
            ProgressEntry.lesson_id == lesson.id,
        )
    ).scalar_one_or_none()

    if existing is None:
        entry = ProgressEntry(
            user_id=current_user.id,
            track_id=lesson.level.track_id,
            lesson_id=lesson.id,
            status=payload.status,
            score=100 if payload.status == "completed" else 0,
        )
        db.add(entry)
    else:
        entry = existing
        entry.status = payload.status
        if payload.status == "completed":
            entry.score = max(entry.score, 100)

    db.commit()
    db.refresh(entry)
    return ProgressEntryRead.model_validate(entry)


@router.get("/tracks/{track_slug}", response_model=TrackProgressRead)
def get_track_progress(
    track_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TrackProgressRead:
    track = db.execute(
        select(Track)
        .where(Track.slug == track_slug, Track.is_published.is_(True))
        .options(selectinload(Track.levels).selectinload(Level.lessons))
    ).scalar_one_or_none()

    if track is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found.")

    ordered_lessons = []
    for level in sorted(track.levels, key=lambda item: item.order_index):
        ordered_lessons.extend(sorted(level.lessons, key=lambda item: item.order_index))

    progress_entries = db.execute(
        select(ProgressEntry).where(
            ProgressEntry.user_id == current_user.id,
            ProgressEntry.track_id == track.id,
            ProgressEntry.lesson_id.is_not(None),
        )
    ).scalars().all()
    progress_by_lesson_id = {str(entry.lesson_id): entry for entry in progress_entries if entry.lesson_id is not None}

    next_unlocked = True
    current_lesson_slug = None
    lesson_snapshots: list[LessonProgressSnapshotRead] = []

    for lesson in ordered_lessons:
        existing = progress_by_lesson_id.get(str(lesson.id))

        if existing and existing.status == "completed":
            status_value = "completed"
            next_unlocked = True
        elif existing and existing.status == "in_progress":
            status_value = "in_progress"
            next_unlocked = False
        elif next_unlocked:
            status_value = "available"
            next_unlocked = False
        else:
            status_value = "locked"

        if current_lesson_slug is None and status_value in {"available", "in_progress"}:
            current_lesson_slug = lesson.slug

        lesson_snapshots.append(
            LessonProgressSnapshotRead(
                lesson_id=lesson.id,
                lesson_slug=lesson.slug,
                status=status_value,
                score=existing.score if existing else 0,
            )
        )

    completed_lessons = sum(1 for lesson in lesson_snapshots if lesson.status == "completed")

    return TrackProgressRead(
        track_slug=track.slug,
        total_lessons=len(lesson_snapshots),
        completed_lessons=completed_lessons,
        current_lesson_slug=current_lesson_slug,
    lessons=lesson_snapshots,
    )


@router.get("/achievements", response_model=AchievementListRead)
def get_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AchievementListRead:
    completed_lessons = db.scalar(
        select(func.count())
        .select_from(ProgressEntry)
        .where(
            ProgressEntry.user_id == current_user.id,
            ProgressEntry.lesson_id.is_not(None),
            ProgressEntry.status == "completed",
        )
    ) or 0
    total_submissions = db.scalar(
        select(func.count()).select_from(Submission).where(Submission.user_id == current_user.id)
    ) or 0
    high_score_submissions = db.scalar(
        select(func.count())
        .select_from(Submission)
        .where(
            Submission.user_id == current_user.id,
            Submission.score >= 90,
        )
    ) or 0
    hint_count = db.scalar(
        select(func.count()).select_from(HintRequest).where(HintRequest.user_id == current_user.id)
    ) or 0
    active_days = db.scalar(
        select(func.count(func.distinct(func.date(Submission.created_at))))
        .select_from(Submission)
        .where(Submission.user_id == current_user.id)
    ) or 0

    achievement_defs = [
        {
            "id": "first-steps",
            "title": "Первые шаги",
            "description": "Заверши первый урок и почувствуй ритм платформы.",
            "reward": "+1 AI-подсказка",
            "current": completed_lessons,
            "target": 1,
        },
        {
            "id": "rising-star",
            "title": "Восходящая звезда",
            "description": "Закрой большой пласт контента и открой серьёзный темп обучения.",
            "reward": "Рамка аватара",
            "current": completed_lessons,
            "target": 25,
        },
        {
            "id": "sprinter",
            "title": "Спринтер",
            "description": "Покажи сильную попытку: добейся высокого результата на отправке.",
            "reward": "Бейдж скорости",
            "current": high_score_submissions,
            "target": 1,
        },
        {
            "id": "ai-explorer",
            "title": "ИИ-исследователь",
            "description": "Используй подсказки как наставника и разберись в логике решения.",
            "reward": "Набор подсказок",
            "current": hint_count,
            "target": 3,
        },
        {
            "id": "marathoner",
            "title": "Марафонец",
            "description": "Возвращайся к практике регулярно и выстраивай устойчивую привычку.",
            "reward": "Бейдж дисциплины",
            "current": active_days,
            "target": 7,
        },
        {
            "id": "practice-engine",
            "title": "Двигатель практики",
            "description": "Отправь много решений и преврати обучение в реальную практику.",
            "reward": "Сундук с наградой",
            "current": total_submissions,
            "target": 10,
        },
    ]

    achievements = [
        AchievementRead(
            id=item["id"],
            title=item["title"],
            description=item["description"],
            reward=item["reward"],
            status="unlocked" if item["current"] >= item["target"] else "locked",
            progress_current=item["current"],
            progress_target=item["target"],
        )
        for item in achievement_defs
    ]

    return AchievementListRead(achievements=achievements)

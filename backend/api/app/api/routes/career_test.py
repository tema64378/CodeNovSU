from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.content import Track
from app.models.learning import CareerTestAttempt
from app.models.user import User
from app.schemas.career_test import (
    CareerTestOptionRead,
    CareerTestQuestionRead,
    CareerTestResultRead,
    CareerTestStateRead,
    CareerTestSubmitRequest,
)

router = APIRouter()

QUESTION_DEFS = [
    CareerTestQuestionRead(
        id="build",
        prompt="Что ты хочешь создавать?",
        options=[
            CareerTestOptionRead(value="games", label="Игры (геймдев)"),
            CareerTestOptionRead(value="websites", label="Сайты и веб-сервисы"),
            CareerTestOptionRead(value="data", label="Анализировать данные и строить графики"),
            CareerTestOptionRead(value="automation", label="Автоматизировать рутину"),
            CareerTestOptionRead(value="security", label="Защищать системы (кибербезопасность)"),
        ],
    ),
    CareerTestQuestionRead(
        id="study_style",
        prompt="Как тебе удобнее учиться?",
        options=[
            CareerTestOptionRead(value="theory", label="Пошагово с теорией"),
            CareerTestOptionRead(value="practice", label="Сразу много практики"),
            CareerTestOptionRead(value="projects", label="С проектами в конце"),
            CareerTestOptionRead(value="ai_hints", label="С подсказками от ИИ"),
        ],
    ),
    CareerTestQuestionRead(
        id="math_level",
        prompt="Какой уровень математики тебе комфортен?",
        options=[
            CareerTestOptionRead(value="basic", label="Базовый (логика, арифметика)"),
            CareerTestOptionRead(value="medium", label="Средний (алгебра, функции)"),
            CareerTestOptionRead(value="advanced", label="Продвинутый (статистика, линал)"),
        ],
    ),
    CareerTestQuestionRead(
        id="ai_interest",
        prompt="Хочешь ли ты работать с ИИ?",
        options=[
            CareerTestOptionRead(value="goal", label="Да, это моя цель"),
            CareerTestOptionRead(value="tool", label="Да, как инструментом"),
            CareerTestOptionRead(value="no", label="Нет, чистая разработка"),
        ],
    ),
    CareerTestQuestionRead(
        id="motivation",
        prompt="Какая мотивация у тебя?",
        options=[
            CareerTestOptionRead(value="dream_job", label="Работа мечты"),
            CareerTestOptionRead(value="salary", label="Высокая зарплата"),
            CareerTestOptionRead(value="startup", label="Свои проекты/стартап"),
            CareerTestOptionRead(value="self", label="Для себя"),
        ],
    ),
]


def get_latest_attempt(db: Session, user_id: str) -> Optional[CareerTestAttempt]:
    return db.execute(
        select(CareerTestAttempt)
        .where(CareerTestAttempt.user_id == user_id)
        .order_by(CareerTestAttempt.created_at.desc())
        .limit(1)
    ).scalar_one_or_none()


def resolve_recommendation(answers: dict[str, str]) -> dict[str, Optional[str]]:
    build = answers.get("build")
    style = answers.get("study_style")
    math = answers.get("math_level")
    ai_interest = answers.get("ai_interest")

    if build == "games" and math == "basic" and ai_interest == "tool":
        return {
            "track_slug": "cpp",
            "path_title": "ИИ в геймдеве",
            "foundation_track_slug": "cpp",
            "explanation": "Тебе важны игры, комфортный порог математики и практический взгляд на ИИ как на инструмент. C++ даст сильную инженерную базу и хороший вход в геймдев.",
        }

    if build == "websites" and style == "practice" and ai_interest == "no":
        return {
            "track_slug": "javascript",
            "path_title": "Профессиональный фронтенд",
            "foundation_track_slug": "javascript",
            "explanation": "Тебя тянет к вебу и быстрому практическому циклу. JavaScript даст самый прямой путь к интерфейсам, логике браузера и современному frontend-потоку.",
        }

    if build == "data" and math == "advanced" and ai_interest == "goal":
        return {
            "track_slug": "ai-specialist",
            "path_title": "Специалист в области ИИ",
            "foundation_track_slug": "python",
            "explanation": "Тебе подходит сильная математическая база и интерес к ИИ как к основной профессии. Трек AI Specialist лучше всего ляжет поверх Python и даст движение к моделям и экспериментам.",
        }

    if build == "security" and style == "theory" and ai_interest == "no":
        return {
            "track_slug": "cybersecurity",
            "path_title": "Кибербезопасность для разработчика",
            "foundation_track_slug": "python",
            "explanation": "Тебе подходит последовательное обучение и фокус на защите систем. Трек по кибербезопасности даст практичный путь в secure development и разбор уязвимостей.",
        }

    if build == "games":
        return {
            "track_slug": "cpp",
            "path_title": "Системное программирование и геймдев",
            "foundation_track_slug": "cpp",
            "explanation": "Игровая разработка лучше всего стартует с сильной инженерной базы, работы с производительностью и уверенного контроля над логикой приложения.",
        }

    if build == "websites":
        return {
            "track_slug": "javascript",
            "path_title": "Frontend и интерактивные интерфейсы",
            "foundation_track_slug": "javascript",
            "explanation": "Веб-направление требует быстрого цикла обратной связи и умения строить интерфейсы. JavaScript даст самый естественный вход в браузерную разработку.",
        }

    if build == "data":
        if ai_interest in {"goal", "tool"}:
            return {
                "track_slug": "ai-specialist",
                "path_title": "Данные и прикладной ИИ",
                "foundation_track_slug": "python",
                "explanation": "Тебя привлекают данные и работа с ИИ, поэтому лучший путь — начать с Python-мышления и постепенно перейти к моделям, метрикам и экспериментам.",
            }
        return {
            "track_slug": "data-analysis",
            "path_title": "Аналитика и работа с данными",
            "foundation_track_slug": "python",
            "explanation": "Тебе близка аналитическая работа с данными, графиками и выводами. Data Analysis даст ясный прикладной маршрут без лишнего перегруза.",
        }

    if build == "automation":
        return {
            "track_slug": "python",
            "path_title": "Автоматизация и прикладной Python",
            "foundation_track_slug": "python",
            "explanation": "Автоматизация лучше всего раскрывается через Python: быстрый синтаксис, понятные скрипты и хорошая база для дальнейшего роста в backend, data и AI.",
        }

    return {
        "track_slug": "python",
        "path_title": "Универсальный старт в разработке",
        "foundation_track_slug": "python",
        "explanation": "Для мягкого старта лучше начать с Python: он снижает порог входа, помогает быстро увидеть результат и позже легко перейти в смежные направления.",
    }


def build_result(db: Session, attempt: CareerTestAttempt, recommendation: Optional[dict[str, Optional[str]]] = None) -> CareerTestResultRead:
    payload = recommendation
    if payload is None:
        track = db.get(Track, attempt.recommended_track_id) if attempt.recommended_track_id else None
        foundation_track_slug = attempt.answers_json.get("foundation_track_slug")
        return CareerTestResultRead(
            recommended_track_slug=track.slug if track else "python",
            recommended_track_title=track.title if track else "Python",
            recommended_path_title=attempt.answers_json.get("recommended_path_title", "Персональный трек"),
            foundation_track_slug=foundation_track_slug,
            explanation=attempt.answers_json.get("recommendation_explanation", "Рекомендация собрана на основе твоих ответов."),
            created_at=attempt.created_at.astimezone(timezone.utc).isoformat(),
        )

    track = db.execute(select(Track).where(Track.slug == payload["track_slug"])).scalar_one_or_none()
    if track is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommended track not found.")

    return CareerTestResultRead(
        recommended_track_slug=track.slug,
        recommended_track_title=track.title,
        recommended_path_title=payload["path_title"] or track.title,
        foundation_track_slug=payload.get("foundation_track_slug"),
        explanation=payload["explanation"] or "Рекомендация собрана на основе твоих ответов.",
    )


@router.get("", response_model=CareerTestStateRead)
def get_career_test_state(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CareerTestStateRead:
    latest_attempt = get_latest_attempt(db, str(current_user.id))

    if latest_attempt is None:
        return CareerTestStateRead(
            questions=QUESTION_DEFS,
            has_attempt=False,
            can_retake=True,
            result=None,
            answers={},
        )

    next_available_at = latest_attempt.created_at + timedelta(days=7)
    can_retake = datetime.now(timezone.utc) >= next_available_at.astimezone(timezone.utc)

    return CareerTestStateRead(
        questions=QUESTION_DEFS,
        has_attempt=True,
        can_retake=can_retake,
        next_available_at=None if can_retake else next_available_at.astimezone(timezone.utc).isoformat(),
        result=build_result(db, latest_attempt),
        answers=latest_attempt.answers_json,
    )


@router.post("/submit", response_model=CareerTestStateRead, status_code=status.HTTP_201_CREATED)
def submit_career_test(
    payload: CareerTestSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CareerTestStateRead:
    expected_ids = {question.id for question in QUESTION_DEFS}
    if set(payload.answers.keys()) != expected_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All career test questions must be answered.",
        )

    latest_attempt = get_latest_attempt(db, str(current_user.id))
    if latest_attempt is not None:
        next_available_at = latest_attempt.created_at + timedelta(days=7)
        if datetime.now(timezone.utc) < next_available_at.astimezone(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Career test can be retaken after {next_available_at.date().isoformat()}.",
            )

    recommendation = resolve_recommendation(payload.answers)
    track = db.execute(select(Track).where(Track.slug == recommendation["track_slug"])).scalar_one_or_none()
    if track is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommended track not found.")

    answers_to_store = {
        **payload.answers,
        "recommended_path_title": recommendation["path_title"],
        "recommendation_explanation": recommendation["explanation"],
        "foundation_track_slug": recommendation.get("foundation_track_slug"),
    }
    attempt = CareerTestAttempt(
        user_id=current_user.id,
        answers_json=answers_to_store,
        recommended_track_id=track.id,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return CareerTestStateRead(
        questions=QUESTION_DEFS,
        has_attempt=True,
        can_retake=False,
        next_available_at=(attempt.created_at + timedelta(days=7)).astimezone(timezone.utc).isoformat(),
        result=build_result(db, attempt, recommendation),
        answers=payload.answers,
    )

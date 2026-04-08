from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.content import Task
from app.models.learning import HintRequest
from app.models.user import User
from app.schemas.ai import HintCreateRequest, HintResponseRead
from app.services.ai_hints import HintContext, generate_ai_hint

router = APIRouter()


@router.post("/tasks/{task_id}/hint", response_model=HintResponseRead, status_code=status.HTTP_201_CREATED)
def create_hint(
    task_id: str,
    payload: HintCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> HintResponseRead:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    used_hints = db.scalar(
        select(func.count()).select_from(HintRequest).where(
            HintRequest.user_id == current_user.id,
            HintRequest.task_id == task.id,
        )
    ) or 0

    if used_hints >= task.max_hints:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No hints remaining for this task.",
        )

    hint = HintRequest(
        user_id=current_user.id,
        task_id=task.id,
        submission_id=payload.submission_id,
        level=payload.level,
        response_text=generate_ai_hint(
            HintContext(
                task=task,
                level=payload.level,
                code=payload.code,
            )
        ),
    )
    db.add(hint)
    db.commit()
    db.refresh(hint)

    remaining = max(task.max_hints - used_hints - 1, 0)
    return HintResponseRead(
        id=hint.id,
        level=hint.level,
        response_text=hint.response_text,
        remaining_hints=remaining,
    )

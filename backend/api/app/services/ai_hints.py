from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib import error, request

from app.core.config import settings
from app.models.content import Task


@dataclass
class HintContext:
    task: Task
    level: int
    code: str


def build_fallback_hint(context: HintContext) -> str:
    code = context.code.lower()

    if context.level == 1:
        if not context.code.strip():
            return "Начни с самого простого шага: определи, что именно программа должна принять на вход и что вывести в конце."
        if "for" in code or "while" in code:
            return "Цикл у тебя уже намечен. Теперь проверь условие завершения и то, как меняется счётчик на каждой итерации."
        return "Сначала сверь решение с условием: какие данные приходят, где должна храниться промежуточная логика и какой результат ждут тесты."

    if context.level == 2:
        return (
            "Разбей решение на три части: подготовка входных данных, основная логика обработки и вывод результата. "
            "Сначала заставь программу проходить видимые тесты, а затем проверь крайние случаи."
        )

    return (
        "Собери каркас решения без финальных деталей: объяви нужные переменные, добавь основной блок обработки "
        "и оставь в конце отдельный шаг для вывода результата. Не пытайся написать всё сразу одной строкой."
    )


def _serialize_visible_tests(task: Task) -> list[dict[str, Any]]:
    return [
        {
            "kind": test_case.kind,
            "input": test_case.input_payload,
            "expected_output": test_case.expected_output,
        }
        for test_case in task.visible_test_cases
    ]


def _parse_output_text(payload: dict[str, Any]) -> str:
    output_text = payload.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    output = payload.get("output")
    if not isinstance(output, list):
        return ""

    parts: list[str] = []
    for item in output:
        if not isinstance(item, dict):
            continue
        content = item.get("content")
        if not isinstance(content, list):
            continue
        for block in content:
            if not isinstance(block, dict):
                continue
            text = block.get("text")
            if isinstance(text, str) and text.strip():
                parts.append(text.strip())

    return "\n".join(parts).strip()


def generate_ai_hint(context: HintContext) -> str:
    if not settings.openai_api_key:
        return build_fallback_hint(context)

    user_prompt = {
        "task_title": context.task.title,
        "language": context.task.language,
        "difficulty": context.task.difficulty,
        "task_description": context.task.description_md,
        "visible_tests": _serialize_visible_tests(context.task),
        "student_code": context.code,
        "hint_level": context.level,
        "rules": {
            "language": "ru",
            "no_complete_solution": True,
            "max_paragraphs": 2,
            "max_bullets": 3,
        },
    }

    body = {
        "model": settings.openai_model,
        "instructions": (
            "Ты AI-наставник платформы CodeNovsu. Помогаешь студенту только в рамках текущей задачи урока. "
            "Отвечай по-русски. Не выдавай полное решение и не пиши готовую программу целиком. "
            "Для уровня 1 дай мягкий намёк на идею. Для уровня 2 подскажи структуру решения и шаги. "
            "Для уровня 3 разрешён только маленький фрагмент или каркас без ключевых деталей."
        ),
        "input": json.dumps(user_prompt, ensure_ascii=False),
        "max_output_tokens": 220,
    }

    http_request = request.Request(
        url=f"{settings.openai_base_url.rstrip('/')}/responses",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(http_request, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (error.URLError, TimeoutError, json.JSONDecodeError):
        return build_fallback_hint(context)

    hint_text = _parse_output_text(payload)
    return hint_text or build_fallback_hint(context)

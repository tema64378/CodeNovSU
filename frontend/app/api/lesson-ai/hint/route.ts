import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

interface LessonAiRequest {
  level: number;
  code: string;
  hintCount: number;
  task: {
    id: string;
    title: string;
    description: string;
    language: string;
    difficulty: string;
    maxHints: number;
    visibleTests: Array<{
      kind: string;
      input: string;
      expectedOutput: string;
    }>;
  };
}

function buildFallbackHint(payload: LessonAiRequest) {
  const code = payload.code.toLowerCase();

  if (payload.level === 1) {
    if (!payload.code.trim()) {
      return "Сначала определи самый первый шаг: какие данные нужны решению и какой результат должен появиться в конце.";
    }
    if (code.includes("for") || code.includes("while")) {
      return "Цикл уже намечен. Проверь, какую часть логики ты выполняешь внутри него и не теряешь ли условие выхода.";
    }
    return "Сверь текущее решение с формулировкой: где должен появиться основной результат и соответствуют ли типы данных задаче.";
  }

  if (payload.level === 2) {
    return "Построй решение по этапам: входные данные, основная обработка, затем отдельный шаг вывода. Сначала закрой видимые тесты.";
  }

  return "Сделай каркас: объяви данные, добавь основной блок обработки и только потом дополни его конкретными операциями без попытки написать всё сразу.";
}

function extractOutputText(responsePayload: Record<string, unknown>) {
  const directText = responsePayload.output_text;
  if (typeof directText === "string" && directText.trim()) {
    return directText.trim();
  }

  const output = responsePayload.output;
  if (!Array.isArray(output)) {
    return "";
  }

  return output
    .flatMap((item: unknown) => {
      if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
        return [];
      }

      return item.content.flatMap((contentItem: unknown) => {
        if (!contentItem || typeof contentItem !== "object" || !("text" in contentItem)) {
          return [];
        }

        return typeof contentItem.text === "string" ? [contentItem.text.trim()] : [];
      });
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

async function createModelHint(payload: LessonAiRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackHint(payload);
  }

  const response = await fetch(`${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      instructions:
        "Ты AI-наставник платформы CodeNovsu. Помогаешь студенту только в рамках текущей задачи урока. " +
        "Отвечай по-русски. Не выдавай полное решение и не пиши готовую программу целиком. " +
        "Уровень 1: только идея. Уровень 2: структура решения. Уровень 3: короткий частичный каркас без ключевых деталей.",
      input: JSON.stringify(
        {
          task_title: payload.task.title,
          task_description: payload.task.description,
          language: payload.task.language,
          difficulty: payload.task.difficulty,
          visible_tests: payload.task.visibleTests,
          student_code: payload.code,
          hint_level: payload.level,
        },
        null,
        2,
      ),
      max_output_tokens: 220,
    }),
  });

  if (!response.ok) {
    return buildFallbackHint(payload);
  }

  const responsePayload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!responsePayload) {
    return buildFallbackHint(payload);
  }

  return extractOutputText(responsePayload) || buildFallbackHint(payload);
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as LessonAiRequest | null;

  if (!payload || !payload.task || payload.level < 1 || payload.level > 3) {
    return NextResponse.json({ detail: "Invalid lesson AI request." }, { status: 400 });
  }

  if (payload.hintCount >= payload.task.maxHints) {
    return NextResponse.json({ detail: "No hints remaining for this task." }, { status: 403 });
  }

  const responseText = await createModelHint(payload);

  return NextResponse.json({
    id: randomUUID(),
    level: payload.level,
    response_text: responseText,
    remaining_hints: Math.max(payload.task.maxHints - payload.hintCount - 1, 0),
  });
}

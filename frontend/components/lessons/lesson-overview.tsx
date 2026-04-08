"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { completeLesson } from "@/lib/api/codenovsu";
import { markLessonCompletedLocally } from "@/lib/progress-store";
import type { LessonDetail } from "@/lib/types";

export function LessonOverview({
  trackSlug,
  lesson,
}: {
  trackSlug: string;
  lesson: LessonDetail;
}) {
  const { token } = useAuth();
  const [completionState, setCompletionState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theoryBlocks = lesson.theory_md.split("\n\n").filter(Boolean);

  const onCompleteLesson = async () => {
    if (!token) {
      markLessonCompletedLocally(trackSlug, lesson.slug);
      setCompletionState("Урок отмечен как пройденный и сохранён локально в браузере.");
      setError(null);
      return;
    }
    try {
      await completeLesson(lesson.id, token);
      markLessonCompletedLocally(trackSlug, lesson.slug);
      setCompletionState("Урок отмечен как пройденный.");
      setError(null);
    } catch (nextError) {
      markLessonCompletedLocally(trackSlug, lesson.slug);
      setCompletionState("Серверный прогресс пока недоступен, поэтому статус сохранён локально в браузере.");
      setError(null);
    }
  };

  return (
    <section className="detail-section">
      <article className="detail-card">
        <div className="eyebrow">Урок</div>
        <h1 style={{ marginTop: 0 }}>{lesson.title}</h1>
        <p>{lesson.summary}</p>
        <div className="detail-chip-row">
          <span className="chip">{lesson.estimated_minutes} мин</span>
          <span className={`chip ${lesson.access_tier === "free" ? "chip--free" : "chip--premium"}`}>
            {lesson.access_tier}
          </span>
          <span className="chip">Порядок: {lesson.order_index}</span>
        </div>
      </article>

      <article className="detail-card">
        <div className="eyebrow">Теория</div>
        <div className="prose-block">
          {theoryBlocks.map((block) => (
            <p key={block}>{block.replace(/^#\s*/, "")}</p>
          ))}
        </div>
      </article>

      <article className="detail-card">
        <div className="eyebrow">Практика</div>
        <h2 style={{ marginTop: 0 }}>Задачи урока</h2>
        <div className="detail-chip-row" style={{ marginBottom: 16 }}>
          <button type="button" className="button button--primary" onClick={onCompleteLesson}>
            Отметить урок пройденным
          </button>
        </div>
        {completionState ? <div className="auth-note" style={{ marginBottom: 16 }}>{completionState}</div> : null}
        {error ? <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div> : null}
        <div className="task-list">
          {lesson.tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tracks/${trackSlug}/lessons/${lesson.slug}/tasks/${task.slug}`}
              className="task-list__item"
            >
              <div>
                <strong>{task.title}</strong>
                <p>
                  {task.language} · {task.difficulty} · {task.estimated_minutes} мин
                </p>
              </div>
              <span className="button button--ghost">Открыть задачу</span>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}

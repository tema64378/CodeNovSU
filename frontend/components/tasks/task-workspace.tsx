"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { createSubmission, requestHint } from "@/lib/api/codenovsu";
import { markLessonCompletedLocally, markLessonInProgressLocally } from "@/lib/progress-store";
import type { HintResponse, SubmissionResult, TaskDetail } from "@/lib/types";

export function TaskWorkspace({
  trackSlug,
  lessonSlug,
  task,
}: {
  trackSlug: string;
  lessonSlug: string;
  task: TaskDetail;
}) {
  const { user, token } = useAuth();
  const [code, setCode] = useState(task.starter_code);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [hints, setHints] = useState<HintResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState<number | null>(null);

  useEffect(() => {
    markLessonInProgressLocally(trackSlug, lessonSlug);
  }, [lessonSlug, trackSlug]);

  const onSubmit = async () => {
    if (!token) {
      setError("Для отправки решения нужно войти в аккаунт.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const submission = await createSubmission(
        task.id,
        {
          language: task.language,
          source_code: code,
        },
        token,
      );
      setResult(submission);
      if (submission.status === "passed") {
        markLessonCompletedLocally(trackSlug, lessonSlug);
      } else {
        markLessonInProgressLocally(trackSlug, lessonSlug);
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось отправить решение.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRequestHint = async (level: number) => {
    if (!token) {
      setError("Для подсказок нужно войти в аккаунт.");
      return;
    }

    setError(null);
    setIsHintLoading(level);
    try {
      const hint = await requestHint(
        task.id,
        {
          code,
          level,
          submission_id: result?.id ?? null,
          task_context: {
            id: task.id,
            title: task.title,
            description: task.description_md,
            language: task.language,
            difficulty: task.difficulty,
            max_hints: task.max_hints,
            hint_count: hints.length,
            visible_tests: task.visible_test_cases,
          },
        },
        token,
      );
      setHints((prev) => [...prev, hint]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось получить подсказку.");
    } finally {
      setIsHintLoading(null);
    }
  };

  return (
    <section className="detail-grid">
      <article className="detail-card detail-section">
        <div className="eyebrow">Задача</div>
        <h1 style={{ marginTop: 0 }}>{task.title}</h1>
        <p>{task.description_md}</p>
        <div className="detail-chip-row">
          <span className="chip">{task.language}</span>
          <span className="chip">{task.difficulty}</span>
          <span className="chip">{task.estimated_minutes} мин</span>
          <span className="chip">{task.max_hints} hints</span>
        </div>

        <div className="detail-card" style={{ padding: 20 }}>
          <strong>Видимые проверки</strong>
          <div className="task-list" style={{ marginTop: 12 }}>
            {task.visible_test_cases.length > 0 ? (
              task.visible_test_cases.map((testCase) => (
                <div className="task-list__item" key={testCase.id}>
                  <div>
                    <strong>{testCase.kind}</strong>
                    <p>Ожидаемый результат: {testCase.expected_output}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="task-list__item">
                <div>
                  <strong>Visible checks</strong>
                  <p>Для этой задачи пока нет открытых тестов.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-card" style={{ padding: 20 }}>
          <strong>AI-наставник урока</strong>
          <p style={{ marginTop: 12 }}>
            Ассистент работает только внутри этой учебной задачи: подсказывает следующий шаг, но не пишет готовое
            решение за студента.
          </p>
          <div className="detail-chip-row" style={{ marginTop: 12 }}>
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                type="button"
                className="button button--ghost"
                onClick={() => onRequestHint(level)}
                disabled={isHintLoading === level}
              >
                {isHintLoading === level ? `Подсказка ${level}…` : `Уровень ${level}`}
              </button>
            ))}
          </div>
          <div className="task-list" style={{ marginTop: 12 }}>
            {hints.length > 0 ? (
              hints.map((hint) => (
                <div className="task-list__item" key={hint.id}>
                  <div>
                    <strong>Уровень {hint.level}</strong>
                    <p>{hint.response_text}</p>
                  </div>
                  <span className="chip">Осталось: {hint.remaining_hints}</span>
                </div>
              ))
            ) : (
              <div className="task-list__item">
                <div>
                  <strong>Подсказки пока не запрошены</strong>
                  <p>Ассистент доступен только в уроке и отвечает намёками без спойлеров.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <aside className="detail-sidebar">
        <div className="detail-card detail-section">
          <div className="eyebrow">Редактор</div>
          <textarea className="code-editor" value={code} onChange={(event) => setCode(event.target.value)} />
          <div className="detail-chip-row">
            <button type="button" className="button button--primary" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Отправляем…" : "Отправить решение"}
            </button>
            <Link href={`/tracks/${trackSlug}/lessons/${lessonSlug}`} className="button button--ghost">
              Назад к уроку
            </Link>
          </div>
          {!user ? <div className="auth-note">Просматривать задачу можно без входа, а отправка решения требует авторизации.</div> : null}
          {error ? <div className="auth-error">{error}</div> : null}
          {result ? (
            <div className="submission-result">
              <strong>
                Статус: {result.status} · Score: {result.score}
              </strong>
              <p>{result.stdout ?? "Результат сохранён."}</p>
              {result.stderr ? <p style={{ color: "var(--danger)" }}>{result.stderr}</p> : null}
            </div>
          ) : null}
        </div>
      </aside>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { TrackCanvasMap } from "@/components/tracks/track-canvas-map";
import { getTrackProgress } from "@/lib/api/codenovsu";
import { getLocalTrackProgress } from "@/lib/progress-store";
import type { ProgressStatus, TrackDetail, TrackProgressData } from "@/lib/types";

const progressLabels: Record<ProgressStatus, string> = {
  locked: "Locked",
  available: "Available",
  in_progress: "In progress",
  completed: "Completed",
};

const progressClasses: Record<ProgressStatus, string> = {
  locked: "lesson-state lesson-state--locked",
  available: "lesson-state lesson-state--available",
  in_progress: "lesson-state lesson-state--progress",
  completed: "lesson-state lesson-state--completed",
};

export function TrackProgressBoard({ track }: { track: TrackDetail }) {
  const { token } = useAuth();
  const [progress, setProgress] = useState<TrackProgressData>(() => getLocalTrackProgress(track));
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    let isActive = true;
    const localProgress = getLocalTrackProgress(track);
    setProgress(localProgress);
    setIsRemote(false);

    if (!token) {
      return () => {
        isActive = false;
      };
    }

    getTrackProgress(track.slug, token)
      .then((nextProgress) => {
        if (!isActive) {
          return;
        }
        setProgress(nextProgress);
        setIsRemote(true);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }
        setProgress(localProgress);
        setIsRemote(false);
      });

    return () => {
      isActive = false;
    };
  }, [token, track]);

  const progressByLessonSlug = useMemo(
    () =>
      Object.fromEntries(progress.lessons.map((lesson) => [lesson.lesson_slug, lesson])),
    [progress],
  );

  const completionPercent =
    progress.total_lessons > 0 ? Math.round((progress.completed_lessons / progress.total_lessons) * 100) : 0;

  return (
    <div className="track-progress-layout">
      <section className="map-card">
        <div>
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <div className="eyebrow">RPG-карта</div>
            <h2>Маршрут по треку с состоянием каждого урока</h2>
            <p>
              {isRemote
                ? "Прогресс подгружен из backend API и показывает актуальное состояние обучения."
                : "Сейчас используется локальный progress fallback в браузере. Он помогает продолжать обучение даже без живой БД."}
            </p>
          </div>

          <div className="detail-chip-row" style={{ marginTop: 18 }}>
            <span className="chip">{progress.completed_lessons} завершено</span>
            <span className="chip">{progress.total_lessons} всего</span>
            <span className="chip chip--free">{completionPercent}% маршрута</span>
          </div>
        </div>

        <TrackCanvasMap track={track} progress={progress} />
      </section>

      <section className="track-level-stack">
        {track.levels.map((level) => (
          <article
            className="detail-card level-shell"
            key={level.id}
            style={{ borderTop: `6px solid ${level.theme_color}` }}
          >
            <div className="level-shell__header">
              <div>
                <div className="detail-chip-row">
                  <span className="chip">{level.icon}</span>
                  <span className="chip">{level.difficulty}</span>
                  <span className="chip">{level.lessons.length} уроков</span>
                </div>
                <h2>{level.title}</h2>
              </div>
              <div className="level-shell__legend">
                <span className="chip chip--free">Base access</span>
                <span className="chip chip--premium">Premium</span>
                <span className="chip chip--boss">Boss</span>
              </div>
            </div>

            <div className="lesson-card-grid">
              {level.lessons.map((lesson, index) => {
                const lessonProgress = progressByLessonSlug[lesson.slug];
                const state = lessonProgress?.status ?? "locked";

                return (
                  <article className={`lesson-card lesson-card--${state}`} key={lesson.id}>
                    <div className="lesson-card__topline">
                      <span className="lesson-card__index">{index + 1}</span>
                      <div className="detail-chip-row">
                        <span className={progressClasses[state]}>{progressLabels[state]}</span>
                        <span className="chip">{lesson.estimated_minutes} мин</span>
                        <span className="chip">{lesson.task_count} задач</span>
                        <span className={`chip ${lesson.access_tier === "free" ? "chip--free" : "chip--premium"}`}>
                          {lesson.access_tier === "free" ? "Free" : "Premium"}
                        </span>
                        {lesson.has_project_task ? <span className="chip chip--project">Проектный шаг</span> : null}
                        {lesson.has_boss_task ? <span className="chip chip--boss">Boss</span> : null}
                      </div>
                    </div>

                    <h3>{lesson.title}</h3>
                    <p>{lesson.summary}</p>

                    <div className="lesson-card__footer">
                      <div className="lesson-card__meta">
                        <span>Порядок #{lesson.order_index}</span>
                        <span>Score: {lessonProgress?.score ?? 0}</span>
                      </div>
                      <Link
                        href={`/tracks/${track.slug}/lessons/${lesson.slug}`}
                        className={`button ${state === "locked" ? "button--ghost" : "button--primary"}`}
                      >
                        {state === "locked" ? "Открыть позже" : "Перейти к уроку"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

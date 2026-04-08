"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { getCareerTestState, getTracks, submitCareerTest } from "@/lib/api/codenovsu";
import {
  createCareerTestFallbackState,
  recommendTrackClient,
  type CareerTestState,
  type CareerTestQuestion,
} from "@/lib/career-test";
import type { TrackListItem } from "@/lib/types";

export function CareerTestWizard() {
  const { token } = useAuth();
  const [tracks, setTracks] = useState<TrackListItem[]>([]);
  const [state, setState] = useState<CareerTestState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"loading" | "ready" | "result">("loading");

  useEffect(() => {
    let active = true;

    getTracks().then((loadedTracks) => {
      if (!active) return;
      setTracks(loadedTracks);
    });

    if (!token) {
      if (!active) return;
      setState(createCareerTestFallbackState([]));
      setMode("ready");
      setError("Для сохранения результата нужен вход в аккаунт. Пока можно посмотреть структуру теста.");
      return () => {
        active = false;
      };
    }

    getCareerTestState(token)
      .then((nextState) => {
        if (!active) return;
        setState(nextState);
        setAnswers(nextState.answers);
        setMode(nextState.result ? "result" : "ready");
      })
      .catch(async () => {
        if (!active) return;
        const fallbackTracks = await getTracks().catch(() => []);
        if (!active) return;
        setTracks(fallbackTracks);
        setState(createCareerTestFallbackState(fallbackTracks));
        setMode("ready");
        setError("Сервер теста временно недоступен, поэтому включён локальный режим рекомендации.");
      });

    return () => {
      active = false;
    };
  }, [token]);

  const currentQuestion = state?.questions[step];
  const progressPercent = state ? Math.round(((step + 1) / state.questions.length) * 100) : 0;

  const fallbackResult = useMemo(() => {
    if (!state || !tracks.length) return null;
    const answeredAll = state.questions.every((question) => answers[question.id]);
    if (!answeredAll) return null;
    return recommendTrackClient(answers, tracks);
  }, [answers, state, tracks]);

  if (!state) {
    return <section className="detail-card">Подготавливаем профориентационный тест…</section>;
  }

  const onChoose = (question: CareerTestQuestion, value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setError(null);
  };

  const onNext = () => {
    if (!currentQuestion) return;
    if (!answers[currentQuestion.id]) {
      setError("Выбери вариант ответа, чтобы двигаться дальше.");
      return;
    }
    setError(null);
    if (step < state.questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setMode("result");
    }
  };

  const onBack = () => {
    setError(null);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const onSubmit = async () => {
    if (!token) {
      setMode("result");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const nextState = await submitCareerTest(token, answers);
      setState(nextState);
      setMode("result");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось сохранить результат теста.");
      setMode("result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const result = state.result ?? fallbackResult;

  if (mode === "result" && result) {
    return (
      <section className="detail-card career-result">
        <div className="eyebrow">Результат теста</div>
        <h1 style={{ marginTop: 0 }}>Тебе подходит трек «{result.recommended_track_title}»</h1>
        <p>{result.explanation}</p>

        <div className="detail-chip-row">
          <span className="chip chip--free">{result.recommended_path_title}</span>
          {result.foundation_track_slug ? <span className="chip">База: {result.foundation_track_slug}</span> : null}
        </div>

        <div className="career-result__panel">
          <strong>Почему именно это направление</strong>
          <p>
            Мы учли то, что тебе хочется создавать, как тебе комфортнее учиться, насколько тебе подходит математика
            и какую роль должен играть ИИ в профессии.
          </p>
        </div>

        {state.next_available_at ? (
          <div className="auth-note">
            Повторно пройти тест можно после {new Date(state.next_available_at).toLocaleDateString("ru-RU")}.
          </div>
        ) : null}
        {error ? <div className="auth-note">{error}</div> : null}

        <div className="career-actions">
          <Link href={`/tracks/${result.recommended_track_slug}`} className="button button--primary">
            Открыть рекомендованный трек
          </Link>
          <Link href="/dashboard" className="button button--ghost">
            Вернуться в кабинет
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="detail-card career-shell">
      <div className="eyebrow">Профориентационный тест</div>
      <h1 style={{ marginTop: 0 }}>Подберём трек, с которого тебе будет проще стартовать</h1>
      <p>
        Это короткий onboarding на 5 вопросов. Он не ставит ярлык, а помогает выбрать понятную стартовую траекторию
        и не потеряться среди направлений.
      </p>

      <div className="career-progress">
        <div className="career-progress__bar">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="career-progress__meta">
          <span>
            Шаг {step + 1} из {state.questions.length}
          </span>
          <span>{progressPercent}%</span>
        </div>
      </div>

      {currentQuestion ? (
        <article className="career-question-card">
          <div className="career-question-card__counter">Вопрос {step + 1}</div>
          <h2>{currentQuestion.prompt}</h2>
          <div className="career-option-grid">
            {currentQuestion.options.map((option) => {
              const isActive = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`career-option ${isActive ? "career-option--active" : ""}`}
                  onClick={() => onChoose(currentQuestion, option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </article>
      ) : null}

      {error ? <div className="auth-error">{error}</div> : null}

      <div className="career-actions">
        <button type="button" className="button button--ghost" onClick={onBack} disabled={step === 0}>
          Назад
        </button>
        {step < state.questions.length - 1 ? (
          <button type="button" className="button button--primary" onClick={onNext}>
            Дальше
          </button>
        ) : (
          <button type="button" className="button button--primary" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Собираем рекомендацию…" : "Получить рекомендацию"}
          </button>
        )}
      </div>
    </section>
  );
}

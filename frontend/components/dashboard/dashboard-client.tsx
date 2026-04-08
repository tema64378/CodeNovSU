"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { AchievementRail } from "@/components/dashboard/achievement-rail";
import { getAchievements, getCareerTestState, getDashboard } from "@/lib/api/codenovsu";
import { getLocalAchievementFallback, getLocalDashboardFallback } from "@/lib/local-gamification";
import type { AchievementListData, DashboardData } from "@/lib/types";
import type { CareerTestState } from "@/lib/career-test";

export function DashboardClient() {
  const { user, token } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData>(() => getLocalDashboardFallback());
  const [achievements, setAchievements] = useState<AchievementListData>(() => getLocalAchievementFallback());
  const [careerState, setCareerState] = useState<CareerTestState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setDashboard(getLocalDashboardFallback());
      setAchievements(getLocalAchievementFallback());
      setCareerState(null);
      return;
    }

    Promise.all([getDashboard(token), getAchievements(token), getCareerTestState(token)])
      .then(([dashboardData, achievementsData, careerTestData]) => {
        setDashboard(dashboardData);
        setAchievements(achievementsData);
        setCareerState(careerTestData);
        setError(null);
      })
      .catch(() => {
        setDashboard(getLocalDashboardFallback());
        setAchievements(getLocalAchievementFallback());
        setCareerState(null);
        setError("Показываем локальный прогресс: серверные данные временно недоступны.");
      });
  }, [token]);

  if (!user) return null;

  return (
    <div className="dashboard-stack">
      <section className="detail-card dashboard-hero">
        <div className="eyebrow">Кабинет</div>
        <div className="dashboard-hero__grid">
          <div>
            <h1 style={{ marginTop: 0 }}>Привет, {user.display_name}</h1>
            <p>
              Здесь собраны твой темп, награды и ближайшие шаги. Задача кабинета не отвлекать, а быстро возвращать
              тебя в обучение ровно с того места, где ты остановился.
            </p>

            <div className="detail-chip-row" style={{ marginBottom: 18 }}>
              <span className="chip">{user.email}</span>
              <span className="chip">{user.role}</span>
              <span className={`chip ${user.email_verified ? "chip--free" : "chip--premium"}`}>
                {user.email_verified ? "Почта подтверждена" : "Подтвердить почту"}
              </span>
            </div>

            <div className="dashboard-actions">
              {!careerState?.has_attempt ? (
                <Link href="/career-test" className="button button--ghost">
                  Пройти профтест
                </Link>
              ) : null}
              <Link href="/tracks/cpp" className="button button--primary">
                Продолжить маршрут
              </Link>
              <Link href="/tracks/cpp/lessons/hello-world-and-structure/tasks/print-hello-cpp" className="button button--ghost">
                Перейти к практике
              </Link>
            </div>
          </div>

          <aside className="dashboard-spotlight">
            <strong>Сегодняшний фокус</strong>
            <p>Один урок, одна задача, одна сильная попытка. Такой ритм даёт устойчивый прогресс без перегруза.</p>
          </aside>
        </div>

        <div className="stat-grid">
          {dashboard.stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        {error ? <div className="auth-note" style={{ marginTop: 18 }}>{error}</div> : null}
      </section>

      {!careerState?.has_attempt ? (
        <section className="detail-card dashboard-support-card">
          <div className="eyebrow">Онбординг</div>
          <h2 style={{ marginTop: 0 }}>Пройди профориентационный тест и сократи путь к первому сильному треку</h2>
          <p>
            Тест занимает пару минут и помогает выбрать стартовое направление без лишнего метания между C++, Python,
            аналитикой, AI и кибербезопасностью.
          </p>
          <div className="dashboard-actions">
            <Link href="/career-test" className="button button--primary">
              Пройти тест
            </Link>
          </div>
        </section>
      ) : null}

      <AchievementRail achievements={achievements.achievements} />

      {dashboard.recent_submissions.length ? (
        <div className="detail-card dashboard-history">
          <div className="eyebrow">История</div>
          <h2 style={{ marginTop: 0 }}>Последние отправки</h2>
          <div className="task-list" style={{ marginTop: 12 }}>
            {dashboard.recent_submissions.map((submission) => (
              <div className="task-list__item" key={submission.id}>
                <div>
                  <strong>{submission.language}</strong>
                  <p>
                    {submission.status} · score {submission.score}
                  </p>
                </div>
                <span className="chip">{new Date(submission.created_at).toLocaleString("ru-RU")}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

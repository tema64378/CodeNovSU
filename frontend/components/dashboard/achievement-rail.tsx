"use client";

import type { Achievement } from "@/lib/types";

export function AchievementRail({ achievements }: { achievements: Achievement[] }) {
  return (
    <section className="detail-card achievements-shell">
      <div className="eyebrow">Ачивки</div>
      <div className="achievements-shell__header">
        <div>
          <h2 style={{ marginTop: 0 }}>Награды за движение по треку</h2>
          <p>
            Ачивки нужны не для галочки, а чтобы показывать прогресс короткими понятными шагами: начал, закрепился,
            ускорился, вошёл в ритм.
          </p>
        </div>
      </div>

      <div className="achievement-grid">
        {achievements.map((achievement) => {
          const progressPercent = Math.min(
            100,
            Math.round((achievement.progress_current / Math.max(achievement.progress_target, 1)) * 100),
          );

          return (
            <article
              key={achievement.id}
              className={`achievement-card ${achievement.status === "unlocked" ? "achievement-card--unlocked" : ""}`}
            >
              <div className="achievement-card__topline">
                <span className={`chip ${achievement.status === "unlocked" ? "chip--free" : ""}`}>
                  {achievement.status === "unlocked" ? "Открыто" : "В пути"}
                </span>
                <span className="chip">{achievement.reward}</span>
              </div>

              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>

              <div className="achievement-progress">
                <div className="achievement-progress__bar">
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="achievement-progress__meta">
                  <span>
                    {achievement.progress_current}/{achievement.progress_target}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

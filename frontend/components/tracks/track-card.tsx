import Link from "next/link";

import type { TrackListItem } from "@/lib/types";

const categoryMap: Record<string, string> = {
  programming:  "Программирование",
  data:         "Аналитика данных",
  ai:           "Нейросети",
  security:     "Кибербезопасность",
};

const categoryIcon: Record<string, string> = {
  programming: "⚡",
  data:        "📊",
  ai:          "🤖",
  security:    "🔐",
};

export function TrackCard({ track }: { track: TrackListItem }) {
  const icon = categoryIcon[track.category] ?? "📚";
  const label = categoryMap[track.category] ?? track.category;

  return (
    <article className="track-card">
      <div className="track-card__eyebrow">
        <span>{icon}</span>
        {label}
      </div>
      <h3>{track.title}</h3>
      <p>{track.description}</p>
      <div className="track-card__chips">
        <span className={`chip ${track.is_premium ? "chip--premium" : "chip--free"}`}>
          {track.is_premium ? "✦ Премиум" : "✓ Бесплатный старт"}
        </span>
        <span className="chip">{track.slug}</span>
      </div>
      <div className="track-card__footer">
        <span className="track-card__meta">Уровни, уроки, практика и карта прогресса</span>
        <Link href={`/tracks/${track.slug}`} className="button button--ghost">
          Войти →
        </Link>
      </div>
    </article>
  );
}

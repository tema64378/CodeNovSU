import Link from "next/link";

import type { TrackListItem } from "@/lib/types";

const categoryMap: Record<string, string> = {
  programming: "Программирование",
  data: "Аналитика",
  ai: "Нейросети",
  security: "Кибербезопасность",
};

export function TrackCard({ track }: { track: TrackListItem }) {
  return (
    <article className="track-card">
      <div className="track-card__eyebrow">{categoryMap[track.category] ?? track.category}</div>
      <h3>{track.title}</h3>
      <p>{track.description}</p>
      <div className="track-card__chips">
        <span className={`chip ${track.is_premium ? "chip--premium" : "chip--free"}`}>
          {track.is_premium ? "Премиум-углубление" : "Бесплатный старт"}
        </span>
        <span className="chip">{track.slug}</span>
      </div>
      <div className="track-card__footer">
        <span className="track-card__meta">Маршрут уже собран: уровни, уроки, практика и карта прогресса.</span>
        <Link href={`/tracks/${track.slug}`} className="button button--ghost">
          Войти в трек
        </Link>
      </div>
    </article>
  );
}

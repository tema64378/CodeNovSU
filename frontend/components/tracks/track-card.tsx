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
      <div className="track-card__eyebrow">{track.title}</div>
      <h3>{categoryMap[track.category] ?? track.category}</h3>
      <p>{track.description}</p>
      <div className="track-card__chips">
        <span className={`chip ${track.is_premium ? "chip--premium" : "chip--free"}`}>
          {track.is_premium ? "Premium" : "Free start"}
        </span>
        <span className="chip">{track.slug}</span>
      </div>
      <div className="track-card__footer">
        <span className="track-card__meta">Трек подключён к backend API и готов к детализации.</span>
        <Link href={`/tracks/${track.slug}`} className="button button--ghost">
          Открыть
        </Link>
      </div>
    </article>
  );
}

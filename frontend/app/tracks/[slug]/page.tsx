import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getTrack } from "@/lib/api/codenovsu";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = await getTrack(slug);

  if (!track) {
    notFound();
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="detail-hero">
          <div className="container detail-grid">
            <div className="detail-card">
              <div className="eyebrow">{track.is_premium ? "Premium track" : "Free entry track"}</div>
              <h1>{track.title}</h1>
              <p>{track.description}</p>
              <div className="detail-chip-row">
                <span className={`chip ${track.is_premium ? "chip--premium" : "chip--free"}`}>
                  {track.is_premium ? "Premium" : "Открыт бесплатно"}
                </span>
                <span className="chip">{track.category}</span>
                <span className="chip">{track.levels.length} уровней в API</span>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="detail-card">
                <h2>Что уже подключено</h2>
                <p className="detail-meta">
                  Эта страница собирается на server components и получает данные из `backend/api`.
                </p>
                <ul>
                  <li>серверный fetch каталога и детального трека;</li>
                  <li>готовая база для будущих lesson pages;</li>
                  <li>fallback-режим для UI-разработки без локального API.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="section">
          <div className="container detail-section">
            {track.levels.map((level) => (
              <article className="detail-card" key={level.id}>
                <div className="detail-chip-row">
                  <span className="chip">{level.icon}</span>
                  <span className="chip">{level.difficulty}</span>
                  <span className="chip">{level.title}</span>
                </div>
                <h2>{level.title}</h2>
                {level.lessons.length > 0 ? (
                  <ul>
                    {level.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <strong>{lesson.title}</strong>
                        <br />
                        {lesson.summary}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Уроки для этого уровня ещё не загружены.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

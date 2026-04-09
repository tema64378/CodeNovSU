import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TrackProgressBoard } from "@/components/tracks/track-progress-board";
import { getTrack } from "@/lib/api/codenovsu";
import type { TrackDetail } from "@/lib/types";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

function getTrackStats(track: TrackDetail) {
  const lessons = track.levels.flatMap((level) => level.lessons);
  const taskCount = lessons.reduce((sum, lesson) => sum + lesson.task_count, 0);
  const premiumLessons = lessons.filter((lesson) => lesson.access_tier !== "free").length;
  const bossLessons = lessons.filter((lesson) => lesson.has_boss_task).length;
  return { lessonCount: lessons.length, taskCount, premiumLessons, bossLessons };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = await getTrack(slug);

  if (!track) notFound();

  const stats = getTrackStats(track);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="detail-hero">
          <div className="container detail-grid">
            {/* Main info */}
            <div className="detail-card">
              <span className="eyebrow">{track.is_premium ? "✦ Premium track" : "✓ Бесплатный трек"}</span>
              <h1>{track.title}</h1>
              <p>{track.description}</p>

              <div className="detail-chip-row">
                <span className={`chip ${track.is_premium ? "chip--premium" : "chip--free"}`}>
                  {track.is_premium ? "Premium" : "Открыт бесплатно"}
                </span>
                <span className="chip">{track.category}</span>
                <span className="chip">{track.levels.length} уровней</span>
                <span className="chip">{stats.lessonCount} уроков</span>
                <span className="chip">{stats.taskCount} задач</span>
              </div>

              <div className="track-stat-grid">
                <article className="track-stat-card">
                  <span>Бесплатный доступ</span>
                  <strong>{stats.lessonCount - stats.premiumLessons} уроков</strong>
                </article>
                <article className="track-stat-card">
                  <span>Премиум-углубление</span>
                  <strong>{stats.premiumLessons} уроков</strong>
                </article>
                <article className="track-stat-card">
                  <span>Boss-модули</span>
                  <strong>{stats.bossLessons}</strong>
                </article>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="detail-sidebar">
              <div className="detail-card">
                <span className="eyebrow">Структура</span>
                <h2>Как устроен трек</h2>
                <ul>
                  <li>Каждый уровень соответствует цвету и сложности из программы</li>
                  <li>Free и premium-контент визуально разделены</li>
                  <li>Boss-уроки и проектные шаги видны в обзоре трека</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* Progress board */}
        <section className="section">
          <div className="container">
            <TrackProgressBoard track={track} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

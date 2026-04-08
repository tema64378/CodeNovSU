import Link from "next/link";

import { FeatureCard } from "@/components/marketing/feature-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TrackMapPreview } from "@/components/tracks/track-map-preview";
import { TrackCard } from "@/components/tracks/track-card";
import { heroMetrics, heroPanelCards, platformFeatures } from "@/features/home/content";
import { getTrack, getTracks } from "@/lib/api/codenovsu";

export default async function HomePage() {
  const [tracks, previewTrack] = await Promise.all([getTracks(), getTrack("cpp")]);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <div className="eyebrow">Production frontend scaffold</div>
              <h1>CodeNovsu переезжает из прототипа в настоящее приложение</h1>
              <p>
                Мы вынесли дизайн-референс в отдельный прототип и начали production frontend на App Router. Этот
                каркас уже умеет забирать треки из backend API и готов к переносу уроков, задач, профтеста и
                карты прогресса.
              </p>
              <div className="hero__actions">
                <Link href="/tracks/cpp" className="button button--primary">
                  Открыть C++ трек
                </Link>
                <Link href="/prototype/web" className="button button--ghost">
                  Посмотреть прототип
                </Link>
              </div>
              <div className="hero__metrics">
                {heroMetrics.map((metric) => (
                  <div className="metric-pill" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="hero__panel" id="api-ready">
              <div className="hero__panel-grid">
                {heroPanelCards.map((card) => (
                  <div className="info-card" key={card.label}>
                    <div className="info-card__label">{card.label}</div>
                    <div className="info-card__value">{card.value}</div>
                    <div className="info-card__body">{card.body}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <SectionHeading
              eyebrow="Платформа"
              title="Сразу строим фронтенд вокруг реальных продуктовых модулей"
              description="Каркас рассчитан не на витрину, а на живые сценарии: каталог треков, страницы обучения, интеграцию с API, прогресс, AI hints и монетизацию."
            />
            <div className="section-grid">
              {platformFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="tracks">
          <div className="container">
            <SectionHeading
              eyebrow="Треки"
              title="Каталог уже читает данные из backend API"
              description="Если backend недоступен локально, фронтенд использует fallback-данные. Это позволяет спокойно продолжать верстку и роутинг, не блокируя UI на каждой серверной правке."
            />
            <div className="track-grid">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">{previewTrack ? <TrackMapPreview track={previewTrack} /> : null}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

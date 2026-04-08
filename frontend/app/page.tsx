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
          <div className="hero-shell hero__grid">
            <div className="hero__content">
              <div className="eyebrow">Учиться через маршрут, а не через хаос</div>
              <h1>CodeNovsu помогает войти в программирование мягко, но без потери глубины</h1>
              <p>
                Здесь теория, практика, карта прогресса, AI-подсказки и награды работают как единый учебный путь.
                Можно начать бесплатно, двигаться шаг за шагом и видеть, что делать дальше, без ощущения
                перегруженности.
              </p>
              <div className="hero__actions">
                <Link href="/tracks/cpp" className="button button--primary">
                  Начать с C++
                </Link>
                <Link href="/dashboard" className="button button--ghost">
                  Открыть кабинет
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
              description="Каждый экран должен отвечать на понятный пользовательский вопрос: где я сейчас, что мне делать дальше, насколько я продвинулся и что получу за усилие."
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
              title="Треки уже собраны как понятные маршруты роста"
              description="В каждом треке есть уровни сложности, практика, boss-модули и карта прогресса. Даже если backend временно недоступен, UI продолжает показывать реальную структуру обучения."
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

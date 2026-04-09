import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CodePreview } from "@/components/home/code-preview";
import { FeatureCard } from "@/components/marketing/feature-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TrackCard } from "@/components/tracks/track-card";
import { platformFeatures } from "@/features/home/content";
import { getTracks } from "@/lib/api/codenovsu";

const pathSteps = [
  { num: 1, title: "Пройди профтест",   desc: "Определи своё направление и уровень" },
  { num: 2, title: "Выбери трек",        desc: "C++, Python, JS, AI и другие" },
  { num: 3, title: "Изучай теорию",      desc: "Короткие уроки с наглядными примерами" },
  { num: 4, title: "Решай задачи",       desc: "Автопроверка и AI-подсказки без спойлеров" },
  { num: 5, title: "Получай награды",    desc: "Достижения, прогресс и сертификаты" },
];

export default async function HomePage() {
  const tracks = await getTracks();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="hero">
          {/* Animated background */}
          <div className="hero__bg" aria-hidden="true">
            <div className="hero__orb hero__orb--1" />
            <div className="hero__orb hero__orb--2" />
            <div className="hero__orb hero__orb--3" />
            <div className="hero__grid-overlay" />
            <div className="hero__scan" />
          </div>

          <div className="container">
            <div className="hero__inner">
              {/* Left: text */}
              <div className="hero__content">
                <span className="eyebrow">✦ Образовательная платформа</span>

                <h1 className="hero__title">
                  Учись писать код
                  <span className="hero__title-gradient">на практике</span>
                </h1>

                <p className="hero__subtitle">
                  Интерактивные треки, реальные задачи, AI-наставник и карта прогресса —
                  всё в одном месте. Начни бесплатно, без регистрации карты.
                </p>

                <div className="hero__actions">
                  <Link href="/tracks/cpp" className="button button--primary button--lg">
                    Начать обучение →
                  </Link>
                  <Link href="/career-test" className="button button--ghost button--lg">
                    Пройти профтест
                  </Link>
                </div>

                <div className="hero__metrics">
                  <div className="metric-pill">
                    <strong>24</strong>
                    <span>урока</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-pill">
                    <strong>6</strong>
                    <span>треков</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-pill">
                    <strong>3</strong>
                    <span>уровня AI</span>
                  </div>
                </div>
              </div>

              {/* Right: live code preview */}
              <div className="hero__card-wrap">
                <CodePreview />
              </div>
            </div>
          </div>
        </section>

        {/* ── ANIMATED STATS ───────────────────────────── */}
        <div className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-item__number">
                  <AnimatedCounter value={12000} suffix="+" />
                </div>
                <div className="stat-item__label">студентов</div>
                <span className="stat-item__icon">👤</span>
              </div>
              <div className="stat-item">
                <div className="stat-item__number">
                  <AnimatedCounter value={8} />
                </div>
                <div className="stat-item__label">треков</div>
                <span className="stat-item__icon">🎯</span>
              </div>
              <div className="stat-item">
                <div className="stat-item__number">
                  <AnimatedCounter value={240} suffix="+" />
                </div>
                <div className="stat-item__label">задач</div>
                <span className="stat-item__icon">⚡</span>
              </div>
              <div className="stat-item">
                <div className="stat-item__number">
                  <AnimatedCounter value={97} suffix="%" />
                </div>
                <div className="stat-item__label">довольны результатом</div>
                <span className="stat-item__icon">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TRACKS ───────────────────────────────────── */}
        <section className="section" id="tracks">
          <div className="container">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Треки"
                title="Выбери свой путь в программировании"
                description="Каждый трек — структурированный маршрут с уровнями сложности, практикой и картой прогресса."
              />
            </ScrollReveal>

            <div className="track-grid">
              {tracks.map((track, i) => (
                <ScrollReveal key={track.id} delay={i * 80}>
                  <TrackCard track={track} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEARNING PATH INFOGRAPHIC ─────────────────── */}
        <section className="section section--alt learning-path" id="features">
          <div className="container">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Как это работает"
                title="Путь от новичка до разработчика"
                description="Пять шагов, которые превращают теорию в реальные навыки."
              />
            </ScrollReveal>

            <div className="path-steps">
              {pathSteps.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 100} className="path-step">
                  <div className="path-step__number">{step.num}</div>
                  <div className="path-step__title">{step.title}</div>
                  <div className="path-step__desc">{step.desc}</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────── */}
        <section className="section" id="platform">
          <div className="container">
            <ScrollReveal>
              <SectionHeading
                eyebrow="Платформа"
                title="Всё необходимое для обучения"
                description="Теория, практика, AI-наставник и геймификация в едином учебном пространстве."
              />
            </ScrollReveal>

            <div className="section-grid">
              {platformFeatures.map((feature, i) => (
                <ScrollReveal key={feature.title} delay={i * 100}>
                  <FeatureCard {...feature} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="cta-section">
          <div className="container">
            <ScrollReveal>
              <div className="cta-card">
                <h2>Готов начать обучение?</h2>
                <p>Первый уровень бесплатно. Без кредитной карты.</p>
                <div className="cta-card__actions">
                  <Link href="/tracks/cpp" className="button button--primary button--lg">
                    Начать бесплатно
                  </Link>
                  <Link href="/career-test" className="button button--ghost button--lg">
                    Пройти профтест
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

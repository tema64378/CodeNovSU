import Link from "next/link";

import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <AuthGuard>
        <main className="section">
          <div className="container">
            <DashboardClient />

            <div className="detail-grid" style={{ marginTop: 24 }}>
              <article className="detail-card">
                <span className="eyebrow">Навигация</span>
                <h2>Что делать дальше, когда время ограничено</h2>
                <p>
                  Хороший кабинет не заставляет думать заново каждый раз. Он быстро возвращает тебя в понятный
                  контекст: продолжить трек, открыть практику или закрыть один короткий урок.
                </p>
                <div className="dashboard-actions">
                  <Link href="/tracks/cpp" className="button button--primary">
                    Вернуться к треку
                  </Link>
                  <Link href="/tracks/cpp/lessons/hello-world-and-structure" className="button button--ghost">
                    Один короткий урок
                  </Link>
                </div>
              </article>

              <aside className="detail-card">
                <span className="eyebrow">Подписка</span>
                <h2>Премиум нужен для глубины, а не для старта</h2>
                <p>
                  Бесплатный слой даёт вход и базовый ритм. Премиум открывает углублённые уровни, больше практики и
                  безлимитные AI-подсказки.
                </p>
                <div className="detail-chip-row">
                  <span className="chip chip--free">Free start</span>
                  <span className="chip chip--premium">Premium depth</span>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </AuthGuard>
      <SiteFooter />
    </div>
  );
}

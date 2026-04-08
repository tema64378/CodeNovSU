import { AuthGuard } from "@/components/auth/auth-guard";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CareerTestWizard } from "@/components/onboarding/career-test-wizard";

export default function CareerTestPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <AuthGuard>
        <main className="auth-layout">
          <div className="container auth-grid">
            <CareerTestWizard />
            <aside className="detail-card auth-aside">
              <div className="eyebrow">Зачем это нужно</div>
              <h2 style={{ marginTop: 0 }}>Тест сокращает путь до первого осмысленного прогресса</h2>
              <p>
                Когда направлений много, новичку тяжело понять, с чего реально начать. Тест помогает не метаться
                между темами, а выбрать трек, который ближе по цели, формату обучения и когнитивной нагрузке.
              </p>
              <div className="auth-benefits">
                <article className="auth-benefit-card">
                  <strong>Меньше перегруза</strong>
                  <p>Вместо шести равноправных направлений пользователь получает один разумный стартовый маршрут.</p>
                </article>
                <article className="auth-benefit-card">
                  <strong>Быстрее к практике</strong>
                  <p>После результата можно сразу открыть рекомендованный трек и не тратить силы на выбор вручную.</p>
                </article>
                <article className="auth-benefit-card">
                  <strong>Можно пересдать</strong>
                  <p>Если цели меняются, тест разрешает повторное прохождение через 7 дней.</p>
                </article>
              </div>
            </aside>
          </div>
        </main>
      </AuthGuard>
      <SiteFooter />
    </div>
  );
}

import { AuthForm } from "@/components/auth/auth-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function LoginPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="auth-layout">
        <div className="container auth-grid">
          <AuthForm />
          <aside className="detail-card auth-aside">
            <div className="eyebrow">После входа</div>
            <h2 style={{ marginTop: 0 }}>Ты сразу попадаешь в живой учебный поток</h2>
            <p>
              Кабинет не должен быть пустой прослойкой между логином и обучением. Он сразу показывает твой маршрут,
              ближайший урок, ачивки и прогресс по трекам.
            </p>
            <div className="auth-benefits">
              <article className="auth-benefit-card">
                <strong>Маршрут</strong>
                <p>Видно, какой урок доступен сейчас, какой заблокирован и где тебя ждёт boss-модуль.</p>
              </article>
              <article className="auth-benefit-card">
                <strong>Практика</strong>
                <p>Можно быстро вернуться к задаче, продолжить попытку и запросить AI-подсказку без спойлеров.</p>
              </article>
              <article className="auth-benefit-card">
                <strong>Награды</strong>
                <p>Ачивки и прогресс помогают держать темп и видеть, что усилия превращаются в реальный рост.</p>
              </article>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

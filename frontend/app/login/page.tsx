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
          <aside className="detail-card">
            <div className="eyebrow">Что дальше</div>
            <h2 style={{ marginTop: 0 }}>Первый production auth flow уже на месте</h2>
            <p>
              Этот экран перенесён из прототипа в живой Next.js маршрут и теперь работает с backend API вместо
              демонстрационного JS.
            </p>
            <ul>
              <li>регистрация создаёт пользователя и возвращает JWT;</li>
              <li>логин проверяет пароль и создаёт сессию на клиенте;</li>
              <li>после входа пользователь попадает в новый dashboard;</li>
              <li>следом сюда можно добавить Google и VK OAuth без переписывания UI.</li>
            </ul>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

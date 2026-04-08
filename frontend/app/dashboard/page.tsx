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
          <div className="container detail-section">
            <DashboardClient />
            <section className="detail-grid">
              <article className="detail-card">
                <div className="eyebrow">Следующий шаг</div>
                <h2 style={{ marginTop: 0 }}>Что уже migrated из прототипа</h2>
                <p>
                  Мы начали перенос auth‑сценариев: production login и dashboard теперь существуют отдельно от
                  статических HTML-файлов и могут расширяться без копирования логики.
                </p>
                <ul>
                  <li>логин и регистрация работают через backend API;</li>
                  <li>появился клиентский auth provider с local session;</li>
                  <li>dashboard защищён и знает текущего пользователя;</li>
                  <li>header теперь реагирует на состояние авторизации.</li>
                </ul>
              </article>

              <aside className="detail-card">
                <div className="eyebrow">Продолжение</div>
                <h2 style={{ marginTop: 0 }}>Что переносить дальше</h2>
                <p>Следующим логичным блоком станет перенос lesson/task flow поверх уже готового API каталога.</p>
                <Link href="/tracks/cpp" className="button button--primary">
                  Перейти к треку
                </Link>
              </aside>
            </section>
          </div>
        </main>
      </AuthGuard>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";

import { AuthStatusActions } from "@/components/auth/auth-status-actions";
import { appConfig } from "@/lib/config";

const navItems = [
  { href: "/#tracks", label: "Треки" },
  { href: "/#features", label: "Платформа" },
  { href: "/#map", label: "Карта прогресса" },
  { href: "/#api-ready", label: "MVP" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand-lockup" aria-label="На главную">
          <span className="brand-lockup__mark">{"</>"}</span>
          <span className="brand-lockup__text">
            <span className="brand-lockup__title">{appConfig.appName}</span>
            <span className="brand-lockup__subtitle">Практика. Проекты. ИИ-наставник.</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__cta">
          <span className="badge-inline">Бета MVP</span>
          <AuthStatusActions />
          <Link href="/tracks/cpp" className="button button--primary">
            Открыть трек
          </Link>
        </div>
      </div>
    </header>
  );
}

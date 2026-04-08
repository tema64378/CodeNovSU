import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <strong>CodeNovsu</strong>
          <p>Платформа, в которой обучение ощущается как маршрут: практика, карта прогресса, награды и ИИ-наставник.</p>
        </div>
        <div className="site-footer__links">
          <Link className="muted-link" href="/tracks/cpp">
            C++ трек
          </Link>
          <Link className="muted-link" href="/tracks/ai-specialist">
            AI Specialist
          </Link>
          <Link className="muted-link" href="/tracks/cybersecurity">
            Кибербезопасность
          </Link>
          <Link className="muted-link" href="/dashboard">
            Кабинет
          </Link>
        </div>
      </div>
    </footer>
  );
}

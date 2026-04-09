import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <strong>CodeNovsu</strong>
            <p>
              Платформа для обучения программированию: практика, карта прогресса, AI-наставник и
              геймификация в едином пространстве.
            </p>
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
            <Link className="muted-link" href="/career-test">
              Профтест
            </Link>
            <Link className="muted-link" href="/dashboard">
              Кабинет
            </Link>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span className="site-footer__copy">© 2025 CodeNovsu. Все права защищены.</span>
          <span className="site-footer__copy">Новосибирский государственный университет</span>
        </div>
      </div>
    </footer>
  );
}

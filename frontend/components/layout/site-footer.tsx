import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <strong>CodeNovsu</strong>
          <p>Production frontend scaffold for the learning platform MVP.</p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link className="muted-link" href="/tracks/cpp">
            C++ Track
          </Link>
          <Link className="muted-link" href="/#features">
            Platform
          </Link>
          <Link className="muted-link" href="/#api-ready">
            API Ready
          </Link>
        </div>
      </div>
    </footer>
  );
}

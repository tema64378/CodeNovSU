import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <main className="container" style={{ padding: "88px 0" }}>
        <div className="detail-card">
          <div className="eyebrow">404</div>
          <h1 style={{ margin: 0 }}>Страница не найдена</h1>
          <p>
            Похоже, этот маршрут ещё не перенесён из прототипа в production frontend или такой трек не найден в API.
          </p>
          <Link href="/" className="button button--primary">
            Вернуться на главную
          </Link>
        </div>
      </main>
    </div>
  );
}

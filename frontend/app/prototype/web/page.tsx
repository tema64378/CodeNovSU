import Link from "next/link";

export default function PrototypeInfoPage() {
  return (
    <main className="container" style={{ padding: "72px 0" }}>
      <div className="detail-card">
        <div className="eyebrow">Prototype</div>
        <h1 style={{ margin: 0 }}>Статический прототип хранится отдельно</h1>
        <p>
          HTML-прототип сохранён в папке <code>frontend/prototype/web</code> как UI-референс. Этот App Router проект
          не рендерит его автоматически, чтобы не смешивать production frontend и статические страницы.
        </p>
        <p>
          Если нужно, следующим шагом я могу начать перенос конкретных страниц прототипа в React-компоненты и
          production-маршруты.
        </p>
        <Link href="/" className="button button--primary">
          Назад к production frontend
        </Link>
      </div>
    </main>
  );
}

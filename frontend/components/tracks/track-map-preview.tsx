import type { TrackDetail } from "@/lib/types";

export function TrackMapPreview({ track }: { track: TrackDetail }) {
  const firstLevel = track.levels[0];

  return (
    <section className="map-card" id="map">
      <div>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <div className="eyebrow">RPG-карта</div>
          <h2>Прогресс как маршрут, а не как скучный список уроков</h2>
          <p>
            В production-версии здесь появятся острова сложности, боссы, сундуки, NPC и визуальный маршрут по
            треку. Сейчас мы уже готовим данные так, чтобы карта строилась из API, а не была захардкожена.
          </p>
        </div>
      </div>

      <div className="map-lane">
        {firstLevel ? (
          <>
            <div className="map-node">
              <div className="map-node__index">{firstLevel.icon}</div>
              <div>
                <strong>{firstLevel.title}</strong>
                <p>Стартовая зона трека с базовыми уроками и безопасным входом в практику.</p>
              </div>
            </div>
            {firstLevel.lessons.map((lesson, index) => (
              <div className="map-node" key={lesson.id}>
                <div className="map-node__index">{index + 1}</div>
                <div>
                  <strong>{lesson.title}</strong>
                  <p>{lesson.summary}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="map-node">
            <div className="map-node__index">?</div>
            <div>
              <strong>Контент скоро будет загружен</strong>
              <p>Структура карты уже подготовлена, осталось наполнить уровни и уроки.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

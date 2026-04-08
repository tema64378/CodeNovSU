import { TrackCanvasMap } from "@/components/tracks/track-canvas-map";
import type { TrackDetail } from "@/lib/types";

export function TrackMapPreview({ track }: { track: TrackDetail }) {
  return (
    <section className="map-card" id="map">
      <div>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <div className="eyebrow">RPG-карта</div>
          <h2>Прогресс как маршрут, а не как скучный список уроков</h2>
          <p>
            В production-версии здесь появятся острова сложности, боссы, сундуки, NPC и визуальный маршрут по
            треку. Уже сейчас карта опирается на реальные уровни и уроки, а не на захардкоженный демо-список.
          </p>
        </div>
      </div>

      <TrackCanvasMap track={track} interactive={false} />
    </section>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const iconMap: Record<string, string> = {
  GUIDE: "🧠",
  FLOW:  "⚡",
  QUEST: "🗺️",
};

const kickerMap: Record<string, string> = {
  GUIDE: "AI-наставник",
  FLOW:  "Практика",
  QUEST: "Прогресс",
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="section-card">
      <div className="section-card__icon">{iconMap[icon] ?? icon}</div>
      <div className="section-card__kicker">{kickerMap[icon] ?? "Фича"}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

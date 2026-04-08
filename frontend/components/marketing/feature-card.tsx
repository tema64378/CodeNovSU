interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="section-card">
      <div className="section-card__icon">{icon}</div>
      <div className="section-card__kicker">Product flow</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

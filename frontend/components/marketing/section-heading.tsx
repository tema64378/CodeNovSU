interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

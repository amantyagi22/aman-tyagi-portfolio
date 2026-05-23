interface SectionHeaderProps {
  kicker: string;
  title: string;
  description: string;
}

export function SectionHeader({ kicker, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">{title}</h2>
      <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
        {description}
      </p>
    </div>
  );
}

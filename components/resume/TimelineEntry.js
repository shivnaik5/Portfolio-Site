const TimelineEntry = ({ entry }) => {
  const { company, title, location, date, content } = entry;

  return (
    <li className="relative mb-12 last:mb-0">
      <span className="absolute -left-9 top-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-display text-lg font-bold text-foreground">{company}</span>
        <span className="text-sm text-muted">{date}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-muted">
        {title && <span className="font-medium text-foreground">{title}</span>}
        <span>{location}</span>
      </div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted marker:text-accent-warm">
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </li>
  );
};

export default TimelineEntry;

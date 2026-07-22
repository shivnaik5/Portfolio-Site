const SectionHeading = ({ title, subtitle, className = '' }) => (
  <div className={`relative mb-16 ${className}`}>
    <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-accent-warm/20 blur-3xl" />
    <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
    <div className="relative">
      <h1 className="text-4xl font-bold text-foreground sm:text-5xl">{title}</h1>
      {subtitle && (
        <p className="mt-4 whitespace-pre-line text-lg text-muted">{subtitle}</p>
      )}
    </div>
  </div>
);

export default SectionHeading;

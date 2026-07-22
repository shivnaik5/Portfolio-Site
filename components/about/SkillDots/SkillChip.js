import { getCompetencyLevel } from './competencyLevel';

const SkillChip = ({ skill }) => {
  const { tech, icon, years } = skill;
  const level = getCompetencyLevel(years);

  return (
    <div
      className="group flex items-center gap-3 rounded-2xl border border-surface bg-surface/50 px-4 py-3 transition-transform duration-200 hover:scale-105"
      aria-label={`${tech}: ${level.label}`}
    >
      <i className={`devicon-${icon} text-2xl text-foreground`} aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{tech}</span>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((index) => {
            const filled = index < level.dots;
            return (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  filled ? 'bg-accent-warm group-hover:animate-refill' : 'bg-surface'
                }`}
                style={filled ? { animationDelay: `${index * 90}ms` } : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillChip;

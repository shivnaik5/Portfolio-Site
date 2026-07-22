// Competency is set per skill rather than derived from years of experience —
// time spent with a technology isn't continuous, so elapsed years overstate it.
// Keys here must match the `level` options in studio/schemas/skillGroup.js.
export const COMPETENCY_LEVELS = {
  beginner: { dots: 1, label: 'Beginner' },
  intermediate: { dots: 2, label: 'Intermediate' },
  advanced: { dots: 3, label: 'Advanced' },
};

export const getCompetencyLevel = (level) => COMPETENCY_LEVELS[level] ?? COMPETENCY_LEVELS.beginner;

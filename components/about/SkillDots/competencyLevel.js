export const COMPETENCY_LEVELS = {
  beginner: { dots: 1, label: 'Beginner' },
  intermediate: { dots: 2, label: 'Intermediate' },
  expert: { dots: 3, label: 'Expert' },
};

export const getCompetencyLevel = (years) => {
  if (years >= 8) return COMPETENCY_LEVELS.expert;
  if (years >= 4) return COMPETENCY_LEVELS.intermediate;
  return COMPETENCY_LEVELS.beginner;
};

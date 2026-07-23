/**
 * Shapes returned by the content layer. Both sources — Sanity and the local JSON
 * fallback — are normalised to these, so components never need to know which one
 * they are rendering.
 */

/** Keys must match the `level` options in studio/schemas/skillGroup.ts. */
export type CompetencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  tech: string;
  /** Devicon class without the "devicon-" prefix, e.g. "javascript-plain". */
  icon: string;
  /** Year first used. Not currently displayed. */
  year?: number;
  level: CompetencyLevel;
}

export interface SkillGroup {
  /** Organisational only — never rendered. */
  title: string;
  skills: Skill[];
}

/** Skills as the about page consumes them: groups flattened to columns of chips. */
export type SkillColumns = Skill[][];

export interface ExperienceEntry {
  company: string;
  /** Absent on entries like education, which render without a role. */
  title?: string;
  location: string;
  date: string;
  content: string[];
}

export interface ResumeContent {
  headline: string;
  description: string;
  details: ExperienceEntry[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface SiteSettings {
  photoUrl: string | null;
  resumeUrl: string;
  socialLinks: SocialLink[];
}

export interface HomeContent {
  welcome: {
    headline: string;
    titles: string[];
    text: string;
  };
  technicalExperience: {
    tagline: string;
    description: string;
    roles: string[];
  };
}

export interface AboutSection {
  title: string;
  description: string;
}

export interface AboutContent {
  title: string;
  subTitle: string;
  aboutMe: AboutSection[];
}

export interface NavLink {
  page: string;
  route: string;
  active: boolean;
}

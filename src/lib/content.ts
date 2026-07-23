import siteJson from '@/data/site.json';
import homeJson from '@/data/home.json';
import aboutJson from '@/data/about.json';
import skillsJson from '@/data/skills.json';
import resumeJson from '@/data/resume.json';
import linksJson from '@/data/links.json';
import { client, isSanityConfigured, urlFor } from './sanity';
import type { SanityImageSource } from '@sanity/image-url';
import type {
  AboutContent, HomeContent, NavLink, ResumeContent, SiteSettings, SkillColumns, SkillGroup,
} from './types';

// JSON imports widen string literals (level: string rather than the union), so the
// fallback data is asserted to the shared shapes it is already written to match.
const site = siteJson as SiteSettings;
const home = homeJson as HomeContent;
const about = aboutJson as AboutContent;
const skills = skillsJson as SkillGroup[];
const resume = resumeJson as ResumeContent;
const links = linksJson as NavLink[];

// Navigation stays local: it tracks which routes exist in the codebase, so it should
// change alongside the code rather than independently of it.
export const getLinks = (): NavLink[] => links;

const SITE_QUERY = `*[_type == "siteSettings"][0]{
  photo,
  "resumeUrl": resumeFile.asset->url,
  socialLinks[]{ label, url, icon }
}`;

const HOME_QUERY = `*[_type == "homePage"][0]{
  welcomeHeadline, welcomeTitles, welcomeText,
  experienceTagline, experienceDescription, roles
}`;

const ABOUT_QUERY = `*[_type == "aboutPage"][0]{
  title, subTitle, aboutMe[]{ title, description }
}`;

// Skill groups are ordered columns, each holding an ordered list of skills.
const SKILLS_QUERY = `*[_type == "skillGroup"] | order(order asc) {
  "skills": skills[]{ tech, icon, year, level }
}`;

// Timeline order is editorial, not chronological, so entries carry an explicit
// order field rather than being sorted by date.
const RESUME_QUERY = `{
  "settings": *[_type == "resumeSettings"][0]{ headline, description },
  "details": *[_type == "experience"] | order(order asc) {
    company, title, location, date, content
  }
}`;

/** Shared settings: photo, resume download and social links. */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (!isSanityConfigured()) return site;

  const settings = await client!.fetch<{
    photo?: SanityImageSource | null;
    resumeUrl?: string;
    socialLinks?: SiteSettings['socialLinks'];
  } | null>(SITE_QUERY);
  if (!settings) return site;

  return {
    // Sized for the largest slot either page renders it in, at 2x.
    photoUrl: urlFor(settings.photo)?.width(448).height(448).fit('crop').url() ?? site.photoUrl,
    resumeUrl: settings.resumeUrl ?? site.resumeUrl,
    socialLinks: settings.socialLinks?.length ? settings.socialLinks : site.socialLinks,
  };
};

export const getHomeContent = async (): Promise<HomeContent> => {
  if (!isSanityConfigured()) return home;

  const page = await client!.fetch<{
    welcomeHeadline: string;
    welcomeTitles?: string[];
    welcomeText: string;
    experienceTagline: string;
    experienceDescription: string;
    roles?: string[];
  } | null>(HOME_QUERY);
  if (!page) return home;

  return {
    welcome: {
      headline: page.welcomeHeadline,
      titles: page.welcomeTitles ?? [],
      text: page.welcomeText,
    },
    technicalExperience: {
      tagline: page.experienceTagline,
      description: page.experienceDescription,
      roles: page.roles ?? [],
    },
  };
};

export const getAboutContent = async (): Promise<AboutContent> => {
  if (!isSanityConfigured()) return about;

  const page = await client!.fetch<AboutContent | null>(ABOUT_QUERY);
  return page ?? about;
};

// Both sources share a shape — [{ title, skills }] — so they flatten the same way.
// Group titles are for organising the content, not for display.
const toSkillColumns = (groups: Pick<SkillGroup, 'skills'>[]): SkillColumns =>
  groups.map((group) => group.skills ?? []).filter((group) => group.length > 0);

export const getSkills = async (): Promise<SkillColumns> => {
  if (!isSanityConfigured()) return toSkillColumns(skills);

  const groups = await client!.fetch<Pick<SkillGroup, 'skills'>[]>(SKILLS_QUERY);
  if (!groups?.length) return toSkillColumns(skills);

  return toSkillColumns(groups);
};

export const getResumeContent = async (): Promise<ResumeContent> => {
  if (!isSanityConfigured()) return resume;

  const { settings, details } = await client!.fetch<{
    settings: Pick<ResumeContent, 'headline' | 'description'> | null;
    details: ResumeContent['details'];
  }>(RESUME_QUERY);
  if (!settings || !details?.length) return resume;

  return { headline: settings.headline, description: settings.description, details };
};

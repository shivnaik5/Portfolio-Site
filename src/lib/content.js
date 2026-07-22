import site from '@/data/site.json';
import home from '@/data/home.json';
import about from '@/data/about.json';
import skills from '@/data/skills.json';
import resume from '@/data/resume.json';
import links from '@/data/links.json';
import { client, isSanityConfigured, urlFor } from './sanity';

// Navigation stays local: it tracks which routes exist in the codebase, so it should
// change alongside the code rather than independently of it.
export const getLinks = () => links;

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

/**
 * Shared settings: { photoUrl, resumeUrl, socialLinks }
 */
export const getSiteSettings = async () => {
  if (!isSanityConfigured()) return site;

  const settings = await client.fetch(SITE_QUERY);
  if (!settings) return site;

  return {
    // Sized for the largest slot either page renders it in, at 2x.
    photoUrl: urlFor(settings.photo)?.width(448).height(448).fit('crop').url() ?? site.photoUrl,
    resumeUrl: settings.resumeUrl ?? site.resumeUrl,
    socialLinks: settings.socialLinks?.length ? settings.socialLinks : site.socialLinks,
  };
};

/**
 * Home content: { welcome, technicalExperience }
 */
export const getHomeContent = async () => {
  if (!isSanityConfigured()) return home;

  const page = await client.fetch(HOME_QUERY);
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

/**
 * About content: { title, subTitle, aboutMe }
 */
export const getAboutContent = async () => {
  if (!isSanityConfigured()) return about;

  const page = await client.fetch(ABOUT_QUERY);
  if (!page) return about;

  return page;
};

// Both sources share a shape — [{ title, skills }] — so they flatten the same way.
// Group titles are for organising the content, not for display.
const toSkillColumns = (groups) =>
  groups.map((group) => group.skills ?? []).filter((group) => group.length > 0);

/**
 * Skills, grouped into columns: [[{ tech, icon, year, level }, ...], ...]
 */
export const getSkills = async () => {
  if (!isSanityConfigured()) return toSkillColumns(skills);

  const groups = await client.fetch(SKILLS_QUERY);
  if (!groups?.length) return toSkillColumns(skills);

  return toSkillColumns(groups);
};

/**
 * Resume content: { headline, description, details: [...] }
 */
export const getResumeContent = async () => {
  if (!isSanityConfigured()) return resume;

  const { settings, details } = await client.fetch(RESUME_QUERY);
  if (!settings || !details?.length) return resume;

  return {
    headline: settings.headline,
    description: settings.description,
    details,
  };
};

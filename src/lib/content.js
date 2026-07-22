import home from '@/data/home.json';
import about from '@/data/about.json';
import skills from '@/data/skills.json';
import resume from '@/data/resume.json';
import links from '@/data/links.json';
import { client, isSanityConfigured } from './sanity';

// Content still served from local JSON. These change rarely and aren't worth the
// round trip to a CMS; see README for how to move them to Sanity later.
export const getHomeContent = () => home;
export const getAboutContent = () => about;
export const getLinks = () => links;

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

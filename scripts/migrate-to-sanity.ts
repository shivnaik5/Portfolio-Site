/**
 * One-off import of the local JSON content into Sanity.
 *
 *   SANITY_PROJECT_ID=... SANITY_WRITE_TOKEN=... node scripts/migrate-to-sanity.ts
 *
 * Documents are written with deterministic IDs via createOrReplace, so running it
 * twice is safe — but note that it overwrites, so any edits made in the studio to
 * these documents are lost on a re-run. Pass --dry-run to preview without writing.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { createClient } from '@sanity/client';

import type {
  AboutContent, HomeContent, ResumeContent, SiteSettings, SkillGroup,
} from '../src/lib/types.ts';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, '../src/data');

// Astro loads .env on its own, but this runs as a plain node script.
try {
  process.loadEnvFile(resolve(here, '../.env'));
} catch {
  // No .env file — fall back to whatever is already in the environment.
}

const dryRun = process.argv.includes('--dry-run');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error('SANITY_PROJECT_ID is not set.');
  process.exit(1);
}

if (!token && !dryRun) {
  console.error(
    'SANITY_WRITE_TOKEN is not set. Create a token with write access in the Sanity\n' +
      'management console (API > Tokens), or re-run with --dry-run to preview.',
  );
  process.exit(1);
}

const readJson = async <T>(name: string): Promise<T> =>
  JSON.parse(await readFile(resolve(dataDir, name), 'utf8')) as T;

// Array items need a _key that is unique within the array. Stripping non-alphanumerics
// alone is not enough — C, C++ and C# all collapse to "c" — so symbols are spelled out
// and the position is appended as a guarantee.
const skillKey = (tech: string, index: number) =>
  `${tech
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '')}-${index}`;

const [resume, skills, site, home, about] = await Promise.all([
  readJson<ResumeContent>('resume.json'),
  readJson<SkillGroup[]>('skills.json'),
  readJson<SiteSettings>('site.json'),
  readJson<HomeContent>('home.json'),
  readJson<AboutContent>('about.json'),
]);

type SanityDoc = { _id: string; _type: string } & Record<string, unknown>;

const documents: SanityDoc[] = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    socialLinks: site.socialLinks.map((link, index) => ({
      _type: 'socialLink',
      _key: `${link.label.toLowerCase().replace(/[^a-z0-9]/g, '')}-${index}`,
      label: link.label,
      url: link.url,
      icon: link.icon,
    })),
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    welcomeHeadline: home.welcome.headline,
    welcomeTitles: home.welcome.titles,
    welcomeText: home.welcome.text,
    experienceTagline: home.technicalExperience.tagline,
    experienceDescription: home.technicalExperience.description,
    roles: home.technicalExperience.roles,
  },
  {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: about.title,
    subTitle: about.subTitle,
    aboutMe: about.aboutMe.map((section, index) => ({
      _type: 'section',
      _key: `section-${index}`,
      title: section.title,
      description: section.description,
    })),
  },
  {
    _id: 'resumeSettings',
    _type: 'resumeSettings',
    headline: resume.headline,
    description: resume.description,
  },
  ...resume.details.map((entry, index) => ({
    _id: `experience-${index}`,
    _type: 'experience',
    order: index,
    company: entry.company,
    // Entries without a role (education) leave the field unset rather than empty.
    ...(entry.title ? { title: entry.title } : {}),
    location: entry.location,
    date: entry.date,
    content: entry.content,
  })),
  ...skills.map((group, index) => ({
    _id: `skillGroup-${index}`,
    _type: 'skillGroup',
    order: index,
    title: group.title,
    skills: group.skills.map((skill, skillIndex) => ({
      _type: 'skill',
      _key: skillKey(skill.tech, skillIndex),
      tech: skill.tech,
      icon: skill.icon,
      year: skill.year,
      level: skill.level,
    })),
  })),
];

// siteSettings holds assets uploaded through the studio — the photo and the resume
// PDF. createOrReplace would drop them, since a replace writes the whole document and
// this script has no idea what was uploaded. So it is created once, then only the
// fields owned by the JSON get patched on later runs.
const MERGE_ONLY = new Set(['siteSettings']);

console.log(`${dryRun ? '[dry run] Would import' : 'Importing'} ${documents.length} documents ` +
  `into ${projectId}/${dataset}:`);
for (const doc of documents) {
  const mode = MERGE_ONLY.has(doc._id) ? 'merge ' : 'replace';
  console.log(`  ${mode}  ${doc._type.padEnd(16)} ${doc._id}`);
}

if (dryRun) {
  process.exit(0);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false });

const tx = documents.reduce((transaction, doc) => {
  if (!MERGE_ONLY.has(doc._id)) return transaction.createOrReplace(doc);

  const { _id, _type, ...fields } = doc;
  return transaction
    .createIfNotExists({ _id, _type })
    .patch(_id, (patch: ReturnType<typeof client.patch>) => patch.set(fields));
}, client.transaction());

await tx.commit();
console.log('\nDone.');

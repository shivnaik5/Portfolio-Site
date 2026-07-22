/**
 * One-off import of the local JSON content into Sanity.
 *
 *   SANITY_PROJECT_ID=... SANITY_WRITE_TOKEN=... node scripts/migrate-to-sanity.mjs
 *
 * Documents are written with deterministic IDs via createOrReplace, so running it
 * twice is safe — but note that it overwrites, so any edits made in the studio to
 * these documents are lost on a re-run. Pass --dry-run to preview without writing.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { createClient } from '@sanity/client';

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

const readJson = async (name) => JSON.parse(await readFile(resolve(dataDir, name), 'utf8'));

// Array items need a _key that is unique within the array. Stripping non-alphanumerics
// alone is not enough — C, C++ and C# all collapse to "c" — so symbols are spelled out
// and the position is appended as a guarantee.
const skillKey = (tech, index) =>
  `${tech
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '')}-${index}`;

const [resume, skills] = await Promise.all([readJson('resume.json'), readJson('skills.json')]);

const documents = [
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

console.log(`${dryRun ? '[dry run] Would import' : 'Importing'} ${documents.length} documents ` +
  `into ${projectId}/${dataset}:`);
for (const doc of documents) {
  console.log(`  ${doc._type.padEnd(16)} ${doc._id}`);
}

if (dryRun) {
  process.exit(0);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false });

const tx = documents.reduce((transaction, doc) => transaction.createOrReplace(doc), client.transaction());

await tx.commit();
console.log('\nDone.');

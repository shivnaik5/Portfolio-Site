import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET ?? 'production';
const token = import.meta.env.SANITY_READ_TOKEN;

// The site builds statically, so content is fetched once per build — a handful of
// requests, not per-visitor traffic. The CDN would save a few milliseconds there and
// cost correctness: it lags a write by a few seconds, which is exactly the window a
// deploy webhook fires in, so a build triggered by publishing can bake in the content
// as it was *before* the publish. Visitors are served by Vercel's CDN either way.
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      useCdn: false,
      token,
    })
  : null;

// When SANITY_PROJECT_ID is unset the content layer falls back to local JSON, so
// the site still builds on a fresh clone with no credentials configured.
export const isSanityConfigured = () => client !== null;

const builder = client ? createImageUrlBuilder(client) : null;

/**
 * Build a URL for a Sanity image asset, served from Sanity's image CDN.
 * Returns null for empty values so callers can keep using falsy checks.
 *
 * urlFor(image).width(448).height(448).url()
 */
export const urlFor = (source) => (builder && source ? builder.image(source) : null);

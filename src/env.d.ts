/// <reference types="astro/client" />

// Read at build time only — the site is statically generated, so none of these reach
// the browser. See .env.example.
interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string;
  readonly SANITY_DATASET?: string;
  /** Only needed for a private dataset. */
  readonly SANITY_READ_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Subdomain the studio is hosted on: https://shivang-naik.sanity.studio
  studioHost: 'shivang-naik',
  deployment: {
    // Identifies the hosted studio app, so redeploys don't prompt for it.
    appId: 'baykmse9yak82d30nd6ejrz0',
  },
});

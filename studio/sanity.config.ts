import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';

// Page-level documents that only ever have one instance. Each is pinned as a single
// editable document instead of a list you can add to.
const SINGLETONS = ['siteSettings', 'homePage', 'aboutPage', 'resumeSettings'];

// Document actions that make no sense on a singleton.
const SINGLETON_HIDDEN_ACTIONS = ['unpublish', 'delete', 'duplicate'];

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID is not set — copy studio/.env.example to studio/.env');
}

// A singleton opens straight into its one document rather than a list of one.
const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio Content',

  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            singleton(S, 'siteSettings', 'Site Settings'),
            S.divider(),
            singleton(S, 'homePage', 'Home Page'),
            singleton(S, 'aboutPage', 'About Page'),
            singleton(S, 'resumeSettings', 'Resume Page'),
            S.divider(),
            S.documentTypeListItem('experience').title('Experience'),
            S.documentTypeListItem('skillGroup').title('Skill Groups'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({ action }) => !action || !SINGLETON_HIDDEN_ACTIONS.includes(action))
        : actions,
  },
});

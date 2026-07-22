import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';

// resumeSettings holds the resume page heading. There is only ever one, so it is
// pinned as a single editable document instead of a list you can add to.
const SINGLETONS = ['resumeSettings'];

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio Content',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Resume Page')
              .id('resumeSettings')
              .child(S.document().schemaType('resumeSettings').documentId('resumeSettings')),
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
        ? actions.filter(({ action }) => !['unpublish', 'delete', 'duplicate'].includes(action))
        : actions,
  },
});

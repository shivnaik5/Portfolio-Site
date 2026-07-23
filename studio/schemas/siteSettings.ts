import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Shared across pages — the photo, the resume download, and the social links.',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description:
        'Used on both the home and about pages. Both lay out differently when no photo is set, so leaving this empty is fine.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume (PDF)',
      type: 'file',
      description:
        'Linked from the "Download Resume" button. Replacing the file here updates the site on the next build — no code change needed.',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Devicon name',
              type: 'string',
              description: 'Devicon class without the "devicon-" prefix, e.g. "github-original".',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});

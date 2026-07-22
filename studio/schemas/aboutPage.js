import { defineArrayMember, defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subTitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Line breaks are preserved as written.',
    }),
    defineField({
      name: 'aboutMe',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          fields: [
            defineField({
              name: 'title',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Body',
              type: 'text',
              rows: 10,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});

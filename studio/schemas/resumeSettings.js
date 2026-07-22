import { defineField, defineType } from 'sanity';

export const resumeSettings = defineType({
  name: 'resumeSettings',
  title: 'Resume Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'headline' },
  },
});

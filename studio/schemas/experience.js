import { defineField, defineType } from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Role',
      type: 'string',
      description: 'Optional — leave blank for entries like education, which render without a role.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date range',
      type: 'string',
      description: 'Free text, shown as written. For example "March 2021 - Present".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Bullet points',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Position in the timeline, lowest first. The timeline is ordered editorially rather than by date, so this is set by hand.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Timeline order',
      name: 'timelineOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'company', subtitle: 'date', order: 'order' },
    prepare: ({ title, subtitle, order }) => ({
      title: `${order ?? '–'}. ${title}`,
      subtitle,
    }),
  },
});

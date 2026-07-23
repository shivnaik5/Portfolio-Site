import { defineArrayMember, defineField, defineType } from 'sanity';

export const skillGroup = defineType({
  name: 'skillGroup',
  title: 'Skill Group',
  type: 'document',
  description: 'A row of related skills on the about page.',
  fields: [
    defineField({
      name: 'title',
      title: 'Group name',
      type: 'string',
      description: 'For your reference in the studio only — not shown on the site.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Position among the skill rows, lowest first.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'skill',
          fields: [
            defineField({
              name: 'tech',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Devicon name',
              type: 'string',
              description:
                'Devicon class without the "devicon-" prefix, for example "javascript-plain". See devicon.dev for the full list.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'year',
              title: 'First used',
              type: 'number',
              description: 'The year you started using this.',
              validation: (Rule) => Rule.integer().min(1980).max(new Date().getFullYear()),
            }),
            defineField({
              name: 'level',
              title: 'Competency',
              type: 'string',
              description: 'Drives the dots shown on the chip: 1, 2 or 3.',
              options: {
                list: [
                  { title: 'Beginner', value: 'beginner' },
                  { title: 'Intermediate', value: 'intermediate' },
                  { title: 'Advanced', value: 'advanced' },
                ],
                layout: 'radio',
              },
              initialValue: 'intermediate',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'tech', subtitle: 'level' },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Group order',
      name: 'groupOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', order: 'order' },
    prepare: ({ title, order }) => ({ title: `${order ?? '–'}. ${title}` }),
  },
});

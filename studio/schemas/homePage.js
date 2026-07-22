import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fieldsets: [
    { name: 'welcome', title: 'Welcome' },
    { name: 'experience', title: 'Technical experience' },
  ],
  fields: [
    defineField({
      name: 'welcomeHeadline',
      title: 'Headline',
      type: 'string',
      fieldset: 'welcome',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'welcomeTitles',
      title: 'Titles',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Shown joined together above the headline.',
      fieldset: 'welcome',
    }),
    defineField({
      name: 'welcomeText',
      title: 'Intro text',
      type: 'text',
      rows: 3,
      fieldset: 'welcome',
    }),
    defineField({
      name: 'experienceTagline',
      title: 'Tagline',
      type: 'string',
      fieldset: 'experience',
    }),
    defineField({
      name: 'experienceDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      fieldset: 'experience',
    }),
    defineField({
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Rendered as a row of pills.',
      fieldset: 'experience',
    }),
  ],
  preview: {
    select: { title: 'welcomeHeadline' },
    prepare: ({ title }) => ({ title: 'Home Page', subtitle: title }),
  },
});

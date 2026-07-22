Personal portfolio website to demonstrate my work experience and display my resume and technical skills.

## About

This project was built with the following technologies:

- Astro
- Tailwind CSS
- Vercel

## Getting Started

This project requires both Node.js and git installed on your machine. Node.js 22.12.0 or newer is required — an `.nvmrc` is included, so `nvm use` will select the right version.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site in a browser. The page reloads automatically when you make edits.

### Other scripts

Build the production site to `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
  pages/       Routes — each .astro file becomes a page
  layouts/     Shared page shell
  components/  UI components, grouped by page/section
  data/        JSON content for each page
  lib/         Content helpers
  styles/      Global CSS and Tailwind setup
public/        Static assets served as-is (fonts, favicon)
```

Page content lives in `src/data/*.json`, so most copy updates can be made without touching components.

## Work in Progress

Improvements will continue to be made over time. The following features are in development:

- General responsiveness and style improvements
- Under Construction: Blog and Portfolio pages

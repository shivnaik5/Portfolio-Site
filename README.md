Personal portfolio website to demonstrate my work experience and display my resume and technical skills.

## About

This project was built with the following technologies:

- Astro
- Tailwind CSS
- Sanity (CMS)
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
  data/        Local JSON content, and the fallback for Sanity-backed content
               (site.json, home.json, about.json, resume.json, skills.json, links.json)
  lib/         Content getters (content.js) and the Sanity client (sanity.js)
  styles/      Global CSS and Tailwind setup
public/        Static assets served as-is (fonts, favicon)
studio/        Sanity Studio — schemas and config, deployed separately
scripts/       One-off maintenance scripts
```

Home, about and navigation content lives in `src/data/*.json`, so that copy can be updated without touching components. Resume and skills content comes from Sanity — see below.

## Content

Page content is managed in Sanity. Everything goes through the getters in [`src/lib/content.js`](src/lib/content.js), which components import — they never read a data source directly.

| Document | Holds |
| --- | --- |
| Site Settings | Photo, resume PDF, social links — shared by the home page and footer |
| Home Page | Welcome copy and the role pills |
| About Page | Title, subtitle and the prose sections |
| Resume Page | Timeline heading and description |
| Experience | One document per role, ordered by hand |
| Skill Groups | Rows of skills, each with a competency level |

Navigation (`src/data/links.json`) stays local on purpose: it tracks which routes exist in the codebase, so it should change alongside the code rather than independently of it.

**Sanity is not required to run the site.** With `SANITY_PROJECT_ID` unset, the content layer falls back to the JSON in `src/data/`, so a fresh clone builds and runs with no setup.

### Connecting Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) and note the project ID.
2. Copy `.env.example` to `.env` and fill in `SANITY_PROJECT_ID`. Separately, copy `studio/.env.example` to `studio/.env` and fill in `SANITY_STUDIO_PROJECT_ID` — the Sanity CLI reads env files from the studio directory, so both are needed.
3. In the management console under **API → CORS origins**, add `http://localhost:3333` with credentials allowed, so the local studio can reach the dataset.
4. Import the existing JSON content:

   ```bash
   SANITY_WRITE_TOKEN=<token> npm run sanity:migrate
   ```

   Add `--dry-run` to preview first. The token needs write access and is only used by this script — it should not be set in the deployed environment.

5. Set `SANITY_PROJECT_ID` and `SANITY_DATASET` in the Vercel project settings so production builds read from Sanity.

Content is fetched at **build time**, so publishing a change in Sanity requires a redeploy to appear on the site. Wire up a Sanity webhook against a Vercel deploy hook to make that automatic.

Reads deliberately bypass Sanity's API CDN (`useCdn: false` in [`src/lib/sanity.js`](src/lib/sanity.js)). The CDN lags a write by a few seconds — precisely the window a publish-triggered deploy fires in — so leaving it on lets a build bake in the content as it was *before* the publish that triggered it. The saving would be a few milliseconds on a handful of build-time requests; visitors are served by Vercel either way.

If a rebuild still shows the old content after a change was published, the build cache is stale — clear it and build again:

```bash
rm -rf node_modules/.astro node_modules/.vite .astro dist && npm run build
```

`node_modules/.astro` is the one that matters and the easiest to miss — clearing only `.astro` and `dist` will still serve the previous build's content.

On Vercel the equivalent is redeploying with the build cache disabled. This bites specifically when *only* the CMS changed and no source file did, so nothing local looks different enough to invalidate.

### Editing content

The studio is a standalone app in `studio/`, deployed and hosted by Sanity:

```bash
cd studio && npm install
```

```bash
cd studio && npm run dev
```

Runs the studio locally at [http://localhost:3333](http://localhost:3333). To publish it to a `<project>.sanity.studio` URL:

```bash
cd studio && npm run deploy
```

Schemas live in `studio/schemas/`. Two things to know about the model:

- The resume timeline and the skill groups are ordered by an explicit `order` field rather than by date, because the timeline order is editorial.
- Each skill carries a `level` of `beginner`, `intermediate` or `advanced`, which maps to the 1–3 dots on the chip. Competency is set by hand rather than derived from years, since time spent with a technology isn't continuous. The `year` field records when you first used something and is not currently displayed.

## Work in Progress

Improvements will continue to be made over time. The following features are in development:

- General responsiveness and style improvements
- Under Construction: Blog and Portfolio pages

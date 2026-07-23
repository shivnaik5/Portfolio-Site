# Development and Release Workflow

How work moves from a feature branch to the live site, and why each rule exists.
Most of these rules are here because the workflow broke down between 2021 and 2023 —
the reasoning is recorded so it doesn't get undone by accident.

## The two repositories

| Repo | Visibility | Role |
| --- | --- | --- |
| `shivnaik5/portfolio-private` | Private | Day-to-day development. Feature branches, WIP, full history. |
| `shivnaik5/Portfolio-Site` | Public | The showcase. What recruiters see, and what Vercel deploys. |

Development stays private; only finished releases become public.

## How deployment actually works

Vercel is connected to the **public** repo:

- `master` → **Production** (the live site)
- any other branch → **Preview** (a throwaway URL)

This is Vercel's default: the production branch is the repo's default branch. It is not
configured anywhere in this repo — it lives at **Vercel → Project → Settings → Git →
Production Branch**.

Nothing in the private repo deploys. Pushing here is always safe.

## Branching

```
private:  feature/<name> ──► development ──► release/X.Y.Z
                                                  │
public:                          development ◄────┘
                                      │
                                   master ──► production
```

- `feature/<name>` — one branch per piece of work, branched from `development`
- `development` — integration branch, and the default branch of the private repo
- `release/X.Y.Z` — a snapshot being published; created from `development`

## Releasing

Scripts do each step and refuse to run when a precondition fails, so the rules below are
enforced rather than remembered. Every script takes `--dry-run` to show what it would do,
and asks before anything is pushed.

| Command | Does |
| --- | --- |
| `npm run release:status` | Read-only health check across both repos. Start here. |
| `npm run release:start -- X.Y.Z` | Cuts `release/X.Y.Z`, bumps `package.json`, tags it |
| `npm run release:publish` | Pushes the release branch to public `development` → **preview** |
| `npm run release:promote` | Merges public `development` → `master` → **production** |
| `npm run release:finish` | Merges the release branch back into private `development` |

The manual equivalents are documented below so the scripts stay auditable.

### 1. Merge the feature into `development` (private)

Open a PR from `feature/<name>` into `development` and merge it. Any merge strategy is
fine here — this history never leaves the private repo.

### 2. Cut a release branch (private)

```bash
git checkout development
git pull
git checkout -b release/X.Y.Z
```

### 3. Bump the version and tag it

`package.json` is the single source of truth for the version number. The release branch,
the tag, and `package.json` must all agree.

```bash
npm version X.Y.Z --no-git-tag-version
git commit -am "Version X.Y.Z"
git tag -a vX.Y.Z -m "Version X.Y.Z"
git push origin release/X.Y.Z --follow-tags
```

Tag **every** release, not just notable ones. Tagging lapsed after `v1.0.1` and there is
now no way to tell what shipped in 1.0.2 or 1.0.3 without reading diffs.

### 4. Push the release to the public repo's `development`

Use the URL and an explicit `source:destination` refspec. Do **not** add the public repo
as a named remote:

```bash
git push git@github.com:shivnaik5/Portfolio-Site.git release/X.Y.Z:development
git push git@github.com:shivnaik5/Portfolio-Site.git vX.Y.Z
```

> **Why the explicit refspec.** Five branches — `development`, three `feature/*`, and
> `task/responsiveness` — leaked into the public repo, almost certainly via a
> `git push --all` against a configured remote. With no remote configured and an explicit
> refspec, only the branch named can move.

This produces a **Preview** deployment. Check it before continuing.

### 5. Merge `development` into `master` in the public repo

```bash
cd ../Portfolio-Site
git fetch origin
git checkout master
git merge --no-ff origin/development
git push origin master
```

Or open a PR in the public repo and use **"Create a merge commit"**.

> **Never squash or rebase this merge.** This is the single rule that matters most, and
> the one that was broken before. Every past `development → master` merge rewrote commits
> into new SHAs, so public `master` became a *variant* of the private history rather than
> the same commits. That is why `56d4c82` on master and `633f9da` on development share a
> commit message but not an identity, and why the two repos permanently diverged. A merge
> commit keeps the original commits intact, so tags stay valid and the histories stay
> comparable.

Merging to `master` deploys to **production**.

### 6. Merge the release branch back into `development` (private)

Otherwise the version bump only exists on the release branch.

```bash
git checkout development
git merge --no-ff release/X.Y.Z
git push origin development
```

## Publishing content changes

Content lives in Sanity, not in git, so **releases do not publish content** and content
changes do not require a release. The two paths are independent:

| Change | How it ships |
| --- | --- |
| Code | The release process above |
| Content (Sanity) | A rebuild of the public `master` deployment |

The site fetches from Sanity at build time, so a Sanity edit changes nothing until a build
runs. See the README for wiring a Sanity webhook to a Vercel deploy hook.

**Prerequisite:** `SANITY_PROJECT_ID` and `SANITY_DATASET` must be set in the Vercel
project. Without them the build silently falls back to the JSON in `src/data/`, and CMS
edits will never appear no matter how many times it rebuilds.

## Checking where things stand

After a gap, run:

```bash
npm run release:status
```

It reports both repos' branch tips, whether versions and tags agree, whether any unexpected
branches exist publicly, and — most importantly — whether any commit on public `master` is
missing from the private repo. That last check is the drift detector: a commit on master
with no private counterpart means master was rebuilt rather than merged, which is the
failure that went unnoticed from 2023 until 2026.

## Versioning

Semantic versioning, with `package.json` as the source of truth.

- **Major** — a stack change or rewrite (Next.js → Astro is `2.0.0`)
- **Minor** — new pages or features
- **Patch** — fixes and content-shaped code changes

As of this writing four version numbers disagree: `release/1.0.3`, tag `v1.0.1`, private
`package.json` `0.2.0`, and public `package.json` `0.1.0`. The next release should reset
all of them to a single agreed number.

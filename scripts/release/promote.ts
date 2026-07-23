/**
 * Step 3 — merge the public repo's development into master. This deploys to PRODUCTION.
 *
 *   npm run release:promote
 *
 * Always a --no-ff merge. Never a squash or rebase: those rewrite commits into new SHAs,
 * which is what made public master a variant of the private history rather than the same
 * commits, and left the two repos permanently diverged. See WORKFLOW.md.
 */
import {
  PUBLIC_CLONE, PUBLIC_DEV, PUBLIC_PROD, assertPublicClone, confirm, detail, fail, git, gitLive,
  info, isDryRun, ok, requireCleanTree, step, warn,
} from './lib.ts';

const cwd = PUBLIC_CLONE;

step('Checking preconditions');

assertPublicClone();
ok(`public clone found at ${PUBLIC_CLONE}`);

requireCleanTree(cwd, 'public repo');
ok('public working tree is clean');

git(['fetch', 'origin'], { cwd });

const devTip = git(['rev-parse', `origin/${PUBLIC_DEV}`], { cwd })!;
const prodTip = git(['rev-parse', `origin/${PUBLIC_PROD}`], { cwd })!;

if (devTip === prodTip) fail(`${PUBLIC_PROD} already matches ${PUBLIC_DEV}. Nothing to promote.`);

const alreadyMerged =
  git(['merge-base', '--is-ancestor', devTip, prodTip], { cwd, allowFail: true }) !== null;
if (alreadyMerged) fail(`${PUBLIC_DEV} is already contained in ${PUBLIC_PROD}. Nothing to promote.`);

// The version being promoted comes from package.json on the development branch.
const version = JSON.parse(git(['show', `origin/${PUBLIC_DEV}:package.json`], { cwd })!).version;
const tag = `v${version}`;
ok(`promoting version ${version}`);

const tagExists = git(['rev-parse', '--verify', '--quiet', tag], { cwd, allowFail: true });
if (!tagExists) {
  warn(`Tag ${tag} is not in the public repo — release:publish normally pushes it.`);
} else {
  ok(`tag ${tag} present`);
}

const incoming = git(['log', '--format=  %h %s', `${prodTip}..${devTip}`], { cwd });
step(`Commits ${PUBLIC_PROD} will gain`);
info(incoming || '  (none)');

if (isDryRun()) {
  step('Dry run — nothing merged or pushed.');
  detail(`Would run: git merge --no-ff origin/${PUBLIC_DEV}`);
  process.exit(0);
}

step('This deploys to PRODUCTION — the live site.');
if (!(await confirm(`Merge ${PUBLIC_DEV} into ${PUBLIC_PROD} and push?`))) fail('Aborted.');

gitLive(['checkout', PUBLIC_PROD], { cwd });
gitLive(['merge', '--ff-only', `origin/${PUBLIC_PROD}`], { cwd });
gitLive(['merge', '--no-ff', `origin/${PUBLIC_DEV}`, '-m', `Merge development for ${tag}`], { cwd });
gitLive(['push', 'origin', PUBLIC_PROD], { cwd });

step('Verifying no drift was introduced');

const newProdTip = git(['rev-parse', PUBLIC_PROD], { cwd })!;
const devInProd =
  git(['merge-base', '--is-ancestor', devTip, newProdTip], { cwd, allowFail: true }) !== null;

if (!devInProd) {
  fail(
    'The development commits are NOT ancestors of master after the merge.',
    'Something rewrote history. This is the exact failure the workflow exists to prevent.',
  );
}
ok('every development commit is now an ancestor of master — no rewriting occurred');

if (tagExists) {
  const tagInProd =
    git(['merge-base', '--is-ancestor', tag, newProdTip], { cwd, allowFail: true }) !== null;
  tagInProd ? ok(`${tag} is an ancestor of ${PUBLIC_PROD}`) : warn(`${tag} is NOT on ${PUBLIC_PROD}`);
}

step('Done.');
detail('Vercel is building production. Then run: npm run release:finish');

/**
 * Step 2 — push the release branch to the public repo's development branch.
 * Produces a Vercel preview deployment. Does not touch production.
 *
 *   npm run release:publish
 */
import {
  PUBLIC_DEV, PUBLIC_URL, assertNoPublicRemote, confirm, currentBranch, detail, fail, git,
  gitLive, info, isDryRun, ok, remoteTip, requireCleanTree, step, versionFromBranch,
} from './lib.ts';

const branch = currentBranch();
const version = versionFromBranch(branch);

if (!version) {
  fail(
    `Not on a release branch (you are on ${branch}).`,
    'Run `npm run release:start -- X.Y.Z` first, or check out an existing release/X.Y.Z.',
  );
}

const tag = `v${version}`;

step('Checking preconditions');

requireCleanTree();
ok('working tree is clean');

assertNoPublicRemote();
ok('no git remote points at the public repo');

if (!git(['rev-parse', '--verify', '--quiet', tag], { allowFail: true })) {
  fail(`Tag ${tag} does not exist.`, 'release:start creates it. Was this branch made by hand?');
}
ok(`tag ${tag} exists`);

const publicDevTip = remoteTip(PUBLIC_DEV);
if (!publicDevTip) fail(`Could not read ${PUBLIC_DEV} on the public repo.`, 'Check SSH access.');

// A non-fast-forward push would rewrite the public branch and orphan whatever is there.
const isFastForward = git(['merge-base', '--is-ancestor', publicDevTip, 'HEAD'], {
  allowFail: true,
}) !== null;

if (!isFastForward) {
  fail(
    `Public ${PUBLIC_DEV} (${publicDevTip.slice(0, 8)}) is not an ancestor of ${branch}.`,
    'Pushing would rewrite public history. Reconcile the branches before publishing.',
  );
}
ok(`push to public ${PUBLIC_DEV} is a fast-forward`);

const incoming = git(['log', '--format=  %h %s', `${publicDevTip}..HEAD`]);
step(`Commits the public repo will gain on ${PUBLIC_DEV}`);
info(incoming || '  (none — already up to date)');

if (isDryRun()) {
  step('Dry run — nothing pushed.');
  detail(`Would push ${branch} → ${PUBLIC_DEV} and tag ${tag}`);
  process.exit(0);
}

if (!(await confirm(`Push ${branch} to the PUBLIC repo's ${PUBLIC_DEV} branch?`))) fail('Aborted.');

step('Pushing to the public repo');

// Explicit source:destination refspec — only this branch can move.
gitLive(['push', PUBLIC_URL, `${branch}:${PUBLIC_DEV}`]);
gitLive(['push', PUBLIC_URL, tag]);

step('Done.');
detail('Vercel is building a preview from the public development branch.');
detail('Check it, then run: npm run release:promote');

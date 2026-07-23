/**
 * Step 4 — merge the release branch back into development, so the version bump is not
 * stranded on the release branch.
 *
 *   npm run release:finish -- 2.0.0     (or run it while on the release branch)
 */
import {
  PRIVATE_DEV, branchExists, confirm, currentBranch, detail, fail, git, gitLive, info, isDryRun,
  ok, parseVersion, requireCleanTree, step,
} from './lib.mjs';

const version = process.argv[2]
  ? parseVersion(process.argv[2])
  : (() => {
      const fromBranch = currentBranch().match(/^release\/(\d+\.\d+\.\d+)$/)?.[1];
      if (!fromBranch) {
        fail('No version given and not on a release branch.', 'Usage: npm run release:finish -- 2.0.0');
      }
      return fromBranch;
    })();

const branch = `release/${version}`;

step('Checking preconditions');

requireCleanTree();
ok('working tree is clean');

if (!branchExists(branch)) fail(`Branch ${branch} does not exist.`);
ok(`${branch} exists`);

git(['fetch', 'origin', PRIVATE_DEV]);

const merged =
  git(['merge-base', '--is-ancestor', branch, PRIVATE_DEV], { allowFail: true }) !== null;
if (merged) fail(`${branch} is already merged into ${PRIVATE_DEV}. Nothing to do.`);

const incoming = git(['log', '--format=  %h %s', `${PRIVATE_DEV}..${branch}`]);
step(`Commits ${PRIVATE_DEV} will gain`);
info(incoming || '  (none)');

if (isDryRun()) {
  step('Dry run — nothing merged.');
  process.exit(0);
}

if (!(await confirm(`Merge ${branch} into ${PRIVATE_DEV} and push?`))) fail('Aborted.');

gitLive(['checkout', PRIVATE_DEV]);
gitLive(['merge', '--ff-only', `origin/${PRIVATE_DEV}`]);
gitLive(['merge', '--no-ff', branch, '-m', `Merge ${branch} into ${PRIVATE_DEV}`]);
gitLive(['push', 'origin', PRIVATE_DEV]);

step('Done.');
detail(`Release ${version} is complete. ${branch} can be deleted when you like.`);

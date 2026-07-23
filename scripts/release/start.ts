/**
 * Step 1 — cut a release branch from development, bump the version, tag it.
 *
 *   npm run release:start -- 2.0.0
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  PRIVATE_DEV, REPO_ROOT, branchExists, confirm, currentBranch, detail, fail, git, gitLive,
  info, isDryRun, ok, parseVersion, requireCleanTree, step,
} from './lib.ts';

const version = parseVersion(process.argv[2]);
const branch = `release/${version}`;
const tag = `v${version}`;

step('Checking preconditions');

requireCleanTree();
ok('working tree is clean');

const branchNow = currentBranch();
if (branchNow !== PRIVATE_DEV) {
  fail(
    `Releases are cut from ${PRIVATE_DEV}, but you are on ${branchNow}.`,
    `Merge your work into ${PRIVATE_DEV} first, then: git checkout ${PRIVATE_DEV}`,
  );
}
ok(`on ${PRIVATE_DEV}`);

if (branchExists(branch)) fail(`Branch ${branch} already exists.`);
if (branchExists(tag)) fail(`Tag ${tag} already exists.`, 'Pick a version that has not shipped.');
ok(`${branch} and ${tag} are free`);

git(['fetch', 'origin', PRIVATE_DEV]);
const behind = git(['rev-list', '--count', `${PRIVATE_DEV}..origin/${PRIVATE_DEV}`]);
if (behind !== '0') fail(`${PRIVATE_DEV} is ${behind} commit(s) behind origin.`, 'Run: git pull');
ok(`${PRIVATE_DEV} is up to date with origin`);

const currentVersion = JSON.parse(readFileSync(resolve(REPO_ROOT, 'package.json'), 'utf8')).version;
detail(`package.json: ${currentVersion} → ${version}`);

const lastTag = git(['describe', '--tags', '--abbrev=0'], { allowFail: true });
const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';

step(`Commits going into ${tag}${lastTag ? ` (since ${lastTag})` : ' (no previous tag)'}`);
info(git(['log', '--format=  %h %s', range]) || '  (none)');

if (isDryRun()) {
  step('Dry run — nothing changed.');
  process.exit(0);
}

if (!(await confirm(`Create ${branch}, bump to ${version} and tag ${tag}?`))) fail('Aborted.');

step('Creating the release');

gitLive(['checkout', '-b', branch]);

// --no-git-tag-version because the tag is created below, annotated, after the commit.
execFileSync('npm', ['version', version, '--no-git-tag-version'], {
  cwd: REPO_ROOT,
  stdio: 'inherit',
});

gitLive(['commit', '-am', `Version ${version}`]);
gitLive(['tag', '-a', tag, '-m', `Version ${version}`]);
gitLive(['push', 'origin', branch, '--follow-tags']);

step('Done.');
detail(`Next: npm run release:publish   — pushes ${branch} to the public repo for a preview`);

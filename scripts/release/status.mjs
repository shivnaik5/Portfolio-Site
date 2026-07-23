/**
 * Read-only health check across both repos. Run it any time, especially after a gap —
 * it answers "where did I leave this?" and detects the drift that went unnoticed for
 * years last time.
 *
 *   npm run release:status
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  PUBLIC_CLONE, PUBLIC_DEV, PUBLIC_PROD, PRIVATE_DEV, REPO_ROOT, currentBranch, detail, git,
  info, ok, step, warn,
} from './lib.mjs';

const short = (sha) => (sha ? sha.slice(0, 8) : '—');
const problems = [];
const flag = (msg) => {
  problems.push(msg);
  warn(msg);
};

step('Private repo');
detail(`on branch: ${currentBranch()}`);
if (git(['status', '--porcelain'])) warn('uncommitted changes');
else ok('working tree clean');

const privateVersion = JSON.parse(readFileSync(resolve(REPO_ROOT, 'package.json'), 'utf8')).version;

// Only vX.Y.Z tags are releases; archive/* tags mark preserved history and are ignored.
const versionTags = (git(['tag', '-l', 'v*']) ?? '').split('\n').filter(Boolean);
// describe finds the newest tag reachable from HEAD, which is empty on a branch that
// predates or diverges from every release.
const tagOnThisBranch = git(['describe', '--tags', '--match', 'v*', '--abbrev=0'], {
  allowFail: true,
});

detail(`package.json version: ${privateVersion}`);
detail(`release tags here: ${versionTags.join(', ') || '(none)'}`);
detail(`newest tag reachable from HEAD: ${tagOnThisBranch ?? '(none)'}`);

if (!versionTags.length) {
  flag('no release tags in the private repo — releases are not being tagged here');
} else if (tagOnThisBranch && tagOnThisBranch !== `v${privateVersion}`) {
  flag(`tag ${tagOnThisBranch} does not match package.json ${privateVersion}`);
} else if (!tagOnThisBranch) {
  detail('  (current branch has no release tag in its history — expected before a release)');
}

const publicClone = git(['remote', 'get-url', 'origin'], { cwd: PUBLIC_CLONE, allowFail: true });
if (!publicClone) {
  step('Public repo');
  warn(`no clone at ${PUBLIC_CLONE} — skipping public checks`);
  summarise();
}

const cwd = PUBLIC_CLONE;
git(['fetch', 'origin'], { cwd, allowFail: true });

step('Public repo');

const devTip = git(['rev-parse', `origin/${PUBLIC_DEV}`], { cwd, allowFail: true });
const prodTip = git(['rev-parse', `origin/${PUBLIC_PROD}`], { cwd, allowFail: true });
detail(`${PUBLIC_DEV}: ${short(devTip)}`);
detail(`${PUBLIC_PROD}: ${short(prodTip)}   ← production`);

const branches = git(['branch', '-r', '--format=%(refname:short)'], { cwd, allowFail: true }) ?? '';
const extra = branches
  .split('\n')
  .map((b) => b.replace('origin/', '').trim())
  .filter((b) => b && b !== 'HEAD' && b !== PUBLIC_DEV && b !== PUBLIC_PROD);

if (extra.length) flag(`unexpected public branches: ${extra.join(', ')}`);
else ok(`only ${PUBLIC_PROD} and ${PUBLIC_DEV} exist`);

step('Drift between the repos');

// The invariant that failed silently before: every commit on public master should also
// exist in the private repo. If it does not, master was rebuilt rather than merged.
const prodCommits = (git(['log', '--format=%H', `origin/${PUBLIC_PROD}`], { cwd }) ?? '').split('\n');
const orphans = prodCommits.filter(
  (sha) => sha && git(['cat-file', '-e', `${sha}^{commit}`], { allowFail: true }) === null,
);

if (orphans.length) {
  flag(`${orphans.length} commit(s) on public ${PUBLIC_PROD} do not exist in the private repo`);
  for (const sha of orphans.slice(0, 5)) {
    detail(`  ${short(sha)} ${git(['log', '-1', '--format=%s', sha], { cwd })}`);
  }
  if (orphans.length > 5) detail(`  … and ${orphans.length - 5} more`);
  detail('  This is the signature of a squash or rebase merge into master.');
} else {
  ok(`every commit on public ${PUBLIC_PROD} exists in the private repo`);
}

const devInProd =
  devTip && prodTip
    ? git(['merge-base', '--is-ancestor', devTip, prodTip], { cwd, allowFail: true }) !== null
    : false;
if (devInProd) ok(`${PUBLIC_DEV} is fully merged into ${PUBLIC_PROD}`);
else {
  const ahead = git(['rev-list', '--count', `${prodTip}..${devTip}`], { cwd, allowFail: true });
  info(`  ${PUBLIC_DEV} is ${ahead} commit(s) ahead of ${PUBLIC_PROD} — unreleased work`);
}

const privateDevTip = git(['rev-parse', PRIVATE_DEV], { allowFail: true });
if (privateDevTip && devTip) {
  if (privateDevTip === devTip) ok('private and public development are identical');
  else {
    const unpublished = git(['rev-list', '--count', `${devTip}..${PRIVATE_DEV}`], { allowFail: true });
    info(`  private ${PRIVATE_DEV} is ${unpublished ?? '?'} commit(s) ahead of public ${PUBLIC_DEV}`);
  }
}

summarise();

function summarise() {
  step(problems.length ? `${problems.length} issue(s) found` : 'No issues found');
  for (const p of problems) info(`  - ${p}`);
  process.exit(0);
}

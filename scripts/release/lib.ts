import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

// The public repo is addressed by URL rather than a configured remote. A named remote is
// what allows a stray `git push --all` to copy every local branch into the public repo,
// which is how five development branches ended up there. See WORKFLOW.md.
export const PUBLIC_URL = 'git@github.com:shivnaik5/Portfolio-Site.git';
export const PUBLIC_CLONE = process.env.PUBLIC_CLONE ?? resolve(REPO_ROOT, '../Portfolio-Site');

export const PRIVATE_DEV = 'development';
export const PUBLIC_DEV = 'development';
export const PUBLIC_PROD = 'master';

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

export const info = (msg: string) => console.log(msg);
export const step = (msg: string) => console.log(`\n${msg}`);
export const ok = (msg: string) => console.log(`  ${GREEN}✓${RESET} ${msg}`);
export const warn = (msg: string) => console.log(`  ${YELLOW}!${RESET} ${msg}`);
export const detail = (msg: string) => console.log(`  ${DIM}${msg}${RESET}`);

export const fail: (msg: string, hint?: string) => never = (msg, hint) => {
  console.error(`\n${RED}✖ ${msg}${RESET}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
};

interface GitOptions {
  cwd?: string;
  /** Return null instead of exiting when the command fails. */
  allowFail?: boolean;
}

export const git = (args: string[], { cwd = REPO_ROOT, allowFail = false }: GitOptions = {}): string | null => {
  try {
    // trimEnd rather than trim: log output is formatted with a leading indent that
    // trim() would strip from the first line only.
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trimEnd();
  } catch (error) {
    if (allowFail) return null;
    const stderr = (error as { stderr?: Buffer | string }).stderr;
    fail(`git ${args.join(' ')} failed`, stderr?.toString().trim());
  }
};

export const gitLive = (args: string[], { cwd = REPO_ROOT }: GitOptions = {}): void => {
  try {
    execFileSync('git', args, { cwd, stdio: 'inherit' });
  } catch {
    fail(`git ${args.join(' ')} failed`);
  }
};

export const confirm = async (question: string): Promise<boolean> => {
  if (process.argv.includes('--yes')) return true;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`\n${question} [y/N] `);
  rl.close();
  return answer.trim().toLowerCase() === 'y';
};

export const isDryRun = (): boolean => process.argv.includes('--dry-run');

export const currentBranch = (cwd: string = REPO_ROOT): string =>
  git(['rev-parse', '--abbrev-ref', 'HEAD'], { cwd })!;

export const requireCleanTree = (cwd: string = REPO_ROOT, label = 'repo'): void => {
  if (git(['status', '--porcelain'], { cwd })) {
    fail(`The ${label} has uncommitted changes.`, 'Commit or stash them before releasing.');
  }
};

export const branchExists = (name: string, cwd: string = REPO_ROOT): boolean =>
  git(['rev-parse', '--verify', '--quiet', name], { cwd, allowFail: true }) !== null;

export const parseVersion = (value: string | undefined): string => {
  if (!value) fail('No version given.', 'Usage: npm run release:start -- 2.0.0');
  if (!/^\d+\.\d+\.\d+$/.test(value)) {
    fail(`"${value}" is not a valid semver version.`, 'Expected MAJOR.MINOR.PATCH, e.g. 2.0.0');
  }
  return value;
};

/** Version implied by the current release/X.Y.Z branch, or null. */
export const versionFromBranch = (branch: string): string | null => branch.match(/^release\/(\d+\.\d+\.\d+)$/)?.[1] ?? null;

/** Tip of a branch on the public repo, read without cloning it. */
export const remoteTip = (branch: string): string | null => {
  const line = git(['ls-remote', PUBLIC_URL, `refs/heads/${branch}`], { allowFail: true });
  return line ? line.split(/\s+/)[0] : null;
};

/**
 * Guards against the mistake that leaked branches into the public repo: a named remote
 * pointing at it, which `git push --all` would then target.
 */
export const assertNoPublicRemote = (): void => {
  const remotes = git(['remote', '-v']) ?? '';
  const offender = remotes
    .split('\n')
    .find((line) => line.includes('Portfolio-Site'));
  if (offender) {
    fail(
      'A git remote is configured for the public repo.',
      `Remove it with: git remote remove ${offender.split(/\s+/)[0]}\n  ` +
        'The release scripts push by URL so that `git push --all` can never reach it.',
    );
  }
};

export const assertPublicClone = (): void => {
  const url = git(['remote', 'get-url', 'origin'], { cwd: PUBLIC_CLONE, allowFail: true });
  if (!url) {
    fail(
      `No git repo found at ${PUBLIC_CLONE}`,
      `Clone it there, or set PUBLIC_CLONE=/path/to/Portfolio-Site`,
    );
  }
  if (!url!.includes('Portfolio-Site')) {
    fail(`${PUBLIC_CLONE} points at ${url}, not the public portfolio repo.`);
  }
};

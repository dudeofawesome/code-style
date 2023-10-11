#!/usr/bin/env node --loader tsm
// #!/usr/bin/env tsm

import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { log } from 'node:console';
import { readFile } from 'node:fs/promises';
import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const exec = promisify(execCallback);

interface NpmWorkspace {
  [key: string]: unknown;

  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  /** local path to the package */
  location: string;
  /** absolute path to the package */
  path: string;
  /** normalized absolute path to the package */
  realpath: string;
}
type NpmWorkspaceQueryResponse = NpmWorkspace[];

function run(command: string, dry_run: boolean) {
  if (dry_run) {
    log(`$ ${command}`);
  } else {
    return exec(command).then((res) => res.stdout);
  }
}

interface BumpOptions {
  dryRun?: boolean;
}
async function bump(type: string, { dryRun = true }: BumpOptions = {}) {
  log('Bumping main package version.');
  await run(`npm version --no-git-tag-version "${type}"`, dryRun);

  const new_version: string = (
    JSON.parse((await readFile('package.json')).toString()) as {
      version: string;
    }
  ).version;

  log('Bumping sub-package versions.');
  // await run(`npm version "${new_version}" --ws`, dryRun);
  await bump_subpackages(new_version, { dryRun });
  await run(`npm install`, dryRun);

  log('Committing changes.');
  await run(`git add package*.json **/package*.json`, dryRun);
  await run(`git commit --message "🚀🔖 release v${new_version}"`, dryRun);
  await run(`git tag "v${new_version}"`, dryRun);
}

interface BumpSubpackagesOptions extends BumpOptions {
  bumped_packages?: Set<string>;
}
async function bump_subpackages(
  version: string,
  { dryRun = true, bumped_packages = new Set() }: BumpSubpackagesOptions = {},
) {
  const workspaces: NpmWorkspaceQueryResponse = JSON.parse(
    await exec(`npm query .workspace`).then((res) => res.stdout),
  ) as NpmWorkspaceQueryResponse;

  const leaves = find_leaves(workspaces, bumped_packages)
    // ignore packages we've already bumped
    .filter((l) => !bumped_packages.has(l.name));
  log(leaves.length);
  log(leaves.map((l) => l.name));

  if (leaves.length === 0) {
    throw new Error(`Didn't find any leaves to bump!`);
  }

  // TODO: this still seems to get confused when upgrading packages with dependents
  await run(
    `npm version "${version}" ${leaves
      .map((l) => `--workspace ${l.location}`)
      .join(' ')}`,
    dryRun,
  );

  await run(
    `npx upgrade-packages ${leaves
      .map((l) => `${l.name}@${version}`)
      .join(' ')}`,
    dryRun,
  );

  leaves.forEach((l) => bumped_packages.add(l.name));

  if (bumped_packages.size < workspaces.length) {
    await bump_subpackages(version, { dryRun, bumped_packages });
  }
}

function find_leaves(
  workspaces: NpmWorkspaceQueryResponse,
  ignore: Set<string>,
): NpmWorkspace[] {
  return workspaces.filter(
    (possible_leaf) =>
      // check that we found no dependents
      find_dependents(workspaces, possible_leaf, ignore).length === 0,
  );
}

function find_dependents(
  haystack: NpmWorkspaceQueryResponse,
  needle: NpmWorkspace,
  ignore: Set<string> = new Set(),
): NpmWorkspace[] {
  return haystack.filter(
    (potential_dependent) =>
      // ensure we're not looking at ourself
      (needle !== potential_dependent ||
        needle.name !== potential_dependent.name) &&
      // ingore if we're told to
      !ignore.has(potential_dependent.name) &&
      // check if possible_leaf is listed in potential_dependent's dependencies
      (potential_dependent.dependencies?.[needle.name] != null ||
        potential_dependent.devDependencies?.[needle.name] != null ||
        potential_dependent.peerDependencies?.[needle.name] != null),
  );
}

async function main() {
  const args = await Yargs(hideBin(process.argv))
    .scriptName('bump')
    .usage('Usage:\t$0 [options] [new-version]')
    .option('dry-run', {
      alias: 'd',
      description: 'Prevent changing state',
      boolean: true,
      default: false,
    })
    .positional('new-version', {
      description:
        '<custom>|major|minor|patch|premajor|preminor|prepatch|prerelease',
      demandOption: true,
      type: 'string',
      choices: [
        'major',
        'minor',
        'patch',
        'premajor',
        'preminor',
        'prepatch',
        'prerelease',
      ],
      default: 'patch',
      boolean: true,
    })
    .help()
    .parserConfiguration({
      'strip-aliased': true,
      'strip-dashed': true,
    })
    .middleware([
      // hack to get positional arguments on root command
      (args): void => {
        const version = args._.shift();
        if (version != null) {
          args.newVersion = version.toString();
        }
      },
    ]).argv;

  await bump(args.newVersion, args);
}

await main();

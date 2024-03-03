#!/usr/bin/env -S node --loader tsm
/* eslint-disable n/no-sync */

import { execSync } from 'node:child_process';
import { concurrently, CloseEvent } from 'concurrently';

const script = process.argv[2];
const extra_commands = process.argv.slice(3);

const workspaces = (
  JSON.parse(execSync(`npm query .workspace`, { encoding: 'utf-8' })) as {
    location: string;
  }[]
).map((p) => p.location);

const res = concurrently(
  workspaces
    .map((workspace) => ({
      command: `npm run ${script} --workspace ${workspace} --if-present`,
      // name: workspace,
    }))
    .concat(extra_commands.map((command) => ({ command }))),
  { group: true, raw: true },
);

await res.result.catch((err: CloseEvent[]) => {
  console.error('The following commands failed:');
  console.error(
    err
      .filter((ev) => ev.exitCode !== 0)
      .map((ev) => `"${ev.command.command}"`)
      .join(', '),
  );
  process.exit(1);
});

/* eslint-enable n/no-sync */

#!/usr/bin/env -S node --import=tsx
/* eslint-disable n/no-sync */

import { execSync } from 'node:child_process';
import { concurrently, CloseEvent } from 'concurrently';

const script = process.argv[2];
const skip_workspaces =
  (process.argv[3] != null && ['--skip', '-s'].includes(process.argv[3])
    ? process.argv[4]?.split(',').map((ws) => ws.replace(/\/?$/u, ''))
    : null) ?? [];
const extra_commands = process.argv.slice(skip_workspaces.length === 0 ? 3 : 5);

const workspaces = (
  JSON.parse(execSync(`npm query .workspace`, { encoding: 'utf-8' })) as {
    location: string;
  }[]
)
  .map((p) => p.location)
  .filter((ws) => !skip_workspaces.includes(ws));

const res = concurrently(
  workspaces
    .map((workspace) => ({
      command: `npm run ${script} --workspace ${workspace} --if-present`,
      // name: workspace,
    }))
    .concat(extra_commands.map((command) => ({ command }))),
  { group: true, raw: true },
);

await res.result.catch((err: unknown) => {
  if (is_close_event_array(err)) {
    console.error('The following commands failed:');
    console.error(
      err
        .filter((ev) => ev.exitCode !== 0)
        .map((ev) => `"${ev.command.command}"`)
        .join(', '),
    );
  }
  process.exit(1);
});

function is_close_event_array(arr: unknown): arr is CloseEvent[] {
  return Array.isArray(arr) && is_close_event(arr[0]);
}

function is_close_event(ev: unknown): ev is CloseEvent {
  return (
    ev != null && typeof ev === 'object' && 'command' in ev && 'exitCode' in ev
  );
}

/* eslint-enable n/no-sync */

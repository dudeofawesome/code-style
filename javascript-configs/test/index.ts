import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';

const exec = promisify(execCallback);

void describe('javascript-configs', () => {
  void describe('node', () =>
    transpile_and_test({
      dir: 'node',
    }));

  void describe('react', () =>
    transpile_and_test({
      dir: 'react',
    }));
});

interface TranspileAndTestOpts {
  dir: string;
  js_config_path?: string;
}
async function transpile_and_test({
  dir,
  js_config_path = 'jsconfig.json',
}: TranspileAndTestOpts): Promise<void> {
  const cwd = join(__dirname, dir);
  const out_dir = join(cwd, 'dist');
  const out = await exec(
    `tsc --project "${js_config_path}" --outDir "${out_dir}" --incremental false --listEmittedFiles`,
    {
      cwd,
      env: {
        ...process.env,
        // prevent debugging TSC
        NODE_OPTIONS: undefined,
      },
    },
  );

  void it('should not output any errors', () => {
    strictEqual(out.stderr, '');
  });
}

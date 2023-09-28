import { describe, it } from 'node:test';
import { deepEqual, strictEqual, match } from 'node:assert';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { basename, join } from 'node:path';
import { readFile } from 'node:fs/promises';

const exec = promisify(execCallback);

describe('typescript-configs', () => {
  describe('jest', async () => {
    await transpile_and_test({ dir: 'jest', code_fragment: 'function foo()' });
    await transpile_and_test({
      dir: 'jest',
      ts_config: 'tsconfig.test.json',
      output_files: [
        'index.js',
        'index.js.map',
        'index.d.ts',
        'index.spec.js',
        'index.spec.js.map',
        'index.spec.d.ts',
      ],
      search_file: 'test/index.spec.js',
      code_fragment: 'expect',
    });
  });

  describe('library', async () => {
    await transpile_and_test({
      dir: 'library',
      output_files: [
        'index.js',
        'index.js.map',
        'index.d.ts',
        'index.d.ts.map',
      ],
      code_fragment: `return 'bar'`,
    });
  });

  describe('node', async () => {
    await transpile_and_test({
      dir: 'node',
      code_fragment: 'process.env.PATH',
    });
  });

  describe('react', async () => {
    await transpile_and_test({
      dir: 'react',
      code_fragment: 'window.location.href',
    });
  });
});

interface TranspileAndTestOpts {
  dir: string;
  ts_config?: string;
  output_files?: string[];
  search_file?: string;
  code_fragment?: string;
}
async function transpile_and_test({
  dir,
  ts_config = 'tsconfig.json',
  output_files = ['index.js', 'index.js.map', 'index.d.ts'],
  search_file = 'index.js',
  code_fragment,
}: TranspileAndTestOpts): Promise<{
  stdout: string;
  stderr: string;
}> {
  const cwd = join(__dirname, dir);
  const out_dir = join(cwd, 'dist');
  const out = await exec(
    `tsc --project "${ts_config}" --outDir "${out_dir}" --incremental false --listEmittedFiles`,
    {
      cwd,
      env: {
        ...process.env,
        // prevent debugging TSC
        NODE_OPTIONS: undefined,
      },
    },
  );

  it('should not output any errors', () => {
    strictEqual(out.stderr, '');
  });

  it('should create transpiled files', () => {
    deepEqual(
      out.stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => basename(line.split('TSFILE: ')[1])),
      output_files,
    );
  });

  if (code_fragment != null) {
    it('should contain some expected code', async () => {
      match(
        (await readFile(join(out_dir, search_file))).toString(),
        new RegExp(code_fragment),
      );
    });
  }

  return out;
}

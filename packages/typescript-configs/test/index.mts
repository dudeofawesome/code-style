import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { describe, it, expect, beforeAll } from '@jest/globals';

const { resolve } = createRequire(import.meta.url);
const exec = promisify(execCallback);

describe('typescript-configs', () => {
  describe('jest', () => {
    transpile_and_test({
      dir: 'fixtures/jest',
      code_fragment: 'function foo()',
    });
    transpile_and_test({
      dir: 'fixtures/jest',
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

  describe('library', () => {
    transpile_and_test({
      dir: 'fixtures/library',
      output_files: [
        'index.js',
        'index.js.map',
        'index.d.ts',
        'index.d.ts.map',
      ],
      code_fragment: `return 'bar'`,
    });
  });

  describe('node', () => {
    transpile_and_test({
      dir: 'fixtures/node',
      code_fragment: 'process.env.PATH',
    });
  });

  describe('react', () => {
    transpile_and_test({
      dir: 'fixtures/react',
      code_fragment: 'window.location.href',
    });
  });
});

/* eslint-disable jest/require-top-level-describe */
interface TranspileAndTestOpts {
  dir: string;
  ts_config?: string;
  output_files?: string[];
  search_file?: string;
  code_fragment?: string;
}
function transpile_and_test({
  dir,
  ts_config = 'tsconfig.json',
  output_files = ['index.js', 'index.js.map', 'index.d.ts'],
  search_file = 'index.js',
  code_fragment,
}: TranspileAndTestOpts): void {
  let cwd: string;
  let out_dir: string;
  let tsc_path: string;
  let out: /*Awaited<ReturnType<typeof exec>>*/ {
    stdout: string;
    stderr: string;
  };

  beforeAll(async () => {
    cwd = join(dirname(fileURLToPath(import.meta.url)), dir);
    out_dir = join(cwd, 'dist');
    tsc_path = resolve('typescript/bin/tsc');
    out = await exec(
      `${tsc_path} --project "${ts_config}" --outDir "${out_dir}" --incremental false --listEmittedFiles`,
      {
        cwd,
        env: {
          ...process.env,
          // prevent debugging TSC
          NODE_OPTIONS: undefined,
        },
      },
    );
  });

  it('should not output any errors', () => {
    expect(out.stderr).toEqual('');
  });

  it('should create transpiled files', () => {
    expect(
      out.stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => basename(line.split('TSFILE: ')[1] ?? '')),
    ).toStrictEqual(output_files);
  });

  if (code_fragment != null) {
    it('should contain some expected code', async () => {
      expect((await readFile(join(out_dir, search_file))).toString()).toContain(
        code_fragment,
      );
    });
  }
}
/* eslint-enable jest/require-top-level-describe */

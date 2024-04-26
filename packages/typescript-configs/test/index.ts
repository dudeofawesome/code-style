import { describe, it } from 'node:test';
import { deepEqual, strictEqual, match } from 'node:assert';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { basename, join } from 'node:path';
import { readFile } from 'node:fs/promises';

const exec = promisify(execCallback);

void describe('typescript-configs', () => {
  void describe('jest', () =>
    Promise.all([
      transpile_and_test({
        dir: 'fixtures/jest',
        code_fragment: 'function foo()',
      }),
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
      }),
    ]).then(() => undefined));

  void describe('library', () =>
    transpile_and_test({
      dir: 'fixtures/library',
      output_files: [
        'index.js',
        'index.js.map',
        'index.d.ts',
        'index.d.ts.map',
      ],
      code_fragment: `return 'bar'`,
    }));

  void describe('node', () =>
    transpile_and_test({
      dir: 'fixtures/node',
      code_fragment: 'process.env.PATH',
    }));

  void describe('react', () =>
    transpile_and_test({
      dir: 'fixtures/react',
      code_fragment: 'window.location.href',
    }));
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
}: TranspileAndTestOpts): Promise<void> {
  const cwd = join(__dirname, dir);
  const out_dir = join(cwd, 'dist');
  const tsc_path = require.resolve('typescript/bin/tsc');
  const out = await exec(
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

  void it('should not output any errors', () => {
    strictEqual(out.stderr, '');
  });

  void it('should create transpiled files', () => {
    deepEqual(
      out.stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => basename(line.split('TSFILE: ')[1] ?? '')),
      output_files,
    );
  });

  if (code_fragment != null) {
    await it('should contain some expected code', async () => {
      match(
        (await readFile(join(out_dir, search_file))).toString(),
        new RegExp(code_fragment, 'u'),
      );
    });
  }
}

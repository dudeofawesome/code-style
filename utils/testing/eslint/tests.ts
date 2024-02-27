import { copyFile, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { strictEqual, ok } from 'node:assert';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { cwd } from 'node:process';
import { after } from 'node:test';
import { randomUUID } from 'node:crypto';
import { ESLint } from 'eslint';
import { FilePathResult, FilePathOpts, filePath, file_exists } from '.';

export function noLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results[0]?.errorCount,
    0,
    `Expected there to be no lint errors, but found:\n${lint_results[0]?.messages
      .map((m) => `  ${m.ruleId}: ${m.message}`)
      .join('\n')}`,
  );
}

export function singleLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results.length,
    1,
    `Expected there to be only one lint result.`,
  );
  strictEqual(
    lint_results[0]?.messages.length,
    1,
    `Expected there to be one lint message, but there were ${
      lint_results[0]?.messages.length
    }:\n${lint_results[0]?.messages.map((m) => `  "${m.message}"`).join('\n')}`,
  );
}

interface TestRuleFailOpts extends TestNoFailOpts {
  ruleId: string;
}
export async function testRuleFail({
  linter,
  ruleId,
  files,
}: TestRuleFailOpts) {
  const _files = files.map((file) => ({
    code: file.code,
    path: file.path ?? filePath(file),
  }));

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    ok(
      res
        .map((r) => r.messages.map((m) => m.ruleId))
        .flat()
        .includes(ruleId),
    );
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}

interface TestNoFailOpts {
  linter: ESLint;
  files: ({
    code: string;
    path?: FilePathResult;
  } & FilePathOpts)[];
}
export async function testNoFail({ linter, files }: TestNoFailOpts) {
  const _files = files.map((file) => ({
    code: file.code,
    path: file.path ?? filePath(file),
  }));

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    noLintMessage(res);
  } else {
    // TODO(3): this is all kind of brittle
    const tmp_dir = join(tmpdir(), 'code-style-testing', randomUUID());
    const created_files: string[] = await Promise.all(
      _files
        .map((f) => ({
          ...f,
          path: join(tmp_dir, f.path),
        }))
        .map((f) =>
          mkdir(dirname(f.path), { recursive: true })
            .catch(() => {
              return;
            })
            .then<string>(async () => {
              await writeFile(f.path, f.code);
              return f.path;
            }),
        ),
    );
    await Promise.all([
      file_exists(join(cwd(), 'test', 'fixture', '.eslintrc.yaml')).then(
        (exists) =>
          exists
            ? copyFile(
                join(cwd(), 'test', 'fixture', '.eslintrc.yaml'),
                join(tmp_dir, '.eslintrc.yaml'),
              )
            : null,
      ),
      copyFile(
        join(cwd(), 'test', 'fixture', 'tsconfig.json'),
        join(tmp_dir, 'tsconfig.json'),
      ),
      symlink(
        join(cwd(), '../..', 'node_modules'),
        join(tmp_dir, 'node_modules'),
      ),
    ]).catch(console.error);
    after(() => rm(tmp_dir, { force: true, recursive: true }));

    noLintMessage(await linter.lintFiles(created_files));
  }
}

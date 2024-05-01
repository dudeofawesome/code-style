import { mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { ok, strictEqual, deepStrictEqual } from 'node:assert';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { cwd } from 'node:process';
import { /* TestFn, TestContext, */ it } from 'node:test';
import { randomUUID } from 'node:crypto';
import { ESLint } from 'eslint';
import { FilePathResult, FilePathOpts, filePath } from '.';

type TestFn = Exclude<Parameters<typeof it>[0], undefined>;
type TestContext = Parameters<TestFn>[0];

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

export function specificLintMessage(
  lint_results: ESLint.LintResult[],
  ruleId: string | string[],
) {
  const rule_ids = Array.isArray(ruleId) ? ruleId : [ruleId];

  const rules = lint_results
    .map((lint_result) => lint_result.messages.map((m) => m.ruleId))
    .flat();
  ok(rules.length > 0, `No lint failures detected.`);
  deepStrictEqual(
    rules,
    new Array(rules.length).fill(ruleId),
    `Expected there to be the following lint errors: ${rule_ids.join(', ')}, but found:\n${lint_results[0]?.messages
      .map((m) => `  ${m.ruleId}: ${m.message}`)
      .join('\n')}`,
  );
}

function map_files(files: TestNoFailOpts['files']) {
  return files.map((file) => ({
    code: file.code.endsWith('\n') ? file.code : `${file.code}\n`,
    path: file.path ?? filePath(file),
  }));
}

interface TestRuleFailOpts extends TestNoFailOpts {
  ruleId: string;
}
export function testRuleFail({
  linter,
  ruleId,
  files,
}: TestRuleFailOpts): TestFn {
  return async (ctx) => {
    const _files = map_files(files);

    if (_files.length === 1 && _files[0] != null) {
      const res = await linter.lintText(_files[0].code, {
        filePath: _files[0].path,
      });
      await it(`${ctx.name} and have lint failures`, () => {
        specificLintMessage(res, ruleId);
      });
    } else {
      const created_files = await setup_tmp_dir(ctx, _files);

      await it(`${ctx.name} and have lint failures`, async () => {
        specificLintMessage(await linter.lintFiles(created_files), ruleId);
      });
    }
  };
}

interface TestNoFailOpts {
  linter: ESLint;
  files: ({
    code: string;
    path?: FilePathResult;
  } & FilePathOpts)[];
}
export function testNoFail({ linter, files }: TestNoFailOpts): TestFn {
  return async (ctx) => {
    const _files = map_files(files);

    if (_files.length === 1 && _files[0] != null) {
      const res = await linter.lintText(_files[0].code, {
        filePath: _files[0].path,
      });
      noLintMessage(res);
    } else {
      const created_files = await setup_tmp_dir(ctx, _files);

      void it(`${ctx.name} and have no lint failures`, async () => {
        noLintMessage(await linter.lintFiles(created_files));
      });
    }
  };
}

export async function setup_tmp_dir(
  ctx: TestContext,
  files: {
    code: string;
    path: string;
  }[],
): Promise<string[]> {
  const tmp_dir = join(tmpdir(), 'code-style-testing', randomUUID());
  const created_files: string[] = await Promise.all(
    files
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
  ctx.before(async () => {
    await Promise.all([
      symlink(
        join(cwd(), '..', '..', 'node_modules'),
        join(tmp_dir, 'node_modules'),
      ),
    ]).catch((err: unknown) => console.error(err));
  });
  ctx.after(() => rm(tmp_dir, { force: true, recursive: true }));

  return created_files;
}

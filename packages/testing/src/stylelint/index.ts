import { codeBlock } from 'common-tags';
import stylelint from 'stylelint';
import type { LinterResult, Config } from 'stylelint';

export function expectNoLintMessage(lint_results: LinterResult): void {
  const lines = lint_results.results[0]?.source?.split('\n') ?? [];
  expect(
    lint_results.errored,
    lint_results.results
      .map((r) =>
        r.warnings
          .map(
            (w) => codeBlock`
              ${w.rule}: ${w.text}
                L${w.line}C${w.column}
                ${lines.slice(Math.min(0, w.line - 3), Math.max(w.line, lines.length)).map((l) => `  ${l}`)}
                ${' '.repeat(w.column - 1)}^
            `,
          )
          .join('\n'),
      )
      .join('\n'),
  ).toBe(false);
}

export function expectSingleLintMessage(lint_results: LinterResult): void {
  const result_count = lint_results.results
    .map((r) => r.warnings.length)
    .reduce((acc, curr) => acc + curr, 0);
  expect(
    result_count,
    // `Expected there to be one lint message, but there were ${result_count}.`,
  ).toBe(1);
}

interface ExpectRuleFailOpts extends ExpectNoFailOpts {
  ruleId: string;
}
export async function expectRuleFail({
  config,
  ruleId,
  files,
}: ExpectRuleFailOpts) {
  if (files.length === 1 && files[0] != null) {
    const lint_promise = stylelint.lint({
      config,
      code: files[0].code,
    });

    await expect(lint_promise).resolves.toMatchObject({ errored: true });
    expect(
      (await lint_promise).results
        .map((r) => r.warnings.map((w) => w.rule))
        .flat(),
    ).toContain(ruleId);
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}

interface ExpectNoFailOpts {
  config: Config;
  files: {
    code: string;
    path?: string;
  }[];
}
export async function expectNoFail({ config, files }: ExpectNoFailOpts) {
  if (files.length === 1 && files[0] != null) {
    const lint_promise = stylelint.lint({
      config,
      code: files[0].code,
    });

    await expect(lint_promise).resolves.not.toThrow();
    expectNoLintMessage(await lint_promise);
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}

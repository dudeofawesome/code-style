import { strictEqual, ok, doesNotReject } from 'node:assert';
import stylelint, { LinterResult, Config } from 'stylelint';

export function noLintMessage(lint_results: LinterResult): void {
  ok(
    !lint_results.errored,
    lint_results.results
      .map((r) => r.warnings.map((w) => `  ${w.rule}: ${w.text}`).join('\n'))
      .join('\n'),
  );
}

export function singleLintMessage(lint_results: LinterResult): void {
  const result_count = lint_results.results
    .map((r) => r.warnings.length)
    .reduce((acc, curr) => acc + curr, 0);
  strictEqual(
    result_count,
    1,
    `Expected there to be one lint message, but there were ${result_count}.`,
  );
}

interface TestRuleFailOpts extends TestNoFailOpts {
  ruleId: string;
}
export async function testRuleFail({
  config,
  ruleId,
  files,
}: TestRuleFailOpts) {
  if (files.length === 1 && files[0] != null) {
    const lint_promise = stylelint.lint({
      config,
      code: files[0].code,
    });
    await doesNotReject(lint_promise);
    const result = await lint_promise;

    ok(result.errored);
    ok(
      result.results
        .map((r) => r.warnings.map((w) => w.rule))
        .flat()
        .includes(ruleId),
    );
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}

interface TestNoFailOpts {
  config: Config;
  files: {
    code: string;
    path?: string;
  }[];
}
export async function testNoFail({ config, files }: TestNoFailOpts) {
  if (files.length === 1 && files[0] != null) {
    const lint_promise = stylelint.lint({
      config,
      code: files[0].code,
    });
    await doesNotReject(lint_promise);
    const result = await lint_promise;

    noLintMessage(result);
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}

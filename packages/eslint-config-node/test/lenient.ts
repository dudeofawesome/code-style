import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as node_lenient } from '@code-style/eslint-config-node/lenient';

const linter = initESLint([...base, ...node, ...node_lenient]);

void describe('eslint-config-node lenient', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass n/no-sync`, () =>
      testNoFail({
        linter,
        files: [{ code: `const { readFileSync } = require('fs');` }],
      }));

    void it(`should pass n/no-process-env`, () =>
      testNoFail({ linter, files: [{ code: `process.env.FOO;\n` }] }));
  });

  void describe('fails', () => {
    void it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));
  });
});

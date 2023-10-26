import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@dudeofawesome', '@dudeofawesome/react'],
});

void describe('eslint-config-react', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should parse jsx`, async () =>
      testNoFail({
        linter,
        files: [
          {
            code: `import React from 'react';\n\nexport const A = () => <div></div>;\n`,
            react: true,
          },
        ],
      }));
  });

  void describe('fails', () => {
    void it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n`, react: true }],
      }));

    void it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n`, react: true }],
      }));

    void it(`should fail react/jsx-key`, () =>
      testRuleFail({
        linter,
        ruleId: 'react/jsx-key',
        files: [
          {
            code: `import React from 'react';

export const Foo = (props) => <div>{props}</div>;
export const Bar = (props) => props.list.map((l) => <Foo text={l}></Foo>);
`,
            react: true,
          },
        ],
      }));
  });
});

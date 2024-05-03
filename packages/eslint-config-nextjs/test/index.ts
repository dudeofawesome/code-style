import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: [
    '@code-style/eslint-config',
    '@code-style/eslint-config-esmodule',
    '@code-style/eslint-config-browser',
    '@code-style/eslint-config-react',
    '@code-style/eslint-config-nextjs',
  ],
});

void describe('eslint-config-nextjs', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should parse jsx`, () =>
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
    void it(`should fail radix`, () =>
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

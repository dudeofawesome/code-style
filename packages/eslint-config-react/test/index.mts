import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectRuleFail, expectNoFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: [
    '@code-style/eslint-config',
    '@code-style/eslint-config-esmodule',
    '@code-style/eslint-config-browser',
    '@code-style/eslint-config-react',
  ],
});

describe('eslint-config-react', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should parse jsx`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: `import React from 'react';\n\nexport const A = () => <div></div>;\n`,
            react: true,
          },
        ],
      }));
  });

  describe('fails', () => {
    it(`should fail radix`, () =>
      expectRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n`, react: true }],
      }));

    it(`should fail no-console`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n`, react: true }],
      }));

    it(`should fail react/jsx-key`, () =>
      expectRuleFail({
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

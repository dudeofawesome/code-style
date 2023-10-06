import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testNoFail, testRuleFail } from '../../utils/testing/eslint';
import { eslintDefaultTestSet } from '../../utils/testing/default-test-sets';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-react', () => {
  eslintDefaultTestSet(linter);

  describe('passes', () => {
    it(`should parse jsx`, async () =>
      testNoFail({
        linter,
        files: [
          {
            code: `import React from 'react';\n\nexport const A = () => <div></div>;\n`,
            path: 'index.jsx',
          },
        ],
      }));
  });

  describe('fails', () => {
    it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        code: `parseInt('10');\n`,
        ruleId: 'radix',
        file_path: 'index.jsx',
      }));

    it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        code: `console.log('foo');\n`,
        ruleId: 'no-console',
        file_path: 'index.jsx',
      }));

    it(`should fail react/jsx-key`, () =>
      testRuleFail({
        linter,
        code: `import React from 'react';

export const Foo = (props) => <div>{props}</div>;
export const Bar = (props) => props.list.map((l) => <Foo text={l}></Foo>);
`,
        ruleId: 'react/jsx-key',
        file_path: 'index.jsx',
      }));
  });
});

import { RuleTester } from '@typescript-eslint/rule-tester';
import { no_barreling } from './no-barreling.js';

const ruleTester = new RuleTester();

ruleTester.run('my-rule', no_barreling, {
  valid: [
    { code: `export type * from './test'` },
    { code: `export const foo = 'foo'` },
    { code: `function foo() { return 'foo'; }` },
  ],

  invalid: [
    {
      code: `export * from './test'`,
      errors: [
        {
          messageId: 'not_allowed',
          suggestions: [{ messageId: 'delete_export', output: `` }],
        },
      ],
    },
    {
      code: `export * from './test'
const foo = 'foo'`,
      errors: [
        {
          messageId: 'not_allowed',
          suggestions: [
            {
              messageId: 'delete_export',
              output: `
const foo = 'foo'`,
            },
          ],
        },
      ],
    },
    {
      code: `export * from './test'
export type * from './test'`,
      errors: [
        {
          messageId: 'not_allowed',
          suggestions: [
            {
              messageId: 'delete_export',
              output: `
export type * from './test'`,
            },
          ],
        },
      ],
    },
  ],
});

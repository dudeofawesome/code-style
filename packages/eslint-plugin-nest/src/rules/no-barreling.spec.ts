import { RuleTester } from '@typescript-eslint/rule-tester';
import { no_barreling } from './no-barreling.js';

const ruleTester = new RuleTester({ parser: '@typescript-eslint/parser' });

ruleTester.run('my-rule', no_barreling, {
  valid: [
    { code: `export type * from './test'` },
    { code: `export const foo = 'foo'` },
    { code: `function foo() { return 'foo'; }` },
  ],

  invalid: [
    {
      code: `export * from './test'`,
      errors: [{ messageId: 'not_allowed' }],
    },
    {
      code: `export * from './test'
const foo = 'foo'`,
      errors: [{ messageId: 'not_allowed' }],
    },
    {
      code: `export * from './test'
export type * from './test'`,
      errors: [{ messageId: 'not_allowed' }],
    },
  ],
});

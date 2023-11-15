import { RuleTester } from 'eslint';
import { no_barreling } from './no-barreling';

const ruleTester = new RuleTester();

ruleTester.run('my-rule', no_barreling, {
  valid: [
    // { code: `export type * from './test'` },
    { code: `export const foo = 'foo'` },
  ],

  invalid: [
    // {
    //   code: `export * from './test'`,
    //   errors: [{ message: 'Barrel files are not allowed' }],
    // },
  ],
});

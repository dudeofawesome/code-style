import type { Linter } from 'eslint';

/**
 * NOTE: this config relies on `@code-style/eslint-config-node` being layered
 * before it (it references the `n/` plugin namespace registered there).
 */
const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config-cli/base',
    rules: {
      /**
       * Allow scripts to log with `console`.
       * Since we're creating a CLI app, we're probably just trying to show output to the user.
       */
      'no-console': 'off',

      // Allow scripts to exit.
      'n/no-process-exit': 'off',
    },
  },
];

export default config;

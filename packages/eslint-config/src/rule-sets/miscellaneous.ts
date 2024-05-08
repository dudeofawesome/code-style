import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    /**
     * Disallow `console` and `alert` calls.
     * Neither of these methods should be used in production.
     */
    'no-console': 'error',
    'no-alert': 'error',

    // Warn about prettier style issues.
    'prettier/prettier': 'warn',

    // Disallow renaming `import`, `export`, and destructured assignments to the same name.
    'no-useless-rename': 'error',

    // Require `symbol`s to have a description.
    'symbol-description': 'error',

    // Require `switch`'s `default` case to be last.
    'default-case-last': 'error',
  },
};

export = config;

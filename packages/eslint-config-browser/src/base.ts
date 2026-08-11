import type { Linter } from 'eslint';
import globals from 'globals';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config-browser/base',
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
];

export default config;

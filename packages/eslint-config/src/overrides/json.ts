import type { Linter } from 'eslint';
import jsonFiles from 'eslint-plugin-json-files';

export const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/overrides/json',
    // ESLint 10's `--cache` requires processors to have a `meta` object
    processor: {
      meta: { name: 'json-files/.json' },
      ...jsonFiles.processors['.json'],
    },
    rules: {
      // eslint-plugin-prettier breaks JSON linting (https://github.com/prettier/eslint-plugin-prettier/issues/570)
      'prettier/prettier': 'off',
    },
  },
];

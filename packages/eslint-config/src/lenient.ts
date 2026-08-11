import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/lenient',
    rules: {
      'symbol-description': 'off',
      'prefer-template': 'off',
      'prefer-spread': 'off',
      'no-await-in-loop': 'off',
      'promise/catch-or-return': 'off',
      'dot-notation': 'off',
      'max-lines': 'off',
      'no-param-reassign': 'off',
      'import/order': 'off',
      'import/newline-after-import': 'off',
      'promise/always-return': 'off',
      'no-throw-literal': 'off',
      'no-unused-vars': 'off',
    },
  },
];

export default config;

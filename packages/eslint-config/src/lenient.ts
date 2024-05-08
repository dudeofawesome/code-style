import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
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
    'n/prefer-global/buffer': 'off',
    'n/prefer-global/text-decoder': 'off',
    'n/prefer-global/text-encoder': 'off',
    'n/prefer-global/url-search-params': 'off',
    'n/prefer-global/url': 'off',
    'n/no-process-env': 'off',
    'promise/always-return': 'off',
    'no-throw-literal': 'off',
    'no-unused-vars': 'off',
  },
};

export = config;

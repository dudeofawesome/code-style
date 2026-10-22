import type { Linter } from 'eslint';

export const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config-node/lenient',
    rules: {
      // enforces error handling in callbacks
      'n/handle-callback-err': 'off',

      // disallow use of synchronous methods
      'n/no-sync': 'off',

      // use promise APIs
      'n/prefer-promises/dns': 'off',
      'n/prefer-promises/fs': 'off',

      // allow using globals instead of imports
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/text-decoder': 'off',
      'n/prefer-global/text-encoder': 'off',
      'n/prefer-global/url-search-params': 'off',
      'n/prefer-global/url': 'off',

      // allow using `process.env` anywhere
      'n/no-process-env': 'off',
    },
  },
];

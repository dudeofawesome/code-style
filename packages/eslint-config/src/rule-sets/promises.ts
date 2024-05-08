import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // Require errors from promises are caught.
    'promise/catch-or-return': ['error', { allowThen: true }],

    // Disallow calling resolve multiple times.
    'promise/no-multiple-resolved': 'error',

    // Allow nesting promises.
    'promise/no-nesting': 'off',

    // Allow using promises inside of callbacks.
    'promise/no-promise-in-callback': 'off',

    // Ensure the proper number of arguments are passed to `Promise` functions.
    'promise/valid-params': 'error',

    // Require `async` functions to contain an `await`.
    'require-await': 'error',

    // Prefer using `Promise.all` instead of synchronous loops.
    'no-await-in-loop': 'error',
  },
};

export = config;

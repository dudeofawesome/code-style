import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  extends: ['plugin:eslint-plugin-n/recommended-module'],

  parserOptions: {
    ecmaVersion: 2022, // Version is inline with Node 16
    // TODO(0): should this maybe be 'script' until the upgrade to eslint 9
    sourceType: 'commonjs' as unknown as undefined,
  },

  env: { node: true },

  // `plugin:n/recommended-module` disables some globals we still want
  globals: {
    // TODO(1): detect if project is type: module or not and remove the globals if so
    __dirname: 'readonly',
    __filename: 'readonly',
    require: 'readonly',
    module: 'writable',
  },

  rules: {
    // Allow unspecified radix in `parseInt` since Node has a consistent radix.
    radix: 'off',

    /**
     * Disallow using `process.env`.
     * Any environment config reading should be in a specific config module.
     * This simplifies understanding of the affects of config variables, as well
     *   as helping to ease error handling.
     */
    'n/no-process-env': 'error',

    /**
     * Require `return` upon callback.
     * Not returning immediately makes it easy to continue executing code after
     *   what would usually be considered the end of method.
     */
    'n/callback-return': ['error', ['callback', 'cb', 'next']],

    /**
     * Disallow `require()` outside of the top-level module scope to encourage a
     *  consistent style.
     */
    'n/global-require': 'error',

    // Require error handling in callbacks.
    'n/handle-callback-err': ['error', '^.*[eE]rr(or)?$'],

    /**
     * Disallow mixing regular variable and `require` declarations to encourage a
     *   consistent style.
     */
    'n/no-mixed-requires': 'error',

    /**
     * Disallow use of new operator with the `require` function to encourage a
     * consistent style.
     */
    'n/no-new-require': 'error',

    // Disallow string concatenation with `__dirname` and `__filename`.
    // Not all environments use the same path seperator (looking at you, Windows).
    'n/no-path-concat': 'error',

    // Allow usage of all node modules.
    'n/no-restricted-import': 'off',
    'n/no-restricted-require': 'off',

    /**
     * Disallow use of synchronous methods that have an async alternative.
     * Using synchronous methods ties up the thread, preventing other requests
     *   from being handled while waiting on I/O.
     */
    'n/no-sync': 'error',

    // Defer to import/no-extraneous-dependencies.
    'n/no-extraneous-import': 'off',
    'n/no-extraneous-require': 'off',

    // Require `module.exports` for commonjs to encourage a consistent style.
    'n/exports-style': ['error', 'module.exports'],

    // Require imports instead of globals.
    'n/prefer-global/buffer': ['error', 'never'],
    'n/prefer-global/text-decoder': ['error', 'never'],
    'n/prefer-global/text-encoder': ['error', 'never'],
    'n/prefer-global/url-search-params': ['error', 'never'],
    'n/prefer-global/url': ['error', 'never'],

    // Require promise APIs when available to encourage a consistent style.
    'n/prefer-promises/dns': 'error',
    'n/prefer-promises/fs': 'error',

    // Require callbacks to be error first callbacks.
    'n/no-callback-literal': 'error',

    // Check that all imports are part of our package in production.
    'n/no-unpublished-import': ['error', { ignoreTypeImport: true }],

    'n/no-unsupported-features/node-builtins': [
      'error',
      { ignores: ['test', 'test.describe', 'test.it'] },
    ],
  },

  overrides: [
    {
      files: [
        // test files
        '**/test/**',
        '**/__test__/**',
        '*.test.*',
        '*.spec.*',
        '*.unit.*',
        '*.e2e.*',
        // config files
        '*.config.*',
        '*.configuration.*',
        'config.*',
        'configuration.*',
      ],
      rules: { 'n/no-process-env': 'off' },
    },
  ],
};

export = config;

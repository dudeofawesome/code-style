import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // Disallows meaningless comparisons to self.
    'no-self-compare': 'error',

    // Disallows using `this` when `this` is undefined.
    'no-invalid-this': 'error',

    // Catches some race conditions, but can lead to false-positives.
    'require-atomic-updates': ['warn', { allowProperties: true }],

    // Disallows usage of `new` for certain globals functions.
    'no-new-native-nonconstructor': 'error',

    /**
     * Disallows throwing literal values, preferring objects extending `Error` instead.
     * Throwing `Errors` improves the traceability of exceptions.
     */
    'no-throw-literal': 'error',

    /**
     * Ensures that binary comparisons can possibly change value.
     * If a binary expression comparison can't change value, then you're likely doing something you didn't intend.
     * https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/
     */
    'no-constant-binary-expression': 'error',
  },
};

export = config;

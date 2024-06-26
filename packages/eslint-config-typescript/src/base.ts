import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  overrides: [
    {
      files: ['*.?(m|c)@(t|j)s?(x)'],
      excludedFiles: '*.json',

      extends: [
        'plugin:@typescript-eslint/eslint-plugin/strict-type-checked',
        'plugin:@typescript-eslint/eslint-plugin/stylistic-type-checked',
        'plugin:eslint-plugin-import/typescript',
      ],

      parserOptions: {
        project: true,
      },

      rules: {
        /** Allow specifying a type that could otherwise be inferred. */
        '@typescript-eslint/no-inferrable-types': 'off',

        /** Disallow unused variables. */
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { args: 'none', destructuredArrayIgnorePattern: '^_' },
        ],

        // TODO(0): throws on code that should probably be allowed
        // ```
        // const foo: number | undefined = Math.random() === 0 ? 1 : undefined;
        // if (foo?.toString().includes('a')) console.log('hi');
        // ```
        /** Require only boolean types to be used for conditions. */
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowAny: false,
            allowString: false,
            allowNullableString: false,
            allowNumber: false,
            allowNullableNumber: false,
            allowNullableObject: true,
            allowNullableBoolean: true,
          },
        ],

        /** Require switches on union types to handle all cases. */
        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        /** Disallow empty classes, unless they're decorated. */
        '@typescript-eslint/no-extraneous-class': [
          'error',
          { allowWithDecorator: true },
        ],

        // TODO: do we want this?
        /**
         * Require `enum` values to be initialized in order to prevent value shifting.
         * If an `enum`'s value isn't defined, Typescript will automatically pick a
         * numeric value for it based on its position in the enum list. If that
         * value is then used to save state into a store, and then the `enum`'s
         * list of values is updated, the value in the store may not correspond with
         * the intended enum value anymore.
         */
        '@typescript-eslint/prefer-enum-initializers': 'error',

        /** Allow use of both `type` and `interface`. */
        '@typescript-eslint/consistent-type-definitions': 'off',

        /** Require `private` members to be marked `readonly` when possible. */
        '@typescript-eslint/prefer-readonly': 'error',

        /** Allow returning the correct type, even if it might be slightly confusing. */
        '@typescript-eslint/no-confusing-void-expression': 'off',

        /** Allow empty functions */
        '@typescript-eslint/no-empty-function': 'off',

        /** Disable this rule since it doesn't work reliably. */
        '@typescript-eslint/consistent-generic-constructors': 'off',

        /**
         * Disable this rule until this issue is fixed.
         * https://github.com/typescript-eslint/typescript-eslint/issues/7502
         */
        '@typescript-eslint/no-base-to-string': 'off',

        /** Allow comparing `enum`s to appropriate primitive values. */
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',

        /** Disable this rule since Typescript checks imports for us. */
        'import/no-unresolved': 'off',
        'n/no-missing-import': 'off',

        /** Disable these rules since Typescript handles these rules for us. */
        'consistent-return': 'off',
        'no-invalid-this': 'off',
        'promise/valid-params': 'off',

        /** Allow any value in template literal expression. */
        '@typescript-eslint/restrict-template-expressions': 'off',

        /** Require unbound methods to be called with their expected scope. */
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

        /**  Allow function overload signatures. */
        '@typescript-eslint/unified-signatures': 'off',

        /** Allow const requires */
        '@typescript-eslint/no-var-requires': 'off',

        // TODO(2): create a linter rule to handle correlation between class-validator types, swagger types, and typescript types
      },
    },
  ],
};

export = config;

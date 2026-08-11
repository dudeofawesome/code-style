import type { Linter } from 'eslint';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

import { test_file_patterns, ts_file_patterns } from './utils.js';

/**
 * Start from import-x's shipped typescript settings, but swap its legacy
 * `resolver: { typescript: true }` (which needs the old resolver interface)
 * for the modern `resolver-next` API.
 * import-x publishes its settings under the `import-x/*` keys; duplicate them
 * under `import/*` as well since we register the plugin under the `import`
 * namespace (see `@code-style/eslint-config`).
 */
const typescript_resolver = [createTypeScriptImportResolver()];
const import_x_settings: Record<string, unknown> = {
  ...importX.flatConfigs.typescript.settings,
};
delete import_x_settings['import-x/resolver'];
import_x_settings['import-x/resolver-next'] = typescript_resolver;

const import_typescript_settings = {
  ...import_x_settings,
  ...Object.fromEntries(
    Object.entries(import_x_settings).map(([key, value]) => [
      key.replace(/^import-x\//u, 'import/'),
      value,
    ]),
  ),
};

const config = [
  ...[
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ].map((c) => ({
    ...c,
    files: ts_file_patterns,
    ignores: ['**/*.json'],
  })),

  {
    name: '@code-style/eslint-config-typescript/import',
    files: ts_file_patterns,
    ignores: ['**/*.json'],
    settings: import_typescript_settings,
    rules: {
      'import/named': 'off',
    },
  },

  {
    name: '@code-style/eslint-config-typescript/parser-options',
    files: ts_file_patterns,
    ignores: ['**/*.json'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },

  {
    name: '@code-style/eslint-config-typescript/base',
    files: ts_file_patterns,
    ignores: ['**/*.json'],

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

      /**
       * Require switches on union types to handle all cases.
       * `considerDefaultExhaustiveForUnions` preserves the typescript-eslint
       * v7 behavior this config was written against: a `default` clause
       * satisfies exhaustiveness.
       */
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
      ],

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

      /** Allow const requires. (typescript-eslint v8 folded `no-var-requires` into `no-require-imports`.) */
      '@typescript-eslint/no-require-imports': 'off',

      // TODO(2): create a linter rule to handle correlation between class-validator types, swagger types, and typescript types
    },
  },

  {
    /**
     * Config files (eslint.config.mjs and friends) usually sit outside the
     * project's tsconfig `include`, which makes type-aware parsing fail on
     * them. Lint them without type information instead.
     */
    ...tseslint.configs.disableTypeChecked,
    name: '@code-style/eslint-config-typescript/disable-type-checked-config-files',
    files: ['**/eslint.config.*js', '**/eslint.config.*ts'],
  },

  {
    name: '@code-style/eslint-config-typescript/testing',
    files: test_file_patterns,
    rules: {
      /**
       * Don't require dot notation in tests.
       * This can be useful for accessing Typescript `private` properties & methods.
       */
      '@typescript-eslint/dot-notation': 'off',

      // Allow `any` in tests.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      // Allow non-null assertions in tests.
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',

      // Simplify testing methods.
      '@typescript-eslint/unbound-method': 'off',

      // Allow tests to throw literals. (typescript-eslint v8 renamed `no-throw-literal` to `only-throw-error`.)
      '@typescript-eslint/only-throw-error': 'off',
    },
  },
] as unknown as Linter.Config[];

export default config;

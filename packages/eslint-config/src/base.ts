import type { Linter } from 'eslint';
import eslintCommentsConfigs from '@eslint-community/eslint-plugin-eslint-comments/configs';
import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import promisePlugin from 'eslint-plugin-promise';
import globals from 'globals';

import bugs from './rule-sets/bugs.js';
import deprecated from './rule-sets/deprecated.js';
import footguns from './rule-sets/footguns.js';
import imports from './rule-sets/imports.js';
import miscellaneous from './rule-sets/miscellaneous.js';
import modernCode from './rule-sets/modern-code.js';
import promises from './rule-sets/promises.js';
import readability from './rule-sets/readability.js';
import security from './rule-sets/security.js';
import overrides from './overrides/index.js';

/**
 * eslint-plugin-import-x registers its rules under the `import-x` namespace.
 * We register the plugin under `import` to keep the `import/*` rule IDs (and
 * every consumer's inline disable comment) working, so its recommended rules
 * need their namespace remapped to match.
 */
const import_recommended_rules: Linter.RulesRecord = Object.fromEntries(
  Object.entries(importX.flatConfigs.recommended.rules ?? {}).map(
    ([rule, severity]) => [rule.replace(/^import-x\//u, 'import/'), severity],
  ),
);

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/ignores',
    ignores: ['**/dist/', '**/out/', '**/coverage/'],
  },
  js.configs.recommended,
  prettierRecommended,
  promisePlugin.configs['flat/recommended'],
  {
    name: '@code-style/eslint-config/import',
    plugins: { import: importX },
    rules: import_recommended_rules,
  },
  eslintCommentsConfigs.recommended,

  ...bugs,
  ...deprecated,
  ...footguns,
  ...imports,
  ...miscellaneous,
  ...modernCode,
  ...promises,
  ...readability,
  ...security,

  ...overrides,

  {
    name: '@code-style/eslint-config/language-options',
    languageOptions: {
      ecmaVersion: 2022,
      /**
       * The eslintrc versions of these configs always parsed as ESM (via
       * `plugin:import/recommended`), relying on `no-restricted-syntax` to
       * report ESM syntax as rule violations rather than parse errors.
       * `@code-style/eslint-config-node` narrows this to `commonjs`;
       * `@code-style/eslint-config-esmodule` sets it back to `module`.
       */
      sourceType: 'module',
      globals: { ...globals.commonjs },
    },
  },
];

export default config;

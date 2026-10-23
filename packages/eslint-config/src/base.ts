import type { Linter } from 'eslint';
import { recommended as eslint_comments_recommended } from '@eslint-community/eslint-plugin-eslint-comments/configs';
import js from '@eslint/js';
import {
  flatConfigs as import_x_configs,
  importX,
} from 'eslint-plugin-import-x';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import promisePlugin from 'eslint-plugin-promise';
import globals from 'globals';

import { config as bugs } from './rule-sets/bugs.js';
import { config as deprecated } from './rule-sets/deprecated.js';
import { config as footguns } from './rule-sets/footguns.js';
import { config as imports } from './rule-sets/imports.js';
import { config as miscellaneous } from './rule-sets/miscellaneous.js';
import { config as modern_code } from './rule-sets/modern-code.js';
import { config as promises } from './rule-sets/promises.js';
import { config as readability } from './rule-sets/readability.js';
import { config as security } from './rule-sets/security.js';
import { config as overrides } from './overrides/index.js';

/**
 * eslint-plugin-import-x is registered under the `import` namespace to keep
 * the `import/*` rule IDs, so its recommended rules need renaming to match.
 */
const import_recommended_rules: Linter.RulesRecord = Object.fromEntries(
  Object.entries(import_x_configs.recommended.rules ?? {}).map(
    ([rule, severity]) => [rule.replace(/^import-x\//u, 'import/'), severity],
  ),
);

export const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/ignores',
    ignores: ['**/dist/', '**/out/', '**/coverage/'],
  },
  {
    // flat config only lints `*.{js,mjs,cjs}` unless a config matches other extensions
    name: '@code-style/eslint-config/files',
    files: ['**/*.?(m|c)@(t|j)s?(x)'],
  },
  js.configs.recommended,
  prettierRecommended,
  promisePlugin.configs['flat/recommended'],
  {
    name: '@code-style/eslint-config/import',
    plugins: { import: importX },
    rules: import_recommended_rules,
  },
  eslint_comments_recommended,

  ...bugs,
  ...deprecated,
  ...footguns,
  ...imports,
  ...miscellaneous,
  ...modern_code,
  ...promises,
  ...readability,
  ...security,

  ...overrides,

  {
    name: '@code-style/eslint-config/language-options',
    languageOptions: {
      ecmaVersion: 2022,
      // matches the eslintrc config, which parsed as `module` via `plugin:import/recommended`
      sourceType: 'module',
      globals: globals.commonjs,
    },
  },
];

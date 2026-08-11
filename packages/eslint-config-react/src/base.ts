import type { Linter } from 'eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import { patch_plugin_for_eslint_10 } from './compat.js';

const patched_react = patch_plugin_for_eslint_10(
  reactPlugin as Parameters<typeof patch_plugin_for_eslint_10>[0],
);
const patched_jsx_a11y = patch_plugin_for_eslint_10(jsxA11y);

const config = [
  {
    ...reactPlugin.configs.flat.recommended,
    plugins: { react: patched_react },
  },

  {
    /**
     * react-hooks is pinned to the classic rule pair instead of its v6+
     * `recommended` config: the modern recommended set bundles the React
     * Compiler rules, and adopting those should be a deliberate versioned
     * change to this package, not a side effect of a plugin bump.
     */
    name: '@code-style/eslint-config-react/react-hooks',
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    ...jsxA11y.flatConfigs.recommended,
    plugins: { 'jsx-a11y': patched_jsx_a11y },
  },

  {
    name: '@code-style/eslint-config-react/base',
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      /**
       * Limit max element nesting to reduce component complexity.
       * This simplifies components & enables better testing.
       */
      'react/jsx-max-depth': ['error', { max: 5 }],

      /** Require class components to use ES6 classes rather than ES5 classes. */
      'react/prefer-es6-class': 'error',

      /** Require stateless components to be functional components. */
      'react/prefer-stateless-function': 'error',

      'react/no-children-prop': 'off',

      /** Require iterated elements to have a `key`. */
      'react/jsx-key': 'error',
    },
  },
] as unknown as Linter.Config[];

export default config;

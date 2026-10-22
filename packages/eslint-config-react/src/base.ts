import { fixupPluginRules } from '@eslint/compat';
import type { ESLint, Linter } from 'eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export const config: Linter.Config[] = [
  // eslint-plugin-react & eslint-plugin-jsx-a11y still call rule-context methods ESLint 10 removed
  {
    ...reactPlugin.configs.flat.recommended,
    plugins: { react: fixupPluginRules(reactPlugin) },
  },
  {
    ...jsxA11y.flatConfigs.recommended,
    plugins: { 'jsx-a11y': fixupPluginRules(jsxA11y) },
  },
  {
    name: '@code-style/eslint-config-react/base',
    // pinned to the rules the eslintrc `recommended` config enabled; v6+'s adds the React Compiler rules
    plugins: { 'react-hooks': reactHooks as ESLint.Plugin },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

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
];

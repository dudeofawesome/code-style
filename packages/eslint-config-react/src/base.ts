import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  extends: [
    'plugin:eslint-plugin-react/recommended',
    'plugin:eslint-plugin-react-hooks/recommended',
    'plugin:eslint-plugin-jsx-a11y/recommended',
  ],
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
};

export = config;

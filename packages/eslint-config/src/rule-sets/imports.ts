import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // Warn about deprecated imports.
    'import/no-deprecated': 'warn',

    // Disallow exporting mutable vars.
    'import/no-mutable-exports': 'error',

    // Disallow AMD modules.
    'import/no-amd': 'error',

    // Disallow mixing ESM with commonjs exports.
    'import/no-import-module-exports': 'error',

    // Disallow importing yourself.
    'import/no-self-import': 'error',

    // Disallow webpack imports.
    'import/no-webpack-loader-syntax': 'error',

    // Ensure imports come first in file.
    'import/first': 'error',

    // Ensure imports are seperated from the rest of the file.
    'import/newline-after-import': 'error',

    // Disallow default exports.
    'import/no-default-export': 'error',

    // Ensure consistent ordering of imports.
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'ignore',
      },
    ],

    // Use `import/order` instead.
    'sort-imports': 'off',

    // Disable ES Module import/export.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ImportDeclaration',
        message: 'ES Module import not allowed',
      },
      {
        selector: 'ExportNamedDeclaration',
        message: 'ES Module export not allowed',
      },
      {
        selector: 'ExportDefaultDeclaration',
        message: 'ES Module export not allowed',
      },
      {
        selector: 'ExportAllDeclaration',
        message: 'ES Module export not allowed',
      },
      {
        selector: 'TSExportAssignment',
        message: 'ES Module export not allowed',
      },
    ],
  },

  overrides: [
    {
      files: ['jest.config.*js'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['./*.config.js'],
      rules: {
        'import/no-commonjs': 'off',
      },
    },
  ],
};

export = config;

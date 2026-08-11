import type { Linter } from 'eslint';
import jsonFiles from 'eslint-plugin-json-files';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/overrides/json',
    files: ['**/*.json'],
    plugins: { 'json-files': jsonFiles },
    processor: jsonFiles.processors['.json'],
    rules: {
      // eslint-plugin-prettier breaks JSON linting (https://github.com/prettier/eslint-plugin-prettier/issues/570)
      'prettier/prettier': 'off',

      // Prevent having the same package in dependencies and devDependencies.
      'json-files/require-unique-dependency-names': 'error',

      // Require that specific ranges are specified in `package.json` `dependencies`.
      'json-files/restrict-ranges': [
        'error',
        {
          versionHint: 'caret',
          dependencyTypes: ['dependencies', 'devDependencies'],
        },
      ],

      // Require that `engines` are specified in `package.json`.
      'json-files/require-engines': 'error',

      /**
       * Require keys in package.json to be sorted, improving readability &
       * consistency across projects.
       */
      'json-files/sort-package-json': 'warn',
    },
  },
];

export default config;

import type { Linter } from 'eslint';
import nestPlugin from '@code-style/eslint-plugin-nest';

const config: Linter.Config[] = [
  ...nestPlugin.configs.recommended,

  {
    name: '@code-style/eslint-config-nest/base',
    rules: {
      // Disallow importing files from `@nestjs/terminus` since it includes a bunch of incorrect types.
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@nestjs/terminus/dist/*'],
        },
      ],
    },
  },
];

export default config;

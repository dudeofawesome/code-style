import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  extends: ['plugin:@next/eslint-plugin-next/recommended'],
  rules: {
    /** NextJS requires page components to be default exports. */
    'import/no-default-export': 'off',
  },
};

export = config;

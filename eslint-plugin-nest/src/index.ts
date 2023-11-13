import { ESLint } from 'eslint';

import { disable_barreling } from './rules/disable-barreling';
import { recommended } from './configs/recommended';

const plugin: ESLint.Plugin = {
  rules: {
    'disable-barreling': disable_barreling,
  },
  configs: {
    recommended,
  },
};

export = plugin;

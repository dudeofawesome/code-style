import { ESLint } from 'eslint';

import { rules } from './rules/index.js';
import { configs } from './configs/index.js';

const plugin: ESLint.Plugin = {
  rules,
  configs,
};

export = plugin;

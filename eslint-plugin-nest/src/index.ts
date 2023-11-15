import { ESLint } from 'eslint';

import { rules } from './rules';
import { configs } from './configs';

const plugin: ESLint.Plugin = {
  rules,
  configs,
};

export = plugin;

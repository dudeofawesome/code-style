import type { ESLint, Rule } from 'eslint';
import { no_barreling } from './no-barreling.js';

export const rules: ESLint.Plugin['rules'] = {
  'no-barreling': no_barreling as unknown as Rule.RuleModule,
};

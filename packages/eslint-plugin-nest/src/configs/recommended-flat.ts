import { Linter } from 'eslint';
import plugin from '../index.js';
import { recommended } from './recommended.js';

export const recommended_flat: Linter.FlatConfig = {
  plugins: { '@code-style/nest': plugin },
  rules: recommended.rules,
};

import { Linter } from 'eslint';
import plugin from '../index';
import { recommended } from './recommended';

export const recommended_flat: Linter.FlatConfig = {
  plugins: { '@dudeofawesome/nest': plugin },
  rules: recommended.rules as Linter.FlatConfig['rules'],
};

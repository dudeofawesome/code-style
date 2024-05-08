import type { JestConfigWithTsJest } from 'ts-jest';
import { config as base } from '../../base.js';
import { config as esm } from '../../layers/esm.js';

export const config: JestConfigWithTsJest = {
  ...base,
  preset: 'ts-jest/presets/default-esm',
  ...esm,
};

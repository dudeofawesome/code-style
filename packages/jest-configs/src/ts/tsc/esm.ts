import type { JestConfigWithTsJest } from 'ts-jest';
import { config as base } from '../../base';
import { config as esm } from '../../layers/esm';

export const config: JestConfigWithTsJest = {
  ...base,
  preset: 'ts-jest/presets/default-esm',
  ...esm,
};

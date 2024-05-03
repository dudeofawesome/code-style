import type { JestConfigWithTsJest } from 'ts-jest';
import { coverage } from './layers/coverage';

export const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  ...coverage,
};

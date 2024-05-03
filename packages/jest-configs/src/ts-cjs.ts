import type { JestConfigWithTsJest } from 'ts-jest';
import { coverage } from './layers/coverage';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default',
  ...coverage,
};

export default config;

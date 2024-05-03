import type { JestConfigWithTsJest } from 'ts-jest';
import { config as base } from './base';

const config: JestConfigWithTsJest = {
  ...base,
  preset: 'ts-jest/presets/default',
};

export default config;

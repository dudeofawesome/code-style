import type { JestConfigWithTsJest } from 'ts-jest';
import { config as base } from '../../base.js';

export const config: JestConfigWithTsJest = {
  ...base,
  preset: 'ts-jest/presets/default',
};

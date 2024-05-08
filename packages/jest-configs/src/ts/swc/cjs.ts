import type { Config } from 'jest';
import { config as base } from '../../base.js';

export const config: Config = {
  ...base,
  transform: {
    [String.raw`^.+\.c?[tj]sx?$`]: '@swc/jest',
  },
};

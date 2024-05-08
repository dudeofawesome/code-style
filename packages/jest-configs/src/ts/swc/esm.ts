import type { Config } from 'jest';
import type { Options } from '@swc/core';
import { config as base } from '../../base.js';
import { config as esm } from '../../layers/esm.js';

export const config: Config = {
  ...base,
  ...esm,
  transform: {
    [String.raw`^.+\.m?[tj]sx?$`]: [
      '@swc/jest',
      {
        sourceMaps: 'inline',
      } as Options as Record<string, unknown>,
    ],
  },
};

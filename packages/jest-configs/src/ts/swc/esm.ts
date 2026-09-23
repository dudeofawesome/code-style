import type { Config } from 'jest';
import type { Options } from '@swc/core';
import { config as base } from '../../base.js';
import { config as esm } from '../../layers/esm.js';
import { esm_ext } from '../../utils/extensions.js';

export const config: Config = {
  ...base,
  ...esm,
  transform: {
    [String.raw`^.+\.${esm_ext}$`]: [
      '@swc/jest',
      {
        sourceMaps: 'inline',
      } as Options as Record<string, unknown>,
    ],
  },
};

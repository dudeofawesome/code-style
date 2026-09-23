import type { Config } from 'jest';
import type { JestConfigWithTsJest } from 'ts-jest';
import { config as base } from '../../base.js';
import { config as esm } from '../../layers/esm.js';
import { esm_ext } from '../../utils/extensions.js';

export const config: Config = {
  ...base,
  ...esm,
  transform: {
    [String.raw`^.+\.${esm_ext}$`]: [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
} as JestConfigWithTsJest as Config;

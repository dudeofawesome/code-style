import type { Config } from 'jest';
import { config as base } from '../../base.js';
import { config as esm } from '../../layers/esm.js';
import { config as esbuild_config } from '../../layers/configs/esbuild.js';

export const config: Config = {
  ...base,
  ...esm,
  transform: {
    [String.raw`^.+\.m?[tj]sx?$`]: [
      'esbuild-jest',
      {
        ...esbuild_config,
        format: 'esm',
      },
    ],
  },
};

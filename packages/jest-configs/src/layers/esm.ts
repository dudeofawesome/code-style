import { Config } from 'jest';
import { defaults } from 'jest-config';

export const config: Config = {
  moduleNameMapper: {
    [String.raw`^(\.{1,2}/.*)\.js$`]: '$1',
  },
  extensionsToTreatAsEsm: Array.from(
    new Set([
      ...defaults.extensionsToTreatAsEsm,
      '.jsx',
      '.mjsx',
      '.ts',
      '.mts',
      '.tsx',
      '.mtsx',
    ]),
  ),
};

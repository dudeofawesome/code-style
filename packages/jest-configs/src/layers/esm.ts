import { Config } from 'jest';

export const config: Config = {
  moduleNameMapper: {
    [String.raw`^(\.{1,2}/.*)\.js$`]: '$1',
  },
  extensionsToTreatAsEsm: [
    '.js',
    '.mjs',
    '.jsx',
    '.mjsx',
    '.ts',
    '.mts',
    '.tsx',
    '.mtsx',
  ],
};

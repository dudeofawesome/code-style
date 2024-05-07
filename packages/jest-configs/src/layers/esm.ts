import { Config } from 'jest';

export const config: Config = {
  moduleNameMapper: {
    [String.raw`^(\.{1,2}/.*)\.js$`]: '$1',
  },
  extensionsToTreatAsEsm: ['.jsx', '.mjsx', '.ts', '.mts', '.tsx', '.mtsx'],
};

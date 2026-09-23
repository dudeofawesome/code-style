import type { Config } from 'jest';
import { defaults } from 'jest-config';

import { config as coverage } from './layers/coverage.js';
import { config as reporters } from './layers/reporters.js';
import { config as extensions } from './layers/extensions.js';

/**
 * // TODO: Configs don't deep-merge.
 * If 2 configs define values for an array (like `setupFilesAfterEnv`), the
 * arrays won't be merged. This could cause unexpected behavior.
 */
export const config: Config = {
  ...coverage,
  ...reporters,
  ...extensions,

  testRegex: Array.from(
    new Set([
      ...defaults.testRegex,
      String.raw`(\/(__tests__|tests?)\/.*|(\.|\/)(test|spec))\.[mc]?[jt]sx?$`,
    ]),
  ),
  testPathIgnorePatterns: Array.from(
    new Set([
      ...defaults.testPathIgnorePatterns,
      String.raw`/dist/`,
      String.raw`/out/`,
      String.raw`/build/`,
      String.raw`/fixtures?/`,
    ]),
  ),
  moduleFileExtensions: Array.from(
    new Set([
      'ts',
      'tsx',
      'mts',
      'cts',
      'mtsx',
      'ctsx',
      ...defaults.moduleFileExtensions,
    ]),
  ),
};

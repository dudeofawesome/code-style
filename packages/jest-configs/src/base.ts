import type { Config } from 'jest';

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
};

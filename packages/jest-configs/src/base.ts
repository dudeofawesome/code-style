import type { Config } from 'jest';

import { config as coverage } from './layers/coverage.js';
import { config as reporters } from './layers/reporters.js';

export const config: Config = {
  ...coverage,
  ...reporters,
};

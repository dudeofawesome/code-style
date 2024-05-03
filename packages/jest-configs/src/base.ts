import type { Config } from 'jest';

import { config as coverage } from './layers/coverage';
import { config as reporters } from './layers/reporters';

export const config: Config = {
  ...coverage,
  ...reporters,
};

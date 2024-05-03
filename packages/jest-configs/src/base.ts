import type { Config } from 'jest';

import { config as coverage } from './layers/coverage';

export const config: Config = {
  ...coverage,
};

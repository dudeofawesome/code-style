import { basename } from 'node:path';
import { defaults } from 'jest-config';
import { config } from '@code-style/jest-configs/ts/tsc/esm';

/** @type {import('jest').Config} */
const custom_config = {
  ...config,
  transformIgnorePatterns: [
    ...defaults.transformIgnorePatterns,
    ...(config.transformIgnorePatterns ?? []),
    // ignore sibling packages
    `/packages/(?!${basename(import.meta.dirname)}(?!/dist))`,
  ],
};

export default custom_config;

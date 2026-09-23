import { defaults } from 'jest-config';
import { config } from '@code-style/jest-configs/ts/esbuild/esm';

/** @type {import('jest').Config} */
const custom_config = {
  ...config,
  transformIgnorePatterns: [
    ...defaults.transformIgnorePatterns,
    // ignore sibling packages
    '/packages/',
  ],
};

export default custom_config;

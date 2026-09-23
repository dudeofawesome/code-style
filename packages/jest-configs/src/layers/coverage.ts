import { Config } from 'jest';
import { defaults } from 'jest-config';

import { all_ext, all_ext_glob } from '../utils/extensions.js';

export const config: Config = {
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: './coverage',
  coverageReporters: defaults.coverageReporters.filter((r) => r !== 'text'),
  collectCoverageFrom: [`**/*.${all_ext_glob}`],
  coveragePathIgnorePatterns: Array.from(
    new Set(
      [
        ...defaults.coveragePathIgnorePatterns,
        [
          // migration files
          String.raw`/migrations/`,
        ],
        [
          // Mikro ORM config
          String.raw`/mikro-orm\.config\.ts$`,
        ],
        [
          // hidden files in the root dir (usually configs)
          String.raw`<rootDir>/\..*\.${all_ext}$`,
        ],
        [
          // config files in the root dir
          String.raw`<rootDir>/\.*\.config\.${all_ext}$`,
          String.raw`<rootDir>/\.*rc\.${all_ext}$`,
        ],
        [
          // types
          String.raw`/interfaces/`,
          String.raw`/types/`,
          String.raw`\.d\.ts$`,
        ],
        [
          // outputs
          String.raw`/dist/`,
          String.raw`/out/`,
          String.raw`/build/`,
        ],
        [
          // tests
          String.raw`/tests?/`,
          String.raw`/__tests?__/`,
        ],
        [
          // coverage
          String.raw`/coverage/`,
        ],
      ].flat(),
    ),
  ),
};

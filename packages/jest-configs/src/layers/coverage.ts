import { Config } from 'jest';

const ext = String.raw`[cm]?[jt]sx?`;
const ext_glob = String.raw`?(c|m)(j|t)s?(x)`;

export const config: Config = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['clover', 'json', 'lcov'],
  collectCoverageFrom: [`**/*.${ext_glob}`],
  coveragePathIgnorePatterns: [
    [
      // dependencies
      String.raw`/node_modules/`,
    ],
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
      String.raw`<rootDir>/\..*\.${ext}$`,
    ],
    [
      // config files in the root dir
      String.raw`<rootDir>/.*\.config\.${ext}$`,
      String.raw`<rootDir>/.*rc\.${ext}$`,
    ],
    [
      // types
      String.raw`/interfaces/`,
      String.raw`/types/`,
      String.raw`\.d.ts$`,
    ],
    [
      // outputs
      String.raw`/dist/`,
      String.raw`/out/`,
    ],
    [
      // tests
      String.raw`/test/`,
      String.raw`/__tests__/`,
    ],
    [
      // coverage
      String.raw`/coverage/`,
    ],
  ].flat(),
};

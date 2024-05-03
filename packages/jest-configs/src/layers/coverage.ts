import { Config } from 'jest';

const ext = String.raw`[cm]?[jt]sx?`;

export const coverage: Config = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    // dependencies
    String.raw`/node_modules/`,
    // migration files
    String.raw`/migrations/`,
    // Mikro ORM config
    String.raw`/mikro-orm\.config\.ts$`,
    // hidden files in the root dir (usually configs)
    String.raw`<rootDir>/\..*\.${ext}$`,
    // config files in the root dir
    String.raw`<rootDir>/.*\.config\.${ext}$`,
    String.raw`<rootDir>/.*rc\.${ext}$`,
    // types
    String.raw`/interfaces/`,
    String.raw`/types/`,
  ],
};

import { Config } from 'jest';

export const coverage: Config = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    'node_modules/',
    'migrations/',
    'mikro-orm\\.config\\.ts$',
    'interfaces/',
    'types/',
  ],
};

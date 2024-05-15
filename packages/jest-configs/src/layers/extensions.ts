import { Config } from 'jest';

export const config: Config = {
  setupFilesAfterEnv: [
    'jest-extended/all',
    'jest-expect-message',
    'jest-chain',
  ],
};

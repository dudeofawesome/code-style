import { Config } from 'jest';

export const config: Config = {
  setupFilesAfterEnv: ['jest-chain', 'jest-extended/all'],
};

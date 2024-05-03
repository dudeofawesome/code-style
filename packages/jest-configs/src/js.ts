import { Config } from 'jest';
import { coverage } from './layers/coverage';

const config: Config = {
  ...coverage,
};

export default config;

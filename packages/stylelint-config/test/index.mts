import { describe } from '@jest/globals';
import { defaultTestSet } from '@code-style/testing/stylelint/default-test-sets';

describe('styleint-config', () => {
  const config = { extends: '@code-style/stylelint-config' };

  defaultTestSet(config);

  describe('passes', () => {});

  describe('fails', () => {});
});

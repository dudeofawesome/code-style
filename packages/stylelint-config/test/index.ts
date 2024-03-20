import { describe } from 'node:test';
import { defaultTestSet } from '@code-style/utils/testing/stylelint/default-test-sets';

void describe('styleint-config', () => {
  const config = { extends: '@code-style/stylelint-config' };

  defaultTestSet(config);

  void describe('passes', () => {
    return;
  });

  void describe('fails', () => {
    return;
  });
});

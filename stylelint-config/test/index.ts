import { describe, it } from 'node:test';
import { testNoFail } from '../../utils/testing/stylelint';
import { defaultTestSet } from '../../utils/testing/stylelint/default-test-sets';

void describe('styleint-config', () => {
  const config = { extends: '@dudeofawesome/stylelint-config' };

  defaultTestSet(config);

  void describe('passes', () => {
    return;
  });

  void describe('fails', () => {
    return;
  });
});

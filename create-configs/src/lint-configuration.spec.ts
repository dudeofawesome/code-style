import { describe, it, expect } from '@jest/globals';
import {
  _generate_eslint_config,
  _transform_eslint_package_name,
} from './lint-configuration';

describe('lint-configuration', () => {
  describe('generate_eslint_config', () => {
    it(`should parse multiline string to array`, () => {
      const output = _generate_eslint_config('web-app', ['ts'], ['jest']);
      expect(output).toMatch(/root: true/u);
      expect(output).toMatch(/^#/u);
    });
  });

  describe('_transform_eslint_package_name', () => {
    it(`should transform eslint package names`, () => {
      expect(_transform_eslint_package_name('foo')).toEqual(
        'eslint-config-foo',
      );

      expect(_transform_eslint_package_name('@foo')).toEqual(
        '@foo/eslint-config',
      );

      expect(_transform_eslint_package_name('@foo/bar')).toEqual(
        '@foo/eslint-config-bar',
      );
    });
  });
});

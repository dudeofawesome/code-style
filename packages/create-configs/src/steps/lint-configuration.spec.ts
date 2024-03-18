import { describe, it, expect } from '@jest/globals';
import { parse } from 'yaml';
import {
  _generate_eslint_config,
  _transform_eslint_package_name,
} from './lint-configuration.js';

describe('lint-configuration', () => {
  describe(_generate_eslint_config.name, () => {
    it(`should generate valid config`, () => {
      const output = _generate_eslint_config({
        project_type: 'web-app',
        languages: ['ts'],
        technologies: ['jest'],
        lenient: false,
      });
      // ensure output is valid YAML
      expect(() => parse(output) as unknown).not.toThrow();
      const parsed: { root: boolean; extends: string[] } = parse(
        output,
      ) as typeof parsed;

      // ensure we have a leading comment
      expect(output).toMatch(/^#/u);
      // ensure config is set to root
      expect(parsed.root).toBe(true);
      // ensure we include relevant configs
      expect(parsed.extends).toStrictEqual([
        '@dudeofawesome/eslint-config',
        '@dudeofawesome/eslint-config-browser',
        '@dudeofawesome/eslint-config-typescript',
        '@dudeofawesome/eslint-config-jest',
      ]);
    });

    it(`should generate valid lenient config`, () => {
      const output = _generate_eslint_config({
        project_type: 'web-app',
        languages: ['ts'],
        technologies: ['jest'],
        lenient: true,
      });
      // ensure output is valid YAML
      expect(() => parse(output) as unknown).not.toThrow();
      const parsed: { root: boolean; extends: string[] } = parse(
        output,
      ) as typeof parsed;

      // ensure we have a leading comment
      expect(output).toMatch(/^#/u);
      // ensure config is set to root
      expect(parsed.root).toBe(true);
      // ensure we include relevant configs
      expect(parsed.extends).toStrictEqual([
        '@dudeofawesome/eslint-config',
        '@dudeofawesome/eslint-config/lenient',
        '@dudeofawesome/eslint-config-browser',
        '@dudeofawesome/eslint-config-typescript',
        '@dudeofawesome/eslint-config-typescript/lenient',
        '@dudeofawesome/eslint-config-jest',
        '@dudeofawesome/eslint-config-jest/lenient',
      ]);
    });
  });

  describe(_transform_eslint_package_name.name, () => {
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

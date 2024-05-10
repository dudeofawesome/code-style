import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { parse } from 'yaml';
import '@code-style/utils/testing/assert/matchers';
import * as utils from '../utils.js';

describe('lint-configuration', () => {
  beforeAll(() => {
    jest.unstable_mockModule('../utils', () => {
      return {
        ...utils,
        version: 'mock',
      };
    });
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('_generate_eslint_config', () => {
    it(`should generate valid config`, async () => {
      const { _generate_eslint_config } = await import(
        './lint-configuration.js'
      );

      const output = _generate_eslint_config({
        project_type: 'web-app',
        languages: ['ts'],
        technologies: ['jest'],
        lenient: false,
      });
      // ensure output is valid YAML
      expect(() => parse(output.content) as unknown).not.toThrow();
      const parsed: { root: boolean; extends: string[] } = parse(
        output.content,
      ) as typeof parsed;

      // ensure we have a leading comment
      expect(output.content).toMatch(/^#/u);
      // ensure config is set to root
      expect(parsed.root).toBe(true);
      // ensure we include relevant configs
      const dependencies = [
        '@code-style/eslint-config',
        '@code-style/eslint-config-browser',
        '@code-style/eslint-config-typescript',
        '@code-style/eslint-config-jest',
      ];
      expect(parsed.extends).toStrictEqual(dependencies);
      expect(output.dependencies.development).toEqual(
        new Set(dependencies.map((d) => `${d}@mock`)),
      );
    });

    it(`should generate valid lenient config`, async () => {
      const { _generate_eslint_config } = await import(
        './lint-configuration.js'
      );

      const output = _generate_eslint_config({
        project_type: 'web-app',
        languages: ['ts'],
        technologies: ['jest'],
        lenient: true,
      });
      // ensure output is valid YAML
      expect(() => parse(output.content) as unknown).not.toThrow();
      const parsed: { root: boolean; extends: string[] } = parse(
        output.content,
      ) as typeof parsed;

      // ensure we have a leading comment
      expect(output.content).toMatch(/^#/u);
      // ensure config is set to root
      expect(parsed.root).toBe(true);
      // ensure we include relevant configs
      expect(parsed.extends).toEqual([
        '@code-style/eslint-config',
        '@code-style/eslint-config/lenient',
        '@code-style/eslint-config-browser',
        '@code-style/eslint-config-typescript',
        '@code-style/eslint-config-typescript/lenient',
        '@code-style/eslint-config-jest',
        '@code-style/eslint-config-jest/lenient',
      ]);
      expect(output.dependencies.development).toEqual(
        new Set([
          '@code-style/eslint-config@mock',
          '@code-style/eslint-config-browser@mock',
          '@code-style/eslint-config-typescript@mock',
          '@code-style/eslint-config-jest@mock',
        ]),
      );
    });
  });

  describe('_transform_eslint_package_name', () => {
    it(`should transform eslint package names`, async () => {
      const { _transform_eslint_package_name } = await import(
        './lint-configuration.js'
      );

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

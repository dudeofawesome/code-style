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
      expect(output.dependencies.development.values()).toStrictEqual(
        new Set(dependencies.map((d) => `${d}@latest`)).values(),
      );
    });

    it(`should generate valid lenient config`, () => {
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
      expect(parsed.extends).toStrictEqual([
        '@code-style/eslint-config',
        '@code-style/eslint-config/lenient',
        '@code-style/eslint-config-browser',
        '@code-style/eslint-config-typescript',
        '@code-style/eslint-config-typescript/lenient',
        '@code-style/eslint-config-jest',
        '@code-style/eslint-config-jest/lenient',
      ]);
      expect(output.dependencies.development.values()).toStrictEqual(
        new Set([
          '@code-style/eslint-config@latest',
          '@code-style/eslint-config-browser@latest',
          '@code-style/eslint-config-typescript@latest',
          '@code-style/eslint-config-jest@latest',
        ]).values(),
      );
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

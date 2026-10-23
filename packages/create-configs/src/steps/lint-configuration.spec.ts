import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import '@code-style/utils/testing/assert/matchers';
import * as utils from '../utils.js';

function import_specifiers(content: string): string[] {
  return [...content.matchAll(/^import .* from '([^']+)';$/gmu)].flatMap(
    (match) => match[1] ?? [],
  );
}

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

      // ensure we have a leading comment
      expect(output.content).toMatch(/^\/\/ In order to update the config/u);
      // ensure the config composes the relevant packages, in order
      const config_packages = [
        '@code-style/eslint-config',
        '@code-style/eslint-config-browser',
        '@code-style/eslint-config-typescript',
        '@code-style/eslint-config-jest',
      ];
      expect(import_specifiers(output.content)).toStrictEqual([
        'eslint/config',
        ...config_packages,
      ]);
      expect(output.content).toContain(
        'export default defineConfig(base, browser, typescript, jest);',
      );
      expect(output.dependencies.development).toEqual(
        new Set([...config_packages.map((d) => `${d}@mock`), 'eslint']),
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

      // ensure we have a leading comment
      expect(output.content).toMatch(/^\/\/ In order to update the config/u);
      // ensure the config composes the relevant packages, in order
      expect(import_specifiers(output.content)).toStrictEqual([
        'eslint/config',
        '@code-style/eslint-config',
        '@code-style/eslint-config/lenient',
        '@code-style/eslint-config-browser',
        '@code-style/eslint-config-typescript',
        '@code-style/eslint-config-typescript/lenient',
        '@code-style/eslint-config-jest',
        '@code-style/eslint-config-jest/lenient',
      ]);
      expect(output.content).toContain(
        'export default defineConfig(base, base_lenient, browser, typescript, typescript_lenient, jest, jest_lenient);',
      );
      expect(output.dependencies.development).toEqual(
        new Set([
          '@code-style/eslint-config@mock',
          '@code-style/eslint-config-browser@mock',
          '@code-style/eslint-config-typescript@mock',
          '@code-style/eslint-config-jest@mock',
          'eslint',
        ]),
      );
    });

    it(`should generate cli lenient config`, async () => {
      const { _generate_eslint_config } = await import(
        './lint-configuration.js'
      );

      const output = _generate_eslint_config({
        project_type: 'cli',
        languages: ['js'],
        technologies: [],
        lenient: true,
      });

      // eslint-config-cli has no lenient config
      expect(import_specifiers(output.content)).toStrictEqual([
        'eslint/config',
        '@code-style/eslint-config',
        '@code-style/eslint-config/lenient',
        '@code-style/eslint-config-node',
        '@code-style/eslint-config-node/lenient',
        '@code-style/eslint-config-cli',
      ]);
      expect(output.content).toContain(
        'export default defineConfig(base, base_lenient, node, node_lenient, cli);',
      );
    });
  });

  describe('_convert_legacy_eslint_config', () => {
    it(`should carry over rules, ignores, and overrides`, async () => {
      const { _convert_legacy_eslint_config } = await import(
        './lint-configuration.js'
      );

      const output = _convert_legacy_eslint_config(
        {
          root: true,
          extends: ['@code-style/eslint-config'],
          env: { node: true },
          ignorePatterns: ['/generated/'],
          rules: { 'no-console': 'off' },
          overrides: [
            {
              files: ['*.test.ts', 'src/legacy/**'],
              excludedFiles: 'src/legacy/keep.ts',
              rules: { 'max-lines': 'off' },
            },
          ],
        },
        '# build output\ndist\n',
      );

      expect(output.ignores).toStrictEqual(['generated/', '**/dist']);
      // (the set matcher compares array entries by reference, so check each config)
      expect(output.configs).toHaveLength(2);
      expect(output.configs[0]).toEqual({ rules: { 'no-console': 'off' } });
      expect(output.configs[1]).toEqual({
        files: ['**/*.test.ts', 'src/legacy/**'],
        ignores: ['src/legacy/keep.ts'],
        rules: { 'max-lines': 'off' },
      });
      // `root` & `extends` are replaced by the generated config
      expect(output.unmigrated).toStrictEqual(['env']);
    });
  });

  describe('_generate_eslint_config with a legacy config', () => {
    it(`should include the carried over config`, async () => {
      const { _generate_eslint_config } = await import(
        './lint-configuration.js'
      );

      const output = _generate_eslint_config(
        {
          project_type: 'backend',
          languages: ['js'],
          technologies: [],
          lenient: false,
        },
        { ignores: ['**/dist'], configs: [{ rules: { 'no-console': 'off' } }] },
      );

      expect(import_specifiers(output.content)[0]).toBe('eslint/config');
      expect(output.content).toContain(
        `import { defineConfig, globalIgnores } from 'eslint/config';`,
      );
      expect(output.content).toContain(
        `export default defineConfig(globalIgnores(["**/dist"]), base, node, {"rules":{"no-console":"off"}});`,
      );
    });
  });
});

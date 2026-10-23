import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import '@code-style/utils/testing/assert/matchers';
import {
  Dependencies,
  DependencySet,
  file_exists,
  is_dependencies_array,
  verify_missing,
} from './utils.js';

describe('utils', () => {
  describe('DependencySet', () => {
    it('should have Set methods', () => {
      expect(DependencySet.prototype instanceof Set).toBe(true);

      const dependencies = new DependencySet(['foo']);

      expect(dependencies.has('foo')).toBe(true);
      expect(dependencies.has('bar')).toBe(false);
    });

    describe('depend', () => {
      it('should add dependency to set', () => {
        const dependencies = new DependencySet();
        expect(dependencies.has('foo')).toBe(false);
        expect(dependencies.depend('foo')).toBe('foo');
        expect(dependencies.has('foo')).toBe(true);
      });

      it('should add dependency with command to set', () => {
        const dependencies = new DependencySet();
        expect(dependencies.has('foo')).toBe(false);
        expect(dependencies.depend('foo', { cmd: 'foo-cli' })).toBe('foo-cli');
        expect(dependencies.has('foo')).toBe(true);
      });

      it(`should't list duplicates`, () => {
        const dependencies = new DependencySet();
        expect(() => dependencies.depend('foo')).not.toThrow();
        expect(() => dependencies.depend('foo')).not.toThrow();
        expect(dependencies).toEqual(new Set(['foo']));
      });

      it('should validate package names', () => {
        const dependencies = new DependencySet();
        expect(() => dependencies.depend('foo')).not.toThrow();
        expect(() => dependencies.depend('foo-bar')).not.toThrow();
        expect(() => dependencies.depend('@foo/bar-baz')).not.toThrow();
        expect(() => dependencies.depend('@foo/bar/baz')).toThrow();
        expect(() => dependencies.depend('foo/bar')).toThrow();
      });
    });
  });

  describe('Dependencies', () => {
    describe('constructor', () => {
      it(`should handle no params`, () => {
        const deps = new Dependencies();
        expect(deps.production).toBe(deps.p);
        expect(deps.development).toBe(deps.d);
        expect(deps.production).not.toBe(deps.d);

        expect(deps.production).toEqual(new Set());
        expect(deps.development).toEqual(new Set());
      });

      it(`should handle a Dependencies list`, () => {
        const deps = new Dependencies([
          new Dependencies(['foo'], ['bar']),
          new Dependencies(['baz'], ['qux']),
        ]);

        expect(deps.production).toEqual(new Set(['foo', 'baz']));
        expect(deps.development).toEqual(new Set(['bar', 'qux']));
      });

      it(`should handle string lists`, () => {
        const deps = new Dependencies(['foo', 'baz'], ['bar', 'qux']);

        expect(deps.production).toEqual(new Set(['foo', 'baz']));
        expect(deps.development).toEqual(new Set(['bar', 'qux']));
      });
    });
  });

  describe('is_dependencies_array', () => {
    it(`should check if list of Dependencies`, () => {
      expect(is_dependencies_array([])).toBe(false);
      expect(is_dependencies_array(['foo'])).toBe(false);
      expect(is_dependencies_array([new Dependencies()])).toBe(true);
    });
  });

  describe('verify_missing', () => {
    const prettier_paths = [
      '.prettierrc.mjs',
      /^\.?prettier(rc|\.config)?(\.(json[5c]?|ya?ml|toml|[mc]?js))?$/u,
    ];
    const original_cwd = process.cwd();
    let dir: string;

    beforeEach(async () => {
      dir = await mkdtemp(join(tmpdir(), 'verify-missing-'));
      process.chdir(dir);
    });
    afterEach(async () => {
      process.chdir(original_cwd);
      await rm(dir, { recursive: true, force: true });
    });

    it('should be true when no file matches', async () => {
      await expect(verify_missing({ path: prettier_paths })).resolves.toBe(
        true,
      );
    });

    it('should be false when a file matches and remove is off', async () => {
      await writeFile('.prettierrc.json', '{}');
      await expect(verify_missing({ path: prettier_paths })).resolves.toBe(
        false,
      );
      await expect(file_exists('.prettierrc.json')).resolves.toEqual([
        '.prettierrc.json',
      ]);
    });

    it('should throw when a file matches and reject is on', async () => {
      await writeFile('.prettierrc.json', '{}');
      await expect(
        verify_missing({ path: prettier_paths, reject: true }),
      ).rejects.toThrow('.prettierrc.json');
    });

    it('should remove a file matched by several patterns', async () => {
      // both patterns match, which used to race to delete the file twice
      await writeFile('.prettierrc.mjs', 'export default {};');
      await expect(
        verify_missing({ path: prettier_paths, remove: true }),
      ).resolves.toBe(true);
      await expect(file_exists('.prettierrc.mjs')).resolves.toBe(false);
    });
  });
});

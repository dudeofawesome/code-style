import { cwd } from 'node:process';
import { join } from 'node:path';
import { describe, it } from '@jest/globals';
import { find_node_modules_path, path_exists } from './path';

describe('path', () => {
  describe('find_node_modules_path', () => {
    it(`should find the node_modules dir`, async () => {
      await expect(find_node_modules_path()).resolves.toMatch(/node_modules$/u);
    });
  });

  describe('path_exists', () => {
    it(`should show that cwd exists`, async () => {
      await expect(path_exists(cwd())).resolves.toBe(true);
    });
    it(`should show that a non-existint file doesn't exist`, async () => {
      await expect(
        path_exists(join(cwd(), 'this-is-not-a-thing')),
      ).resolves.toBe(false);
    });
  });
});

import { describe, it, expect } from '@jest/globals';
import { _generate_lint_script } from './scripts.js';

describe('scripts', () => {
  describe(_generate_lint_script.name, () => {
    it(`should create lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts'],
        technologies: ['react'],
      });
      expect(output.lint).toEqual('concurrently "npm:lint:*"');
      expect(output['lint:js']).toMatch(/^eslint/u);
    });
  });
});

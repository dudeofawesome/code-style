import { describe, it, expect } from '@jest/globals';
import { _generate_lint_script } from './scripts.js';

describe('scripts', () => {
  describe(_generate_lint_script.name, () => {
    it(`should create ts lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts'],
        technologies: ['react'],
      });
      expect(output.lint).toMatch(/concurrently.+"npm:lint:\*"/u);
      expect(output['lint:js']).toMatch(/^eslint /u);
      expect(output['lint:js']).toMatch(/ --ext /u);
      expect(
        output['lint:js']?.match(/--ext (\S+)\b/u)?.[1]?.split(','),
      ).toEqual(['ts', 'tsx', 'json']);
    });

    it(`should create ts & js lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts', 'js'],
        technologies: [],
      });
      expect(output.lint).toMatch(/concurrently.+"npm:lint:\*"/u);
      expect(output['lint:js']).toMatch(/^eslint /u);
      expect(output['lint:js']).toMatch(/ --ext /u);
      expect(
        output['lint:js']?.match(/--ext (\S+)\b/u)?.[1]?.split(','),
      ).toEqual(['js', 'ts', 'json']);
    });
  });
});

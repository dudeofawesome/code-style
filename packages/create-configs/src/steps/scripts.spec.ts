import { describe, it, expect } from '@jest/globals';
import { _generate_lint_script } from './scripts.js';

describe('scripts', () => {
  describe(_generate_lint_script.name, () => {
    describe(`ts lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts'],
        technologies: ['react'],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+"npm:lint:\*"/u);
        expect(output.scripts['lint:js']).toMatch(/^eslint /u);
        expect(output.scripts['lint:js']).toMatch(/ --ext /u);
        expect(
          output.scripts['lint:js']?.match(/--ext (\S+)\b/u)?.[1]?.split(','),
        ).toEqual(['ts', 'tsx', 'json']);
      });

      test_no_shell_globs(Object.values(output.scripts));
    });

    describe(`ts & js lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts', 'js'],
        technologies: [],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+"npm:lint:\*"/u);
        expect(output.scripts['lint:js']).toMatch(/^eslint /u);
        expect(output.scripts['lint:js']).toMatch(/ --ext /u);
        expect(
          output.scripts['lint:js']?.match(/--ext (\S+)\b/u)?.[1]?.split(','),
        ).toEqual(['js', 'ts', 'json']);
      });

      test_no_shell_globs(Object.values(output.scripts));
    });

    describe(`css lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['css'],
        technologies: [],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+"npm:lint:\*"/u);
        expect(output.scripts['lint:css']).toMatch(/^stylelint /u);
        expect(output.scripts['lint:css']).toMatch(/\{css\}/u);
      });

      test_no_shell_globs(Object.values(output.scripts));
    });

    describe(`css & scss lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['css', 'scss'],
        technologies: [],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+"npm:lint:\*"/u);
        expect(output.scripts['lint:css']).toMatch(/^stylelint /u);
        expect(output.scripts['lint:css']).toMatch(/[^s]css/u);
        expect(output.scripts['lint:css']).toMatch(/scss/u);
      });

      test_no_shell_globs(Object.values(output.scripts));
    });
  });
});

function test_no_shell_globs(scripts: string[]) {
  it(`shouldn't allow the shell to expand globs`, () => {
    for (const script of scripts) {
      // https://regex101.com/r/e67boW/
      expect(script).toMatch(/(?:["'][\S]*?(\*)[\S]*?["']|^[^*]*$)/u);
    }
  });
}

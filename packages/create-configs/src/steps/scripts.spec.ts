import { describe, it, expect } from '@jest/globals';

import {
  _generate_build_script,
  _generate_lint_script,
  _generate_test_script,
} from './scripts.js';

describe('scripts', () => {
  describe(_generate_lint_script.name, () => {
    describe(`ts lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts'],
        technologies: ['react'],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+'npm:lint:\*'/u);
        expect(output.scripts['lint:js']).toMatch(/^eslint /u);
        expect(output.scripts['lint:js']).toMatch(/ --ext /u);
        expect(
          output.scripts['lint:js']?.match(/--ext (\S+)\b/u)?.[1]?.split(','),
        ).toEqual(['ts', 'tsx', 'json']);
      });

      test_no_shell_globs(Object.values(output.scripts));
      test_matched_braces(Object.values(output.scripts));
    });

    describe(`ts & js lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['ts', 'js'],
        technologies: [],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+'npm:lint:\*'/u);
        expect(output.scripts['lint:js']).toMatch(/^eslint /u);
        expect(output.scripts['lint:js']).toMatch(/ --ext /u);
        expect(
          output.scripts['lint:js']?.match(/--ext (\S+)\b/u)?.[1]?.split(','),
        ).toEqual(['js', 'ts', 'json']);
      });

      test_no_shell_globs(Object.values(output.scripts));
      test_matched_braces(Object.values(output.scripts));
    });

    describe(`css lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['css'],
        technologies: [],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+'npm:lint:\*'/u);
        expect(output.scripts['lint:css']).toMatch(/^stylelint /u);
        expect(output.scripts['lint:css']).toMatch(/\{css\}/u);
      });

      test_no_shell_globs(Object.values(output.scripts));
      test_matched_braces(Object.values(output.scripts));
    });

    describe(`css & scss lint scripts`, () => {
      const output = _generate_lint_script({
        builder: 'esbuild',
        languages: ['css', 'scss'],
        technologies: [],
      });

      it(`should create lint scripts`, () => {
        expect(output.scripts.lint).toMatch(/concurrently.+'npm:lint:\*'/u);
        expect(output.scripts['lint:css']).toMatch(/^stylelint /u);
        expect(output.scripts['lint:css']).toMatch(/[^s]css/u);
        expect(output.scripts['lint:css']).toMatch(/scss/u);
      });

      test_no_shell_globs(Object.values(output.scripts));
      test_matched_braces(Object.values(output.scripts));
    });
  });

  describe(_generate_build_script.name, () => {
    describe(`esbuild backend scripts`, () => {
      const output = _generate_build_script({
        project_type: 'backend',
        builder: 'esbuild',
        languages: ['ts'],
        technologies: ['esm'],
        library: false,
        input_dir: 'src',
        output_dir: 'dist',
      });

      it(`should create build scripts`, () => {
        expect(output.scripts.build).toMatch(/concurrently.+'npm:build:\*'/u);
        expect(output.scripts['build:js']).toMatch(/^esbuild /u);
        expect(output.scripts['build:js']).toMatch(/\besm\b/u);
        expect(output.scripts['build:js']).not.toMatch(/\n/u);
      });

      test_no_shell_globs(Object.values(output.scripts));
      test_matched_braces(Object.values(output.scripts));
    });
  });

  describe(_generate_test_script.name, () => {
    describe(`test scripts using node:test with esbuild`, () => {
      const output = _generate_test_script({
        builder: 'esbuild',
        languages: ['ts'],
        technologies: ['esm'],
        output_dir: 'dist',
        runtime: 'nodejs',
      });

      it(`should create build scripts`, () => {
        expect(output.scripts.test).toMatch(/^node .*--test/u);
        expect(output.scripts['test:debug']).toMatch(/--inspect-brk/u);
        expect(output.scripts['test:debug']).not.toMatch(/NODE_OPTIONS=/u);
      });

      test_no_shell_globs(Object.values(output.scripts));
      test_matched_braces(Object.values(output.scripts));
    });
  });
});

function test_no_shell_globs(scripts: string[]) {
  // eslint-disable-next-line jest/require-top-level-describe
  it(`shouldn't allow the shell to expand globs`, () => {
    expect.hasAssertions();
    // expect.assertions(scripts.length);

    for (const script of scripts) {
      // https://regex101.com/r/e67boW/
      expect(script).toMatch(/(?:["'][\S]*?(\*)[\S]*?["']|^[^*]*$)/u);
    }
  });
}

function test_matched_braces(scripts: string[]) {
  // eslint-disable-next-line jest/require-top-level-describe
  it(`should match opening & closing braces`, () => {
    expect.hasAssertions();
    // expect.assertions(scripts.length * 3);

    for (const script of scripts) {
      expect(script.match(/\(/gu)?.length).toEqual(
        script.match(/\)/gu)?.length,
      );
      expect(script.match(/\[/gu)?.length).toEqual(
        script.match(/\]/gu)?.length,
      );
      expect(script.match(/\{/gu)?.length).toEqual(
        script.match(/\}/gu)?.length,
      );
    }
  });
}

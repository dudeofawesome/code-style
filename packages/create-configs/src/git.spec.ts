import { describe, it, expect } from '@jest/globals';
import { gitignore_sets, _generate_gitignore } from './git.js';

describe('git', () => {
  describe('gitignore_sets', () => {
    describe(gitignore_sets.reports.name, () => {
      it(`should add diagnostic reports for node`, () => {
        expect(gitignore_sets.reports({ languages: ['js'] })).toContain(
          'report.[',
        );
      });
      it(`should not add diagnostic reports`, () => {
        expect(gitignore_sets.reports({ languages: [] })).toBeUndefined();
      });
    });

    describe(gitignore_sets.dependencies.name, () => {
      it(`should add node_modules for node`, () => {
        expect(gitignore_sets.dependencies({ languages: ['js'] })).toContain(
          'node_modules',
        );
      });
      it(`should not add node_modules`, () => {
        expect(gitignore_sets.dependencies({ languages: [] })).toBeUndefined();
      });
    });

    describe(gitignore_sets.compiled.name, () => {
      it(`should add build dir`, () => {
        expect(gitignore_sets.compiled(['build'])).toContain('build');
      });
      it(`should not add anything`, () => {
        expect(gitignore_sets.compiled([])).toBeUndefined();
      });
    });

    describe(gitignore_sets.logs.name, () => {
      it(`should add logs dir`, () => {
        expect(gitignore_sets.logs({ languages: [] })).toContain('*.log');
      });
      it(`should add npm logs`, () => {
        expect(gitignore_sets.logs({ languages: ['js'] })).toContain(
          'npm-debug.log',
        );
      });
    });

    describe(gitignore_sets.caches.name, () => {
      it(`should add ts cache dir`, () => {
        expect(
          gitignore_sets.caches({
            languages: ['ts'],
            technologies: [],
            builder: 'tsc',
          }),
        ).toContain('.tsbuildinfo');
      });
      it(`should add eslint cache dir`, () => {
        expect(
          gitignore_sets.caches({
            languages: ['js'],
            technologies: [],
            builder: 'none',
          }),
        ).toContain('.eslintcache');
      });
      it(`should add stylelint cache dir`, () => {
        expect(
          gitignore_sets.caches({
            languages: ['css'],
            technologies: [],
            builder: 'none',
          }),
        ).toContain('.stylelintcache');
      });
      it(`should add next cache dir`, () => {
        expect(
          gitignore_sets.caches({
            languages: ['ts'],
            technologies: ['react'],
            builder: 'tsc',
          }),
        ).toContain('.next/');
      });
    });

    describe(gitignore_sets.testing.name, () => {
      it(`should add coverage dir`, () => {
        expect(gitignore_sets.testing({ languages: [] })).toContain('coverage');
      });
      it(`should add lcov`, () => {
        expect(gitignore_sets.testing({ languages: ['js'] })).toContain(
          '.lcov',
        );
      });
    });

    describe(gitignore_sets.secrets.name, () => {
      it(`should add .env`, () => {
        expect(gitignore_sets.secrets({ languages: [] })).toContain('.env');
      });
      it(`should add lcov`, () => {
        expect(gitignore_sets.secrets({ languages: ['js'] })).toContain(
          '.npmrc',
        );
      });
    });
  });

  describe(_generate_gitignore.name, () => {
    it('should build basic gitignore', () => {
      const basic = _generate_gitignore({
        languages: [],
        project_type: 'backend',
        technologies: [],
        builder: 'none',
      });

      expect(basic).toContain('.vscode');
      expect(basic).toContain('.DS_Store');
    });

    it('should build nodejs gitignore', () => {
      const nodejs = _generate_gitignore({
        languages: ['js'],
        project_type: 'backend',
        technologies: [],
        builder: 'none',
      });

      expect(nodejs).toContain('.vscode');
      expect(nodejs).toContain('.DS_Store');
      expect(nodejs).toContain('node_modules');
      expect(nodejs).toContain('.eslintcache');
      expect(nodejs).toContain('.lcov');
    });

    it('should build typescript gitignore', () => {
      const web = _generate_gitignore({
        languages: ['ts'],
        project_type: 'web-app',
        technologies: [],
        builder: 'tsc',
      });

      expect(web).toContain('.vscode');
      expect(web).toContain('.DS_Store');
      expect(web).toContain('node_modules');
      expect(web).toContain('.eslintcache');
      expect(web).toContain('tsbuildinfo');
    });

    it('should have no lines with leading spaces', () => {
      const react = _generate_gitignore({
        languages: ['ts'],
        project_type: 'web-app',
        technologies: ['react'],
        builder: 'tsc',
      });

      expect(react).not.toMatch(/^\s+\S+$/gmu);
    });
  });
});

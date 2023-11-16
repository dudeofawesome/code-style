import { stripIndent, stripIndents } from 'common-tags';

import { create_file, includes_js, prettify, verify_missing } from './utils.js';
import { ProjectType, Language, Technology } from './types.js';

export const gitignore_sets = {
  reports: ({ languages }: Pick<Options, 'languages'>) =>
    includes_js(languages)
      ? stripIndent`
          # Diagnostic reports (https://nodejs.org/api/report.html)
          report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
        `
      : undefined,
  dependencies: ({ languages }: Pick<Options, 'languages'>) =>
    includes_js(languages)
      ? stripIndent`
          # dependencies
          node_modules/
          .npm
        `
      : undefined,
  compiled: (compiled_paths: (string | undefined)[]) => {
    const filtered_paths = compiled_paths.filter(Boolean);
    return filtered_paths.length > 0
      ? stripIndents`
          # compiled output
          ${filtered_paths.join('\n')}
        `
      : undefined;
  },
  logs: ({ languages }: Pick<Options, 'languages'>) =>
    stripIndents`
      # logs
      logs/
      *.log
      ${
        includes_js(languages)
          ? stripIndents`
              npm-debug.log*
              pnpm-debug.log*
              yarn-debug.log*
              yarn-error.log*
            `
          : ''
      }
    `.trim(),
  caches: ({
    languages,
    technologies,
  }: Pick<Options, 'languages' | 'technologies'>) => stripIndents`
    # caches
    ${[
      includes_js(languages) ? '.eslintcache' : null,
      // TODO(0): is this actually the right file
      '.prettiercache',
      languages.includes('ts') ? '*.tsbuildinfo' : null,
      languages.includes('css') || languages.includes('scss')
        ? '.stylelintcache'
        : null,
      technologies.includes('react') ? '.next/' : null,
    ]
      .filter((l) => l != null)
      .join('\n')}
  `,
  os: stripIndent`
    # OS
    .DS_Store
    thumbs.db
  `,
  testing: ({ languages }: Pick<Options, 'languages'>) =>
    stripIndents`
      # test output
      /coverage
      ${
        includes_js(languages)
          ? stripIndent`
              /.nyc_output
              *.lcov
            `
          : ''
      }
    `.trim(),
  IDEs: stripIndents`
    # IDEs and editors
    .vscode/*
    !.vscode/settings.json
    !.vscode/tasks.json
    !.vscode/launch.json
    !.vscode/extensions.json
    *.sublime-workspace
  `,
  secrets: ({ languages }: Pick<Options, 'languages'>) =>
    stripIndents`
      # Secrets
      *.env
      *.env.*
      *.bin
      *.key
      *_accessKeys.csv
      ${includes_js(languages) ? '.npmrc' : ''}
    `.trim(),
};

interface Options {
  project_type: ProjectType;
  languages: Language[];
  technologies: Technology[];
  output_dir?: string;
}
/** @private */
export function _generate_gitignore(options: Options): string {
  return [
    gitignore_sets.compiled([options.output_dir]),
    gitignore_sets.dependencies(options),
    gitignore_sets.logs(options),
    gitignore_sets.reports(options),
    gitignore_sets.caches(options),
    gitignore_sets.testing(options),
    gitignore_sets.os,
    gitignore_sets.IDEs,
    gitignore_sets.secrets(options),
  ]
    .filter((s) => s != null && s.trim() !== '')
    .join('\n\n');
}

export async function create_gitignore(
  options: Options,
  overwrite: boolean = true,
) {
  const path = '.gitignore';
  if (await verify_missing({ path, remove: overwrite })) {
    return create_file(path, _generate_gitignore(options));
  }
}

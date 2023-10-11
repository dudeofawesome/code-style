import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Options } from 'yargs';

import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';
import { build, BuildOptions } from './build.js';
import { interactive_setup } from './interactive.js';

// TODO(4): add support for ruby
// TODO(1): add support for build systems
// TODO(2): add support for runtimes
// TODO(1): add npm scripts for build, lint, etc

export async function main() {
  const options = await Yargs(hideBin(process.argv))
    .scriptName('create-configs')
    .command(
      'create',
      'Create your new project with CLI arguments.',
      (yargs) => {
        // TODO(0): bring yargs up to date with prompt
        yargs
          .option<string, { choices: ProjectType[] } & Options>(
            'project_type',
            {
              alias: 't',
              describe: 'Pick a project type',
              choices: ['web-app', 'backend', 'cli'],
            },
          )
          .option<string, { choices: Language[] } & Options>('language', {
            alias: 'l',
            describe: 'Pick a language',
            choices: ['ts', 'js', 'rb', 'py', 'css', 'scss'],
            array: true,
            default: ['ts'],
          })
          .option<string, { choices: Runtime[] } & Options>('runtime', {
            alias: 'r',
            describe: 'Pick a runtime',
            choices: ['nodejs', 'bun'],
            default: 'nodejs',
          })
          .option<string, { choices: Builder[] } & Options>('builder', {
            alias: 'b',
            describe: 'Pick a builder',
            choices: ['tsc', 'esbuild', 'swc', 'babel', 'bun', 'none'],
            default: 'esbuild',
          })
          .option('input_dir', {
            alias: 'i',
            describe: 'Pick an input directory',
            default: 'src/',
          })
          .option('output_dir', {
            alias: 'o',
            describe: 'Pick an output directory',
            default: 'dist/',
          })
          .option<string, { choices: Technology[] } & Options>('technologies', {
            alias: 'c',
            describe: 'Choose some technologies you will use',
            choices: ['react', 'nestjs', 'jest', 'vs-code'],
            array: true,
            default: ['jest', 'vs-code'],
          });
      },
      async (argv) => {
        await build(argv as unknown as BuildOptions);
        process.exit(0);
      },
    )
    .command(
      'prompt',
      'Walk through a set of prompts to configure your new project',
      interactive_setup,
      (argv) => {
        return;
      },
    )
    .parserConfiguration({
      'strip-aliased': true,
      'strip-dashed': true,
    }).argv;

  if (options._.length === 0) await interactive_setup();
}

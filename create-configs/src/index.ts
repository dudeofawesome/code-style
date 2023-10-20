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
// TODO(0): allow overwriting files when an option is passed

export async function main() {
  const options = await Yargs(hideBin(process.argv))
    .scriptName('create-configs')
    .option('overwrite', {
      alias: 'o',
      description: 'Allows overwriting files.',
      type: 'boolean',
      default: false,
    })
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
              description: 'Pick a project type',
              choices: ['web-app', 'backend', 'cli'],
            },
          )
          .option<string, { choices: Language[] } & Options>('language', {
            alias: 'l',
            description: 'Pick a language',
            choices: ['ts', 'js', 'rb', 'py', 'css', 'scss'],
            array: true,
            default: ['ts'],
          })
          .option<string, { choices: Runtime[] } & Options>('runtime', {
            alias: 'r',
            description: 'Pick a runtime',
            choices: ['nodejs', 'bun'],
            default: 'nodejs',
          })
          .option<string, { choices: Builder[] } & Options>('builder', {
            alias: 'b',
            description: 'Pick a builder',
            choices: ['tsc', 'esbuild', 'swc', 'babel', 'bun', 'none'],
            default: 'esbuild',
          })
          .option('input_dir', {
            alias: 'i',
            description: 'Pick an input directory',
            default: 'src/',
          })
          .option('output_dir', {
            alias: 'o',
            description: 'Pick an output directory',
            default: 'dist/',
          })
          .option<string, { choices: Technology[] } & Options>('technologies', {
            alias: 'c',
            description: 'Choose some technologies you will use',
            choices: ['react', 'nestjs', 'jest', 'vs-code'],
            array: true,
            default: ['jest', 'vs-code'],
          });
      },
      async (argv) => {
        await build(argv as unknown as BuildOptions, options.overwrite);
        process.exit(0);
      },
    )
    .command(
      'prompt',
      'Walk through a set of prompts to configure your new project',
      async (yargs) => {
        await interactive_setup((await yargs.argv).overwrite);
      },
      (argv) => {
        return;
      },
    )
    .parserConfiguration({
      'strip-aliased': true,
      'strip-dashed': true,
    }).argv;

  if (options._.length === 0) await interactive_setup(options.overwrite);
}

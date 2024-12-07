import { stat, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { stripIndent } from 'common-tags';
import {
  ConfigFile,
  Dependencies,
  create_file,
  verify_missing,
  version as v,
} from '../utils.js';

export async function create_prettier_config(
  overwrite: boolean = false,
): Promise<ConfigFile['dependencies']> {
  const deps = new Dependencies();
  const preferred = '.prettierrc.mjs';
  const paths = [
    preferred,
    /^\.?prettier(rc|\.config)?(\.(json[5c]?|ya?ml|toml|[mc]?js))?$/u,
  ];
  if (await verify_missing({ path: paths, remove: overwrite })) {
    await create_file(
      preferred,
      stripIndent`
        /**
         * https://prettier.io/docs/en/
         * Prettier configuration file
         * In order to update the config, update @code-style/code-style
         */
        import config from '${deps.d.depend('@code-style/code-style', { v })}/prettierrc';
        export default config;
      `,
    );
  }

  return deps;
}

export async function create_editor_config(
  overwrite: boolean = false,
): Promise<ConfigFile['dependencies'] | undefined> {
  const deps = new Dependencies();
  const path = '.editorconfig';
  if (await verify_missing({ path, remove: overwrite })) {
    if (!(await stat(path).catch(() => ({ isFile: () => false }))).isFile()) {
      await symlink(
        join(
          'node_modules',
          deps.d.depend('@code-style/code-style', { v }),
          '.editorconfig',
        ),
        path,
      );
    }
  }

  return deps;
}

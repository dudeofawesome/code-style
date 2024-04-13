import { stat, symlink } from 'node:fs/promises';
import { stripIndent } from 'common-tags';
import { create_file, verify_missing } from '../utils.js';

export async function create_prettier_config(overwrite: boolean = false) {
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
         * In order to update the this config, update @code-style/code-style
         */
        import config from '@code-style/code-style/prettierrc';
        export default config;
      `,
    );
  }
}

export async function create_editor_config(overwrite: boolean = false) {
  const path = '.editorconfig';
  if (await verify_missing({ path, remove: overwrite })) {
    if (!(await stat(path).catch(() => ({ isFile: () => false }))).isFile()) {
      await symlink('node_modules/@code-style/code-style/.editorconfig', path);
    }
  }
}

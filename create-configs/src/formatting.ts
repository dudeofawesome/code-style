import { stat, symlink } from 'node:fs/promises';
import { stripIndent } from 'common-tags';
import { create_file, verify_missing } from './utils.js';

export async function create_prettier_config(overwrite: boolean = false) {
  const path = '.prettierrc';
  if (await verify_missing({ path, remove: overwrite })) {
    await create_file(
      path,
      stripIndent`
      # https://prettier.io/docs/en/
      # Prettier configuration file
      # In order to update the this config, update @dudeofawesome/code-style
      "@dudeofawesome/code-style/.prettierrc.js"
    `,
    );
  }
}

export async function create_editor_config(overwrite: boolean = false) {
  const path = '.editorconfig';
  if (await verify_missing({ path, remove: overwrite })) {
    if (!(await stat(path).catch(() => ({ isFile: () => false }))).isFile()) {
      await symlink(
        'node_modules/@dudeofawesome/code-style/.editorconfig',
        path,
      );
    }
  }
}

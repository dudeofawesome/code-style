import { mkdir, stat, symlink } from 'node:fs/promises';
import { create_file } from './utils.js';

export async function create_prettier_config() {
  await create_file(
    '.prettierrc',
    '"@dudeofawesome/code-style/.prettierrc.js"\n',
  );
}

export async function create_editor_config() {
  if (
    !(
      await stat('.editorconfig').catch(() => ({ isFile: () => false }))
    ).isFile()
  ) {
    await symlink(
      'node_modules/@dudeofawesome/code-style/.editorconfig',
      '.editorconfig',
    );
  }
}

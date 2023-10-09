import { stat, writeFile } from 'node:fs/promises';

export async function create_file(
  path: string,
  content: string,
  overwrite = false,
): Promise<void> {
  if (
    (await stat(path).catch(() => ({ isFile: () => false }))).isFile() &&
    !overwrite
  ) {
    return;
  }

  await writeFile(path, content, { mode: 0b110110100 });
}

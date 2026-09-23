import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setup_tmp_dir } from '@code-style/utils/path';
import { exec, file_exists } from '../src/utils.js';
import { mkdir } from 'node:fs/promises';

const { resolve } = createRequire(import.meta.url);

describe(`e2e`, () => {
  describe(`run with rcfile & --yes`, () => {
    let cleanup: () => Promise<void>;
    beforeAll(async () => {
      cleanup = (await setup_tmp_dir([])).cleanup;
    });
    afterAll(async () => {
      await cleanup();
    });

    it(`should complete successfully`, async () => {
      const tmp_dir = join(tmpdir(), `code-style-create-configs-e2e`);
      await mkdir(tmp_dir, { recursive: true });

      await expect(
        exec(
          `npx file:${dirname(dirname(resolve('@code-style/create-configs')))} --yes`,
          { cwd: tmp_dir },
        ),
      ).resolves.not.toThrow();

      await Promise.all([
        expect(file_exists(`tsconfig`)).rejects.toBe(true),
        expect(file_exists(`tsconfig.json`)).rejects.toBe(true),
      ]);
    }, 20_000);
  });
});

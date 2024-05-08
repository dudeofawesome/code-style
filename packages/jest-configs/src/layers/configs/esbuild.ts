import type { BuildOptions } from 'esbuild';

export const config = {
  tsconfig: 'tsconfig.build.json',

  sourcemap: 'inline',
  platform: 'node',
  target: 'node18',
} as BuildOptions;

/** Matches TS and JS source files (typescript-eslint deliberately lints JS too). */
export const ts_file_patterns = ['**/*.?(m|c)@(t|j)s?(x)'];

export const test_file_patterns = [
  '**/test/**',
  '**/__test__/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/*.unit.*',
  '**/*.e2e.*',
];

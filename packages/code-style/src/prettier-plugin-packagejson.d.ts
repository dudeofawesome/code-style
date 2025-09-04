declare module 'prettier-plugin-packagejson' {
  import type { Plugin } from 'prettier';

  export const { parsers, options }: Plugin;
}

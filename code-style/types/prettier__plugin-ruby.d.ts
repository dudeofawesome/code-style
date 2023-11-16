declare module '@prettier/plugin-ruby' {
  import type { Options, Plugin } from 'prettier';

  export type RubyOptions = {
    /**
     * Allows you to configure your Ruby executable path.
     * @default 'ruby'
     */
    rubyExecutablePath: string;
    /**
     * The comma-separated list of plugins to require.
     * See [Syntax Tree](https://github.com/ruby-syntax-tree/syntax_tree#plugins).
     * @default ''
     */
    rubyPlugins: string;
    /**
     * Whether or not to default to single quotes for Ruby code.
     * See [Syntax Tree](https://github.com/ruby-syntax-tree/syntax_tree#plugins).
     * @default false
     */
    rubySingleQuote: boolean
  } & Options;
  const plugin: Plugin;

  export default plugin;
}

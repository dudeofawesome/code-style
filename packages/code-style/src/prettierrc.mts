// https://prettier.io/docs/en/options.html

import { execSync } from 'child_process';
import deepmerge from 'deepmerge';
import type { RubyConfig } from '@prettier/plugin-ruby';
import type { Config } from 'prettier';

const is_prettier_gem_installed: boolean = (() => {
  try {
    return (
      // TODO(0): re-enable ruby
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-binary-expression
      false &&
      execSync('gem list -i prettier_print').toString().trim() === 'true'
    );
  } catch {
    return false;
  }
})();

const option_sets: Record<string, Config | RubyConfig> = {
  general: {
    singleQuote: true,
    semi: true,
    trailingComma: 'all',
    quoteProps: 'as-needed', // prettier default
    bracketSpacing: true, // prettier default
    bracketSameLine: false, // prettier default
    arrowParens: 'always', // prettier default
    proseWrap: 'preserve', // prettier default
    singleAttributePerLine: false, // prettier default
    embeddedLanguageFormatting: 'auto', // prettier default
    // printWidth: // configured in .editorconfig->max_line_length
    // useTabs: // configured in .editorconfig->indent_style
    // tabWidth: // configured in .editorconfig->indent_size
    // endOfLine: // configured in .editorconfig->end_of_line
  },

  html: {
    htmlWhitespaceSensitivity: 'css', // prettier default
  },

  jsx: {
    jsxSingleQuote: false, // prettier default
  },

  vue: {
    vueIndentScriptAndStyle: false, // prettier default
  },

  package_json: {
    // TODO(0): consider switching to `prettier-plugin-pkg`
    plugins: ['prettier-plugin-packagejson'],
  },

  ruby: is_prettier_gem_installed
    ? {
        plugins: ['@prettier/plugin-ruby'],

        rubySingleQuote: true,
        // rubyPlugins: ['plugin/single_quotes'],
      }
    : {},
};

const config = deepmerge.all<Config>([
  {},
  ...Object.entries(option_sets).map(([_, v]) => v),
]);

export default config;

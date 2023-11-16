// https://prettier.io/docs/en/options.html

import { execSync } from 'child_process';
import deepmerge from 'deepmerge';
// TODO(0): consider switching to `prettier-plugin-pkg` or `prettier-plugin-package`
import PrettierPluginPackageJson from 'prettier-plugin-packagejson';
import PrettierPluginRuby from '@prettier/plugin-ruby';
import type { RubyOptions } from '@prettier/plugin-ruby';
import type { Options } from 'prettier';

const is_prettier_gem_installed: boolean = (() => {
  try {
    return (
      execSync('gem list -i prettier_print').toString().trim() === 'true' &&
      // disable ruby for now
      false
    );
  } catch {
    return false;
  }
})();

const option_sets: Record<string, Options | RubyOptions> = {
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
    plugins: [PrettierPluginPackageJson],
  },

  ruby: is_prettier_gem_installed
    ? {
        plugins: [PrettierPluginRuby],

        // rubyArrayLiteral: true,
        // rubyHashLabel: true,
        // rubyModifier: true,
        rubySingleQuote: true,
        // rubyToProc: false,
        // rubyPlugins: ['plugin/single_quotes'],
      }
    : {},
};

const config: Options = deepmerge.all([
  {},
  ...Object.entries(option_sets).map(([_, v]) => v),
]);

export default config;

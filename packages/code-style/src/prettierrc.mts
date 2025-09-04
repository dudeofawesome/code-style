// https://prettier.io/docs/en/options.html

import { execSync } from 'child_process';
import deepmerge from 'deepmerge';
import type { Config, Plugin } from 'prettier';
import type { RubyConfig } from '@prettier/plugin-ruby';
import plugin_ruby from '@prettier/plugin-ruby';
import * as plugin_packagejson from 'prettier-plugin-packagejson';

// eslint-disable-next-line n/no-process-env -- this is the only config we need.
const in_vscode_ext = process.env.VSCODE_PID != null;

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

function resolve_plugin(
  plugin: 'prettier-plugin-packagejson' | '@prettier/plugin-ruby',
): string | Plugin {
  if (!in_vscode_ext) {
    switch (plugin) {
      case 'prettier-plugin-packagejson':
        return plugin_packagejson;
      case '@prettier/plugin-ruby':
        return plugin_ruby;
    }
  } else {
    /**
     * vscode's prettier extension fails to load esm plugins when they include
     * an esm import (https://github.com/prettier/prettier-vscode/issues/3066)
     * so we resolve the package's path here instead.
     */
    return (
      import.meta
        .resolve(plugin)
        /**
         * vscode's prettier ext can't understand URIs, so we must convert
         * the URI to an absolute path instead.
         */
        .replace(/^file:\/\//u, '')
    );
  }
}

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
    plugins: [resolve_plugin('prettier-plugin-packagejson')],
  },

  ruby: is_prettier_gem_installed
    ? {
        plugins: [resolve_plugin('@prettier/plugin-ruby')],

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

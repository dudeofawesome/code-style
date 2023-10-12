// https://prettier.io/docs/en/options.html

const { execSync } = require('child_process');
const deepmerge = require('deepmerge');

/** @type {boolean} */
const is_prettier_gem_installed =
  execSync('gem list -i prettier_print').toString().trim() === 'true' &&
  // disable ruby for now
  false;

/** @type {Record<string, import('prettier').Options>} */
const option_sets = {
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

  ruby: is_prettier_gem_installed
    ? {
        plugins: ['@prettier/plugin-ruby'],

        // rubyArrayLiteral: true,
        // rubyHashLabel: true,
        // rubyModifier: true,
        rubySingleQuote: true,
        // rubyToProc: false,
        // rubyPlugins: ['plugin/single_quotes'],
      }
    : {},
};

/** @type {import('prettier').Options} */
module.exports = deepmerge.all([
  {},
  ...Object.entries(option_sets).map(([_, v]) => v),
]);

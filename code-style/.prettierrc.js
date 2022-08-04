// https://prettier.io/docs/en/options.html

const exec = require('child_process').exec;

const is_prettier_gem_installed = exec('gem list -i prettier') === 'true';

const general = {
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
  // useTabs: // configured in .editorconfig->indent_size
  // tabWidth: // configured in .editorconfig->indent_style
  // endOfLine: // configured in .editorconfig->end_of_line
};

const html = {
  htmlWhitespaceSensitivity: 'css', // prettier default
};

const jsx = {
  jsxSingleQuote: false, // prettier default
};

const vue = {
  vueIndentScriptAndStyle: false, // prettier default
};

const ruby = {
  rubyArrayLiteral: true,
  rubyHashLabel: true,
  rubyModifier: true,
  rubySingleQuote: true,
  rubyToProc: false,
};

module.exports = {
  ...general,
  ...html,
  ...jsx,
  ...vue,
};

if (is_prettier_gem_installed) {
  module.exports = {
    ...module.exports,
    ...ruby,
  };
}

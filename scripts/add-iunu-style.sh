#!/usr/bin/env bash

# configure editorconfig
if [ ! -f .editorconfig ]; then
  ln -s node_modules/@iunu/code-style/.editorconfig .editorconfig;
  echo "Symlinked .editorconfig";
else
  echo ".editorconfig already exists";
fi

# configure prettier
if [ ! -f .prettierrc ]; then
  cp node_modules/@iunu/code-style/examples/.prettierrc .
  echo "Created .prettierrc";
else
  echo ".prettierrc already exists";
fi

# configure eslint
if [ ! -f .eslintrc.yaml ]; then
  cp node_modules/@iunu/code-style/examples/.eslintrc.yaml .
  echo "Created base .eslintrc.yaml";
  echo "You probably want to add a 'parserOptions.ecmaVersion' to match this project's target"
else
  echo ".eslintrc.yaml already exists";
fi

# configure stylelint
if [ ! -f .stylelintrc.json ]; then
  cp node_modules/@iunu/code-style/examples/.stylelintrc.json .
  echo "Created base .stylelintrc.json";
else
  echo ".stylelintrc.json already exists";
fi

# configure rubocop
if [ ! -f .rubocop.yml ]; then
  cp node_modules/@iunu/code-style/examples/.rubocop.yml .
  echo "Created base .rubocop.yml";
else
  echo ".rubocop.yml already exists";
fi

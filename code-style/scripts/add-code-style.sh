#!/usr/bin/env bash

editorconfig=true
prettier=true
eslint=true
stylelint=true
rubocop=true

overwrite=false

write_files () {
  # configure editorconfig
  if [ $editorconfig = true ] && ([ ! -f .editorconfig ] || [ $overwrite = true ]); then
    if [ $overwrite = true ]; then rm .editorconfig; fi;
    ln -s node_modules/@iunu-inc/code-style/.editorconfig .editorconfig;
    echo "Symlinked .editorconfig";
  else
    echo "Skipping editorconfig";
  fi

  # configure prettier
  if [ $prettier = true ] && ([ ! -f .prettierrc ] || [ $overwrite = true ]); then
    if [ $overwrite = true ]; then rm .prettierrc; fi;
    cp node_modules/@iunu-inc/code-style/examples/.prettierrc .;
    echo "Created .prettierrc";
  else
    echo "Skipping prettier";
  fi

  # configure eslint
  if [ $eslint = true ] && ([ ! -f .eslintrc.yml ] || [ $overwrite = true ]); then
    if [ $overwrite = true ]; then rm .eslintrc.yml; fi;
    cp node_modules/@iunu-inc/code-style/examples/.eslintrc.yml .;
    echo "Created base .eslintrc.yml";
    echo "You probably want to add a 'parserOptions.ecmaVersion' to match this project's target"
  else
    echo "Skipping eslint";
  fi

  # configure stylelint
  if [ $stylelint = true ] && ([ ! -f .stylelintrc.json ] || [ $overwrite = true ]); then
    if [ $overwrite = true ]; then rm .stylelintrc.json; fi;
    cp node_modules/@iunu-inc/code-style/examples/.stylelintrc.json .;
    echo "Created base .stylelintrc.json";
  else
    echo "Skipping stylelint";
  fi

  # configure rubocop
  if [ $rubocop = true ] && ([ ! -f .rubocop.yml ] || [ $overwrite = true ]); then
    if [ $overwrite = true ]; then rm .rubocop.yml; fi;
    cp node_modules/@iunu-inc/code-style/examples/.rubocop.yml .;
    echo "Created base .rubocop.yml";
  else
    echo "Skipping rubocop";
  fi
}

only_files () {
  editorconfig=false
  prettier=false
  eslint=false
  stylelint=false
  rubocop=false

  for f in $@; do
    set_file_toggle $f true
  done
}

skip_files () {
  for f in $@; do
    set_file_toggle $f false
  done
}

set_file_toggle () {
  case "$1" in
    editorconfig) editorconfig=$2;;
    prettier) prettier=$2;;
    eslint) eslint=$2;;
    stylelint) stylelint=$2;;
    rubocop) rubocop=$2;;
    *) echo "Unknown file '$1'"; exit 1;;
  esac
}

list_support_files () {
  echo -e "editorconfig prettier eslint stylelint rubocop"
}

help () {
  echo -e ""
  echo -e "Usage:\t$(basename $0) [OPTIONS]"
  echo -e ""
  echo -e "Options:"
  echo -e "   -o, --only \"[opts]\"  Only add the listed files"
  echo -e "   -s, --skip \"[opts]\"  Skip the listed files"
  echo -e "   -w, --overwrite      Overwrite config files that already exist"
  echo -e "   -l, --list           List supported configs"
  echo -e "   -h, --help           Show this message"
}

option_error () {
  echo "Unknown argument '$1'"
  help
  exit 128
}

main () {
  while getopts 'o:s:wlh-:' opt; do
    case "$opt" in
      o) only_files "$OPTARG";;
      s) skip_files "$OPTARG";;
      w) overwrite=true;;
      l) list_support_files; exit 0;;
      h) help; exit 0;;
      -)
        case "${OPTARG}" in
          only) only_files "$OPTARG";;
          skip) skip_files "$OPTARG";;
          overwrite) overwrite=true;;
          list) list_support_files; exit 0;;
          help) help; exit 0;;
          *) option_error "$OPTARG";;
        esac
        ;;
      *) option_error "$OPTARG";;
    esac
  done

  write_files
}

main "$@"

# IUNU Code Style Guide

A bunch of configuration files for code style standards. Intended to be shared across all IUNU's repos.

## Usage

### Add config files

```sh
npm i --save-dev @iunu-inc/code-style
npx add-code-style
```

### Consider adding some editor settings

-   VS Code

    ```json
    {
        "editor.formatOnSave": true,
        "editor.formatOnType": true,
        "editor.formatOnPaste": true,
        "typescript.format.enable": false,
        "javascript.format.enable": false,
        "editor.defaultFormatter": "esbenp.prettier-vscode",

        "[ruby]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
        }
    }
    ```

-   Vim
    ```vim
    let g:prettier#autoformat_config_present = 1
    let g:prettier#autoformat_require_pragma = 0
    ```

### Consider installing an editor plugin

This will automatically apply formatting to your files.

-   VS Code
    -   https://github.com/prettier/prettier-vscode
-   Vim
    -   https://github.com/prettier/vim-prettier

### Formatting a pre-existing project

1. Make sure you've got a clean working tree
1. Run Prettier

    ```sh
    prettier -w
    ```

1. Commit changes

    ````sh
    git add .
    git commit --author="Prettier (see commit msg) <software@iunu.com>" \
    -m "🎨 format with prettier (see message)" -m \
    'To see the original author of a line with `git blame`, use:

    ```sh
    git config blame.ignoreRevsFile .git-blame-ignore-revs
    ```

    This will configure git to ignore this commit when looking at history for `blame`.'
    ````

1. Add formatting commit hash to `.git-blame-ignore-revs`

    This makes `git blame` ignore the formatting commit so you can see the actual author of the line.

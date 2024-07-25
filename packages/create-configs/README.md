# @code-style/create-configs

A script to create configuration files to conform to code style standards.

## Usage

1. Create your config files.

    ```
    $ npm init @code-style/configs
    ```

1. Answer the prompted questions.

1. Verify settings match the type of project you're working on.

    ESLint in particular has a bunch of settings that will vary based on the type of project you're working on.

### Consider adding some editor settings

-   VS Code

    Handled by this script

-   Vim

    ```vim
    let g:prettier#autoformat_config_present = 1
    let g:prettier#autoformat_require_pragma = 0
    ```

### Consider installing editor plugins

This will automatically apply formatting and linting to your files as you work.

-   VS Code

    Handled by this script

-   Vim
    -   https://github.com/prettier/vim-prettier
    -   https://github.com/editorconfig/editorconfig-vim
    -   https://github.com/vim-syntastic/syntastic
-   IntelliJ IDEA
    -   https://www.jetbrains.com/help/idea/prettier.html
    -   https://www.jetbrains.com/help/idea/editorconfig.html
    -   https://www.jetbrains.com/help/idea/eslint.html
-   Sublime Text
    -   https://packagecontrol.io/packages/JsPrettier
    -   https://packagecontrol.io/packages/EditorConfig
    -   https://github.com/SublimeLinter/SublimeLinter-eslint

### Formatting a pre-existing project

If you'd like to maintain git-blame information, you can use the following method (with varying amounts of success):

1. Make sure you've got a clean working tree
1. Run Prettier

    ```sh
    prettier -w .
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

1. Commit `.git-blame-ignore-revs`

    ````sh
    git add .git-blame-ignore-revs
    git commit -m "🔧 add git-blame-ignore-revs" -m \
    'Run the following command to ignore the repo-wide prettier format

    ```sh
    git config blame.ignoreRevsFile .git-blame-ignore-revs
    ```'
    ````

1. Setup git to ignore the formatting commit

    ```sh
    git config blame.ignoreRevsFile .git-blame-ignore-revs
    ```

# @code-style/eslint-config-cli

My CLI project eslint config

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-cli
    ```

1. Add the plugin to your `eslintrc`.

    ```yaml
    extends:
        - '@code-style'
        - '@code-style/cli'
    ```

1. You might also want to specify an `ecmaVersion`.

    ```yaml
    parserOptions:
        ecmaVersion: 2022
    ```

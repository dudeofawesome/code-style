# @code-style/eslint-config-react

My React eslint config

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-react
    ```

1. Add the plugin to your `eslintrc`.

    ```yaml
    extends:
        - '@code-style'
        - '@code-style/react'
    ```

1. You might also want to specify an `ecmaVersion`.

    ```yaml
    parserOptions:
        ecmaVersion: 2022
    ```

# @code-style/eslint-config-jest

My Jest eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-jest
    ```

1. Add the plugin to your ESLint config.

    ```diff
     extends:
         - '@code-style/eslint-config'
    +    - '@code-style/eslint-config-jest'
    ```

    You'll also likely want to have some of my other ESLint configs for your environment.

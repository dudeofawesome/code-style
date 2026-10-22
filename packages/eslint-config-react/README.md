# @code-style/eslint-config-react

My React eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-react
    ```

1. Add the plugin to your ESLint config.

    ```diff
     import { config as base } from '@code-style/eslint-config';
    +import { config as react } from '@code-style/eslint-config-react';

    -export default defineConfig(base);
    +export default defineConfig(base, react);
    ```

    You'll also likely want to have some of my other ESLint configs for your environment.

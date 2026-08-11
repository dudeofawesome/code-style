# @code-style/eslint-config-cli

My CLI project eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-cli
    ```

1. Add the config to your `eslint.config.mjs`.

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import node from '@code-style/eslint-config-node';
    import cli from '@code-style/eslint-config-cli';

    export default defineConfig(base, node, cli);
    ```

    > **Layering order matters:** this config relies on `@code-style/eslint-config-node` being layered before it.

    You'll also likely want to have some of my other ESLint configs for your environment.

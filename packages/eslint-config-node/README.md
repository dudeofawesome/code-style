# @code-style/eslint-config-node

My node eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-node
    ```

1. Add the config to your `eslint.config.mjs`.

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import node from '@code-style/eslint-config-node';

    export default defineConfig(base, node);
    ```

    You'll also likely want to have some of my other ESLint configs for your environment.

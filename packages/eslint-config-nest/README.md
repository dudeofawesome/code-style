# @code-style/eslint-config-nest

My NestJS eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-nest
    ```

1. Add the config to your `eslint.config.mjs`.

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import node from '@code-style/eslint-config-node';
    import typescript from '@code-style/eslint-config-typescript';
    import nest from '@code-style/eslint-config-nest';

    export default defineConfig(base, node, typescript, nest);
    ```

    You'll also likely want to have some of my other ESLint configs for your environment.

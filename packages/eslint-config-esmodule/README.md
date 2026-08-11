# @code-style/eslint-config-esmodule

My ES Module eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-esmodule
    ```

1. Add the config to your `eslint.config.mjs`.

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import esmodule from '@code-style/eslint-config-esmodule';

    export default defineConfig(base, esmodule);
    ```

    > **Layering order matters:** this config must be layered after `@code-style/eslint-config` (it re-enables the ESM syntax that the base config bans).

    You'll also likely want to have some of my other ESLint configs for your environment.

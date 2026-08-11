# @code-style/eslint-config-nextjs

My Next.JS eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-nextjs
    ```

1. Add the config to your `eslint.config.mjs`.

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import browser from '@code-style/eslint-config-browser';
    import esmodule from '@code-style/eslint-config-esmodule';
    import react from '@code-style/eslint-config-react';
    import nextjs from '@code-style/eslint-config-nextjs';

    export default defineConfig(base, browser, esmodule, react, nextjs);
    ```

    > **Layering order matters:** this config must be layered after `@code-style/eslint-config` and `@code-style/eslint-config-react`.

    You'll also likely want to have some of my other ESLint configs for your environment.

# @code-style/eslint-config-nextjs

My Next.JS eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-nextjs
    ```

1. Add the plugin to your ESLint config.

    ```diff
     import { config as base } from '@code-style/eslint-config';
    +import { config as nextjs } from '@code-style/eslint-config-nextjs';

    -export default defineConfig(base);
    +export default defineConfig(base, nextjs);
    ```

    You'll also likely want to have some of my other ESLint configs for your environment.

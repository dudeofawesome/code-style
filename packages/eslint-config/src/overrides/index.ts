import type { Linter } from 'eslint';

import json from './json.js';
import testing from './testing.js';

const config: Linter.Config[] = [...json, ...testing];

export default config;

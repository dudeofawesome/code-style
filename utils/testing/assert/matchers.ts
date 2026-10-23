import { expect } from '@jest/globals';

import { areSetsEqual } from './set-matcher.js';

expect.addEqualityTesters([areSetsEqual]);

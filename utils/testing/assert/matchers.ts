import { expect } from '@jest/globals';

import { areSetsEqual } from './set-matcher';

expect.addEqualityTesters([areSetsEqual]);

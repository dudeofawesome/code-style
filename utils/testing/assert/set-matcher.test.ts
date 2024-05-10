import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import { areSetsEqual } from './set-matcher';

void describe('set-matcher', () => {
  void describe(areSetsEqual.name, () => {
    void it(`should pass with empty sets`, () => {
      strictEqual(areSetsEqual(new Set(), new Set()), true);
      strictEqual(areSetsEqual(new Set(), []), true);
      strictEqual(areSetsEqual([], new Set()), true);
      strictEqual(areSetsEqual([], []), true);
    });

    void it(`should pass matching sets`, () => {
      strictEqual(areSetsEqual(new Set([1, 2, 3]), new Set([1, 2, 3])), true);
      strictEqual(
        areSetsEqual(new Set([true, false]), new Set([true, false])),
        true,
      );
      strictEqual(
        areSetsEqual(new Set(['a', 'b', 'c']), new Set(['a', 'b', 'c'])),
        true,
      );
      strictEqual(areSetsEqual(new Set([]), new Set([])), true);
    });

    void it(`should fail matching sets`, () => {
      strictEqual(areSetsEqual(new Set([1]), new Set([])), false);
      strictEqual(areSetsEqual(new Set([1]), new Set([1, 2])), false);
      strictEqual(areSetsEqual(new Set([1]), new Set(['1'])), false);
    });

    void it(`should signal unhandled comparison for non-sets`, () => {
      strictEqual(areSetsEqual(true, true), undefined);
      strictEqual(areSetsEqual(true, false), undefined);
    });
  });
});

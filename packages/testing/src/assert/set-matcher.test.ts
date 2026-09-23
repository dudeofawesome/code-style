import { describe, it, expect } from '@jest/globals';

import { areSetsEqual } from './set-matcher.js';

describe('set-matcher', () => {
  describe(areSetsEqual.name, () => {
    it(`should pass with empty sets`, () => {
      expect(areSetsEqual(new Set(), new Set())).toBe(true);
      expect(areSetsEqual(new Set(), [])).toBe(true);
      expect(areSetsEqual([], new Set())).toBe(true);
      expect(areSetsEqual([], [])).toBe(true);
    });

    it(`should pass matching sets`, () => {
      expect(areSetsEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
      expect(areSetsEqual(new Set([true, false]), new Set([true, false]))).toBe(
        true,
      );
      expect(
        areSetsEqual(new Set(['a', 'b', 'c']), new Set(['a', 'b', 'c'])),
      ).toBe(true);
      expect(areSetsEqual(new Set([]), new Set([]))).toBe(true);
    });

    it(`should fail matching sets`, () => {
      expect(areSetsEqual(new Set([1]), new Set([]))).toBe(false);
      expect(areSetsEqual(new Set([1]), new Set([1, 2]))).toBe(false);
      expect(areSetsEqual(new Set([1]), new Set(['1']))).toBe(false);
    });

    it(`should signal unhandled comparison for non-sets`, () => {
      expect(areSetsEqual(true, true)).toBeUndefined();
      expect(areSetsEqual(true, false)).toBeUndefined();
    });
  });
});

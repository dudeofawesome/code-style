import type { Tester } from '@jest/expect-utils';

type SimpleTester = (a: unknown, b: unknown) => ReturnType<Tester>;

export const areSetsEqual: SimpleTester = function areSetsEqual(
  a: unknown,
  b: unknown,
): boolean | undefined {
  if (
    (!(a instanceof Set) && !Array.isArray(a)) ||
    (!(b instanceof Set) && !Array.isArray(b))
  ) {
    return undefined;
  }

  const one = Array.from(a);
  const two = Array.from(b);

  if (one.length !== two.length) {
    return false;
  }

  for (const entry of one) {
    const i = two.findIndex((e) => e === entry);
    if (i === -1) {
      return false;
    }
    two.splice(i, 1);
  }

  if (two.length !== 0) {
    return false;
  }

  return true;
};

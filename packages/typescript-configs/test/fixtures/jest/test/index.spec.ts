import { describe, it, expect } from '@jest/globals';
import { foo } from '../src/index';

describe('foo', () => {
  it('should be bar', () => {
    expect(foo()).toBe('bar');
  });
});

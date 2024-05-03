import { describe, it } from 'node:test';
import { doesNotReject, match, equal } from 'node:assert';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { find_node_modules_path, path_exists } from './path';

void describe('path', () => {
  void describe('find_node_modules_path', () => {
    void it(`should find the node_modules dir`, async () => {
      const prom = find_node_modules_path();
      await doesNotReject(prom);
      match(await prom, /node_modules$/u);
    });
  });

  void describe('path_exists', () => {
    void it(`should show that cwd exists`, async () => {
      const prom = path_exists(cwd());
      await doesNotReject(prom);
      equal(await prom, true);
    });
    void it(`should show that a non-existint file doesn't exist`, async () => {
      const prom = path_exists(join(cwd(), 'this-is-not-a-thing'));
      await doesNotReject(prom);
      equal(await prom, false);
    });
  });
});

import type { expect as bunExpect, test as bunTest } from "bun:test";
// node:test is too much barebones
import type { expect as vitestExpect, test as vitestTest } from "vitest";

let describe: (name: string, fn: () => void) => void;
let test: typeof bunTest | typeof vitestTest;
let expect: typeof bunExpect | typeof vitestExpect;

if (globalThis.Bun != undefined) {
  const bunTestRunner = await import("bun:test");

  describe = bunTestRunner.describe;
  test = bunTestRunner.test;
  expect = bunTestRunner.expect;
} else {
  const vitestRunner = await import("vitest");

  vitestRunner.expect.extend({
    toContainAllValues(received: unknown[], expected: unknown[]) {
      return {
        pass: this.equals(received, vitestRunner.expect.arrayContaining(expected)),
        message: () =>
          `expected ${this.utils.printReceived(received)}${this.isNot ? " not" : ""} to contain all values in ${this.utils.printExpected(expected)}`,
        actual: received,
        expected,
      };
    },
  });

  describe = vitestRunner.describe;
  test = vitestRunner.test;
  expect = vitestRunner.expect;
}

export { test, describe, expect };

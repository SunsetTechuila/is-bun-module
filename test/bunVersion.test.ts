import { test, expect, describe } from "bun:test";

import { isBunModule, isBunImplementedNodeModule, isBunBuiltin } from "is-bun-module";

describe("Bun version parsing", () => {
  test("Throw if lower than minimum", () => {
    expect(() => isBunModule("bun", "0.0.0")).toThrow();
    expect(() => isBunImplementedNodeModule("fs", "0.0.0")).toThrow();
    expect(() => isBunBuiltin("bun", "0.0.0")).toThrow();
    expect(() => isBunBuiltin("fs", "0.0.0")).toThrow();
  });

  test("Not throw if a valid semver", () => {
    expect(() => isBunModule("bun", "1.0.0")).not.toThrow();
    expect(() => isBunImplementedNodeModule("fs", "1.0.0")).not.toThrow();
    expect(() => isBunBuiltin("bun", "1.0.0")).not.toThrow();
    expect(() => isBunBuiltin("fs", "1.0.0")).not.toThrow();
    expect(() => isBunModule("bun", "1.1.28-debug")).not.toThrow();
    expect(() => isBunImplementedNodeModule("fs", "1.1.28-debug")).not.toThrow();
    expect(() => isBunBuiltin("bun", "1.1.28-debug")).not.toThrow();
    expect(() => isBunBuiltin("fs", "1.1.28-debug")).not.toThrow();
  });

  test("Throw if an invalid semver", () => {
    // @ts-expect-error Testing invalid input
    expect(() => isBunModule("bun", "foo")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunImplementedNodeModule("fs", "bar")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunBuiltin("bun", "foo")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunBuiltin("fs", "bar")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunModule("bun", "1.1.1.1")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunImplementedNodeModule("fs", "1.1.1.1")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunBuiltin("bun", "1.1.1.1")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunBuiltin("fs", "1.1.1.1")).toThrow();
  });

  test("Can detect if not provided", () => {
    expect(() => isBunModule("bun")).not.toThrow();
    expect(() => isBunImplementedNodeModule("fs")).not.toThrow();
    expect(() => isBunBuiltin("bun")).not.toThrow();
    expect(() => isBunBuiltin("fs")).not.toThrow();
  });

  test('Not throw if "latest"', () => {
    expect(() => isBunModule("bun", "latest")).not.toThrow();
    expect(() => isBunImplementedNodeModule("fs", "latest")).not.toThrow();
    expect(() => isBunBuiltin("bun", "latest")).not.toThrow();
    expect(() => isBunBuiltin("fs", "latest")).not.toThrow();
  });
});

import { test, expect, describe } from "bun:test";

import { isBunModule, isSupportedNodeModule } from "@self";

describe("Bun version parsing", () => {
  test("Throw if lower than minimum", () => {
    expect(() => isBunModule("bun", "0.0.0")).toThrow();
    expect(() => isSupportedNodeModule("fs", "0.0.0")).toThrow();
  });

  test("Not throw if a valid semver", () => {
    expect(() => isBunModule("bun", "1.0.0")).not.toThrow();
    expect(() => isSupportedNodeModule("fs", "1.0.0")).not.toThrow();
    expect(() => isBunModule("bun", "1.1.28-debug")).not.toThrow();
    expect(() => isSupportedNodeModule("fs", "1.1.28-debug")).not.toThrow();
  });

  test("Throw if an invalid semver", () => {
    // @ts-expect-error Testing invalid input
    expect(() => isBunModule("bun", "foo")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isSupportedNodeModule("fs", "bar")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isBunModule("bun", "1.1.1.1")).toThrow();
    // @ts-expect-error Testing invalid input
    expect(() => isSupportedNodeModule("fs", "1.1.1.1")).toThrow();
  });

  test("Can detect if not provided", () => {
    expect(() => isBunModule("bun")).not.toThrow();
    expect(() => isSupportedNodeModule("fs")).not.toThrow();
  });

  test('Not throw if "latest"', () => {
    expect(() => isBunModule("bun", "latest")).not.toThrow();
    expect(() => isSupportedNodeModule("fs", "latest")).not.toThrow();
  });
});

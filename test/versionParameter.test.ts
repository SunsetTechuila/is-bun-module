import { test, expect, describe } from "bun:test";

import { isBunModule, isSupportedNodeModule } from "src";

describe("Version parameter parsing", () => {
  test("Throw if lower than minimum", () => {
    expect(() => isBunModule("bun", "0.0.0")).toThrow();
    expect(() => isSupportedNodeModule("fs", "0.0.0")).toThrow();
  });

  test("Not throw if not provided", () => {
    expect(() => isBunModule("bun")).not.toThrow();
    expect(() => isSupportedNodeModule("fs")).not.toThrow();
  });

  test('Not throw if "latest"', () => {
    expect(() => isBunModule("bun", "latest")).not.toThrow();
    expect(() => isSupportedNodeModule("fs", "latest")).not.toThrow();
  });
});

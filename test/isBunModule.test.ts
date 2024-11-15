import { test, expect, describe } from "bun:test";

import { isBunModule } from "is-bun-module";

describe("Bun modules checking", () => {
  test("Return true for bun", () => {
    expect(isBunModule("bun")).toBe(true);
    expect(isBunModule("bun:test")).toBe(true);
  });

  test("Return false for non-bun", () => {
    expect(isBunModule("node:fs")).toBe(false);
    expect(isBunModule("fs")).toBe(false);
    expect(isBunModule("bun:not-bun")).toBe(false);
  });
});

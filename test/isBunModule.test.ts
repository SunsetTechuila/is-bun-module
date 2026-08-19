import { test, expect, describe } from "./testRunner";

import { isBunModule } from "is-bun-module";

describe("Bun modules checking", () => {
  test("Return true for bun", () => {
    expect(isBunModule("bun")).toBe(true);
    expect(isBunModule("bun:test")).toBe(true);
    expect(isBunModule("bun:bundle", "1.3.5")).toBe(true);
    expect(isBunModule("bun:bundle", "latest")).toBe(true);
  });

  test("Return false for non-bun", () => {
    expect(isBunModule("node:fs")).toBe(false);
    expect(isBunModule("fs")).toBe(false);
    expect(isBunModule("bun:not-bun")).toBe(false);
    expect(isBunModule("bun:bundle", "1.3.4")).toBe(false);
  });
});

import { test, expect, describe } from "bun:test";

import { isBunBuiltin } from "is-bun-module";

describe("Bun built-ins checking", () => {
  test("Return true for bun modules", () => {
    expect(isBunBuiltin("bun")).toBe(true);
    expect(isBunBuiltin("bun:test")).toBe(true);
  });

  test("Return true for implemented node modules", () => {
    expect(isBunBuiltin("fs")).toBe(true);
    expect(isBunBuiltin("node:fs")).toBe(true);
    expect(isBunBuiltin("http2", "1.0.13")).toBe(true);
    expect(isBunBuiltin("node:http2", "1.0.13")).toBe(true);
  });

  test("Return false for non-node/not implemented", () => {
    expect(isBunBuiltin("node:bun")).toBe(false);
    expect(isBunBuiltin("node:http2", "1.0.0")).toBe(false);
    expect(isBunBuiltin("http2", "1.0.0")).toBe(false);
  });
});

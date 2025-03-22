import { test, expect, describe } from "bun:test";

import { isBunImplementedNodeModule } from "is-bun-module";

describe("Implemented Node modules checking", () => {
  test("Return true for implemented node modules", () => {
    expect(isBunImplementedNodeModule("fs")).toBe(true);
    expect(isBunImplementedNodeModule("node:fs")).toBe(true);
    expect(isBunImplementedNodeModule("http2", "1.0.13")).toBe(true);
    expect(isBunImplementedNodeModule("node:http2", "1.0.13")).toBe(true);
  });

  test("Return false for non-node/not implemented modules", () => {
    expect(isBunImplementedNodeModule("bun")).toBe(false);
    expect(isBunImplementedNodeModule("node:bun")).toBe(false);
    expect(isBunImplementedNodeModule("node:http2", "1.0.0")).toBe(false);
    expect(isBunImplementedNodeModule("http2", "1.0.0")).toBe(false);
  });
});

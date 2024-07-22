import { test, expect, describe } from "bun:test";

import { isSupportedNodeModule } from "@self";

describe("Supported Node modules checking", () => {
  test("Return true for supported node", () => {
    expect(isSupportedNodeModule("fs")).toBe(true);
    expect(isSupportedNodeModule("node:fs")).toBe(true);
    expect(isSupportedNodeModule("http2", "1.0.13")).toBe(true);
    expect(isSupportedNodeModule("node:http2", "1.0.13")).toBe(true);
  });

  test("Return false for non-node/not supported", () => {
    expect(isSupportedNodeModule("bun")).toBe(false);
    expect(isSupportedNodeModule("node:bun")).toBe(false);
    expect(isSupportedNodeModule("node:http2", "1.0.0")).toBe(false);
    expect(isSupportedNodeModule("http2", "1.0.0")).toBe(false);
  });
});

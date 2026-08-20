import { test, expect, describe } from "./testRunner";

import { isBunImplementedNodeModule } from "is-bun-module";

describe("Implemented Node modules checking", () => {
  test("Return true for implemented node modules", () => {
    expect(isBunImplementedNodeModule("fs")).toBe(true);
    expect(isBunImplementedNodeModule("node:fs")).toBe(true);
    expect(isBunImplementedNodeModule("http2", "1.0.13")).toBe(true);
    expect(isBunImplementedNodeModule("node:http2", "1.0.13")).toBe(true);
    expect(isBunImplementedNodeModule("node:test", "1.2.6")).toBe(true);
    expect(isBunImplementedNodeModule("_tls_wrap", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("async_hooks", "1.0.0")).toBe(true);
  });

  test("Return false for non-node/not implemented modules", () => {
    expect(isBunImplementedNodeModule("bun")).toBe(false);
    expect(isBunImplementedNodeModule("node:bun")).toBe(false);
    expect(isBunImplementedNodeModule("node:http2", "1.0.0")).toBe(false);
    expect(isBunImplementedNodeModule("http2", "1.0.0")).toBe(false);
    expect(isBunImplementedNodeModule("node:test", "1.2.5")).toBe(false);
    expect(isBunImplementedNodeModule("_tls_wrap", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("async_hooks/async_context", "1.0.0")).toBe(false);
  });

  test("Return false for unprefixed names of modules with mandatory prefix", () => {
    expect(isBunImplementedNodeModule("sqlite", "latest")).toBe(false);
    expect(isBunImplementedNodeModule("quic", "latest")).toBe(false);
    expect(isBunImplementedNodeModule("test", "latest")).toBe(false);
  });
});

import { test, expect, describe } from "./testRunner";

import { isBunImplementedNodeModule } from "is-bun-module";

describe("Implemented Node modules checking", () => {
  test("Return true for implemented node modules", () => {
    expect(isBunImplementedNodeModule("fs")).toBe(true);
    expect(isBunImplementedNodeModule("node:fs")).toBe(true);
    expect(isBunImplementedNodeModule("http2", "1.0.13")).toBe(true);
    expect(isBunImplementedNodeModule("node:http2", "1.0.13")).toBe(true);
    expect(isBunImplementedNodeModule("node:test", "1.2.6")).toBe(true);
    expect(isBunImplementedNodeModule("_stream_readable", "1.1.45")).toBe(true);
    expect(isBunImplementedNodeModule("node:_stream_readable", "1.1.45")).toBe(true);
    expect(isBunImplementedNodeModule("_http_agent", "1.2.11")).toBe(true);
    expect(isBunImplementedNodeModule("node:_http_agent", "1.2.11")).toBe(true);
    expect(isBunImplementedNodeModule("inspector", "1.3.7")).toBe(true);
    expect(isBunImplementedNodeModule("node:inspector", "1.3.7")).toBe(true);
    expect(isBunImplementedNodeModule("node:inspector/promises", "1.3.7")).toBe(true);
    expect(isBunImplementedNodeModule("_tls_wrap", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("node:_tls_common", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("repl", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("node:repl", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("trace_events", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("node:trace_events", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("node:sqlite", "1.4.0")).toBe(true);
    expect(isBunImplementedNodeModule("node:quic", "1.4.0")).toBe(true);
  });

  test("Return false for non-node/not implemented modules", () => {
    expect(isBunImplementedNodeModule("bun")).toBe(false);
    expect(isBunImplementedNodeModule("node:bun")).toBe(false);
    expect(isBunImplementedNodeModule("node:http2", "1.0.0")).toBe(false);
    expect(isBunImplementedNodeModule("http2", "1.0.0")).toBe(false);
    expect(isBunImplementedNodeModule("test", "1.2.6")).toBe(false);
    expect(isBunImplementedNodeModule("node:sea", "latest")).toBe(false);
    expect(isBunImplementedNodeModule("async_hooks/async_context", "latest")).toBe(false);
  });

  test("Return false for modules implemented in a later Bun version", () => {
    expect(isBunImplementedNodeModule("_stream_readable", "1.1.44")).toBe(false);
    expect(isBunImplementedNodeModule("node:_stream_readable", "1.1.44")).toBe(false);
    expect(isBunImplementedNodeModule("_http_agent", "1.2.10")).toBe(false);
    expect(isBunImplementedNodeModule("node:_http_agent", "1.2.10")).toBe(false);
    expect(isBunImplementedNodeModule("inspector", "1.3.6")).toBe(false);
    expect(isBunImplementedNodeModule("node:inspector", "1.3.6")).toBe(false);
    expect(isBunImplementedNodeModule("_tls_wrap", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("node:_tls_common", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("repl", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("node:repl", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("trace_events", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("node:trace_events", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("node:sqlite", "1.3.14")).toBe(false);
    expect(isBunImplementedNodeModule("node:quic", "1.3.14")).toBe(false);
  });

  test("Return false for unprefixed names of modules Bun resolves only with the node: prefix", () => {
    expect(isBunImplementedNodeModule("sqlite", "latest")).toBe(false);
    expect(isBunImplementedNodeModule("quic", "latest")).toBe(false);
    expect(isBunImplementedNodeModule("test", "latest")).toBe(false);
  });
});

import { describe, expect, test } from "vitest";

import bundledBunModules from "@src/modules/bun";
import bundledNodeModules from "@src/modules/node";

import {
  getBunModules,
  getBunImplementedNodeModules,
  getBunBuiltinModules,
  isBunModule,
  isBunImplementedNodeModule,
  isBunBuiltin,
} from "is-bun-module";

describe("Module lists checking", () => {
  const bunModulesList = Object.keys(bundledBunModules);
  const nodeModulesList = Object.keys(bundledNodeModules);
  const builtinModulesList = [...bunModulesList, ...nodeModulesList];

  test("getBunModules('latest') equals keys of bun-modules.json", () => {
    expect(getBunModules("latest")).toEqual(expect.arrayContaining(bunModulesList));
  });
  test("getBunModules() returns only bun modules", () => {
    getBunModules().forEach((moduleName) => {
      expect(isBunModule(moduleName)).toBe(true);
    });
  });

  test("getBunImplementedNodeModules('latest') equals keys of implemented-node-modules.json", () => {
    expect(getBunImplementedNodeModules("latest")).toEqual(expect.arrayContaining(nodeModulesList));
  });
  test("getBunImplementedNodeModules() returns only node modules", () => {
    getBunImplementedNodeModules().forEach((moduleName) => {
      expect(isBunImplementedNodeModule(moduleName)).toBe(true);
    });
  });
  test("getBunImplementedNodeModules() doesn't return not implemented node modules", () => {
    expect(getBunImplementedNodeModules("1.0.0")).not.toContain("http2");
  });

  test("getBunBuiltinModules('latest') equals keys of implemented-node-modules.json && bun-modules.json", () => {
    expect(getBunBuiltinModules("latest")).toEqual(expect.arrayContaining(builtinModulesList));
  });
  test("getBunBuiltinModules() returns only built-in modules", () => {
    getBunBuiltinModules().forEach((moduleName) => {
      expect(isBunBuiltin(moduleName)).toBe(true);
    });
  });
});

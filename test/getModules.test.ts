import { test, expect, describe } from "bun:test";
import bundledBunModules from "@assets/bun-modules.json";
import bundledNodeModules from "@assets/implemented-node-modules.json";

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

  test("getBunModules() equals keys of bun-modules.json", () => {
    expect(getBunModules()).toContainAllValues(bunModulesList);
  });
  test("getBunModules() returns only bun modules", () => {
    getBunModules().forEach((moduleName) => {
      expect(isBunModule(moduleName)).toBe(true);
    });
  });

  test("getBunImplementedNodeModules() equals keys of implemented-node-modules.json", () => {
    expect(getBunImplementedNodeModules()).toContainAllValues(nodeModulesList);
  });
  test("getBunImplementedNodeModules() returns only node modules", () => {
    getBunImplementedNodeModules().forEach((moduleName) => {
      expect(isBunImplementedNodeModule(moduleName)).toBe(true);
    });
  });
  test("getBunImplementedNodeModules() doesn't return not implemented node modules", () => {
    expect(getBunImplementedNodeModules("1.0.0")).not.toContain("http2");
  });

  test("getBunBuiltinModules() equals keys of implemented-node-modules.json && bun-modules.json", () => {
    expect(getBunBuiltinModules()).toContainAllValues(builtinModulesList);
  });
  test("getBunBuiltinModules() returns only built-in modules", () => {
    getBunBuiltinModules().forEach((moduleName) => {
      expect(isBunBuiltin(moduleName)).toBe(true);
    });
  });
});

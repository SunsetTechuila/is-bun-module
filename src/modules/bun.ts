import { parseRange } from "verkit";

import type { Modules, VersionRange } from ".";

export const CURRENT_BUN_VERSION = globalThis.Bun?.version as string | undefined;

const BUN_MODULES = new Map<string, VersionRange>([
  ["bun", true],
  ["bun:bundle", parseRange(">= 1.3.5")],
  ["bun:ffi", true],
  ["bun:jsc", true],
  ["bun:sqlite", true],
  ["bun:test", true],
  ["bun:wrap", true],
]) satisfies Modules;

// don't do the same with node modules because `builtinModules` in bun contains even not implemented node modules
if (CURRENT_BUN_VERSION) {
  const { builtinModules } = require("node:module");
  for (const moduleName of builtinModules) {
    if (moduleName.startsWith("bun:") && !BUN_MODULES.has(moduleName)) {
      BUN_MODULES.set(moduleName, parseRange(`>=${CURRENT_BUN_VERSION}`));
    }
  }
}

export default BUN_MODULES;

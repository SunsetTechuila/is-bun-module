import { builtinModules } from "node:module";

import { checkModule, getModules, bundledBunModules, implementedNodeModules } from "./shared";
import type { BunVersion, Modules } from "./shared";

export type { BunVersion };
export { MINIMUM_BUN_VERSION } from "./shared";

const currentBunVersion = Bun.version as BunVersion;

const bunModules = { ...bundledBunModules } as Modules;
// don't do the same with node modules because `builtinModules` in bun contains even not implemented node modules
for (const moduleName of builtinModules) {
  if (moduleName.startsWith("bun:")) {
    bunModules[moduleName] ??= `>=${currentBunVersion}`;
  }
}

export function isBunModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, bunModules, bunVersion ?? currentBunVersion);
}

export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, implementedNodeModules, bunVersion ?? currentBunVersion);
}

export function isBunBuiltin(moduleName: string, bunVersion?: BunVersion): boolean {
  return isBunModule(moduleName, bunVersion) || isBunImplementedNodeModule(moduleName, bunVersion);
}

export function getBunModules(bunVersion?: BunVersion): string[] {
  return getModules(bunModules, bunVersion ?? currentBunVersion);
}

export function getBunImplementedNodeModules(bunVersion?: BunVersion): string[] {
  return getModules(implementedNodeModules, bunVersion ?? currentBunVersion);
}

export function getBunBuiltinModules(bunVersion?: BunVersion): string[] {
  return [...getBunModules(bunVersion), ...getBunImplementedNodeModules(bunVersion)];
}

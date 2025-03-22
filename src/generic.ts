import { checkModule, getModules, bundledBunModules, implementedNodeModules } from "./shared";
import type { BunVersion } from "./shared";

export type { BunVersion };
export { MINIMUM_BUN_VERSION } from "./shared";

export function isBunModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, bundledBunModules, bunVersion ?? "latest");
}

export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, implementedNodeModules, bunVersion ?? "latest");
}

export function isBunBuiltin(moduleName: string, bunVersion?: BunVersion): boolean {
  return isBunModule(moduleName, bunVersion) || isBunImplementedNodeModule(moduleName, bunVersion);
}

export function getBunModules(bunVersion?: BunVersion): string[] {
  return getModules(bundledBunModules, bunVersion ?? "latest");
}

export function getBunImplementedNodeModules(bunVersion?: BunVersion): string[] {
  return getModules(implementedNodeModules, bunVersion ?? "latest");
}

export function getBunBuiltinModules(bunVersion?: BunVersion): string[] {
  return [...getBunModules(bunVersion), ...getBunImplementedNodeModules(bunVersion)];
}

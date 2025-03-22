import { checkModule, getModules, bundledBunModules, implementedNodeModules } from "./shared";
import type { BunVersion } from "./shared";

export type { BunVersion };
export { MINIMUM_BUN_VERSION } from "./shared";

/**
 * Checks if the given module name is a native Bun module.
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Bun module, `false` otherwise
 */
export function isBunModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, bundledBunModules, bunVersion ?? "latest");
}

/**
 * Checks if the given module name is a Node.js module implemented in Bun.
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Node.js module implemented in Bun, `false` otherwise
 */
export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, implementedNodeModules, bunVersion ?? "latest");
}

/**
 * Checks if the given module name is a Bun builtin (either a Bun module or a Node.js module implemented in Bun).
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Bun builtin, `false` otherwise
 */
export function isBunBuiltin(moduleName: string, bunVersion?: BunVersion): boolean {
  return isBunModule(moduleName, bunVersion) || isBunImplementedNodeModule(moduleName, bunVersion);
}

/**
 * Gets a list of all native Bun modules.
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunModules(bunVersion?: BunVersion): string[] {
  return getModules(bundledBunModules, bunVersion ?? "latest");
}

/**
 * Gets a list of all Node.js modules implemented in Bun.
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunImplementedNodeModules(bunVersion?: BunVersion): string[] {
  return getModules(implementedNodeModules, bunVersion ?? "latest");
}

/**
 * Gets a list of all Bun builtin modules (both Bun modules and Node.js modules implemented in Bun).
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunBuiltinModules(bunVersion?: BunVersion): string[] {
  return [...getBunModules(bunVersion), ...getBunImplementedNodeModules(bunVersion)];
}

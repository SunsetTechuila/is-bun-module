import valid from "semver/functions/valid";
import satisfies from "semver/functions/satisfies";
import lt from "semver/functions/lt";

import bundledBunModules from "@assets/bun-modules.json";
import implementedNodeModules from "@assets/implemented-node-modules.json";

type VersionRange = string | boolean;
type Modules = Record<string, VersionRange>;

type SemVerBaseStringified = `${bigint}.${bigint}.${bigint}`;
type SemVerStringifiedWithReleaseName = `${SemVerBaseStringified}-${string}`;
type SemVerStringified = SemVerBaseStringified | SemVerStringifiedWithReleaseName;
export type BunVersion = SemVerStringified | "latest";

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerBaseStringified;

// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const currentBunVersion = (globalThis.Bun?.version ?? "latest") as BunVersion;

const bunModules = { ...bundledBunModules } as Modules;
if (currentBunVersion !== "latest") {
  // don't do the same with node modules because `builtinModules` in bun contains even not implemented node modules
  const { builtinModules } = require("node:module");
  for (const moduleName of builtinModules) {
    if (moduleName.startsWith("bun:")) {
      bunModules[moduleName] ??= `>=${currentBunVersion}`;
    }
  }
}

/**
 * Checks if the given module name is a native Bun module.
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Bun module, `false` otherwise
 */
export function isBunModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, bunModules, bunVersion);
}

/**
 * Checks if the given module name is a Node.js module implemented in Bun.
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Node.js module implemented in Bun, `false` otherwise
 */
export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, implementedNodeModules, bunVersion);
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
  return getModules(bunModules, bunVersion);
}

/**
 * Gets a list of all Node.js modules implemented in Bun.
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunImplementedNodeModules(bunVersion?: BunVersion): string[] {
  return getModules(implementedNodeModules, bunVersion);
}

/**
 * Gets a list of all Bun builtin modules (both Bun modules and Node.js modules implemented in Bun).
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunBuiltinModules(bunVersion?: BunVersion): string[] {
  return [...getBunModules(bunVersion), ...getBunImplementedNodeModules(bunVersion)];
}

function checkModule(moduleName: string, modules: Modules, bunVersion?: BunVersion): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  if (!Object.hasOwn(modules, moduleName)) return false;
  const targetBunVersion = normalizeBunVersion(bunVersion);
  return satisfiesVersionRange(targetBunVersion, modules[moduleName]!);
}

function getModules(modules: Modules, bunVersion?: BunVersion): string[] {
  const targetBunVersion = normalizeBunVersion(bunVersion);
  return Object.keys(modules).filter((moduleName) => {
    return satisfiesVersionRange(targetBunVersion, modules[moduleName]!);
  });
}

function satisfiesVersionRange(version: SemVerStringified, versionRange: VersionRange): boolean {
  if (typeof versionRange === "boolean") return versionRange;
  return satisfies(version, versionRange);
}

function normalizeBunVersion(version = currentBunVersion): SemVerStringified {
  if (typeof version !== "string") throw new TypeError("Bun version must be a string");
  if (version === "latest") return "999.999.999";
  if (!valid(version)) throw new TypeError("Bun version must be a string like '1.0.0' or 'latest'");
  if (lt(version, MINIMUM_BUN_VERSION)) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_VERSION}`);
  }
  return version;
}

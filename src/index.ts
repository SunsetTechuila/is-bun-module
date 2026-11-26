import { SemVer, satisfies } from "semver";

import bunModules from "@assets/bun-modules.json";
import implementedNodeModules from "@assets/implemented-node-modules.json";

type VersionRange = string | boolean;
type Modules = Record<string, VersionRange>;

type SemVerBaseStringified = `${bigint}.${bigint}.${bigint}`;
type SemVerStringifiedWithReleaseName = `${SemVerBaseStringified}-${string}`;
type SemVerStringified = SemVerBaseStringified | SemVerStringifiedWithReleaseName;
export type BunVersion = SemVerStringified | "latest";

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerBaseStringified;
const MINIMUM_BUN_SEMVER = new SemVer(MINIMUM_BUN_VERSION);
const LATEST_BUN_SEMVER = new SemVer("999.999.999");
const CURRENT_BUN_VERSION = globalThis.Bun?.version as string | undefined;
const CURRENT_BUN_SEMVER = CURRENT_BUN_VERSION
  ? new SemVer(CURRENT_BUN_VERSION)
  : LATEST_BUN_SEMVER;

if (CURRENT_BUN_VERSION) {
  // don't do the same with node modules because `builtinModules` in bun contains even not implemented node modules
  const { builtinModules } = require("node:module");
  for (const moduleName of builtinModules) {
    if (moduleName.startsWith("bun:")) {
      (bunModules as Modules)[moduleName] ??= `>=${CURRENT_BUN_VERSION}`;
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
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return checkModule(moduleName, bunModules, normalizedBunVersion);
}

/**
 * Checks if the given module name is a Node.js module implemented in Bun.
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Node.js module implemented in Bun, `false` otherwise
 */
export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return checkModule(moduleName, implementedNodeModules, normalizedBunVersion);
}

/**
 * Checks if the given module name is a Bun builtin (either a Bun module or a Node.js module implemented in Bun).
 * @param moduleName - The name of the module to check
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns `true` if the module is a Bun builtin, `false` otherwise
 */
export function isBunBuiltin(moduleName: string, bunVersion?: BunVersion): boolean {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return (
    checkModule(moduleName, bunModules, normalizedBunVersion) ||
    checkModule(moduleName, implementedNodeModules, normalizedBunVersion)
  );
}

/**
 * Gets a list of all native Bun modules.
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunModules(bunVersion?: BunVersion): string[] {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return getModules(bunModules, normalizedBunVersion);
}

/**
 * Gets a list of all Node.js modules implemented in Bun.
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunImplementedNodeModules(bunVersion?: BunVersion): string[] {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return getModules(implementedNodeModules, normalizedBunVersion);
}

/**
 * Gets a list of all Bun builtin modules (both Bun modules and Node.js modules implemented in Bun).
 * @param bunVersion - Optional. The Bun version to check against. Defaults to the current Bun version if available, otherwise "latest".
 * @returns An array of module names
 */
export function getBunBuiltinModules(bunVersion?: BunVersion): string[] {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  const result: string[] = [];

  getModules(bunModules, normalizedBunVersion, result);
  getModules(implementedNodeModules, normalizedBunVersion, result);

  return result;
}

function checkModule(moduleName: unknown, modules: Modules, version: SemVer): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  if (!Object.hasOwn(modules, moduleName)) return false;
  return satisfiesVersionRange(version, modules[moduleName]!);
}

function getModules(modules: Modules, version: SemVer, result: string[] = []): string[] {
  for (const moduleName in modules) {
    if (
      Object.hasOwn(modules, moduleName) &&
      satisfiesVersionRange(version, modules[moduleName]!)
    ) {
      result.push(moduleName);
    }
  }

  return result;
}

function satisfiesVersionRange(version: SemVer, versionRange: VersionRange): boolean {
  if (typeof versionRange === "boolean") return versionRange;
  return satisfies(version, versionRange);
}

function normalizeBunVersion(version?: unknown): SemVer {
  if (version == undefined) return CURRENT_BUN_SEMVER;
  if (typeof version !== "string") throw new TypeError("Bun version must be a string");
  if (version === "latest") return LATEST_BUN_SEMVER;

  const parsed = new SemVer(version);
  if (parsed.compare(MINIMUM_BUN_SEMVER) < 0) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_SEMVER.toString()}`);
  }

  return parsed;
}

import { compare, parse, satisfies, type SemVer } from "verkit";

import {
  type Modules,
  type VersionRange,
  BUN_MODULES,
  CURRENT_BUN_VERSION,
  IMPLEMENTED_NODE_MODULES,
} from "./modules";

type SemVerBaseStringified = `${bigint}.${bigint}.${bigint}`;
type SemVerStringifiedWithReleaseName = `${SemVerBaseStringified}-${string}`;
type SemVerStringified = SemVerBaseStringified | SemVerStringifiedWithReleaseName;
export type BunVersion = SemVerStringified | "latest";

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerBaseStringified;
const MINIMUM_BUN_SEMVER = parse(MINIMUM_BUN_VERSION);
const LATEST_BUN_SEMVER = parse("999.999.999");
const CURRENT_BUN_SEMVER =
  CURRENT_BUN_VERSION && CURRENT_BUN_VERSION[0] !== "0"
    ? parse(CURRENT_BUN_VERSION)
    : LATEST_BUN_SEMVER;

/**
 * Checks if the given module name is a native Bun module.
 * @param moduleName - The name of the module to check
 * @param bunVersion - The Bun version to check against. Defaults to the current Bun version if available and is equal to or greater than 1.0.0, otherwise "latest".
 * @returns `true` if the module is a Bun module, `false` otherwise
 */
export function isBunModule(moduleName: string, bunVersion?: BunVersion): boolean {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return checkModule(moduleName, BUN_MODULES, normalizedBunVersion);
}

/**
 * Checks if the given module name is a Node.js module implemented in Bun.
 * @param moduleName - The name of the module to check
 * @param bunVersion - The Bun version to check against. Defaults to the current Bun version if available and is equal to or greater than 1.0.0, otherwise "latest".
 * @returns `true` if the module is a Node.js module implemented in Bun, `false` otherwise
 */
export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return checkModule(moduleName, IMPLEMENTED_NODE_MODULES, normalizedBunVersion);
}

/**
 * Checks if the given module name is a Bun builtin (either a Bun module or a Node.js module implemented in Bun).
 * @param moduleName - The name of the module to check
 * @param bunVersion - The Bun version to check against. Defaults to the current Bun version if available and is equal to or greater than 1.0.0, otherwise "latest".
 * @returns `true` if the module is a Bun builtin, `false` otherwise
 */
export function isBunBuiltin(moduleName: string, bunVersion?: BunVersion): boolean {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return (
    checkModule(moduleName, BUN_MODULES, normalizedBunVersion) ||
    checkModule(moduleName, IMPLEMENTED_NODE_MODULES, normalizedBunVersion)
  );
}

/**
 * Gets a list of all native Bun modules.
 * @param bunVersion - The Bun version to check against. Defaults to the current Bun version if available and is equal to or greater than 1.0.0, otherwise "latest".
 * @returns An array of module names
 */
export function getBunModules(bunVersion?: BunVersion): string[] {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return getModules(BUN_MODULES, normalizedBunVersion);
}

/**
 * Gets a list of all Node.js modules implemented in Bun.
 * @param bunVersion - The Bun version to check against. Defaults to the current Bun version if available and is equal to or greater than 1.0.0, otherwise "latest".
 * @returns An array of module names
 */
export function getBunImplementedNodeModules(bunVersion?: BunVersion): string[] {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  return getModules(IMPLEMENTED_NODE_MODULES, normalizedBunVersion);
}

/**
 * Gets a list of all Bun builtin modules (both Bun modules and Node.js modules implemented in Bun).
 * @param bunVersion - The Bun version to check against. Defaults to the current Bun version if available and is equal to or greater than 1.0.0, otherwise "latest".
 * @returns An array of module names
 */
export function getBunBuiltinModules(bunVersion?: BunVersion): string[] {
  const normalizedBunVersion = normalizeBunVersion(bunVersion);
  const result: string[] = [];

  getModules(BUN_MODULES, normalizedBunVersion, result);
  getModules(IMPLEMENTED_NODE_MODULES, normalizedBunVersion, result);

  return result;
}

function checkModule(moduleName: unknown, modules: Modules, version: SemVer): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  const versionRange = modules.get(moduleName);
  if (versionRange === undefined) return false;
  return satisfiesVersionRange(version, versionRange);
}

function getModules(modules: Modules, version: SemVer, result: string[] = []): string[] {
  for (const [moduleName, versionRange] of modules) {
    if (satisfiesVersionRange(version, versionRange)) {
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

  const parsed = parse(version);
  if (compare(parsed, MINIMUM_BUN_SEMVER) < 0) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_VERSION}`);
  }

  return parsed;
}

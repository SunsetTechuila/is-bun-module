import valid from "semver/functions/valid";
import satisfies from "semver/functions/satisfies";
import lt from "semver/functions/lt";

import bunModules from "@assets/bun-modules.json";
import nodeModules from "@assets/implemented-node-modules.json";

type SemVerBaseStringified = `${bigint}.${bigint}.${bigint}`;
type SemVerStringifiedWithReleaseName = `${SemVerBaseStringified}-${string}`;
type SemVerStringified = SemVerBaseStringified | SemVerStringifiedWithReleaseName;
export type BunVersion = SemVerStringified | "latest";

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerBaseStringified;

export function isBunModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName, bunModules, bunVersion);
}

export function isBunImplementedNodeModule(moduleName: string, bunVersion?: BunVersion): boolean {
  return checkModule(moduleName.replace(/^node:/, ""), nodeModules, bunVersion);
}

export function isBunBuiltin(moduleName: string, bunVersion?: BunVersion): boolean {
  return isBunModule(moduleName, bunVersion) || isBunImplementedNodeModule(moduleName, bunVersion);
}

export function getBunModules(version?: BunVersion): string[] {
  return getModules(bunModules, version);
}

export function getBunImplementedNodeModules(version?: BunVersion): string[] {
  return getModules(nodeModules, version);
}

export function getBunBuiltinModules(version?: BunVersion): string[] {
  return getModules({ ...bunModules, ...nodeModules }, version);
}

type BunModules = typeof bunModules;
type ImplementedNodeModules = typeof nodeModules;
type CoreModules = BunModules | ImplementedNodeModules;

function checkModule(moduleName: string, modules: CoreModules, bunVersion?: BunVersion): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  if (!(moduleName in modules)) return false;

  let targetBunVersion: SemVerStringified;
  if (bunVersion) {
    targetBunVersion = toSemVerStringified(bunVersion);
  } else {
    if (typeof process === "undefined" || !process.versions?.bun) {
      targetBunVersion = toSemVerStringified("latest");
    }
    targetBunVersion = process.versions.bun as SemVerStringified;
  }

  if (lt(targetBunVersion, MINIMUM_BUN_VERSION)) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_VERSION}`);
  }

  return satisfiesVersionRange(targetBunVersion, modules[moduleName as keyof typeof modules]);
}

function getModules(modules: CoreModules, bunVersion?: BunVersion): string[] {
  let targetBunVersion: SemVerStringified;
  if (bunVersion) {
    targetBunVersion = toSemVerStringified(bunVersion);
  } else {
    if (typeof Bun === "undefined") {
      targetBunVersion = toSemVerStringified("latest");
    }
    targetBunVersion = Bun.version as SemVerStringified;
  }

  return Object.keys(modules).filter((moduleName) => {
    return satisfiesVersionRange(targetBunVersion, modules[moduleName as keyof typeof modules]);
  });
}

function satisfiesVersionRange(
  version: SemVerStringified,
  versionRange: string | boolean,
): boolean {
  if (typeof versionRange === "boolean") return versionRange;
  return satisfies(version, versionRange);
}

function toSemVerStringified(input: unknown): SemVerStringified {
  if (typeof input !== "string") throw new TypeError("Bun version must be a string");
  if (input === "latest") return "999.999.999" as SemVerStringified;
  if (valid(input)) return input as SemVerBaseStringified;
  throw new TypeError("Bun version must be a string like '1.0.0' or 'latest'");
}

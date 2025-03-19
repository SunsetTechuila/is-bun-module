import valid from "semver/functions/valid";
import satisfies from "semver/functions/satisfies";
import lt from "semver/functions/lt";

import bunModules from "@assets/bun-modules.json";
import nodeModules from "@assets/node-modules.json";

type SemVerBaseStringified = `${bigint}.${bigint}.${bigint}`;
type SemVerStringifiedWithReleaseName = `${SemVerBaseStringified}-${string}`;
type SemVerStringified = SemVerBaseStringified | SemVerStringifiedWithReleaseName;
export type Version = SemVerStringified | "latest";

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerBaseStringified;

export function isBunModule(moduleName: string, bunVersion?: Version): boolean {
  return checkModule(moduleName, bunModules, bunVersion);
}

export function isSupportedNodeModule(moduleName: string, bunVersion?: Version): boolean {
  return checkModule(moduleName.replace(/^node:/, ""), nodeModules, bunVersion);
}

export function isBunBuiltin(moduleName: string, bunVersion?: Version): boolean {
  return isBunModule(moduleName, bunVersion) || isSupportedNodeModule(moduleName, bunVersion);
}

type BunModules = typeof bunModules;
type SupportedNodeModules = typeof nodeModules;
type CoreModules = BunModules | SupportedNodeModules;

function checkModule(moduleName: string, modules: CoreModules, bunVersion?: Version): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  if (!(moduleName in modules)) return false;

  let targetBunVersion: Version | undefined;
  if (bunVersion) {
    targetBunVersion = toSemVerStringified(bunVersion);
    if (!targetBunVersion) {
      throw new TypeError("Bun version must be a string like 1.0.0 or 'latest'");
    }
  } else {
    if (typeof process === "undefined" || !process.versions?.bun) {
      throw new Error("Bun version is not provided and cannot be detected");
    }
    targetBunVersion = process.versions.bun as SemVerStringified;
  }

  if (lt(targetBunVersion, MINIMUM_BUN_VERSION)) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_VERSION}`);
  }

  const versionRange = modules[moduleName as keyof typeof modules];
  if (typeof versionRange === "boolean") return versionRange;
  return satisfies(targetBunVersion, versionRange);
}

function toSemVerStringified(input: unknown): SemVerStringified | undefined {
  if (typeof input !== "string") return;
  if (input === "latest") return "999.999.999";
  if (valid(input)) return input as SemVerBaseStringified;
}

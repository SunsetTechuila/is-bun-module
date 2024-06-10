import semver from "semver";

import bunModules from "@assets/bun-modules.json";
import nodeModules from "@assets/node-modules.json";

type SemVerStringified = `${number}.${number}.${number}`;
export type Version = SemVerStringified | "latest";

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerStringified;

export function isBunModule(moduleName: string, bunVersion?: Version): boolean {
  return checkModule(moduleName, bunModules, bunVersion);
}

export function isSupportedNodeModule(moduleName: string, bunVersion?: Version): boolean {
  return checkModule(moduleName.replace(/^node:/, ""), nodeModules, bunVersion);
}

type BunModules = typeof bunModules;
type SupportedNodeModules = typeof nodeModules;
type CoreModules = BunModules | SupportedNodeModules;

function checkModule(moduleName: string, modules: CoreModules, bunVersion?: Version): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  if (!(moduleName in modules)) return false;

  if (bunVersion != null && !isVersion(bunVersion)) {
    throw new TypeError("Bun version must be a string like 1.0.0 or 'latest' or undefined");
  }

  const targetBunVersion = bunVersion
    ? bunVersion === "latest"
      ? ("999.999.999" satisfies SemVerStringified)
      : bunVersion
    : typeof process !== "undefined" && process.versions.bun;
  if (!targetBunVersion) throw "Bun version is not provided and cannot be detected";

  if (semver.lt(targetBunVersion, MINIMUM_BUN_VERSION)) {
    throw `Bun version must be at least ${MINIMUM_BUN_VERSION}`;
  }

  const versionRange = modules[moduleName as keyof typeof modules];

  if (typeof versionRange === "boolean") return versionRange;
  return semver.satisfies(targetBunVersion, versionRange);
}

function isVersion(input: unknown): input is Version {
  return (
    typeof input === "string" && (input === "latest" || Boolean(input.match(/^(?:\d+\.){2}\d+$/)))
  );
}

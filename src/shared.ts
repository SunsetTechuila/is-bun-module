import valid from "semver/functions/valid";
import satisfies from "semver/functions/satisfies";
import lt from "semver/functions/lt";

export { default as bundledBunModules } from "@assets/bun-modules.json";
export { default as implementedNodeModules } from "@assets/implemented-node-modules.json";

type SemVerBaseStringified = `${bigint}.${bigint}.${bigint}`;
type SemVerStringifiedWithReleaseName = `${SemVerBaseStringified}-${string}`;
type SemVerStringified = SemVerBaseStringified | SemVerStringifiedWithReleaseName;
export type BunVersion = SemVerStringified | "latest";

export type Modules = Record<string, string | boolean>;

export const MINIMUM_BUN_VERSION = "1.0.0" satisfies SemVerBaseStringified;

export function checkModule(moduleName: string, modules: Modules, bunVersion: BunVersion): boolean {
  if (typeof moduleName !== "string") throw new TypeError("Module name must be a string");
  if (!(moduleName in modules)) return false;

  const targetBunVersion = toSemVerStringified(bunVersion);
  if (lt(targetBunVersion, MINIMUM_BUN_VERSION)) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_VERSION}`);
  }

  return satisfiesVersionRange(targetBunVersion, modules[moduleName]!);
}

export function getModules(modules: Modules, bunVersion?: BunVersion): string[] {
  const targetBunVersion = toSemVerStringified(bunVersion);
  if (lt(targetBunVersion, MINIMUM_BUN_VERSION)) {
    throw new RangeError(`Bun version must be at least ${MINIMUM_BUN_VERSION}`);
  }

  return Object.keys(modules).filter((moduleName) => {
    return satisfiesVersionRange(targetBunVersion, modules[moduleName]!);
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

import type { SemVerRange } from "verkit";

export { default as BUN_MODULES, CURRENT_BUN_VERSION } from "./bun";
export { default as IMPLEMENTED_NODE_MODULES } from "./node";

export type VersionRange = SemVerRange | boolean;
export type Modules = Map<string, VersionRange>;

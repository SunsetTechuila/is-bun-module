import semver from "semver";
import { test, expect, describe } from "bun:test";

describe("Version ranges parsing", () => {
  test("Node modules is parsebable", async () => {
    const nodeModules = (await import("@assets/node-modules.json")).default;

    for (const range of Object.values(nodeModules)) {
      expect(isValidRange(range)).toBe(true);
    }
  });

  test("Bun modules is parsebable", async () => {
    const bunModules = (await import("@assets/bun-modules.json")).default;

    for (const range of Object.values(bunModules)) {
      expect(isValidRange(range)).toBe(true);
    }
  });
});

function isValidRange(range: unknown): boolean {
  switch (typeof range) {
    case "boolean":
      return true;
    case "string":
      return Boolean(semver.validRange(range));
    default:
      return false;
  }
}

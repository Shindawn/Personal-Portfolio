import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const vercelConfigPath = path.resolve(rootDir, "../../vercel.json");

describe("vercel.json", () => {
  it("rewrites all routes to index.html for SPA navigation", () => {
    const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, "utf8"));

    expect(vercelConfig.rewrites).toContainEqual({
      source: "/(.*)",
      destination: "/index.html",
    });
  });
});

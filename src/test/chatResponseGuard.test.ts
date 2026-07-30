import { describe, expect, it } from "vitest";
import { sanitizeChatResponse } from "../lib/chatResponseGuard";

describe("sanitizeChatResponse", () => {
  it("corrects graduation-status contradictions", () => {
    const result = sanitizeChatResponse("I am still a student and will graduate soon.");

    expect(result).toContain("already graduated");
    expect(result).toContain("Catanduanes State University");
  });

  it("preserves a correct graduation statement", () => {
    const result = sanitizeChatResponse("I already graduated from Catanduanes State University.");

    expect(result).toContain("already graduated");
  });
});

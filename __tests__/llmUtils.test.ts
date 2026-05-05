import { describe, it, expect } from "vitest";
import { stripFences, safeArray, buildUserMessage } from "@/lib/llmUtils";

// ─── stripFences ─────────────────────────────────────────────────────────────

describe("stripFences", () => {
  it("returns plain JSON unchanged", () => {
    const json = '{"matchScore": 72}';
    expect(stripFences(json)).toBe(json);
  });

  it("strips ```json ... ``` fences", () => {
    const input = "```json\n{\"matchScore\": 72}\n```";
    expect(stripFences(input)).toBe('{"matchScore": 72}');
  });

  it("strips ``` ... ``` fences (no language tag)", () => {
    const input = "```\n{\"matchScore\": 72}\n```";
    expect(stripFences(input)).toBe('{"matchScore": 72}');
  });

  it("trims surrounding whitespace", () => {
    expect(stripFences('  {"key": "val"}  ')).toBe('{"key": "val"}');
  });

  it("handles empty string", () => {
    expect(stripFences("")).toBe("");
  });
});

// ─── safeArray ───────────────────────────────────────────────────────────────

describe("safeArray", () => {
  it("returns string arrays as-is", () => {
    expect(safeArray(["a", "b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("filters out non-string items", () => {
    expect(safeArray(["a", 1, null, "b", true])).toEqual(["a", "b"]);
  });

  it("returns [] for non-array input", () => {
    expect(safeArray(null)).toEqual([]);
    expect(safeArray(undefined)).toEqual([]);
    expect(safeArray("string")).toEqual([]);
    expect(safeArray(42)).toEqual([]);
  });

  it("returns [] for empty array", () => {
    expect(safeArray([])).toEqual([]);
  });
});

// ─── buildUserMessage ────────────────────────────────────────────────────────

describe("buildUserMessage", () => {
  it("includes RESUME and JOB DESCRIPTION sections", () => {
    const msg = buildUserMessage({ resumeText: "My resume", jobText: "My job" });
    expect(msg).toContain("RESUME:");
    expect(msg).toContain("My resume");
    expect(msg).toContain("JOB DESCRIPTION:");
    expect(msg).toContain("My job");
  });

  it("appends COMPANY when provided", () => {
    const msg = buildUserMessage({ resumeText: "r", jobText: "j", company: "Acme" });
    expect(msg).toContain("COMPANY: Acme");
  });

  it("appends ROLE when provided", () => {
    const msg = buildUserMessage({ resumeText: "r", jobText: "j", role: "Engineer" });
    expect(msg).toContain("ROLE: Engineer");
  });

  it("omits COMPANY and ROLE when null", () => {
    const msg = buildUserMessage({ resumeText: "r", jobText: "j", company: null, role: null });
    expect(msg).not.toContain("COMPANY");
    expect(msg).not.toContain("ROLE");
  });

  it("trims whitespace from inputs", () => {
    const msg = buildUserMessage({ resumeText: "  resume  ", jobText: "  job  " });
    expect(msg).toContain("resume");
    expect(msg).not.toContain("  resume  ");
  });
});

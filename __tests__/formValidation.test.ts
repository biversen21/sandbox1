import { describe, it, expect } from "vitest";
import { validate } from "@/lib/formValidation";

describe("validate", () => {
  it("returns no errors when resume and job description are provided", () => {
    expect(validate("My resume", "Job description", "")).toEqual({});
  });

  it("returns no errors when resume and job URL are provided", () => {
    expect(validate("My resume", "", "https://example.com/job")).toEqual({});
  });

  it("returns no errors when resume and both job fields are provided", () => {
    expect(validate("My resume", "Job description", "https://example.com/job")).toEqual({});
  });

  it("errors on empty resume", () => {
    const result = validate("", "Job description", "");
    expect(result.resume).toBeDefined();
    expect(result.job).toBeUndefined();
  });

  it("errors when resume is only whitespace", () => {
    const result = validate("   ", "Job description", "");
    expect(result.resume).toBeDefined();
  });

  it("errors when both job fields are empty", () => {
    const result = validate("My resume", "", "");
    expect(result.job).toBeDefined();
    expect(result.resume).toBeUndefined();
  });

  it("errors when both job fields are only whitespace", () => {
    const result = validate("My resume", "   ", "   ");
    expect(result.job).toBeDefined();
  });

  it("returns both errors when all fields are empty", () => {
    const result = validate("", "", "");
    expect(result.resume).toBeDefined();
    expect(result.job).toBeDefined();
  });
});

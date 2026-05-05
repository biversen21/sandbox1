import { describe, it, expect } from "vitest";
import { isSafeUrl, inferFromTitle } from "@/lib/extractUtils";

// ─── isSafeUrl ───────────────────────────────────────────────────────────────

describe("isSafeUrl", () => {
  const url = (s: string) => new URL(s);

  it("allows public https URLs", () => {
    expect(isSafeUrl(url("https://careers.example.com/jobs/123"))).toBe(true);
  });

  it("allows public http URLs", () => {
    expect(isSafeUrl(url("http://example.com/job"))).toBe(true);
  });

  it("blocks non-http protocols", () => {
    expect(isSafeUrl(url("ftp://example.com/file"))).toBe(false);
  });

  it("blocks localhost by name", () => {
    expect(isSafeUrl(url("http://localhost/admin"))).toBe(false);
  });

  it("blocks 127.0.0.1", () => {
    expect(isSafeUrl(url("http://127.0.0.1/secret"))).toBe(false);
  });

  it("blocks IPv6 loopback", () => {
    expect(isSafeUrl(url("http://[::1]/secret"))).toBe(false);
  });

  it("blocks 10.x.x.x private range", () => {
    expect(isSafeUrl(url("http://10.0.0.1/internal"))).toBe(false);
    expect(isSafeUrl(url("http://10.255.255.255/internal"))).toBe(false);
  });

  it("blocks 172.16–172.31 private range", () => {
    expect(isSafeUrl(url("http://172.16.0.1/internal"))).toBe(false);
    expect(isSafeUrl(url("http://172.31.255.255/internal"))).toBe(false);
  });

  it("allows 172.32 (outside private range)", () => {
    expect(isSafeUrl(url("http://172.32.0.1/page"))).toBe(true);
  });

  it("blocks 192.168.x.x private range", () => {
    expect(isSafeUrl(url("http://192.168.1.1/router"))).toBe(false);
  });

  it("blocks 169.254.x.x link-local range", () => {
    expect(isSafeUrl(url("http://169.254.169.254/metadata"))).toBe(false);
  });

  it("allows a public IP", () => {
    expect(isSafeUrl(url("https://8.8.8.8/"))).toBe(true);
  });
});

// ─── inferFromTitle ──────────────────────────────────────────────────────────

describe("inferFromTitle", () => {
  it("returns nulls for empty string", () => {
    expect(inferFromTitle("")).toEqual({ company: null, role: null });
  });

  it('parses "Role at Company" pattern', () => {
    expect(inferFromTitle("Software Engineer at Acme Corp")).toEqual({
      role: "Software Engineer",
      company: "Acme Corp",
    });
  });

  it('parses "Role at Company | Site" pattern, ignoring site suffix', () => {
    expect(inferFromTitle("Senior Developer at Startup Inc | LinkedIn")).toEqual({
      role: "Senior Developer",
      company: "Startup Inc",
    });
  });

  it('is case-insensitive for "at"', () => {
    expect(inferFromTitle("Product Manager AT BigCo")).toEqual({
      role: "Product Manager",
      company: "BigCo",
    });
  });

  it('parses "Role | Company" separator pattern', () => {
    expect(inferFromTitle("Data Analyst | Widgets LLC")).toEqual({
      role: "Data Analyst",
      company: "Widgets LLC",
    });
  });

  it('parses "Role - Company" separator pattern', () => {
    expect(inferFromTitle("UX Designer - Creative Agency")).toEqual({
      role: "UX Designer",
      company: "Creative Agency",
    });
  });

  it('parses "Role – Company" em-dash separator', () => {
    expect(inferFromTitle("DevOps Engineer – Infra Co")).toEqual({
      role: "DevOps Engineer",
      company: "Infra Co",
    });
  });

  it("falls back to role=title, company=null when no separator found", () => {
    expect(inferFromTitle("Just A Title")).toEqual({
      role: "Just A Title",
      company: null,
    });
  });
});

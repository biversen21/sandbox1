import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const MIN_TEXT_LENGTH = 200;

interface ExtractJobResponse {
  success: boolean;
  jobText: string;
  company: string | null;
  role: string | null;
  error: string | null;
}

function isSafeUrl(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const h = url.hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1") return false;
  const ipv4 = h.match(/^(\d+)\.(\d+)\./);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 10) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 169 && b === 254) return false;
  }
  return true;
}

function inferFromTitle(title: string): { company: string | null; role: string | null } {
  if (!title) return { company: null, role: null };

  // "Role at Company | Site" or "Role at Company - Site"
  const atMatch = title.match(/^(.+?)\s+at\s+(.+?)(?:\s*[\|–\-].*)?$/i);
  if (atMatch) {
    return { role: atMatch[1].trim(), company: atMatch[2].trim() };
  }

  // "Role | Company" or "Role - Company" or "Role – Company"
  const sepMatch = title.match(/^(.+?)\s*[\|–\-]\s*(.+?)(?:\s*[\|–\-].*)?$/);
  if (sepMatch) {
    return { role: sepMatch[1].trim(), company: sepMatch[2].trim() };
  }

  return { company: null, role: title.trim() };
}

function fail(error: string, status = 200): NextResponse<ExtractJobResponse> {
  return NextResponse.json({ success: false, jobText: "", company: null, role: null, error }, { status });
}

export async function POST(req: NextRequest) {
  let body: { jobUrl?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body.", 400);
  }

  const { jobUrl } = body;
  if (!jobUrl || typeof jobUrl !== "string") {
    return fail("jobUrl is required.", 400);
  }

  let url: URL;
  try {
    url = new URL(jobUrl);
  } catch {
    return fail("Invalid URL.", 400);
  }

  if (!isSafeUrl(url)) {
    return fail("Invalid URL.", 400);
  }

  let html: string;
  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobCopilot/1.0; +https://jobcopilot.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch {
    return fail("Could not fetch the job URL. Please paste the job description manually.");
  }

  const $ = cheerio.load(html);
  const pageTitle = $("title").first().text().trim();

  // Remove noisy structural elements
  $("script, style, nav, footer, header, noscript, iframe, svg").remove();

  const rawText = $("body").text();

  // Normalize whitespace: collapse runs of spaces/tabs, collapse 3+ newlines to 2
  const jobText = rawText
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+/gm, "")
    .trim();

  if (jobText.length < MIN_TEXT_LENGTH) {
    return fail(
      "Could not extract enough text from this job URL. Please paste the job description manually."
    );
  }

  const { company, role } = inferFromTitle(pageTitle);

  return NextResponse.json({ success: true, jobText, company, role, error: null });
}

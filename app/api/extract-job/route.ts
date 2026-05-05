import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { isSafeUrl, inferFromTitle } from "@/lib/extractUtils";

const MIN_TEXT_LENGTH = 200;

interface ExtractJobResponse {
  success: boolean;
  jobText: string;
  company: string | null;
  role: string | null;
  error: string | null;
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
  if (!jobUrl || typeof jobUrl !== "string") return fail("jobUrl is required.", 400);

  let url: URL;
  try {
    url = new URL(jobUrl);
  } catch {
    return fail("Invalid URL.", 400);
  }

  if (!isSafeUrl(url)) return fail("Invalid URL.", 400);

  let html: string;
  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobCopilot/1.0)",
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
  $("script, style, nav, footer, header, noscript, iframe, svg").remove();

  const jobText = $("body")
    .text()
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+/gm, "")
    .trim();

  if (jobText.length < MIN_TEXT_LENGTH) {
    return fail("Could not extract enough text from this job URL. Please paste the job description manually.");
  }

  const { company, role } = inferFromTitle(pageTitle);
  return NextResponse.json({ success: true, jobText, company, role, error: null });
}

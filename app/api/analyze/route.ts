import { NextRequest, NextResponse } from "next/server";
import { stripFences, buildUserMessage } from "@/lib/llmUtils";

interface AnalyzeRequest {
  resumeText: string;
  jobText: string;
  company?: string | null;
  role?: string | null;
}

interface AnalyzeResponse {
  matchScore: number;
  previewImprovements: string[];
  missingKeywords: string[];
  summary: string;
  locked: true;
}

interface AnalyzeErrorResponse {
  error: string;
}

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) specialist and professional resume coach.
Analyze the provided resume against a job description and return a structured JSON assessment.

RULES:
- Never fabricate experience, skills, or achievements not present in the resume
- Never invent qualifications the candidate does not have
- Base all analysis solely on what is written in the resume vs the job description
- Be specific, practical, and actionable in every suggestion
- Focus on realistic improvements the candidate can actually make

Respond with ONLY a valid JSON object — no markdown, no explanation, just JSON:
{
  "matchScore": <integer 0-100>,
  "summary": <string: 2-3 sentences describing overall fit and the most important gap>,
  "previewImprovements": [<exactly 3 specific, actionable improvement suggestions>],
  "missingKeywords": [<exactly 5 keywords or phrases from the job description absent or underrepresented in the resume>],
  "locked": true
}

Scoring guide:
80-100: Strong match, only minor gaps
60-79: Good match, some notable gaps
40-59: Moderate match, several important gaps
20-39: Weak match, significant skills or experience missing
0-19:  Poor match, fundamental misalignment`;


export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalyzeResponse | AnalyzeErrorResponse>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  let body: AnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.resumeText?.trim()) {
    return NextResponse.json({ error: "resumeText is required." }, { status: 400 });
  }
  if (!body.jobText?.trim()) {
    return NextResponse.json({ error: "jobText is required." }, { status: 400 });
  }

  let llmRes: Response;
  try {
    llmRes = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(body) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000,
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the analysis service. Please try again." },
      { status: 502 }
    );
  }

  if (!llmRes.ok) {
    const text = await llmRes.text().catch(() => "");
    console.error("LLM API error", llmRes.status, text);
    return NextResponse.json(
      { error: "Analysis service returned an error. Please try again." },
      { status: 502 }
    );
  }

  let completion: { choices?: { message?: { content?: string } }[] };
  try {
    completion = await llmRes.json();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse analysis service response." },
      { status: 502 }
    );
  }

  const raw = completion?.choices?.[0]?.message?.content ?? "";

  let parsed: Partial<AnalyzeResponse>;
  try {
    parsed = JSON.parse(stripFences(raw));
  } catch {
    console.error("Failed to parse LLM JSON:", raw);
    return NextResponse.json(
      { error: "Failed to parse analysis result. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    matchScore: Math.min(100, Math.max(0, Math.round(Number(parsed.matchScore) || 0))),
    summary: parsed.summary ?? "",
    previewImprovements: (parsed.previewImprovements ?? []).slice(0, 3),
    missingKeywords: (parsed.missingKeywords ?? []).slice(0, 5),
    locked: true,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { stripFences, safeArray, buildUserMessage } from "@/lib/llmUtils";

interface OptimizeRequest {
  resumeText: string;
  jobText: string;
  company?: string | null;
  role?: string | null;
}

interface InterviewPrep {
  likelyQuestions: string[];
  talkingPoints: string[];
  companyResearchAngles: string[];
}

interface OptimizeResponse {
  optimizedResume: string;
  matchScore: number;
  fullImprovements: string[];
  missingKeywords: string[];
  interviewPrep: InterviewPrep;
}

interface OptimizeErrorResponse {
  error: string;
}

const SYSTEM_PROMPT = `You are an expert ATS resume optimization specialist and career coach.
Your task is to rewrite and optimize a candidate's resume for a specific job description, then generate targeted interview preparation.

CRITICAL RULES — follow these exactly:
- NEVER add experience, skills, employers, education, dates, or metrics that are not in the original resume
- NEVER fabricate achievements or invent quantified results
- NEVER add certifications, tools, or languages the candidate has not mentioned
- When a bullet point would benefit from a real metric the candidate should add, use exactly: [add metric]
- Preserve all factual content from the original — improve only phrasing, structure, and keyword alignment
- Tailor every change to the specific job description provided, not generic resume advice
- interviewPrep.talkingPoints must be grounded in the candidate's actual background

Respond with ONLY a valid JSON object — no markdown, no explanation, no code fences:
{
  "optimizedResume": "<full rewritten resume as plain text; use \\n for line breaks>",
  "matchScore": <integer 0-100 representing fit after optimization>,
  "fullImprovements": [<5-10 specific improvements made, each a concise actionable string>],
  "missingKeywords": [<up to 8 keywords still absent that the candidate could honestly add>],
  "interviewPrep": {
    "likelyQuestions": [<5-7 likely interview questions for this specific role>],
    "talkingPoints": [<5-7 talking points the candidate can use, grounded in their real experience>],
    "companyResearchAngles": [<3-5 research angles the candidate should prepare before interviewing>]
  }
}`;


export async function POST(
  req: NextRequest
): Promise<NextResponse<OptimizeResponse | OptimizeErrorResponse>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  let body: OptimizeRequest;
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
        max_tokens: 4000,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the optimization service. Please try again." },
      { status: 502 }
    );
  }

  if (!llmRes.ok) {
    const text = await llmRes.text().catch(() => "");
    console.error("LLM API error", llmRes.status, text);
    return NextResponse.json(
      { error: "Optimization service returned an error. Please try again." },
      { status: 502 }
    );
  }

  let completion: { choices?: { message?: { content?: string } }[] };
  try {
    completion = await llmRes.json();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse optimization service response." },
      { status: 502 }
    );
  }

  const raw = completion?.choices?.[0]?.message?.content ?? "";

  let parsed: Partial<OptimizeResponse & { interviewPrep: Partial<InterviewPrep> }>;
  try {
    parsed = JSON.parse(stripFences(raw));
  } catch {
    console.error("Failed to parse LLM JSON:", raw);
    return NextResponse.json(
      { error: "Failed to parse optimization result. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    optimizedResume: typeof parsed.optimizedResume === "string" ? parsed.optimizedResume : "",
    matchScore: Math.min(100, Math.max(0, Math.round(Number(parsed.matchScore) || 0))),
    fullImprovements: safeArray(parsed.fullImprovements),
    missingKeywords: safeArray(parsed.missingKeywords).slice(0, 8),
    interviewPrep: {
      likelyQuestions: safeArray(parsed.interviewPrep?.likelyQuestions),
      talkingPoints: safeArray(parsed.interviewPrep?.talkingPoints),
      companyResearchAngles: safeArray(parsed.interviewPrep?.companyResearchAngles),
    },
  });
}

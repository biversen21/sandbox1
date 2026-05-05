export function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
}

export function safeArray(val: unknown): string[] {
  return Array.isArray(val) ? (val as string[]).filter((x) => typeof x === "string") : [];
}

export function buildUserMessage(body: {
  resumeText: string;
  jobText: string;
  company?: string | null;
  role?: string | null;
}): string {
  const lines = ["RESUME:", body.resumeText.trim(), "", "JOB DESCRIPTION:", body.jobText.trim()];
  if (body.company) lines.push("", `COMPANY: ${body.company}`);
  if (body.role) lines.push(`ROLE: ${body.role}`);
  return lines.join("\n");
}

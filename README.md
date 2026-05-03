# JobCopilot

AI-powered job application copilot — turn any job posting into a tailored resume and interview prep plan.

Paste your resume and a job description (or URL). Get a match score, missing keywords, and targeted improvement suggestions. Paid tier unlocks a fully optimized resume and interview prep plan.

---

## Tech stack

- **Next.js 15** — App Router, API routes
- **TypeScript**
- **Tailwind CSS**
- **OpenAI-compatible LLM API** (OpenAI, Together, Groq, or any compatible provider)

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example below into a `.env.local` file at the project root:

```bash
# Required — your LLM API key
OPENAI_API_KEY=sk-...

# Optional — override to use a different OpenAI-compatible provider
# Defaults to: https://api.openai.com/v1
OPENAI_BASE_URL=https://api.openai.com/v1

# Optional — model to use for analysis
# Defaults to: gpt-4o-mini
OPENAI_MODEL=gpt-4o-mini
```

Any OpenAI-compatible provider works. Examples:

| Provider | `OPENAI_BASE_URL` | Example model |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.1-8b-instant` |
| Together AI | `https://api.together.xyz/v1` | `meta-llama/Llama-3-8b-chat-hf` |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API routes

### `POST /api/analyze`

Analyzes a resume against a job description using an LLM.

**Request**
```json
{
  "resumeText": "string",
  "jobText": "string",
  "company": "string | null",
  "role": "string | null"
}
```

**Response**
```json
{
  "matchScore": 72,
  "summary": "string",
  "previewImprovements": ["string", "string", "string"],
  "missingKeywords": ["string", "string", "string", "string", "string"],
  "locked": true
}
```

---

### `POST /api/extract-job`

Fetches a job posting URL server-side and extracts readable text.

**Request**
```json
{
  "jobUrl": "https://example.com/jobs/123"
}
```

**Response**
```json
{
  "success": true,
  "jobText": "string",
  "company": "string | null",
  "role": "string | null",
  "error": null
}
```

---

## Project structure

```
app/
  page.tsx                  # Landing page
  layout.tsx                # Root layout
  globals.css               # Tailwind imports
  api/
    analyze/route.ts        # LLM analysis endpoint
    extract-job/route.ts    # Job URL extraction endpoint
components/
  OptimizerForm.tsx         # Main form — holds all state and submit logic
  ResumeInput.tsx           # Resume textarea
  JobInput.tsx              # Job description textarea + URL field
  AnalyzeButton.tsx         # Submit button with loading state
  AnalysisResults.tsx       # Results display (score, improvements, keywords, locked CTA)
```

---

## Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

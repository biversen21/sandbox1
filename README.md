# JobCopilot

AI-powered job application copilot — turn any job posting into a tailored resume and interview prep plan.

Paste your resume and a job description (or URL). Get a free match score, missing keywords, and improvement suggestions. Pay $7 to unlock a fully optimized resume and interview prep plan.

---

## Tech stack

- **Next.js 15** — App Router, API routes
- **TypeScript**
- **Tailwind CSS**
- **OpenAI-compatible LLM API** (OpenAI, Together, Groq, or any compatible provider)
- **Stripe Checkout** — one-time $7 payment

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```bash
# ── LLM (required) ────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-...

# Optional — use any OpenAI-compatible provider (defaults to OpenAI)
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# ── Stripe (required for payments) ────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...

# ── App (required for Stripe redirect URLs) ───────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Dev tools (optional) ──────────────────────────────────────────────────────
# Set to "true" to show a bypass button that skips Stripe and calls /api/optimize directly
NEXT_PUBLIC_ENABLE_DEV_UNLOCK=true
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## LLM providers

Any OpenAI-compatible provider works via `OPENAI_BASE_URL`:

| Provider | `OPENAI_BASE_URL` | Example model |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.1-8b-instant` |
| Together AI | `https://api.together.xyz/v1` | `meta-llama/Llama-3-8b-chat-hf` |

---

## User flow

```
1. Paste resume + job description (or job URL)
2. Click "Analyze My Resume"
      → URL extraction (if URL provided)
      → LLM analysis → free preview
3. Free preview shows:
      - Match score
      - Summary
      - 3 top improvement suggestions
      - 5 missing keywords
4. Click "Unlock — $7" → Stripe Checkout
5. After payment → /success
      → full optimized resume
      → complete improvement plan
      → interview prep (questions, talking points, research angles)
```

---

## API routes

### `POST /api/analyze`

Free analysis — returns a preview only.

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

### `POST /api/optimize`

Full optimization — called after payment. Returns the complete result.

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
  "optimizedResume": "string",
  "matchScore": 85,
  "fullImprovements": ["string", "..."],
  "missingKeywords": ["string", "..."],
  "interviewPrep": {
    "likelyQuestions": ["string", "..."],
    "talkingPoints": ["string", "..."],
    "companyResearchAngles": ["string", "..."]
  }
}
```

---

### `POST /api/extract-job`

Fetches a job posting URL server-side and extracts readable text.

**Request**
```json
{ "jobUrl": "https://example.com/jobs/123" }
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

### `POST /api/create-checkout-session`

Creates a Stripe Checkout session for the $7 unlock.

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
{ "url": "https://checkout.stripe.com/..." }
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page + optimizer form |
| `/success` | Post-payment page — retrieves stored inputs, calls `/api/optimize`, displays full result |

---

## Project structure

```
app/
  page.tsx                          # Landing page
  layout.tsx                        # Root layout
  globals.css                       # Tailwind imports
  success/
    page.tsx                        # Suspense wrapper for success page
    SuccessContent.tsx              # Client component — calls /api/optimize after payment
  api/
    analyze/route.ts                # Free LLM analysis endpoint
    optimize/route.ts               # Full optimization endpoint (post-payment)
    extract-job/route.ts            # Job URL extraction endpoint
    create-checkout-session/route.ts # Stripe Checkout session endpoint
components/
  OptimizerForm.tsx                 # Main form — holds all state and submit logic
  ResumeInput.tsx                   # Resume textarea with validation
  JobInput.tsx                      # Job description textarea + URL field
  AnalyzeButton.tsx                 # Submit button with loading state
  AnalysisResults.tsx               # Free preview (score, improvements, keywords, paywall CTA)
  OptimizedResults.tsx              # Full result (resume, plan, keywords, interview prep)
```

---

## Stripe test cards

Use these in the Stripe Checkout test environment:

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0002` | Payment declined |

Use any future expiry date, any 3-digit CVC, and any postal code.

---

## Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

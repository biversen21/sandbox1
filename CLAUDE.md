# JobCopilot — Claude Code Guide

## What this is

An AI-powered job application copilot. Users paste a resume and job description, receive a free match analysis, then pay $7 to unlock a fully optimized resume and interview prep plan.

## Architecture

Next.js 15 App Router. No database, no authentication, no session storage on the server. State lives in the client (React state + sessionStorage for cross-page handoff after Stripe payment).

```
Landing page → OptimizerForm (client component)
  → POST /api/extract-job   (if URL provided instead of text)
  → POST /api/analyze       (free preview)
  → Stripe Checkout         ($7 paywall)
  → /success page
  → POST /api/optimize      (full result)
```

## Key files

| File | Purpose |
|---|---|
| `app/page.tsx` | Landing page — hero, how-it-works, form section |
| `app/layout.tsx` | Root layout with Inter font |
| `app/success/page.tsx` | Suspense wrapper for post-payment page |
| `app/success/SuccessContent.tsx` | Reads `sessionStorage("jc_payload")`, calls `/api/optimize`, renders result |
| `app/api/analyze/route.ts` | Free LLM analysis — returns preview (3 improvements, 5 keywords, score, summary) |
| `app/api/optimize/route.ts` | Full LLM optimization — returns rewritten resume + interview prep |
| `app/api/extract-job/route.ts` | Server-side job URL fetch + HTML parse (cheerio) |
| `app/api/create-checkout-session/route.ts` | Creates Stripe Checkout session ($7 one-time) |
| `components/OptimizerForm.tsx` | All form state, validation, extraction, analysis, checkout flow |
| `components/AnalysisResults.tsx` | Free preview display + paywall CTA |
| `components/OptimizedResults.tsx` | Full result display — resume, improvements, keywords, interview prep |
| `lib/extractUtils.ts` | Pure utils: `isSafeUrl`, `inferFromTitle` |
| `lib/llmUtils.ts` | Pure utils: `stripFences`, `safeArray`, `buildUserMessage` |
| `lib/formValidation.ts` | Pure util: `validate` |

## Environment variables

```bash
# LLM
OPENAI_API_KEY=sk-...                     # required
OPENAI_BASE_URL=https://api.openai.com/v1 # optional, default shown
OPENAI_MODEL=gpt-4o-mini                  # optional, default shown

# Stripe
STRIPE_SECRET_KEY=sk_test_...             # required for payments
NEXT_PUBLIC_APP_URL=http://localhost:3000 # required for Stripe redirect URLs

# Dev tools
NEXT_PUBLIC_ENABLE_DEV_UNLOCK=true        # shows bypass button that skips Stripe
```

## Development workflow

- Branch from `main` for every change
- PR targets `main`
- Never push directly to `main`
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`

## Running locally

```bash
npm install
cp .env.example .env.local  # fill in values
npm run dev
```

## Running tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

Tests cover pure utility functions only (`isSafeUrl`, `inferFromTitle`, `stripFences`, `safeArray`, `validate`). LLM and Stripe calls are not tested — they require real API keys.

## LLM prompt design

- `/api/analyze`: `temperature: 0.3`, `max_tokens: 1000`, `response_format: json_object`
- `/api/optimize`: `temperature: 0.3`, `max_tokens: 4000`, `response_format: json_object`
- Both prompts explicitly forbid fabricating experience, skills, or metrics
- `[add metric]` placeholder instructed for bullets needing real numbers
- `stripFences()` strips markdown code fences as a safety net even with `json_object` format

## Intentionally not built (MVP scope)

- Authentication
- Database / persistence
- Stripe webhooks (payment verified by trust + sessionStorage for MVP)
- PDF/DOCX export
- Job tracker
- Auto-apply
- Hiring manager finder
- Subscriptions
- Dashboard

## Stripe payment flow

```
1. User completes free analysis
2. Inputs saved to sessionStorage("jc_payload")
3. POST /api/create-checkout-session → returns Stripe URL
4. Client redirects to Stripe Checkout
5. On success → /success?session_id=...
6. SuccessContent reads sessionStorage, clears it, calls /api/optimize
7. Full result rendered
```

The session_id in the success URL is currently unused (no webhook verification). Add Stripe webhooks before handling large volumes.

## SSRF protection

`isSafeUrl()` in `lib/extractUtils.ts` blocks:
- Non-http(s) protocols
- `localhost`, `127.0.0.1`, `::1`
- Private IPv4 ranges: `10.x`, `172.16–31.x`, `192.168.x`, `169.254.x`

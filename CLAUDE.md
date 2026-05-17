# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server on `:3000` (Turbopack).
- `npm run build` — production build (`output: "standalone"` — produces `.next/standalone` for the Docker runner).
- `npm start` — run the production build.
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, `eslint-config-next`).
- `docker compose up -d --build` — containerized run; reads `.env`, exposes `:3000`, wget healthcheck every 30s.

There is no test framework wired up.

Note: `next.config.ts` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`. CI-style validation must be done by running `npm run lint` and `tsc --noEmit` explicitly — `npm run build` will NOT catch type or lint errors.

## Environment

- `GEMINI_API_KEY` — server-side Gemini key (optional if BYOK is acceptable). Loaded from `.env` by Next and docker-compose.
- `x-gemini-key` request header — user-supplied key from the `/generate` UI; **takes precedence over the server key** (see `route.ts:159`).

## Architecture

This is a single-purpose Next.js 16 App Router app: it turns an Engineering Graphics prose problem into a **single self-contained HTML file** that renders a First-Angle Projection plate, then displays that HTML inside a sandboxed iframe.

The whole app is three files of substance:

1. **`src/app/api/generate/route.ts`** — the only server logic. POST takes `{ prompt }`, calls `@google/genai` with:
   - `PRIMARY_MODEL = "gemini-2.5-pro"`, `FALLBACK_MODEL = "gemini-2.5-flash"`.
   - **Model selection inverts based on key source**: server key → Pro first, Flash fallback. BYOK user key → Flash first, Pro fallback (free-tier user keys have a tighter Pro RPM budget). Quota errors on the primary trigger one retry on the secondary.
   - A long `SYSTEM_INSTRUCTION` baked into the route that enforces first-angle convention (VP above XY, HP below), the color palette (FV `#e53e3e`, TV `#3182ce`, projectors `#a0aec0`), vertex labelling (`a` / `a'`), three-stage layout, and the apparent-angle formula `β = arctan(tan θ / cos φ)`. Editing this prompt changes every future plate.
   - Returns structured error codes the client switches on: `NEEDS_USER_KEY`, `RATE_LIMITED`, `INVALID_USER_KEY`, `INVALID_SERVER_KEY`, `BAD_OUTPUT`, `GENERATION_FAILED`. The `needsUserKey: true` flag on a response is the trigger for the client BYOK modal.
   - Output is stripped of markdown fences (`stripFences`) and validated to start with `<!doctype html` before returning.

2. **`src/lib/exampleHtml.ts`** — a hand-written, working 8-problem solver shipped as a string. It's appended to every user prompt as a **few-shot exemplar**. Gemini is instructed to match its CSS, canvas DPR scaling, projector logic, and steps card *exactly*, changing only the problem-specific geometry. **Editing this file changes the visual identity and structure of every generated plate** — treat it as part of the system prompt, not as throwaway data.

3. **`src/app/generate/page.tsx`** — "The Studio". Composer + iframe preview + BYOK modal. The user key lives in `localStorage` under `graphicai.geminiKey` and is sent as the `x-gemini-key` header. The key panel opens automatically when the API returns `needsUserKey: true`.

`src/app/page.tsx` is the landing folio. `src/app/layout.tsx` wires Fraunces / JetBrains Mono / Inter via `next/font`. `src/app/globals.css` contains the hand-written drafting design system (bone paper `#f1ece2`, graphite `#1a1816`, sanguine `#b8341c`, blueprint `#1e5fa8`) — don't replace this with off-the-shelf component aesthetics.

## Editing rules specific to this repo

- The system prompt and exemplar are tightly coupled. If you change the output's CSS/structure expectations in `SYSTEM_INSTRUCTION`, update `exampleHtml.ts` to match, and vice versa. Drift between the two causes Gemini to emit hybrid output that fails the `<!doctype html` self-check or renders broken.
- The route's `temperature: 0.15` and `maxOutputTokens: 32768` are tuned for deterministic long-form HTML generation against the ~20KB exemplar. Lower temperature breaks geometric variety; higher temperature breaks layout discipline.
- BYOK is a hard requirement, not a nice-to-have: assume the server key may be missing or rate-limited and that the client must degrade gracefully through the `needsUserKey` path.

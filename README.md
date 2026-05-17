# GraphicAI

> A drafting machine for engineering students. Type the problem in prose — get
> a first-angle projection plate, drafted on bone paper, with the matrices
> shown.

Built with Next.js 16, Tailwind v4, Framer Motion, and Google Gemini 2.5 Pro.
From a student, to students. — Arsh Pathan.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure your Gemini key
cp .env.example .env
# then edit .env and paste your GEMINI_API_KEY

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Getting a Gemini API key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with any Google account.
3. Click **Create API key** — Google will mint one starting with `AIza…`.
4. Paste it into `.env` as `GEMINI_API_KEY=…`.

The free tier on Gemini 2.5 Flash is generous (15 RPM, 1500 requests/day).

---

## Bring Your Own Key (BYOK)

If the server's shared API key hits its quota — or if you're self-hosting and
don't want to provision a server key at all — the `/generate` UI gracefully
prompts the user to paste their own key. It is:

- Stored only in the browser's `localStorage`.
- Sent over a request header (`x-gemini-key`) directly to your server, which
  forwards it to Google. **Never logged.**
- Cleared instantly from the same panel.

The route in `src/app/api/generate/route.ts` prefers the user-supplied key
over the server key when both are present.

---

## Docker

```bash
docker compose up -d --build
```

The compose file loads `.env` for `GEMINI_API_KEY`, exposes port 3000, and
adds a wget-based healthcheck.

---

## Stack

| Layer       | Choice                                          |
| ----------- | ----------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack, standalone)  |
| Language    | TypeScript                                      |
| Styling     | Tailwind CSS v4 + custom drafting design system |
| Motion      | Framer Motion 12                                |
| AI          | Google Gemini 2.5 Pro / Flash via `@google/genai` |
| Type        | First-Angle Projection of plane laminae        |

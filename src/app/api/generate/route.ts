import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { exampleHtml } from "@/lib/exampleHtml";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Best Gemini model for long, deterministic code generation in 2026.
 * gemini-2.5-pro: strongest reasoning + 1M context, ideal for our few-shot
 * exemplar (which itself is ~20KB of HTML). gemini-2.5-flash is the fallback
 * for BYOK users on the free tier.
 */
const PRIMARY_MODEL = "gemini-2.5-pro";
const FALLBACK_MODEL = "gemini-2.5-flash";

/* ────────────────────────────────────────────────────────────────────────
 * SYSTEM INSTRUCTION
 * Engineering-graphics drafting standards baked in. The model must obey
 * the exemplar's structure (canvas + steps card) AND the geometric rules
 * of First Angle Projection.
 * ──────────────────────────────────────────────────────────────────────── */
const SYSTEM_INSTRUCTION = `You are GraphicAI — an expert Computational Geometry Engineer and draftsman. Your only job is to emit a **single, self-contained HTML file** that solves and renders an Engineering Graphics problem in **First Angle Projection**.

══════════════════════════════════════════════════════════════════════════
NON-NEGOTIABLE OUTPUT RULES
══════════════════════════════════════════════════════════════════════════
1. Output MUST start with \`<!DOCTYPE html>\` and end with \`</html>\`.
2. Output MUST be a single file — inline all CSS in <style>, all JS in <script>. No external requests, no CDN, no fonts loaded from the network (use system font stacks only).
3. NEVER wrap the output in markdown code fences. NEVER add explanatory prose before or after the HTML.
4. The page must render on its own in any modern browser, with no build step.

══════════════════════════════════════════════════════════════════════════
ENGINEERING GRAPHICS STANDARDS (FIRST ANGLE PROJECTION)
══════════════════════════════════════════════════════════════════════════
• XY line is the reference. **VP above XY, HP below XY** (first-angle convention).
• **Front View (FV)** in CRIMSON (#e53e3e) — appears ABOVE XY (lifted by +z).
• **Top View (TV)** in BLUEPRINT BLUE (#3182ce) — appears BELOW XY (offset by +y).
• **Projectors / locus lines** in muted grey (#a0aec0), 1px, dashed when transferring between stages.
• Vertices labelled with lowercase letters: \`a\` for TV points, \`a'\` for FV points. Place labels with small offset from the dot, never overlapping the polygon edge.
• Three stages, drawn left-to-right:
   – Stage 1: True Shape (lamina parallel to HP, resting on the named element)
   – Stage 2: HP Inclination (lamina rotated about an axis in HP, so the surface makes the stated angle with HP)
   – Stage 3: VP Inclination (the previous stage rotated about an axis in VP, so the named line makes the stated angle with VP)
• When BOTH HP and VP inclinations are given for a line/diagonal, use the **apparent angle** formula:  β = arctan( tan(θ_true) / cos(φ_HP) )  where φ_HP is the surface angle to HP. State the computed β in the steps card.
• When the problem fixes a foreshortened length (e.g. "diagonal twice the other", "top view appears as a square"), derive the HP angle from the cos⁻¹ / sin⁻¹ ratio rather than guessing.

══════════════════════════════════════════════════════════════════════════
MATHEMATICAL SOLVER REQUIREMENTS
══════════════════════════════════════════════════════════════════════════
• Build the lamina as a JS array of vertex objects: \`{x, y, label}\` in mm, in true shape lying in the XY plane.
• Compute rotations explicitly. Two rotations max:
    – HP rotation about the Y axis:   x' = x·cos(θ),   z' = x·sin(θ)
    – VP rotation about the Z axis:   x'' = x'·cos(β) − y·sin(β),   y'' = x'·sin(β) + y·cos(β)
• Auto-compute global Y offset so the lowest projected point sits ~30mm below XY (no view ever drifts off-canvas).
• Auto-compute bounding boxes per stage and lay them out with a 120px horizontal gutter, centred horizontally on the canvas.
• Use \`window.devicePixelRatio\` scaling on the canvas so the drawing is crisp on retina displays.
• If the lamina is a circle, approximate it with 12 equispaced points and label \`a\`…\`l\`.

══════════════════════════════════════════════════════════════════════════
UI / LAYOUT (match the provided exemplar exactly)
══════════════════════════════════════════════════════════════════════════
• Background \`#f8f9fa\`, container card white with soft shadow, 1050px max width.
• Heading: "Engineering Graphics: Projection Solver".
• Problem statement in a blue-left-border callout (\`.problem-desc\`).
• Canvas 100% wide, 550px tall, light grey fill.
• Legend row beneath canvas: FV (red box), TV (blue box), Projectors / Locus (grey rule).
• Steps card titled "Calculated Orientations & Output Values" with an ordered list — at minimum: True Shape, HP Tilt (with computed θ in degrees), VP Tilt (with computed β if applicable). Each step uses <strong> for the label.
• Do NOT include the multi-problem dropdown the exemplar uses — the file should solve and render ONLY the problem the user asked for. Hard-code the single problem.
• System font stack: \`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif\`.

══════════════════════════════════════════════════════════════════════════
SELF-CHECK BEFORE EMITTING
══════════════════════════════════════════════════════════════════════════
Before writing the closing </html>, silently verify:
  ☑ All three stages draw without overlapping.
  ☑ Every labelled vertex in TV has a matching primed label in FV directly above it on the same projector.
  ☑ HP angle and VP angle in the steps card match what the JS actually rotates by.
  ☑ No undefined variables, no missing closing braces, no JSON parse calls.
  ☑ Canvas resize handler is wired so the figure recentres on window resize.

If any check fails, FIX it before emitting. Do not emit broken HTML.`;

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */
function stripFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```html")) t = t.replace(/^```html\n?/, "");
  else if (t.startsWith("```")) t = t.replace(/^```[a-zA-Z]*\n?/, "");
  if (t.endsWith("```")) t = t.replace(/\n?```$/, "");
  return t.trim();
}

function isQuotaError(err: unknown): boolean {
  if (!err) return false;
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : JSON.stringify(err);
  const haystack = msg.toLowerCase();
  return (
    haystack.includes("quota") ||
    haystack.includes("rate limit") ||
    haystack.includes("resource_exhausted") ||
    haystack.includes("resource exhausted") ||
    haystack.includes("429") ||
    haystack.includes("exceeded")
  );
}

function isAuthError(err: unknown): boolean {
  if (!err) return false;
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : JSON.stringify(err);
  const h = msg.toLowerCase();
  return (
    h.includes("api key not valid") ||
    h.includes("api_key_invalid") ||
    h.includes("permission denied") ||
    h.includes("401") ||
    h.includes("403") ||
    h.includes("unauthenticated")
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * POST /api/generate
 * Body:    { prompt: string }
 * Headers: x-gemini-key?: string  (BYOK — overrides server key)
 * ──────────────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  let prompt = "";
  try {
    const body = await req.json();
    prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON body." },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json(
      { error: "Problem statement is required." },
      { status: 400 }
    );
  }

  const userKey = req.headers.get("x-gemini-key")?.trim();
  const serverKey = process.env.GEMINI_API_KEY?.trim();
  const apiKey = userKey || serverKey;
  const usingUserKey = Boolean(userKey);

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No API key available. The server has no GEMINI_API_KEY configured and you have not supplied one.",
        code: "NEEDS_USER_KEY",
        needsUserKey: true,
      },
      { status: 503 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const userMessage = `Below is a CANONICAL exemplar of the expected single-file HTML output. Study its CSS, canvas scale handling, projector logic, vertex labelling, and steps card. Match this structure EXACTLY — only the problem-specific geometry, the problem statement text, and the steps content should change.

═══ BEGIN EXEMPLAR ═══
${exampleHtml}
═══ END EXEMPLAR ═══

Now produce the complete single-file HTML solution for ONLY this problem (do not include the problem dropdown — render this one problem directly):

"${prompt}"`;

  // Choose model: server key gets the strong model; BYOK users get flash by
  // default since their personal keys typically sit on the free tier with
  // a tighter Pro RPM budget.
  const primary = usingUserKey ? FALLBACK_MODEL : PRIMARY_MODEL;
  const secondary = usingUserKey ? PRIMARY_MODEL : FALLBACK_MODEL;

  async function callModel(model: string) {
    return ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.15,
        maxOutputTokens: 32768,
      },
    });
  }

  try {
    let response;
    try {
      response = await callModel(primary);
    } catch (primaryErr) {
      // If the primary model is rate-limited, try the other tier once before
      // giving up — but only when we still have a key to retry with.
      if (isQuotaError(primaryErr) && !isAuthError(primaryErr)) {
        try {
          response = await callModel(secondary);
        } catch (secondaryErr) {
          throw secondaryErr;
        }
      } else {
        throw primaryErr;
      }
    }

    const raw = response.text || "";
    const html = stripFences(raw);

    if (!html || !html.toLowerCase().includes("<!doctype html")) {
      return NextResponse.json(
        {
          error:
            "The model returned a malformed response. Please refine the problem statement and try again.",
          code: "BAD_OUTPUT",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      html,
      model: primary,
      usingUserKey,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (isAuthError(error)) {
      return NextResponse.json(
        {
          error: usingUserKey
            ? "Your API key was rejected by Google. Double-check it on https://aistudio.google.com/app/apikey."
            : "The server API key is invalid. Please supply your own key.",
          code: usingUserKey ? "INVALID_USER_KEY" : "INVALID_SERVER_KEY",
          needsUserKey: true,
        },
        { status: 401 }
      );
    }

    if (isQuotaError(error)) {
      return NextResponse.json(
        {
          error: usingUserKey
            ? "Your personal Gemini key has hit its quota. Wait a minute or upgrade your plan."
            : "The studio's shared key is rate-limited right now. Add your own Gemini key to keep drafting — it takes 30 seconds.",
          code: "RATE_LIMITED",
          needsUserKey: !usingUserKey,
        },
        { status: 429 }
      );
    }

    const msg =
      error instanceof Error
        ? error.message
        : "Failed to generate graphic. Please try again.";
    return NextResponse.json(
      { error: msg, code: "GENERATION_FAILED" },
      { status: 500 }
    );
  }
}

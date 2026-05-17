"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_PROMPTS = [
  "A thin square plate of side 40 mm stands on one of its corners on HP; opposite corner is raised so one diagonal is twice the other and is parallel to both reference planes.",
  "Hexagonal lamina of side 25 mm rests on a corner on HP, plane @ 45° to HP, diagonal through the resting corner @ 30° to VP.",
  "Circular lamina of 50 mm diameter rests on HP with one diameter inclined at 30° to VP and 45° to HP.",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setHtml(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setHtml(data.html);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plate.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-body relative overflow-hidden flex flex-col">
      {/* paper substrate */}
      <div className="fixed inset-0 -z-10 bg-drafting paper-grain" />
      <div className="fixed inset-0 -z-10 paper-noise pointer-events-none" />

      {/* Top hairline rule */}
      <div className="h-[3px] w-full bg-ink" />
      <div className="h-2 w-full ruler-top opacity-60" />

      {/* Header / title block */}
      <header className="px-6 md:px-10 py-4 flex items-center justify-between border-b border-ink/40 bg-vellum/60 backdrop-blur-sm relative z-30">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-pencil hover:text-ink transition-colors flex items-center gap-2"
          >
            <span className="text-sanguine">←</span> Folio
          </Link>
          <div className="h-5 w-px bg-ink/30" />
          <div>
            <div className="font-display text-lg tracking-tight leading-none">
              The Studio
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">
              Plate Composer · DWG-002
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil">
          <span>Method: <span className="text-ink">First Angle</span></span>
          <span>Scale: <span className="text-ink">1 : 1</span></span>
          <span>Engine: <span className="text-ink">Gemini · v2.5</span></span>
        </div>

        {html && (
          <motion.button
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] hover:bg-pencil transition-colors shadow-[3px_3px_0_var(--color-sanguine)]"
          >
            ↓ Export HTML
          </motion.button>
        )}
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[460px_1fr] min-h-0 relative">
        {/* ─── Left composer panel ────────────────────────────────── */}
        <aside className="border-r border-ink/40 bg-vellum/40 flex flex-col min-h-0">
          <div className="px-6 md:px-8 py-7 border-b border-ink/30">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display text-2xl italic text-sanguine">
                I.
              </span>
              <h2 className="font-display text-2xl tracking-tight">
                State the problem
              </h2>
            </div>
            <p className="text-pencil text-sm leading-relaxed pl-9">
              Give the primitive, dimensions, resting condition, and the two
              inclinations (HP & VP).
            </p>
          </div>

          <div className="px-6 md:px-8 py-6 flex-1 overflow-y-auto">
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft mb-3">
              Problem statement
            </label>

            <div className="relative">
              {/* corner ticks */}
              <Tick className="absolute -top-1 -left-1" />
              <Tick className="absolute -top-1 -right-1" />
              <Tick className="absolute -bottom-1 -left-1" />
              <Tick className="absolute -bottom-1 -right-1" />

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A hexagonal lamina of side 25 mm rests on a corner on HP, plane at 45° to HP, diagonal at 30° to VP…"
                className="w-full h-72 p-5 bg-paper border border-ink/50 resize-none focus:outline-none focus:border-ink focus:shadow-[3px_3px_0_var(--color-sanguine)] transition-all text-[14px] leading-[1.6] text-ink placeholder:text-ink-soft/70 font-body"
              />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              <span>{prompt.length} char</span>
              <span>en-IN · plain</span>
            </div>

            <div className="mt-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft mb-3">
                Or pick a precedent
              </div>
              <ul className="space-y-2">
                {SAMPLE_PROMPTS.map((p, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setPrompt(p)}
                      className="w-full text-left text-[13px] leading-snug text-pencil hover:text-ink border border-ink/20 hover:border-ink hover:shadow-[2px_2px_0_var(--color-ink)] bg-paper/60 p-3 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sanguine pt-0.5">
                          §{i + 1}
                        </span>
                        <span className="line-clamp-2">{p}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-6 md:px-8 py-5 border-t border-ink/30 bg-paper/60">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full group relative bg-ink text-paper py-4 font-mono text-[11px] uppercase tracking-[0.24em] hover:bg-pencil disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[5px_5px_0_var(--color-sanguine)] disabled:shadow-[3px_3px_0_var(--color-rule)]"
            >
              <span className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Spinner />
                    Drafting…
                  </>
                ) : (
                  <>
                    Draft the plate
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-sanguine/10 border-l-2 border-sanguine text-sanguine font-mono text-[11px] leading-relaxed"
                >
                  ✘ {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* ─── Right preview canvas ───────────────────────────────── */}
        <section className="relative flex flex-col min-h-0">
          {/* corner annotation */}
          <div className="absolute top-4 right-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft z-10 text-right">
            Plate · DWG-002
            <br />
            <span className="text-sanguine">
              {loading ? "drafting…" : html ? "rendered ✓" : "awaiting input"}
            </span>
          </div>

          <div className="flex-1 grid place-items-center p-6 md:p-10 overflow-auto">
            <AnimatePresence mode="wait">
              {!html && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-md text-center relative"
                >
                  <EmptyDraftingFigure />
                  <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-pencil">
                    Plate · empty · awaiting prose
                  </div>
                  <h3 className="font-display text-3xl mt-2 tracking-tight text-ink">
                    The drawing board is set.
                  </h3>
                  <p className="text-pencil mt-3 leading-relaxed text-sm">
                    Write your problem on the left. We will sharpen the
                    pencils, calculate the matrices, and lay down the views.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-3xl"
                >
                  <DraftingLoader />
                </motion.div>
              )}

              {html && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-[1100px] mx-auto"
                >
                  <div className="bg-paper border border-ink/70 shadow-[10px_10px_0_var(--color-ink)]">
                    <div className="flex items-stretch border-b border-ink/60 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil">
                      <div className="flex-1 px-4 py-2 border-r border-ink/40">
                        Generated · preview.html
                      </div>
                      <div className="px-4 py-2 border-r border-ink/40">
                        SCALE 1:1
                      </div>
                      <div className="px-4 py-2 text-sanguine">
                        rendered ✓
                      </div>
                    </div>
                    <iframe
                      srcDoc={html}
                      title="Generated plate"
                      sandbox="allow-scripts"
                      className="w-full h-[78vh] bg-paper"
                    />
                  </div>
                  <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                    <span>Folio 002 · recto</span>
                    <span>drafted by GraphicAI</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ─── Tiny utilities ──────────────────────────────────────────────── */
function Tick({ className }: { className?: string }) {
  return (
    <div
      className={`w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-ink ${className}`}
    />
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M21 12 a 9 9 0 0 0 -9 -9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmptyDraftingFigure() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-44 mx-auto">
      <defs>
        <pattern id="g2" width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M16 0 L0 0 0 16"
            fill="none"
            stroke="rgba(26,24,22,0.08)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#g2)" />
      <line x1="20" y1="100" x2="300" y2="100" stroke="#1a1816" strokeWidth="1.5" />
      <text x="14" y="104" fontSize="9" fontFamily="var(--font-mono), monospace" fill="#1a1816" textAnchor="end">X</text>
      <text x="306" y="104" fontSize="9" fontFamily="var(--font-mono), monospace" fill="#1a1816">Y</text>
      <motion.polygon
        points="120,140 160,120 200,140 160,160"
        fill="none"
        stroke="#1e5fa8"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.line
        x1="120"
        y1="100"
        x2="200"
        y2="60"
        stroke="#b8341c"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
      />
      {[120, 160, 200].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={x === 160 ? 120 : 100}
          x2={x}
          y2={140}
          stroke="#1a1816"
          strokeOpacity="0.4"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      ))}
    </svg>
  );
}

function DraftingLoader() {
  return (
    <div className="bg-paper border border-ink/70 shadow-[8px_8px_0_var(--color-ink)] overflow-hidden">
      <div className="flex items-stretch border-b border-ink/60 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil">
        <div className="flex-1 px-4 py-2 border-r border-ink/40">
          Drafting · plate composer
        </div>
        <div className="px-4 py-2 text-sanguine">in progress</div>
      </div>

      <div className="relative h-[60vh] bg-vellum bg-drafting-fine overflow-hidden">
        {/* scanning line */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-transparent via-blueprint/15 to-transparent border-b border-blueprint/60 animate-scan" />

        {/* skeleton plate */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 m-auto w-3/4 h-3/4"
        >
          <line x1="20" y1="150" x2="380" y2="150" stroke="#1a1816" strokeWidth="1.5" />
          <motion.polygon
            points="160,210 220,170 280,210 220,250"
            fill="none"
            stroke="#1e5fa8"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.line
            x1="160"
            y1="150"
            x2="280"
            y2="90"
            stroke="#b8341c"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
            Calculating matrices · projecting vertices
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft mt-1">
            θ → β → render
          </div>
        </div>
      </div>
    </div>
  );
}

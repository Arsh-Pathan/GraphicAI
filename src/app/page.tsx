"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * GraphicAI — Landing
 * Aesthetic: drafting atelier. Bone paper, graphite ink, blueprint cyan,
 * sanguine red. Editorial serif (Fraunces) + technical mono (JetBrains).
 * Hand-drafted SVG plates, ruler tick-marks, asymmetric editorial grid.
 * ──────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const driftRot = useTransform(scrollYProgress, [0, 1], [0, 6]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-paper text-ink font-body relative overflow-x-hidden"
    >
      {/* Paper substrate */}
      <div className="fixed inset-0 -z-10 bg-drafting paper-grain pointer-events-none" />
      <div className="fixed inset-0 -z-10 paper-noise pointer-events-none" />
      {/* Vignette to give the paper an edge */}
      <div className="fixed inset-0 -z-10 pointer-events-none [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(26,24,22,0.12))]" />

      <TopRule />
      <Header />
      <Hero />
      <BeltStrip />
      <PlateShowcase />
      <Methodology />
      <ProblemTypes />
      <Workflow />
      <Manifesto />
      <Footer />

      {/* Parallax decorative compass in the gutter */}
      <motion.div
        style={{ y: driftY, rotate: driftRot }}
        aria-hidden
        className="hidden xl:block fixed right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"
      >
        <CompassRose />
      </motion.div>
    </div>
  );
}

/* ─── Top hairline ruler ──────────────────────────────────────────────── */
function TopRule() {
  return (
    <div className="relative w-full">
      <div className="h-[3px] w-full bg-ink" />
      <div className="h-3 w-full ruler-top opacity-70" />
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────────────────── */
function Header() {
  return (
    <header className="w-full px-6 md:px-10 py-5 flex items-center justify-between relative z-30">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 border-[1.5px] border-ink rounded-sm grid place-items-center bg-paper shadow-[2px_2px_0_var(--color-ink)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0_var(--color-ink)] transition-all">
          <MarkGlyph className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-[19px] font-semibold tracking-tight">
            GraphicAI
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft -mt-0.5">
            DRAFTING&nbsp;ATELIER&nbsp;·&nbsp;EST.&nbsp;2026
          </div>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-pencil">
        <a href="#plates" className="hover:text-ink transition-colors">
          01 · Plates
        </a>
        <a href="#method" className="hover:text-ink transition-colors">
          02 · Method
        </a>
        <a href="#manifesto" className="hover:text-ink transition-colors">
          03 · Manifesto
        </a>
      </nav>

      <Link
        href="/generate"
        className="group inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-pencil transition-colors shadow-[3px_3px_0_var(--color-sanguine)]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sanguine-soft" />
        Open Studio
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </header>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative px-6 md:px-10 pt-12 md:pt-20 pb-24 max-w-[1400px] mx-auto">
      {/* Folio number */}
      <div className="absolute top-6 right-6 md:right-10 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft text-right">
        Folio 001 / Recto
        <br />
        <span className="text-pencil">Plate A — Hero</span>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
        {/* Headline column */}
        <div className="col-span-12 lg:col-span-7 relative">
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="h-px w-10 bg-ink" />
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-pencil">
              An engineering-graphics drafting machine
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05 }}
            className="font-display font-light text-[58px] md:text-[92px] lg:text-[112px] leading-[0.92] tracking-[-0.035em] text-ink"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
          >
            Draft the{" "}
            <span className="italic font-normal text-sanguine">
              projection
            </span>
            ,
            <br />
            keep the{" "}
            <span className="relative inline-block">
              <span className="hand-underline">marks</span>
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-10 max-w-xl text-[17px] leading-[1.65] text-pencil"
          >
            Type a problem statement in plain English. GraphicAI computes the
            rotation matrices, derives the apparent angle{" "}
            <span className="font-mono text-ink">
              β = arctan(tan θ ÷ cos φ)
            </span>
            , and renders a first-angle blueprint on canvas — with crimson
            front views, blue top views, ticked projectors and floating
            vertex labels. The way your viva expects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-12 flex flex-wrap items-center gap-5"
          >
            <Link
              href="/generate"
              className="group inline-flex items-center gap-3 bg-ink text-paper pl-6 pr-3 py-4 font-mono text-[12px] uppercase tracking-[0.2em] hover:bg-pencil transition-colors shadow-[5px_5px_0_var(--color-sanguine)]"
            >
              Start a new plate
              <span className="grid place-items-center w-8 h-8 bg-sanguine text-paper">
                →
              </span>
            </Link>
            <a
              href="#plates"
              className="font-mono text-[12px] uppercase tracking-[0.2em] text-ink hand-underline"
            >
              Inspect plate archive ↓
            </a>
          </motion.div>

          {/* Hero callouts: notarized values */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 max-w-2xl"
          >
            {[
              ["08", "Problem types"],
              ["1:1", "Drafting scale"],
              ["β", "Apparent angle"],
              ["1°", "Solver tolerance"],
            ].map(([n, l]) => (
              <div key={l as string} className="relative">
                <div className="font-display text-3xl md:text-4xl text-ink tabular-nums">
                  {n}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft mt-1">
                  {l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero plate column */}
        <div className="col-span-12 lg:col-span-5 relative">
          <HeroPlate />
        </div>
      </div>
    </section>
  );
}

/* ─── Hero Plate (the showpiece SVG) ─────────────────────────────────── */
function HeroPlate() {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative bg-vellum border border-ink/80 shadow-[8px_8px_0_var(--color-ink)]"
    >
      {/* Title block */}
      <figcaption className="flex items-stretch border-b border-ink/80 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil">
        <div className="flex-1 px-4 py-2 border-r border-ink/60">
          Plate A.1 — Square plate · corner on HP
        </div>
        <div className="px-4 py-2 border-r border-ink/60">SCALE 1:1</div>
        <div className="px-4 py-2">FIRST ANGLE</div>
      </figcaption>

      <svg
        viewBox="0 0 520 600"
        className="block w-full h-auto"
        aria-label="First-angle projection of a tilted square plate"
      >
        <defs>
          <pattern
            id="paperGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(26,24,22,0.07)"
              strokeWidth="0.5"
            />
          </pattern>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1a1816" />
          </marker>
        </defs>

        <rect width="520" height="600" fill="url(#paperGrid)" />

        {/* XY reference line */}
        <line
          x1="30"
          y1="300"
          x2="490"
          y2="300"
          stroke="#1a1816"
          strokeWidth="2"
        />
        <text
          x="22"
          y="304"
          fontFamily="var(--font-mono), monospace"
          fontSize="11"
          fill="#1a1816"
          textAnchor="end"
        >
          X
        </text>
        <text
          x="498"
          y="304"
          fontFamily="var(--font-mono), monospace"
          fontSize="11"
          fill="#1a1816"
        >
          Y
        </text>
        <text
          x="36"
          y="292"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          fill="#6b6358"
        >
          VP
        </text>
        <text
          x="36"
          y="314"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          fill="#6b6358"
        >
          HP
        </text>

        {/* FRONT VIEW — sanguine */}
        <g>
          {/* tilted edge view of the plate (foreshortened) */}
          <motion.line
            x1="120"
            y1="300"
            x2="260"
            y2="180"
            stroke="#b8341c"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 0.6 }}
            style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
            className="draft-stroke"
          />
          {/* mid-diagonal */}
          <motion.line
            x1="120"
            y1="300"
            x2="190"
            y2="240"
            stroke="#b8341c"
            strokeWidth="1.2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          />
          {/* labels */}
          <text
            x="116"
            y="312"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            a′
          </text>
          <text
            x="194"
            y="232"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            b′,d′
          </text>
          <text
            x="266"
            y="172"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            c′
          </text>

          {/* angle arc */}
          <path
            d="M 160 300 A 40 40 0 0 0 154 268"
            fill="none"
            stroke="#1a1816"
            strokeWidth="0.8"
          />
          <text
            x="166"
            y="288"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#b8341c"
          >
            θ = 60°
          </text>
        </g>

        {/* TOP VIEW — blueprint */}
        <g>
          <motion.polygon
            points="120,420 220,360 320,420 220,480"
            fill="rgba(30,95,168,0.04)"
            stroke="#1e5fa8"
            strokeWidth="2.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.1 }}
          />
          {/* diagonals */}
          <line
            x1="120"
            y1="420"
            x2="320"
            y2="420"
            stroke="#1e5fa8"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <line
            x1="220"
            y1="360"
            x2="220"
            y2="480"
            stroke="#1e5fa8"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          {/* labels */}
          <text
            x="106"
            y="424"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            a
          </text>
          <text
            x="216"
            y="352"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            b
          </text>
          <text
            x="326"
            y="424"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            c
          </text>
          <text
            x="216"
            y="496"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
          >
            d
          </text>
        </g>

        {/* Projectors */}
        {[
          [120, 300, 120, 420],
          [220, 240, 220, 360],
          [320, 180, 320, 420],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#1a1816"
            strokeOpacity="0.4"
            strokeWidth="0.6"
            strokeDasharray="2 3"
          />
        ))}

        {/* Dimension line: side = 40 mm */}
        <g>
          <line
            x1="120"
            y1="540"
            x2="320"
            y2="540"
            stroke="#1a1816"
            strokeWidth="0.8"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <line
            x1="120"
            y1="486"
            x2="120"
            y2="548"
            stroke="#1a1816"
            strokeWidth="0.5"
          />
          <line
            x1="320"
            y1="426"
            x2="320"
            y2="548"
            stroke="#1a1816"
            strokeWidth="0.5"
          />
          <rect x="206" y="528" width="28" height="14" fill="#f1ece2" />
          <text
            x="220"
            y="540"
            fontFamily="var(--font-mono), monospace"
            fontSize="11"
            fill="#1a1816"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            40
          </text>
        </g>

        {/* Stamp / annotation */}
        <g transform="translate(360,460)">
          <rect
            width="130"
            height="100"
            fill="#faf6ec"
            stroke="#1a1816"
            strokeWidth="1"
          />
          <text
            x="65"
            y="22"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fill="#1a1816"
            textAnchor="middle"
            letterSpacing="2"
          >
            COMPUTED
          </text>
          <line x1="10" y1="30" x2="120" y2="30" stroke="#1a1816" />
          <text
            x="10"
            y="48"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fill="#6b6358"
          >
            θ (HP) = 60.00°
          </text>
          <text
            x="10"
            y="64"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fill="#6b6358"
          >
            φ (VP) = 30.00°
          </text>
          <text
            x="10"
            y="80"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fill="#6b6358"
          >
            d_app  = 28.28
          </text>
          <text
            x="10"
            y="96"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fill="#b8341c"
          >
            verified ✓
          </text>
        </g>
      </svg>

      {/* Bottom title block */}
      <div className="flex items-stretch border-t border-ink/80 font-mono text-[10px] uppercase tracking-[0.18em] text-pencil">
        <div className="flex-1 px-4 py-2 border-r border-ink/60">
          Drawn by · GraphicAI
        </div>
        <div className="px-4 py-2 border-r border-ink/60">DWG-001-A</div>
        <div className="px-4 py-2 text-ink">Rev 2.0</div>
      </div>
    </motion.figure>
  );
}

/* ─── Marquee belt strip ──────────────────────────────────────────────── */
function BeltStrip() {
  const items = [
    "ROTATION MATRICES",
    "APPARENT ANGLES",
    "FIRST-ANGLE METHOD",
    "VERTEX LOCI",
    "AUXILIARY VIEWS",
    "TRUE LENGTHS",
    "FORESHORTENING",
  ];
  return (
    <section className="border-y-2 border-ink bg-ink text-paper overflow-hidden">
      <div className="flex gap-12 py-3 font-mono text-[11px] uppercase tracking-[0.3em] whitespace-nowrap animate-[scroll_30s_linear_infinite]">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="text-sanguine-soft">✦</span>
            {t}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Plate Showcase ──────────────────────────────────────────────────── */
function PlateShowcase() {
  const plates = [
    {
      tag: "Plate II",
      title: "Pentagonal lamina",
      sub: "Corner on HP · plane @ 60° · edge @ 45° VP",
      glyph: <PentagonGlyph />,
      tone: "sanguine",
    },
    {
      tag: "Plate III",
      title: "Hexagonal disc",
      sub: "Resting corner · plane @ 45° · diagonal @ 30° VP",
      glyph: <HexGlyph />,
      tone: "blueprint",
    },
    {
      tag: "Plate IV",
      title: "Circular lamina",
      sub: "Diameter @ 30° VP · plane @ 45° HP",
      glyph: <CircleGlyph />,
      tone: "ochre",
    },
  ];

  return (
    <section
      id="plates"
      className="relative px-6 md:px-10 py-24 md:py-32 max-w-[1400px] mx-auto"
    >
      <SectionHeader
        number="02"
        eyebrow="A selection of recent plates"
        title="The archive."
        kicker="Every problem in the syllabus has the same skeleton: rest a primitive on the HP, tilt it, then rotate it about the Z. We render that skeleton — beautifully."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16">
        {plates.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            className="group relative bg-vellum border border-ink/70 shadow-[6px_6px_0_var(--color-ink)] hover:shadow-[8px_8px_0_var(--color-sanguine)] transition-all"
          >
            <div className="flex items-stretch border-b border-ink/60 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil">
              <div className="flex-1 px-3 py-2 border-r border-ink/40">
                {p.tag}
              </div>
              <div className="px-3 py-2">001/Recto</div>
            </div>

            <div className="aspect-square grid place-items-center bg-paper relative">
              <div className="absolute inset-0 bg-drafting-fine opacity-50" />
              <div className="relative w-3/4 h-3/4">{p.glyph}</div>
            </div>

            <div className="p-5 border-t border-ink/40 bg-vellum">
              <h3 className="font-display text-2xl tracking-tight text-ink mb-1">
                {p.title}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft leading-relaxed">
                {p.sub}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ─── Methodology ─────────────────────────────────────────────────────── */
function Methodology() {
  const steps = [
    {
      n: "I",
      title: "Initialise the vertex array.",
      body:
        "Every primitive — square, pentagon, hexagon, rhombus, circle — is born as a list of [x, y, z] triples lying flat on the HP at z = 0.",
      mono: "vertices = [[x, y, 0], …]",
    },
    {
      n: "II",
      title: "Tilt about the resting edge.",
      body:
        "A rotation matrix swings the plane around the corner (or edge) in contact with the HP, bringing the surface to its true inclination θ.",
      mono: "R_y(θ) · vertices",
    },
    {
      n: "III",
      title: "Twist about the vertical.",
      body:
        "A secondary rotation about the Z-axis turns the diagonal or edge to the requested VP relationship. If the problem states a true angle, we derive β = arctan(tan θ ÷ cos φ).",
      mono: "R_z(β) · vertices",
    },
    {
      n: "IV",
      title: "Project, label, dimension.",
      body:
        "The canvas draws the XY datum, drops the front view in sanguine above, the top view in blueprint below, ticks every projector, and floats vertex labels a′, b′…",
      mono: "draw(FV) · draw(TV)",
    },
  ];

  return (
    <section
      id="method"
      className="relative px-6 md:px-10 py-24 md:py-32 bg-vellum border-y border-ink/70"
    >
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader
          number="03"
          eyebrow="The drafting method"
          title="Four strokes. One projection."
          kicker="No black-box, no hallucinated geometry. The same procedure your textbook teaches — executed by code that you can read, fork, and submit."
        />

        <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative pl-20 border-l border-ink/30 pb-8"
            >
              <span className="absolute left-0 top-0 font-display text-5xl text-sanguine italic">
                {s.n}
              </span>
              <h3 className="font-display text-2xl md:text-[28px] tracking-tight text-ink mb-3">
                {s.title}
              </h3>
              <p className="text-pencil leading-[1.65] mb-3 max-w-md">
                {s.body}
              </p>
              <code className="inline-block bg-paper border border-ink/30 px-3 py-1 font-mono text-[11px] text-ink">
                {s.mono}
              </code>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── Problem types grid ──────────────────────────────────────────────── */
function ProblemTypes() {
  const types = [
    { t: "Square plate", n: "01" },
    { t: "Rhombus lamina", n: "02" },
    { t: "Isosceles triangle", n: "03" },
    { t: "Equilateral triangle", n: "04" },
    { t: "Pentagonal lamina", n: "05" },
    { t: "Rectangular plate", n: "06" },
    { t: "Hexagonal lamina", n: "07" },
    { t: "Circular disc", n: "08" },
  ];
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 max-w-[1400px] mx-auto">
      <SectionHeader
        number="04"
        eyebrow="What it knows"
        title="Eight primitives, every variation."
        kicker="From single-corner rest to compound apparent-angle problems — the eight templates below cover the entire first-year syllabus."
      />

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-l border-ink/40">
        {types.map((p) => (
          <div
            key={p.t}
            className="group border-r border-b border-ink/40 p-6 md:p-8 bg-paper hover:bg-vellum transition-colors relative"
          >
            <div className="flex items-start justify-between mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                Problem · {p.n}
              </span>
              <span className="w-2 h-2 rounded-full bg-sanguine opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-display text-xl md:text-2xl text-ink leading-tight">
              {p.t}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-pencil">
              ready to draft →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Workflow row ────────────────────────────────────────────────────── */
function Workflow() {
  return (
    <section className="relative px-6 md:px-10 py-24 bg-ink text-paper overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] [background:repeating-linear-gradient(0deg,transparent,transparent_19px,#f1ece2_19px,#f1ece2_20px)]" />
      <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-sanguine-soft">
            05 · Studio workflow
          </span>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight mt-6">
            From{" "}
            <span className="italic text-sanguine-soft">prose</span> to
            plate
            <br />
            in one breath.
          </h2>
          <p className="mt-8 text-paper/70 max-w-md leading-relaxed">
            Paste your manual problem. Pick first or third angle. Hit draft.
            The studio composes the page, dimensions the views, and hands
            you a downloadable HTML blueprint — runnable in any browser,
            inkable on any printer.
          </p>
          <Link
            href="/generate"
            className="mt-10 inline-flex items-center gap-3 bg-paper text-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-sanguine hover:text-paper transition-colors"
          >
            Enter the studio
            <span>→</span>
          </Link>
        </div>

        <div className="lg:col-span-7 relative">
          <TerminalCard />
        </div>
      </div>
    </section>
  );
}

function TerminalCard() {
  return (
    <div className="bg-paper text-ink border border-ink shadow-[10px_10px_0_var(--color-sanguine)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-ink/40 bg-vellum font-mono text-[10px] uppercase tracking-[0.2em] text-pencil">
        <span>graphicai/studio · plate.composer</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sanguine" />
          <span className="w-2 h-2 rounded-full bg-ochre" />
          <span className="w-2 h-2 rounded-full bg-moss" />
        </span>
      </div>
      <div className="p-6 font-mono text-[13px] leading-[1.8]">
        <Line prompt="$" cmd="> describe the problem" />
        <p className="pl-5 text-pencil">
          A hexagonal lamina of side 25 mm rests on one of its corners on the
          HP. The plane is inclined at 45° to HP and the diagonal through the
          resting corner is inclined at 30° to the VP.
        </p>
        <div className="my-3 border-t border-ink/20" />
        <Line prompt="parser:" cmd='shape="hexagon" side=25 rest="corner"' />
        <Line
          prompt="solver:"
          cmd="θ=45° (HP)   φ_true=30° (VP)   ⇒ β = 41.41°"
        />
        <Line prompt="render:" cmd="FV ↑ sanguine  ·  TV ↓ blueprint" />
        <Line prompt="✓" cmd="plate ready · 8 vertices · 12 projectors" />
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sanguine">›</span>
          <span className="text-ink">draft</span>
          <span className="inline-block w-2 h-4 bg-ink cursor-blink translate-y-0.5" />
        </div>
      </div>
    </div>
  );
}

function Line({ prompt, cmd }: { prompt: string; cmd: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-sanguine w-12 shrink-0">{prompt}</span>
      <span className="text-ink">{cmd}</span>
    </div>
  );
}

/* ─── Manifesto / signature ───────────────────────────────────────────── */
function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative px-6 md:px-10 py-32 max-w-[1100px] mx-auto"
    >
      <div className="relative">
        <span className="absolute -top-12 left-0 font-display italic text-[180px] leading-none text-sanguine/15 select-none pointer-events-none">
          “
        </span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative font-display text-3xl md:text-5xl leading-[1.15] tracking-tight text-ink"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0' }}
        >
          I built GraphicAI in my second year, after the third night of
          erasing the same pentagon. It is the tool I wish the syllabus had
          shipped with — a quiet, precise{" "}
          <span className="italic text-sanguine">drafting partner</span> that
          treats engineering graphics as a craft worth getting right.
        </motion.p>

        <div className="mt-10 flex items-center gap-4">
          <div className="w-12 h-px bg-ink" />
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
              Arsh Pathan
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              From student · to students
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 border-[1.5px] border-ink grid place-items-center bg-paper">
              <MarkGlyph className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-lg">GraphicAI</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">
                Drafting Atelier · MMXXVI
              </div>
            </div>
          </div>
          <p className="text-pencil text-sm leading-relaxed max-w-sm">
            A drafting partner for engineering students. Open in beta. Built
            in long study sessions on bone-coloured paper.
          </p>
        </div>

        <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil space-y-2">
          <div className="text-ink mb-3">Studio</div>
          <Link href="/generate" className="block hover:text-ink">
            Open
          </Link>
          <a href="#plates" className="block hover:text-ink">
            Archive
          </a>
          <a href="#method" className="block hover:text-ink">
            Method
          </a>
        </div>
        <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil space-y-2">
          <div className="text-ink mb-3">Reference</div>
          <span className="block">First angle</span>
          <span className="block">ISO 128</span>
          <span className="block">N.D. Bhatt</span>
        </div>
        <div className="md:col-span-3 font-mono text-[10px] uppercase tracking-[0.2em] text-pencil space-y-2">
          <div className="text-ink mb-3">Colophon</div>
          <span className="block">Fraunces · JetBrains Mono</span>
          <span className="block">Next.js · Gemini · Docker</span>
          <span className="block text-sanguine">© Arsh Pathan</span>
        </div>
      </div>
      <div className="border-t border-ink/30 px-6 md:px-10 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft flex justify-between">
        <span>plate 001 · recto · folio bound by hand</span>
        <span>scale 1 : 1</span>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Section header
 * ────────────────────────────────────────────────────────────────────── */
function SectionHeader({
  number,
  eyebrow,
  title,
  kicker,
}: {
  number: string;
  eyebrow: string;
  title: string;
  kicker: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-6 items-end">
      <div className="col-span-12 md:col-span-1 font-display text-5xl md:text-6xl text-sanguine italic leading-none">
        {number}
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-pencil mb-3">
          {eyebrow}
        </div>
        <h2
          className="font-display text-4xl md:text-6xl tracking-tight text-ink leading-[0.98]"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          {title}
        </h2>
      </div>
      <p className="col-span-12 md:col-span-5 text-pencil leading-[1.65] max-w-md md:justify-self-end">
        {kicker}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Decorative SVG glyphs
 * ────────────────────────────────────────────────────────────────────── */
function MarkGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 20 L12 4 L20 20 Z" stroke="#1a1816" strokeWidth="1.5" />
      <line x1="8" y1="20" x2="16" y2="20" stroke="#b8341c" strokeWidth="1.5" />
      <circle cx="12" cy="14" r="1" fill="#1a1816" />
    </svg>
  );
}

function PentagonGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon
        points="100,30 170,82 144,162 56,162 30,82"
        fill="none"
        stroke="#b8341c"
        strokeWidth="1.5"
      />
      <line x1="100" y1="30" x2="100" y2="162" stroke="#1a1816" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="30" y1="82" x2="170" y2="82" stroke="#1a1816" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="100" cy="100" r="2" fill="#1a1816" />
      <text x="100" y="180" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono), monospace" fill="#6b6358" letterSpacing="2">
        25 mm
      </text>
    </svg>
  );
}

function HexGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <polygon
        points="100,30 165,65 165,135 100,170 35,135 35,65"
        fill="none"
        stroke="#1e5fa8"
        strokeWidth="1.5"
      />
      <line x1="35" y1="100" x2="165" y2="100" stroke="#1a1816" strokeWidth="0.5" />
      <line x1="100" y1="30" x2="100" y2="170" stroke="#1a1816" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="35" y1="65" x2="165" y2="135" stroke="#1a1816" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="35" y1="135" x2="165" y2="65" stroke="#1a1816" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="35" cy="100" r="2.5" fill="#b8341c" />
    </svg>
  );
}

function CircleGlyph() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <ellipse cx="100" cy="100" rx="70" ry="40" fill="none" stroke="#c08a3e" strokeWidth="1.5" />
      <line x1="30" y1="100" x2="170" y2="100" stroke="#1a1816" strokeWidth="0.5" />
      <line x1="40" y1="76" x2="160" y2="124" stroke="#b8341c" strokeWidth="1" strokeDasharray="3 3" />
      <text x="100" y="180" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono), monospace" fill="#6b6358" letterSpacing="2">
        Ø 50 mm · 30°
      </text>
    </svg>
  );
}

function CompassRose() {
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      <circle cx="60" cy="60" r="55" fill="none" stroke="#1a1816" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#1a1816" strokeWidth="0.4" strokeDasharray="2 3" />
      <polygon points="60,10 64,60 60,55 56,60" fill="#b8341c" />
      <polygon points="60,110 56,60 60,65 64,60" fill="#1a1816" />
      <line x1="10" y1="60" x2="110" y2="60" stroke="#1a1816" strokeWidth="0.4" />
      <text x="60" y="8" textAnchor="middle" fontSize="6" fontFamily="var(--font-mono), monospace" fill="#1a1816">N</text>
      <text x="60" y="118" textAnchor="middle" fontSize="6" fontFamily="var(--font-mono), monospace" fill="#1a1816">S</text>
    </svg>
  );
}

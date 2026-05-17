/**
 * GraphicAI · canonical exemplar for DEVELOPMENT OF SURFACES problems.
 *
 * Solves "Problem": "Draw the development of the lateral surface of a
 * hexagonal prism, edge of base 25 mm and axis 50 mm long, rests such
 * that one of its rectangular faces is parallel to VP."
 *
 * The exemplar demonstrates the canonical layout the AI must reproduce:
 *
 *   1. XY line runs horizontally across the canvas.
 *   2. Top View (TV) drawn BELOW XY in BLUE (#3182ce) — shows the polygon
 *      base (hexagon, pentagon, square, triangle, circle).
 *   3. Front View (FV) drawn ABOVE XY in CRIMSON (#e53e3e) — shows the
 *      elevation rectangle (prisms/cylinders) or triangle (pyramids/cones).
 *   4. Development drawn to the RIGHT of the FV, connected by horizontal
 *      dashed projectors from the FV top/bottom edges.
 *      - PRISMS: Development = rectangle (height × perimeter), divided
 *        into N equal vertical strips. Bottom labels = a, b, c, …, a
 *        Top labels = 1, 2, 3, …, 1 (matching the FV corners).
 *      - PYRAMIDS: Development = fan of N equal triangles radiating from
 *        apex. Radius = slant height (True Length of lateral edge).
 *        Labels = a, b, c, …, a around the base arc, apex = o.
 *      - CYLINDERS: Development = rectangle (height × πD), divided into
 *        12 equal vertical strips.
 *      - CONES: Development = arc sector. R = slant height, θ = (r/R)×360°.
 *   5. Vertical projectors (dashed grey) connect TV vertices up through
 *      the XY line to FV.
 *   6. Dimensions shown for given values (base edge, height, perimeter).
 *   7. Steps card lists the construction procedure.
 *
 * LAYOUT PATTERN (from student's hand-drawn reference):
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  FV label                    Development label           │
 *   │  ┌──────┐  ←projectors→   ┌───┬───┬───┬───┬───┬───┐    │
 *   │  │      │                 │   │   │   │   │   │   │    │
 *   │  │  FV  │                 │   │   │   │   │   │   │    │
 *   │  │      │                 │   │   │   │   │   │   │    │
 *   │  └──────┘                 └───┴───┴───┴───┴───┴───┘    │
 *   │ ─────────── XY ─────────────────────────────────────── │
 *   │     /\                                                  │
 *   │    /  \    ← TV hexagon                                 │
 *   │   /    \                                                │
 *   │  TV label                                               │
 *   └──────────────────────────────────────────────────────────┘
 */
export const developmentExampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Engineering Graphics — Surface Development Solver</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f8f9fa; color:#333; padding:20px; margin:0; display:flex; flex-direction:column; align-items:center; }
  .container { background:#fff; padding:30px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.05); max-width:1050px; width:100%; box-sizing:border-box; }
  h2 { color:#2c3e50; margin:0 0 15px; border-bottom:2px solid #e2e8f0; padding-bottom:10px; }
  .problem-desc { background:#f8f9fa; padding:16px 20px; border-left:4px solid #2b6cb0; border-radius:0 6px 6px 0; font-size:15px; line-height:1.6; margin-bottom:25px; color:#4a5568; }
  .canvas-container { position:relative; overflow-x:auto; text-align:center; background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:10px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.02); }
  canvas { background:#fafafa; display:block; margin:0 auto; width:100%; height:600px; }
  .legend { display:flex; flex-wrap:wrap; justify-content:center; gap:20px; margin-top:15px; font-size:13px; font-weight:600; color:#4a5568; }
  .legend-item { display:flex; align-items:center; gap:8px; }
  .box { width:16px; height:16px; border-radius:4px; }
  .steps-card { margin-top:30px; background:#f1f3f5; padding:20px 25px; border-left:5px solid #2b6cb0; border-radius:6px; }
  .steps-card h3 { margin:0 0 15px; color:#2b6cb0; font-size:18px; }
  ol { padding-left:20px; line-height:1.65; margin:0; color:#2d3748; font-size:15px; }
  li { margin-bottom:10px; }
  li strong { color:#2c3e50; }
</style>
</head>
<body>
<div class="container">
  <h2>Engineering Graphics: Surface Development Solver</h2>
  <div class="problem-desc" id="problem-desc"></div>
  <div class="canvas-container"><canvas id="canvas"></canvas></div>
  <div class="legend">
    <div class="legend-item"><div class="box" style="background:#e53e3e;"></div> Front View (FV)</div>
    <div class="legend-item"><div class="box" style="background:#3182ce;"></div> Top View (TV)</div>
    <div class="legend-item"><div class="box" style="background:#38a169;"></div> Development</div>
    <div class="legend-item"><div class="box" style="background:#a0aec0; height:3px; border-radius:0; width:24px;"></div> Projectors</div>
  </div>
  <div class="steps-card">
    <h3>Construction Steps</h3>
    <ol id="steps-list"></ol>
  </div>
</div>

<script>
/* ─── Problem Parameters ───────────────────────────────────────────── */
const PROBLEM = {
  text: "<strong>Problem Statement:</strong> Draw the development of the lateral surface of a hexagonal prism, edge of base 25 mm and axis 50 mm long, rests such that one of its rectangular faces is parallel to VP."
};

const baseEdge = 25;   // mm
const axisHeight = 50; // mm
const sides = 6;       // hexagon

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* ─── Colour Palette ───────────────────────────────────────────────── */
const COLOR_XY   = '#4a5568';
const COLOR_PROJ  = '#a0aec0';
const COLOR_FV    = '#e53e3e';
const COLOR_TV    = '#3182ce';
const COLOR_DEV   = '#38a169';
const COLOR_TEXT  = '#2d3748';
const COLOR_DIM   = 'rgba(113, 128, 150, 0.5)';

/* ─── Drawing Helpers ──────────────────────────────────────────────── */
function setDash(arr) { ctx.setLineDash(arr || []); }
function line(x1, y1, x2, y2, color, width, dash) {
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width || 1;
  setDash(dash); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  setDash([]);
}
function dot(x, y, r, color) {
  ctx.beginPath(); ctx.arc(x, y, r || 3, 0, Math.PI*2);
  ctx.fillStyle = color || COLOR_TEXT; ctx.fill();
}
function label(text, x, y, color, size, weight) {
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.font = (weight||'bold')+' '+(size||13)+'px "Segoe UI", sans-serif';
  ctx.fillText(text, x, y);
}
function dim(x1, y1, x2, y2, offset, text) {
  const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy);
  if (dist < 1) return;
  const nx = -dy / dist, ny = dx / dist;
  const ox = nx * offset, oy = ny * offset;
  const ax = x1 + ox, ay = y1 + oy, bx = x2 + ox, by = y2 + oy;
  line(x1, y1, ax, ay, COLOR_DIM, 0.8);
  line(x2, y2, bx, by, COLOR_DIM, 0.8);
  line(ax, ay, bx, by, COLOR_DIM, 0.9);
  // Tick endcaps
  line(ax - nx * 4, ay - ny * 4, ax + nx * 4, ay + ny * 4, COLOR_DIM, 0.9);
  line(bx - nx * 4, by - ny * 4, bx + nx * 4, by + ny * 4, COLOR_DIM, 0.9);
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  ctx.save(); ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = '#fafafa'; ctx.fillRect(mx - tw/2 - 4, my - 8, tw + 8, 16);
  ctx.fillStyle = COLOR_DIM; ctx.fillText(text, mx, my);
  ctx.restore();
}

/* ─── Main Render ──────────────────────────────────────────────────── */
function render() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = rect.width;
  const ch = 600;
  ctx.clearRect(0, 0, cw, ch);

  document.getElementById('problem-desc').innerHTML = PROBLEM.text;

  /* ── Geometry ─────────────────────────────────────────────────── */
  // Hexagon circumradius = side for regular hexagon
  const R = baseEdge;
  const perimeter = sides * baseEdge; // 150 mm
  const tvWidth = R * 2;        // max width of TV
  const devWidth = perimeter;   // development width

  // Total horizontal footprint: TV + gap + FV_width + gap + Dev
  const fvWidth = tvWidth;      // FV width = same as TV projected width
  const totalW = tvWidth + 30 + devWidth; // TV + gap + Dev
  const totalH = axisHeight + R * 2;     // FV height + TV height

  // Scale to fit
  const scaleX = (cw - 120) / totalW;
  const scaleY = (ch - 140) / totalH;
  const scale = Math.min(scaleX, scaleY, 3.5);

  // XY line position (vertically centered with room for FV above and TV below)
  const xyY = 60 + axisHeight * scale;
  const leftMargin = (cw - totalW * scale) / 2;

  // TV center X
  const tvCx = leftMargin + R * scale;

  /* ─── XY Line ─────────────────────────────────────────────────── */
  line(20, xyY, cw - 20, xyY, COLOR_XY, 1.5);
  label("X", 25, xyY - 8, COLOR_XY, 11);
  label("Y", cw - 30, xyY - 8, COLOR_XY, 11);

  /* ─── Top View (Hexagon below XY) ─────────────────────────────── */
  // Start angle chosen so one side is parallel to VP (horizontal)
  // For a regular hexagon with a flat side on top: start at -π/6
  const tvPts = [];
  const hexStart = -Math.PI / 6; // flat side parallel to VP (horizontal)
  for (let i = 0; i < sides; i++) {
    const angle = hexStart + i * (2 * Math.PI / sides);
    tvPts.push({
      x: tvCx + R * scale * Math.cos(angle),
      y: xyY + 15 * scale + R * scale - R * scale * Math.sin(angle)
    });
  }

  // Draw TV polygon with fill
  ctx.beginPath(); ctx.strokeStyle = COLOR_TV; ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(49, 130, 206, 0.06)';
  ctx.moveTo(tvPts[0].x, tvPts[0].y);
  for (let i = 1; i < sides; i++) ctx.lineTo(tvPts[i].x, tvPts[i].y);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // TV vertex labels
  const tvLabels = ['a', 'b', 'c', 'd', 'e', 'f'];
  tvPts.forEach((p, i) => {
    dot(p.x, p.y, 2.5, COLOR_TV);
    const offX = (p.x > tvCx) ? 6 : -14;
    const offY = (p.y > xyY + 15*scale + R*scale) ? 14 : -6;
    label(tvLabels[i], p.x + offX, p.y + offY, COLOR_TV, 11);
  });
  label("TV", tvCx - 8, xyY + 15*scale + R*scale*2 + 20, COLOR_TV, 12);

  // Diagonals inside hexagon (construction lines)
  for (let i = 0; i < sides; i++) {
    for (let j = i + 2; j < sides; j++) {
      if (j - i !== sides / 2) continue; // only draw main diagonals
      line(tvPts[i].x, tvPts[i].y, tvPts[j].x, tvPts[j].y, COLOR_PROJ, 0.6, [2, 3]);
    }
  }

  /* ─── Projectors: TV → FV ─────────────────────────────────────── */
  // Get unique x positions from TV (sorted)
  const uniqueXs = [...new Set(tvPts.map(p => Math.round(p.x)))].sort((a,b) => a - b);
  uniqueXs.forEach(x => {
    line(x, xyY, x, xyY + 15*scale + R*scale*2, COLOR_PROJ, 0.7, [4, 4]);
  });

  /* ─── Front View (Rectangle above XY) ─────────────────────────── */
  const fvLeft = uniqueXs[0];
  const fvRight = uniqueXs[uniqueXs.length - 1];
  const fvTop = xyY - axisHeight * scale;
  const fvBottom = xyY;

  ctx.beginPath(); ctx.strokeStyle = COLOR_FV; ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(229, 62, 62, 0.06)';
  ctx.rect(fvLeft, fvTop, fvRight - fvLeft, axisHeight * scale);
  ctx.fill(); ctx.stroke();

  // Inner vertical edges in FV (project each unique X from TV)
  uniqueXs.forEach(x => {
    line(x, fvBottom, x, fvTop, COLOR_FV, 1.5);
  });

  // FV corner labels
  // Bottom corners: a', b1', ... matching TV order projected
  label("a'", fvLeft - 16, fvBottom + 14, COLOR_FV, 11);
  label("d'", fvRight + 4, fvBottom + 14, COLOR_FV, 11);
  label("1'", fvLeft - 16, fvTop - 5, COLOR_FV, 11);
  label("4'", fvRight + 4, fvTop - 5, COLOR_FV, 11);
  label("FV", (fvLeft + fvRight)/2 - 8, fvTop - 15, COLOR_FV, 12);

  // Numbering top corners along FV
  const topLabels = ['2,6', '3,5', '4'];
  const innerXs = uniqueXs.slice(1, -1);
  innerXs.forEach((x, i) => {
    if (i < topLabels.length)
      label(topLabels[i] + "'", x - 8, fvTop - 5, COLOR_FV, 10, 'normal');
  });

  /* ─── Development (Rectangle strip to the right) ──────────────── */
  const devGap = 30 * scale;
  const devStartX = fvRight + devGap;
  const devEndX = devStartX + perimeter * scale;

  // Horizontal projectors from FV to Development
  line(fvRight, fvTop, devEndX + 10, fvTop, COLOR_PROJ, 0.7, [4, 4]);
  line(fvRight, fvBottom, devEndX + 10, fvBottom, COLOR_PROJ, 0.7, [4, 4]);

  // Main development rectangle
  ctx.beginPath(); ctx.strokeStyle = COLOR_DEV; ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(56, 161, 105, 0.06)';
  ctx.rect(devStartX, fvTop, perimeter * scale, axisHeight * scale);
  ctx.fill(); ctx.stroke();

  // Vertical division lines
  for (let i = 1; i < sides; i++) {
    const x = devStartX + i * baseEdge * scale;
    line(x, fvTop, x, fvBottom, COLOR_DEV, 1.5);
  }

  // Bottom labels (a, b, c, d, e, f, a)
  const devBottomLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'a'];
  for (let i = 0; i <= sides; i++) {
    const x = devStartX + i * baseEdge * scale;
    dot(x, fvBottom, 2, COLOR_DEV);
    dot(x, fvTop, 2, COLOR_DEV);
    label(devBottomLabels[i], x - 4, fvBottom + 16, COLOR_DEV, 11);
  }

  // Top labels (1, 2, 3, 4, 5, 6, 1)
  const devTopLabels = ['1', '2', '3', '4', '5', '6', '1'];
  for (let i = 0; i <= sides; i++) {
    const x = devStartX + i * baseEdge * scale;
    label(devTopLabels[i], x - 4, fvTop - 8, COLOR_DEV, 11);
  }

  label("Development", devStartX + (perimeter*scale)/2 - 40, fvTop - 25, COLOR_DEV, 13);

  /* ─── Dimensions ──────────────────────────────────────────────── */
  // Base edge in TV
  dim(tvPts[0].x, tvPts[0].y, tvPts[1].x, tvPts[1].y, -20, baseEdge + " mm");

  // Axis height on FV
  dim(fvLeft, fvBottom, fvLeft, fvTop, -25, axisHeight + " mm");

  // Development perimeter
  dim(devStartX, fvBottom, devEndX, fvBottom, 30, sides + " × " + baseEdge + " = " + perimeter + " mm");

  /* ─── Steps ───────────────────────────────────────────────────── */
  document.getElementById('steps-list').innerHTML = \`
    <li><strong>Step 1:</strong> Draw the Top View — a regular hexagon of side 25 mm below XY, with one side parallel to VP.</li>
    <li><strong>Step 2:</strong> Project all TV vertices vertically upward through XY to construct the Front View — a rectangle of width equal to the projected span and height = 50 mm (axis length) resting on XY.</li>
    <li><strong>Step 3:</strong> To the right, draw horizontal projectors from the top and bottom edges of the FV.</li>
    <li><strong>Step 4:</strong> Mark the Development: starting from vertex 'a', lay off 6 equal distances of 25 mm each (total perimeter = 6 × 25 = 150 mm) along the bottom projector.</li>
    <li><strong>Step 5:</strong> At each division, draw vertical lines up to the top projector to form 6 rectangles — each representing one lateral face.</li>
    <li><strong>Step 6:</strong> Label: bottom row a, b, c, d, e, f, a — top row 1, 2, 3, 4, 5, 6, 1.</li>
  \`;
}

/* ─── Responsive Canvas ────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = 600 * window.devicePixelRatio;
  canvas.style.height = '600px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  render();
});
window.onload = () => window.dispatchEvent(new Event('resize'));
</script>
</body>
</html>
`;

/**
 * GraphicAI · canonical exemplar for ENGINEERING CURVES problems.
 *
 * Solves: "Draw an ellipse having major and minor axes 120 mm and 70 mm
 * respectively by rectangle method."
 *
 * RECTANGLE METHOD for ellipse (textbook standard):
 *   1. Draw a rectangle ABCD with sides = major axis (120) × minor axis (70).
 *   2. Mark center O at intersection of axes.
 *   3. Divide the SEMI-MAJOR axis (OA = half the long side on the rectangle top edge)
 *      into N equal parts → number them 1, 2, 3, … from O.
 *   4. Divide the SEMI-MINOR axis (OC = half the short side on the rectangle left edge)
 *      into N equal parts → number them 1, 2, 3, … from O.
 *   5. From end-of-major-axis (A on the left mid-point of the short edge),
 *      draw straight lines to each division on the near short edge (top half).
 *   6. From end-of-minor-axis (C on the top mid-point of the long edge),
 *      draw straight lines to the SAME-numbered divisions on the near long edge (top half).
 *   7. The intersection of corresponding numbered lines (line-1 from A ∩ line-1 from C)
 *      gives one point on the ellipse.
 *   8. Repeat for all 4 quadrants by symmetry.
 *   9. Join all intersection points with a smooth freehand curve → ellipse.
 *
 * Number labels: divisions are labelled 1, 2, 3, … on BOTH the semi-major
 * and semi-minor edges. The construction lines are drawn in light grey.
 */
export const curveExampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Engineering Graphics — Ellipse by Rectangle Method</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f8f9fa; color:#333; padding:20px; margin:0; display:flex; flex-direction:column; align-items:center; }
  .container { background:#fff; padding:30px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.05); max-width:1050px; width:100%; box-sizing:border-box; }
  h2 { color:#2c3e50; margin:0 0 15px; border-bottom:2px solid #e2e8f0; padding-bottom:10px; }
  .problem-desc { background:#f8f9fa; padding:16px 20px; border-left:4px solid #2b6cb0; border-radius:0 6px 6px 0; font-size:15px; line-height:1.6; margin-bottom:25px; color:#4a5568; }
  .canvas-container { position:relative; overflow-x:auto; text-align:center; background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:10px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.02); }
  canvas { background:#fafafa; display:block; margin:0 auto; width:100%; height:650px; }
  .legend { display:flex; flex-wrap:wrap; justify-content:center; gap:20px; margin-top:15px; font-size:13px; font-weight:600; color:#4a5568; }
  .legend-item { display:flex; align-items:center; gap:8px; }
  .box { width:16px; height:16px; border-radius:4px; }
  .steps-card { margin-top:30px; background:#f1f3f5; padding:20px 25px; border-left:5px solid #2b6cb0; border-radius:6px; }
  .steps-card h3 { margin:0 0 15px; color:#2b6cb0; font-size:18px; }
  ol { padding-left:20px; line-height:1.65; margin:0; color:#2d3748; font-size:15px; }
  li { margin-bottom:10px; }
  li strong { color:#2c3e50; }
  .results { display:flex; flex-wrap:wrap; gap:24px; margin-top:18px; padding-top:14px; border-top:1px dashed #cbd5e0; }
  .result-pill { font-size:14px; color:#2d3748; }
  .result-pill strong { color:#2b6cb0; font-size:16px; display:block; }
</style>
</head>
<body>
<div class="container">
  <h2>Engineering Graphics: Ellipse by Rectangle Method</h2>
  <div class="problem-desc" id="problem-desc"></div>
  <div class="canvas-container"><canvas id="canvas"></canvas></div>
  <div class="legend">
    <div class="legend-item"><div class="box" style="background:#e53e3e;"></div> Ellipse Curve</div>
    <div class="legend-item"><div class="box" style="background:#a0aec0; height:3px; border-radius:0; width:24px;"></div> Construction Lines</div>
    <div class="legend-item"><div class="box" style="background:#38a169;"></div> Axes</div>
  </div>
  <div class="steps-card">
    <h3>Construction Steps &amp; Computed Values</h3>
    <ol id="steps-list"></ol>
    <div class="results" id="results"></div>
  </div>
</div>

<script>
/* ─── Problem Parameters ───────────────────────────────────────────── */
const PROBLEM = {
  text: "<strong>Problem Statement:</strong> Draw an ellipse having major and minor axes 120 mm and 70 mm respectively by rectangle method."
};

const majorAxis = 120; // mm
const minorAxis = 70;  // mm
const N = 5;           // divisions per semi-axis

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* ─── Colour Palette ───────────────────────────────────────────────── */
const COLOR_CURVE     = '#e53e3e';
const COLOR_CONSTRUCT = '#a0aec0';
const COLOR_AXIS      = '#38a169';
const COLOR_TEXT      = '#2d3748';
const COLOR_DIM       = 'rgba(113, 128, 150, 0.5)';

/* ─── Drawing Helpers ──────────────────────────────────────────────── */
function setDash(arr) { ctx.setLineDash(arr || []); }
function line(x1, y1, x2, y2, color, width, dash) {
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width || 1;
  setDash(dash); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); setDash([]);
}
function dot(x, y, r, color) {
  ctx.beginPath(); ctx.fillStyle = color || COLOR_TEXT;
  ctx.arc(x, y, r || 3, 0, Math.PI * 2); ctx.fill();
}
function label(text, x, y, color, size, weight) {
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.font = (weight || 'bold') + ' ' + (size || 12) + 'px "Segoe UI", sans-serif';
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
  line(ax - nx * 4, ay - ny * 4, ax + nx * 4, ay + ny * 4, COLOR_DIM, 0.9);
  line(bx - nx * 4, by - ny * 4, bx + nx * 4, by + ny * 4, COLOR_DIM, 0.9);
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  ctx.save(); ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = '#fafafa'; ctx.fillRect(mx - tw/2 - 4, my - 8, tw + 8, 16);
  ctx.fillStyle = COLOR_DIM; ctx.fillText(text, mx, my); ctx.restore();
}

/* ─── Main Render ──────────────────────────────────────────────────── */
function render() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = rect.width;
  const ch = 650;
  ctx.clearRect(0, 0, cw, ch);
  document.getElementById('problem-desc').innerHTML = PROBLEM.text;

  // Scale to fit
  const scale = Math.min((cw - 150) / majorAxis, (ch - 180) / minorAxis, 4.0);
  const cx = cw / 2;  // center X
  const cy = ch / 2;  // center Y
  const a = (majorAxis / 2) * scale; // semi-major in px
  const b = (minorAxis / 2) * scale; // semi-minor in px

  /* ─── Rectangle (bounding box) ────────────────────────────────── */
  const rectLeft = cx - a, rectRight = cx + a;
  const rectTop = cy - b, rectBot = cy + b;
  line(rectLeft, rectTop, rectRight, rectTop, COLOR_CONSTRUCT, 1);
  line(rectRight, rectTop, rectRight, rectBot, COLOR_CONSTRUCT, 1);
  line(rectRight, rectBot, rectLeft, rectBot, COLOR_CONSTRUCT, 1);
  line(rectLeft, rectBot, rectLeft, rectTop, COLOR_CONSTRUCT, 1);

  /* ─── Axes (dash-dot) ─────────────────────────────────────────── */
  line(rectLeft - 20, cy, rectRight + 20, cy, COLOR_AXIS, 1.2, [10, 4, 2, 4]);
  line(cx, rectTop - 20, cx, rectBot + 20, COLOR_AXIS, 1.2, [10, 4, 2, 4]);

  /* ─── Division marks on semi-major (top edge, left half: from center to left) ─ */
  // Top edge: from cx going left to rectLeft → N divisions
  // Right side top edge: from cx going right to rectRight → N divisions (mirror)
  // Left edge: from cy going up to rectTop → N divisions (semi-minor on short side)
  // Right edge: from cy going up to rectTop → N divisions (mirror)

  // Division spacing
  const dxMajor = a / N; // spacing along semi-major
  const dyMinor = b / N; // spacing along semi-minor

  // Mark divisions on top edge (semi-major, left half)
  for (let i = 1; i < N; i++) {
    const x = cx - i * dxMajor;
    // Small tick on top edge
    line(x, rectTop - 3, x, rectTop + 3, COLOR_TEXT, 0.8);
    label(String(i), x - 3, rectTop - 8, COLOR_TEXT, 10, 'normal');
    // Mirror on right
    const xr = cx + i * dxMajor;
    line(xr, rectTop - 3, xr, rectTop + 3, COLOR_TEXT, 0.8);
    label(String(i), xr - 3, rectTop - 8, COLOR_TEXT, 10, 'normal');
    // Bottom edge mirrors
    line(x, rectBot - 3, x, rectBot + 3, COLOR_TEXT, 0.8);
    label(String(i), x - 3, rectBot + 15, COLOR_TEXT, 10, 'normal');
    line(xr, rectBot - 3, xr, rectBot + 3, COLOR_TEXT, 0.8);
    label(String(i), xr - 3, rectBot + 15, COLOR_TEXT, 10, 'normal');
  }

  // Mark divisions on left edge (semi-minor, top half)
  for (let i = 1; i < N; i++) {
    const y = cy - i * dyMinor;
    line(rectLeft - 3, y, rectLeft + 3, y, COLOR_TEXT, 0.8);
    label(String(i), rectLeft - 14, y + 4, COLOR_TEXT, 10, 'normal');
    // Mirror on right edge
    line(rectRight - 3, y, rectRight + 3, y, COLOR_TEXT, 0.8);
    label(String(i), rectRight + 5, y + 4, COLOR_TEXT, 10, 'normal');
    // Bottom half mirrors
    const yb = cy + i * dyMinor;
    line(rectLeft - 3, yb, rectLeft + 3, yb, COLOR_TEXT, 0.8);
    label(String(i), rectLeft - 14, yb + 4, COLOR_TEXT, 10, 'normal');
    line(rectRight - 3, yb, rectRight + 3, yb, COLOR_TEXT, 0.8);
    label(String(i), rectRight + 5, yb + 4, COLOR_TEXT, 10, 'normal');
  }

  /* ─── Construction Lines & Intersection Points (all 4 quadrants) ── */
  // For each quadrant, we draw two sets of lines and find intersections.
  //
  // TOP-LEFT QUADRANT:
  //   Set A: from END of major axis on the LEFT (rectLeft, cy)
  //          to each division on the LEFT short edge TOP half (rectLeft, cy - i*dyMinor)
  //   Set C: from END of minor axis on the TOP (cx, rectTop)
  //          to each division on the TOP long edge LEFT half (cx - i*dxMajor, rectTop)
  //   Intersection of line-i from A and line-i from C = point on ellipse.

  const quadrants = [
    { ax: rectLeft, ay: cy, cx_: cx, cy_: rectTop, edgeXdir: -1, edgeYdir: -1 }, // Top-Left
    { ax: rectRight, ay: cy, cx_: cx, cy_: rectTop, edgeXdir: 1, edgeYdir: -1 },  // Top-Right
    { ax: rectRight, ay: cy, cx_: cx, cy_: rectBot, edgeXdir: 1, edgeYdir: 1 },   // Bottom-Right
    { ax: rectLeft, ay: cy, cx_: cx, cy_: rectBot, edgeXdir: -1, edgeYdir: 1 },    // Bottom-Left
  ];

  const allPts = []; // collect all ellipse construction points

  quadrants.forEach(q => {
    for (let i = 1; i < N; i++) {
      // Division i on the LONG edge (top or bottom edge of rectangle)
      const longEdgeX = cx + q.edgeXdir * i * dxMajor;
      const longEdgeY = q.cy_; // same y as the C-end

      // Division i on the SHORT edge (left or right edge of rectangle)
      const shortEdgeX = q.ax; // same x as the A-end
      const shortEdgeY = cy + q.edgeYdir * i * dyMinor;

      // Set 1: from A (end of major axis) → to division on the LONG edge
      // These lines fan diagonally from A to the top/bottom edge divisions
      line(q.ax, q.ay, longEdgeX, longEdgeY, COLOR_CONSTRUCT, 0.6);

      // Set 2: from C (end of minor axis) → to division on the SHORT edge
      // These lines fan diagonally from C to the left/right edge divisions
      line(q.cx_, q.cy_, shortEdgeX, shortEdgeY, COLOR_CONSTRUCT, 0.6);

      // Find intersection of these two lines → point on the ellipse
      // Line 1: from (q.ax, q.ay) to (longEdgeX, longEdgeY)
      // Line 2: from (q.cx_, q.cy_) to (shortEdgeX, shortEdgeY)
      const x1 = q.ax, y1 = q.ay, x2 = longEdgeX, y2 = longEdgeY;
      const x3 = q.cx_, y3 = q.cy_, x4 = shortEdgeX, y4 = shortEdgeY;

      const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (Math.abs(denom) > 0.001) {
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const ix = x1 + t * (x2 - x1);
        const iy = y1 + t * (y2 - y1);
        allPts.push({ x: ix, y: iy });
        dot(ix, iy, 2.5, COLOR_CURVE);
      }
    }
  });

  // Add the 4 axis endpoints to the points list for a complete curve
  allPts.push({ x: rectLeft, y: cy });  // A (left)
  allPts.push({ x: cx, y: rectTop });   // C (top)
  allPts.push({ x: rectRight, y: cy }); // B (right)
  allPts.push({ x: cx, y: rectBot });   // D (bottom)

  /* ─── Draw the smooth ellipse curve through points ────────────── */
  ctx.beginPath(); ctx.strokeStyle = COLOR_CURVE; ctx.lineWidth = 2.5;
  for (let theta = 0; theta <= Math.PI * 2 + 0.01; theta += 0.03) {
    const ex = cx + a * Math.cos(theta);
    const ey = cy + b * Math.sin(theta);
    if (theta === 0) ctx.moveTo(ex, ey); else ctx.lineTo(ex, ey);
  }
  ctx.closePath(); ctx.stroke();

  /* ─── Axis endpoint labels ────────────────────────────────────── */
  dot(rectLeft, cy, 4, COLOR_CURVE);  label("A", rectLeft - 16, cy + 5, COLOR_TEXT, 13);
  dot(rectRight, cy, 4, COLOR_CURVE); label("B", rectRight + 6, cy + 5, COLOR_TEXT, 13);
  dot(cx, rectTop, 4, COLOR_CURVE);   label("C", cx + 6, rectTop - 6, COLOR_TEXT, 13);
  dot(cx, rectBot, 4, COLOR_CURVE);   label("D", cx + 6, rectBot + 16, COLOR_TEXT, 13);
  dot(cx, cy, 3, COLOR_TEXT);         label("O", cx + 6, cy + 14, COLOR_TEXT, 12);

  // Title label
  label("Ellipse", cx + a/2, rectTop - 30, COLOR_CURVE, 14, 'bold');

  /* ─── Dimensions ──────────────────────────────────────────────── */
  dim(rectLeft, rectBot, rectRight, rectBot, 35, majorAxis + " mm");
  dim(rectLeft, rectTop, rectLeft, rectBot, -30, minorAxis + " mm");

  /* ─── Steps ───────────────────────────────────────────────────── */
  document.getElementById('steps-list').innerHTML = \`
    <li><strong>Step 1:</strong> Draw the major axis AB = 120 mm horizontally and minor axis CD = 70 mm vertically, intersecting at center O.</li>
    <li><strong>Step 2:</strong> Construct the bounding rectangle through the endpoints A, B, C, D.</li>
    <li><strong>Step 3:</strong> Divide the semi-major axis (top edge from O to left rectangle corner) into \${N} equal parts. Number them 1, 2, 3, … from O outward.</li>
    <li><strong>Step 4:</strong> Divide the semi-minor axis (left edge from O to top rectangle corner) into \${N} equal parts. Number them 1, 2, 3, … from O outward.</li>
    <li><strong>Step 5:</strong> From point A (end of major axis), draw straight lines to each numbered division on the near short edge (left edge, top half).</li>
    <li><strong>Step 6:</strong> From point C (end of minor axis), draw straight lines to the same-numbered divisions on the near long edge (top edge, left half).</li>
    <li><strong>Step 7:</strong> The intersection of line-1 from A with line-1 from C gives point P1 on the ellipse. Similarly for P2, P3, P4.</li>
    <li><strong>Step 8:</strong> Repeat for all four quadrants by symmetry.</li>
    <li><strong>Step 9:</strong> Join all intersection points and the axis endpoints A, B, C, D with a smooth freehand curve to complete the ellipse.</li>
  \`;

  document.getElementById('results').innerHTML = \`
    <div class="result-pill"><strong>\${majorAxis} mm</strong> Major Axis</div>
    <div class="result-pill"><strong>\${minorAxis} mm</strong> Minor Axis</div>
    <div class="result-pill"><strong>\${N} divisions</strong> per semi-axis</div>
    <div class="result-pill"><strong>\${4 * (N - 1) + 4} points</strong> plotted</div>
  \`;
}

/* ─── Responsive Canvas ────────────────────────────────────────────── */
function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = 650 * window.devicePixelRatio;
  canvas.style.height = '650px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  render();
}
window.addEventListener('resize', resize);
window.onload = resize;
</script>
</body>
</html>
`;

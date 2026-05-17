export const curveExampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Engineering Graphics — Curve Solver</title>
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
  <h2>Engineering Graphics: Curve Solver</h2>
  <div class="problem-desc" id="problem-desc"></div>
  <div class="canvas-container"><canvas id="canvas"></canvas></div>
  <div class="legend">
    <div class="legend-item"><div class="box" style="background:#e53e3e;"></div> Curve Path</div>
    <div class="legend-item"><div class="box" style="background:#a0aec0; height:3px; border-radius:0; width:24px;"></div> Construction Lines</div>
    <div class="legend-item"><div class="box" style="background:#38a169;"></div> Directrix / Axis</div>
  </div>
  <div class="steps-card">
    <h3>Construction Steps &amp; Computed Values</h3>
    <ol id="steps-list"></ol>
    <div class="results" id="results"></div>
  </div>
</div>

<script>
/* ─── Problem statement ─────────────────────────────────────────────── */
const PROBLEM = {
  title: "Ellipse by Rectangle Method",
  text: "<strong>Problem Statement:</strong> Draw an ellipse having major and minor axes 120 mm and 70 mm respectively by rectangle method."
};

/* ─── Given ─────────────────────────────────────────────────────────── */
const majorAxis = 120;
const minorAxis = 70;
const numDivisions = 4; // Divisions per half-axis

/* ─── Canvas ────────────────────────────────────────────────────────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const COLOR_CURVE = '#e53e3e';
const COLOR_CONSTRUCT = '#a0aec0';
const COLOR_AXIS = '#38a169';
const COLOR_TEXT = '#2d3748';
const COLOR_DIM = '#718096';

function setDash(arr) { ctx.setLineDash(arr || []); }
function line(x1, y1, x2, y2, color, width, dash) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 1;
  setDash(dash);
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.stroke();
  setDash([]);
}
function dot(x, y, r, color) { ctx.beginPath(); ctx.fillStyle = color; ctx.arc(x, y, r || 3, 0, Math.PI * 2); ctx.fill(); }
function label(text, x, y, color, size, weight) {
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.font = (weight || 'normal') + ' ' + (size || 12) + 'px "Segoe UI", sans-serif';
  ctx.fillText(text, x, y);
}

/* Dimension line with tick endcaps + centred label */
function dim(x1, y1, x2, y2, offset, text) {
  const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy);
  const nx = -dy / dist, ny = dx / dist;
  const ox = nx * offset, oy = ny * offset;
  const ax = x1 + ox, ay = y1 + oy, bx = x2 + ox, by = y2 + oy;
  const dimLineCol = 'rgba(113, 128, 150, 0.35)';
  line(x1, y1, ax, ay, dimLineCol, 0.8);
  line(x2, y2, bx, by, dimLineCol, 0.8);
  line(ax, ay, bx, by, dimLineCol, 0.9);
  const tick = 4;
  line(ax - nx * tick, ay - ny * tick, ax + nx * tick, ay + ny * tick, dimLineCol, 0.9);
  line(bx - nx * tick, by - ny * tick, bx + nx * tick, by + ny * tick, dimLineCol, 0.9);
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  ctx.save();
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(mx - tw / 2 - 4, my - 8, tw + 8, 16);
  ctx.fillStyle = 'rgba(113, 128, 150, 0.8)';
  ctx.fillText(text, mx, my);
  ctx.restore();
}

/* ─── Render ────────────────────────────────────────────────────────── */
function render() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = rect.width;
  const ch = 650;
  ctx.clearRect(0, 0, cw, ch);

  document.getElementById('problem-desc').innerHTML = PROBLEM.text;

  // Auto-scale to fit the curve and construction lines
  const scale = Math.min((cw - 150) / majorAxis, (ch - 150) / minorAxis);
  const ox = cw / 2;
  const oy = ch / 2;

  // Bounding rectangle dimensions
  const w = majorAxis * scale;
  const h = minorAxis * scale;

  // Draw Major and Minor Axes
  line(ox - w / 2 - 20, oy, ox + w / 2 + 20, oy, COLOR_AXIS, 1.5, [10, 4, 2, 4]); // Major axis
  line(ox, oy - h / 2 - 20, ox, oy + h / 2 + 20, COLOR_AXIS, 1.5, [10, 4, 2, 4]); // Minor axis
  label("Major Axis", ox + w / 2 + 25, oy + 4, COLOR_AXIS, 12, 'bold');
  label("Minor Axis", ox - 35, oy - h / 2 - 25, COLOR_AXIS, 12, 'bold');

  // Draw Bounding Rectangle
  line(ox - w / 2, oy - h / 2, ox + w / 2, oy - h / 2, COLOR_CONSTRUCT, 1, [3, 3]);
  line(ox + w / 2, oy - h / 2, ox + w / 2, oy + h / 2, COLOR_CONSTRUCT, 1, [3, 3]);
  line(ox + w / 2, oy + h / 2, ox - w / 2, oy + h / 2, COLOR_CONSTRUCT, 1, [3, 3]);
  line(ox - w / 2, oy + h / 2, ox - w / 2, oy - h / 2, COLOR_CONSTRUCT, 1, [3, 3]);

  // Dimensioning
  dim(ox - w / 2, oy + h / 2, ox + w / 2, oy + h / 2, 40, majorAxis + " mm (Major Axis)");
  dim(ox - w / 2, oy - h / 2, ox - w / 2, oy + h / 2, 40, minorAxis + " mm (Minor Axis)");

  const pts = [];

  // Construct points for top-left quadrant
  for (let i = 0; i <= numDivisions; i++) {
    // Points along the vertical edge
    const yEdge = oy - (i / numDivisions) * (h / 2);
    const xEdge = ox - w / 2;

    // Points along the major axis
    const xCenter = ox - w / 2 + (i / numDivisions) * (w / 2);
    const yCenter = oy;

    // Top point of minor axis (focus of construction rays)
    const fx = ox;
    const fy = oy - h / 2;

    // Bottom point of minor axis
    const bx = ox;
    const by = oy + h / 2;

    if (i > 0 && i < numDivisions) {
      // Ray 1: from top focus to edge points
      line(fx, fy, xEdge, yEdge, COLOR_CONSTRUCT, 0.5);
      
      // Ray 2: from bottom focus through center points
      // Extend ray 2 to intersect ray 1
      const slope2 = (yCenter - by) / (xCenter - bx);
      const intercept2 = by - slope2 * bx;

      const slope1 = (yEdge - fy) / (xEdge - fx);
      const intercept1 = fy - slope1 * fx;

      const ix = (intercept2 - intercept1) / (slope1 - slope2);
      const iy = slope1 * ix + intercept1;

      pts.push({ x: ix, y: iy });
      line(bx, by, ix, iy, COLOR_CONSTRUCT, 0.5);
      dot(ix, iy, 2, COLOR_CURVE);
      label("P" + i, ix - 15, iy - 5, COLOR_TEXT, 10);
    }
  }

  // To draw the full curve perfectly, we calculate standard points, but the construction lines were drawn above
  ctx.beginPath();
  ctx.strokeStyle = COLOR_CURVE;
  ctx.lineWidth = 2.5;
  for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
    const cx = ox + (w / 2) * Math.cos(theta);
    const cy = oy + (h / 2) * Math.sin(theta);
    if (theta === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.closePath();
  ctx.stroke();

  // Draw endpoints
  dot(ox - w / 2, oy, 4, COLOR_CURVE); label("A", ox - w / 2 - 15, oy + 4);
  dot(ox + w / 2, oy, 4, COLOR_CURVE); label("B", ox + w / 2 + 5, oy + 4);
  dot(ox, oy - h / 2, 4, COLOR_CURVE); label("C", ox + 5, oy - h / 2 - 5);
  dot(ox, oy + h / 2, 4, COLOR_CURVE); label("D", ox + 5, oy + h / 2 + 15);

  /* ─── Steps & Results ─────────────────────────────────────────────── */
  const stepsList = document.getElementById('steps-list');
  const steps = [
    "<strong>Step 1:</strong> Draw the major axis AB = 120 mm and minor axis CD = 70 mm intersecting at O.",
    "<strong>Step 2:</strong> Construct a bounding rectangle passing through A, B, C, D.",
    "<strong>Step 3:</strong> Divide the semi-major axis AO and the vertical edge of the rectangle into " + numDivisions + " equal parts.",
    "<strong>Step 4:</strong> Join C to the points on the vertical edge with straight lines.",
    "<strong>Step 5:</strong> Join D through the points on AO and extend them to intersect the corresponding lines from C. These intersections are points on the ellipse.",
    "<strong>Step 6:</strong> Repeat for all four quadrants to complete the curve."
  ];
  steps.forEach(s => {
    let li = document.createElement('li'); li.innerHTML = s; stepsList.appendChild(li);
  });

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = \`
    <div class="result-pill"><strong>\${majorAxis} mm</strong> Major Axis</div>
    <div class="result-pill"><strong>\${minorAxis} mm</strong> Minor Axis</div>
    <div class="result-pill"><strong>\${(majorAxis/2).toFixed(1)} mm</strong> Semi-major</div>
    <div class="result-pill"><strong>\${(minorAxis/2).toFixed(1)} mm</strong> Semi-minor</div>
  \`;
}

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

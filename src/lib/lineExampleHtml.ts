/**
 * GraphicAI · canonical exemplar for LINE PROJECTION problems.
 *
 * Solves Problem 1: "Point M of line MN is 20 mm above HP & is in VP. Its
 * FV & TV make 40° & 45° with HP & VP respectively. Projector distance =
 * 100 mm. Draw the projections; find true inclinations."
 *
 * LAYOUT (textbook / Indian engineering graphics convention):
 *   ───── single combined plate ─────
 *   FV (above XY)  ── m'──── n'
 *   ────────────────┼──────┼──── XY
 *   TV (below XY)   ── m ── n
 *
 *   Vertical dashed projectors carry endpoints across XY. Locus-arc
 *   rotations swing the apparent FV / TV horizontally to find the true
 *   length on either side. θ_HP arc opens at the FV resting endpoint;
 *   φ_VP arc opens at the TV resting endpoint. ONE drawing — not two
 *   stages side-by-side.
 *
 * Every annotation Gemini must reproduce on any line problem appears
 * here exactly once, in the right place:
 *
 *   • Endpoint dots + labels:  m, n  (TV)   m', n'  (FV)
 *   • Apparent-angle arcs:     α at m',  β at m
 *   • Vertical dashed projectors connecting m'↔m and n'↔n
 *   • Locus arcs (dashed grey) swung from m and m' to find n₁ and n₂'
 *   • TL lines in moss green from m' to n₁' (FV side) and m to n₂' (TV side)
 *   • True-inclination arcs: θ at m' (against horizontal),  φ at m
 *   • Locus horizontal labels:  "locus of n'", "locus of n"
 *   • Dimension lines with tick endcaps for projector distance, m' height
 *   • Steps card with numbered construction moves + results pill row
 */
export const lineExampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Engineering Graphics — Line Projection</title>
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
  .results { display:flex; flex-wrap:wrap; gap:24px; margin-top:18px; padding-top:14px; border-top:1px dashed #cbd5e0; }
  .result-pill { font-size:14px; color:#2d3748; }
  .result-pill strong { color:#2b6cb0; font-size:16px; display:block; }
</style>
</head>
<body>
<div class="container">
  <h2>Engineering Graphics: Line Projection Solver</h2>
  <div class="problem-desc" id="problem-desc"></div>
  <div class="canvas-container"><canvas id="canvas"></canvas></div>
  <div class="legend">
    <div class="legend-item"><div class="box" style="background:#e53e3e;"></div> Front View (FV)</div>
    <div class="legend-item"><div class="box" style="background:#3182ce;"></div> Top View (TV)</div>
    <div class="legend-item"><div class="box" style="background:#38a169;"></div> True Length (TL)</div>
    <div class="legend-item"><div class="box" style="background:#a0aec0; height:3px; border-radius:0; width:24px;"></div> Projector / Locus arc</div>
  </div>
  <div class="steps-card">
    <h3>Construction Steps &amp; Computed Values</h3>
    <ol id="steps-list"></ol>
    <div class="results" id="results"></div>
  </div>
</div>

<script>
/* ─── Problem statement ─────────────────────────────────────────────── */
const PROBLEM_TEXT =
  "<strong>Problem Statement:</strong> The point M of line MN is 20 mm above HP &amp; is in VP. Its FV &amp; TV make 40° &amp; 45° with HP &amp; VP respectively. Draw the projections if the distance between the end projectors is 100 mm. Find true inclinations.";

/* ─── Given ─────────────────────────────────────────────────────────── */
const mAboveHP   = 20;          // height of M above XY (FV side)
const mInFrontVP = 0;           // M is in VP → m sits ON XY
const L          = 100;         // projector distance between end points
const alphaDeg   = 40;          // FV apparent angle (with XY)
const betaDeg    = 45;          // TV apparent angle (with XY)
const alpha = alphaDeg * Math.PI / 180;
const beta  = betaDeg  * Math.PI / 180;

/* ─── Derived ───────────────────────────────────────────────────────── */
const dz = L * Math.tan(alpha);                 // height rise of N above M
const dy = L * Math.tan(beta);                  // depth rise of N in front of M
const FV_len = Math.hypot(L, dz);               // m'n'
const TV_len = Math.hypot(L, dy);               // mn
const TL     = Math.hypot(L, dy, dz);           // true length
const theta  = Math.asin(dz / TL);              // inclination with HP
const phi    = Math.asin(dy / TL);              // inclination with VP

/* ─── Canvas helpers ────────────────────────────────────────────────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const COLOR_XY    = '#2d3748';
const COLOR_PROJ  = '#a0aec0';
const COLOR_FV    = '#e53e3e';
const COLOR_TV    = '#3182ce';
const COLOR_TL    = '#38a169';
const COLOR_TEXT  = '#2d3748';
const COLOR_DIM   = '#718096';

function setDash(arr){ ctx.setLineDash(arr || []); }
function line(x1,y1,x2,y2,color,width,dash){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth   = width || 1;
  setDash(dash);
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
  ctx.stroke();
  setDash([]);
}
function dot(x,y,r,color){
  ctx.beginPath();
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.arc(x,y,r||3.2,0,Math.PI*2);
  ctx.fill();
}
function label(text,x,y,color,size,weight){
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.font = (weight||'bold')+' '+(size||13)+'px "Segoe UI", sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(text,x,y);
}
function arc(cx,cy,r,a1,a2,color,ccw){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  setDash([4,4]);
  ctx.arc(cx,cy,r,a1,a2,ccw||false);
  ctx.stroke();
  setDash([]);
}
function angleArc(cx,cy,r,a1,a2,color){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.3;
  setDash([]);
  ctx.arc(cx,cy,r,a1,a2);
  ctx.stroke();
}
/* Dimension line with tick endcaps, label centred along the bar */
function dim(x1,y1,x2,y2,offset,text){
  const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy);
  const nx=-dy/len, ny=dx/len;
  const ax=x1+nx*offset, ay=y1+ny*offset;
  const bx=x2+nx*offset, by=y2+ny*offset;
  line(x1,y1,ax,ay,COLOR_DIM,0.8);
  line(x2,y2,bx,by,COLOR_DIM,0.8);
  line(ax,ay,bx,by,COLOR_DIM,0.9);
  const tick=4;
  line(ax-nx*tick,ay-ny*tick,ax+nx*tick,ay+ny*tick,COLOR_DIM,0.9);
  line(bx-nx*tick,by-ny*tick,bx+nx*tick,by+ny*tick,COLOR_DIM,0.9);
  const mx=(ax+bx)/2 + nx*9;
  const my=(ay+by)/2 + ny*9;
  ctx.save();
  ctx.fillStyle = COLOR_DIM;
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text,mx,my);
  ctx.restore();
}

/* ─── Render ────────────────────────────────────────────────────────── */
function render(){
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = rect.width;
  const ch = 600;
  ctx.clearRect(0,0,cw,ch);

  document.getElementById('problem-desc').innerHTML = PROBLEM_TEXT;

  /* Layout: single combined plate. XY across the middle. FV above, TV below.
     We need horizontal room for: the original FV/TV (L wide) plus the
     rotated copies on the right (extra FV_len-L on FV side, extra TV_len-L
     on TV side, whichever is wider).                                      */
  const widestRotation = Math.max(FV_len, TV_len);
  const usableW = cw - 200;                       // leave 200 for margins
  const scale   = Math.min( usableW / (widestRotation + 60), 2.6 );
  const xyY     = 300;                            // XY line position
  const padL    = 110;                            // left padding

  /* XY reference line */
  line(40, xyY, cw-40, xyY, COLOR_XY, 1.6);
  label("X", 30,  xyY+4, COLOR_XY, 13);
  label("Y", cw-32, xyY+4, COLOR_XY, 13);
  label("VP", 46, xyY-10, COLOR_DIM, 11, 'normal');
  label("HP", 46, xyY+18, COLOR_DIM, 11, 'normal');

  /* Projector x-coords */
  const xM = padL;
  const xN = padL + L*scale;

  /* Endpoint y-coords */
  const yMp = xyY - mAboveHP*scale;               // m' FV
  const yM  = xyY + mInFrontVP*scale;             // m  TV (on XY)
  const yNp = yMp - dz*scale;                     // n' FV (rises by dz)
  const yN  = yM  + dy*scale;                     // n  TV (drops by dy)

  /* Vertical dashed projectors through m and n */
  line(xM, yNp-14, xM, yN+14, COLOR_PROJ, 1, [4,4]);
  line(xN, yNp-14, xN, yN+14, COLOR_PROJ, 1, [4,4]);

  /* Apparent FV  m' → n'  (crimson) */
  line(xM, yMp, xN, yNp, COLOR_FV, 2.2);
  dot(xM, yMp, 3.4, COLOR_FV); dot(xN, yNp, 3.4, COLOR_FV);
  label("m'", xM-16, yMp-4);
  label("n'", xN+6,  yNp-4);

  /* Apparent TV  m → n  (blue) */
  line(xM, yM, xN, yN, COLOR_TV, 2.2);
  dot(xM, yM, 3.4, COLOR_TV); dot(xN, yN, 3.4, COLOR_TV);
  label("m", xM-14, yM+16);
  label("n", xN+6,  yN+16);

  /* Apparent angle α at m' — between FV line and horizontal through m' */
  angleArc(xM, yMp, 26, -alpha, 0, COLOR_FV);
  label("α = "+alphaDeg+"°", xM+30, yMp-4, COLOR_FV, 12);

  /* Apparent angle β at m — between TV line and horizontal through m */
  angleArc(xM, yM, 26, 0, beta, COLOR_TV);
  label("β = "+betaDeg+"°", xM+30, yM+18, COLOR_TV, 12);

  /* ─── LOCUS construction · METHOD 1: rotate TV → find TL on FV ─── */
  /* With centre m, radius = TV_len, swing n down to horizontal locus
     through m. Landing point n₁ sits at (xM + TV_len·s, yM).         */
  const xN1 = xM + TV_len*scale;
  arc(xM, yM, TV_len*scale,
      Math.atan2(yN - yM, xN - xM), 0, COLOR_PROJ);
  dot(xN1, yM, 2.6, COLOR_PROJ);
  label("n₁", xN1+5, yM+16, COLOR_DIM, 11, 'normal');

  /* Horizontal locus line through m on the TV plane */
  line(xM, yM, xN1+18, yM, COLOR_PROJ, 0.8, [2,4]);
  label("locus of n", xN1+24, yM+4, COLOR_DIM, 11, 'normal');

  /* Vertical projector up from n₁ to FV level of n' */
  line(xN1, yM, xN1, yNp, COLOR_PROJ, 1, [4,4]);
  dot(xN1, yNp, 2.6, COLOR_PROJ);
  label("n₁'", xN1+5, yNp-4, COLOR_DIM, 11, 'normal');

  /* TL line on FV side: m' → n₁'  (this is the true length;
     the angle it makes with horizontal is θ_HP)                     */
  line(xM, yMp, xN1, yNp, COLOR_TL, 2.4);
  label("TL", (xM+xN1)/2 - 16, (yMp+yNp)/2 - 8, COLOR_TL, 13);

  /* θ_HP arc at m' */
  angleArc(xM, yMp, 38, -Math.atan2(yMp-yNp, xN1-xM), 0, COLOR_TL);
  label("θ = "+(theta*180/Math.PI).toFixed(1)+"°",
        xM+46, yMp-16, COLOR_TL, 12);

  /* ─── LOCUS construction · METHOD 2: rotate FV → find TL on TV ─── */
  const xN2 = xM + FV_len*scale;
  arc(xM, yMp, FV_len*scale,
      Math.atan2(yNp - yMp, xN - xM), 0, COLOR_PROJ);
  dot(xN2, yMp, 2.6, COLOR_PROJ);
  label("n₂'", xN2+5, yMp-4, COLOR_DIM, 11, 'normal');

  /* Horizontal locus line through m' on the FV plane */
  line(xM, yMp, xN2+18, yMp, COLOR_PROJ, 0.8, [2,4]);
  label("locus of n'", xN2+24, yMp-4, COLOR_DIM, 11, 'normal');

  /* Vertical projector down from n₂' to TV depth of n */
  line(xN2, yMp, xN2, yN, COLOR_PROJ, 1, [4,4]);
  dot(xN2, yN, 2.6, COLOR_PROJ);
  label("n₂", xN2+5, yN+16, COLOR_DIM, 11, 'normal');

  /* TL line on TV side: m → n₂  (angle with horizontal = φ_VP) */
  line(xM, yM, xN2, yN, COLOR_TL, 2.4);

  /* φ_VP arc at m */
  angleArc(xM, yM, 38, 0, Math.atan2(yN-yM, xN2-xM), COLOR_TL);
  label("φ = "+(phi*180/Math.PI).toFixed(1)+"°",
        xM+46, yM+30, COLOR_TL, 12);

  /* ─── Dimensions ─────────────────────────────────────────────────── */
  /* Projector distance L, drawn above the apparent FV bracket */
  dim(xM, yMp - 24, xN, yMp - 24, 18, L.toFixed(0)+" mm");
  /* Height of m' above XY */
  dim(xM-26, yMp, xM-26, xyY, 0, mAboveHP+" mm");
  /* TL dimension on FV side, drawn above the horizontal locus */
  dim(xM, yMp - 60, xN1, yMp - 60, 0, "TL = "+TL.toFixed(1)+" mm");

  /* ─── Steps & results ───────────────────────────────────────────── */
  const steps = [
    "<strong>Mark M:</strong> M is in VP, so its TV (<em>m</em>) sits ON the XY line. M is 20 mm above HP, so its FV (<em>m'</em>) is 20 mm above XY on the same vertical projector.",
    "<strong>Apparent FV:</strong> from <em>m'</em>, draw a line at <strong>α = 40°</strong> above the horizontal. It meets the second projector (100 mm to the right) at <em>n'</em>.",
    "<strong>Apparent TV:</strong> from <em>m</em>, draw a line at <strong>β = 45°</strong> below the horizontal. It meets the same second projector at <em>n</em>.",
    "<strong>Find TL — Method 1 (rotate TV):</strong> with centre <em>m</em>, swing the TV <em>mn</em> down to the horizontal locus through <em>m</em>, landing at <em>n₁</em>. Project <em>n₁</em> vertically up to the locus of <em>n'</em>, marking <em>n₁'</em>. The line <em>m'n₁'</em> is the TRUE LENGTH; the angle it makes with the horizontal is <strong>θ</strong>, the true inclination with HP.",
    "<strong>Find TL — Method 2 (rotate FV):</strong> with centre <em>m'</em>, swing the FV <em>m'n'</em> down to the horizontal locus through <em>m'</em>, landing at <em>n₂'</em>. Project <em>n₂'</em> vertically down to the locus of <em>n</em>, marking <em>n₂</em>. The line <em>mn₂</em> is the TRUE LENGTH; the angle it makes with the horizontal is <strong>φ</strong>, the true inclination with VP.",
    "<strong>Verify:</strong> both methods produce the same TL. Numerically: sin θ = Δz / TL and sin φ = Δy / TL where Δz = L·tan α and Δy = L·tan β."
  ];
  const list = document.getElementById('steps-list');
  list.innerHTML = '';
  steps.forEach(function(s){
    const li = document.createElement('li');
    li.innerHTML = s;
    list.appendChild(li);
  });

  const res = document.getElementById('results');
  res.innerHTML =
    '<div class="result-pill"><strong>'+TL.toFixed(1)+' mm</strong>True Length (TL)</div>'+
    '<div class="result-pill"><strong>'+(theta*180/Math.PI).toFixed(1)+'°</strong>θ &mdash; true inclination with HP</div>'+
    '<div class="result-pill"><strong>'+(phi*180/Math.PI).toFixed(1)+'°</strong>φ &mdash; true inclination with VP</div>'+
    '<div class="result-pill"><strong>'+FV_len.toFixed(1)+' mm</strong>FV length (m\\'n\\')</div>'+
    '<div class="result-pill"><strong>'+TV_len.toFixed(1)+' mm</strong>TV length (mn)</div>';
}

function resize(){
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width * window.devicePixelRatio;
  canvas.height = 600 * window.devicePixelRatio;
  canvas.style.height = '600px';
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  render();
}
window.addEventListener('resize', resize);
window.onload = resize;
</script>
</body>
</html>
`;

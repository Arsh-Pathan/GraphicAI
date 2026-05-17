/**
 * GraphicAI · canonical exemplar for LINE PROJECTION problems.
 *
 * Solves "Problem 1": "Point M of line MN is 20 mm above HP & is in VP. Its
 * FV & TV make 40° & 45° with HP & VP respectively. Distance between end
 * projectors is 100 mm. Draw projections; find true inclinations."
 *
 * The exemplar must demonstrate every annotation Gemini is expected to
 * reproduce for *any* line projection problem:
 *
 *   • Endpoint dots + labels:    m, n  (TV)    m', n'  (FV)
 *   • XY reference rule + VP/HP labels.
 *   • Apparent angle arcs:       α at m' (FV vs XY),  β at m (TV vs XY)
 *   • Projector dashed verticals tying m'↔m and n'↔n.
 *   • Linear dimensions with tick-and-arrow heads:
 *       – Projector distance (between end projectors)
 *       – Heights of endpoints above XY (FV) and below XY (TV)
 *   • Construction locus arcs:
 *       – Swing FV (m'n') about m' down to a horizontal — gives TL₁
 *       – Swing TV (mn)   about m  up   to a horizontal — gives TL₂
 *     (TL₁ == TL₂; both labelled with θ_HP and φ_VP arcs at the rest line)
 *   • Stepped construction is laid out as a SEQUENCE of stages so the
 *     student can follow it: Stage 1 = given, Stage 2 = locus to TL.
 *   • Steps card explains each construction move in plain English and
 *     reports computed TL, θ_HP, φ_VP to one decimal place.
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
  canvas { background:#fafafa; display:block; margin:0 auto; width:100%; height:560px; }
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
const PROBLEM = {
  title: "Line MN — apparent angles 40° (FV) & 45° (TV), projector distance 100 mm",
  text: "<strong>Problem Statement:</strong> The point M of line MN is 20 mm above HP &amp; is in VP. Its FV &amp; TV make 40° &amp; 45° with HP &amp; VP respectively. Draw the projections if the distance between the end projectors is 100 mm. Find true inclinations."
};

/* ─── Given ─────────────────────────────────────────────────────────── */
const mAboveHP   = 20;          // height of M above XY (FV)
const mInFrontVP = 0;           // M is in VP
const L          = 100;         // projector distance between end points
const alphaDeg   = 40;          // FV apparent angle with XY
const betaDeg    = 45;          // TV apparent angle with XY
const alpha = alphaDeg * Math.PI / 180;
const beta  = betaDeg  * Math.PI / 180;

/* ─── Derived geometry ──────────────────────────────────────────────── */
// Heights/depths at end N
const dz = L * Math.tan(alpha);          // N is dz higher than M (FV rise)
const dy = L * Math.tan(beta);           // N is dy further from VP than M (TV rise)
const nAboveHP   = mAboveHP + dz;
const nInFrontVP = mInFrontVP + dy;

// FV length m'n' and TV length mn
const FV_len = Math.hypot(L, dz);
const TV_len = Math.hypot(L, dy);

// True length
const TL = Math.hypot(L, dy, dz);

// True inclinations
const thetaHP = Math.asin(dz / TL);      // with HP
const phiVP   = Math.asin(dy / TL);      // with VP

/* ─── Canvas ────────────────────────────────────────────────────────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const COLOR_XY    = '#4a5568';
const COLOR_PROJ  = '#a0aec0';
const COLOR_FV    = '#e53e3e';
const COLOR_TV    = '#3182ce';
const COLOR_TL    = '#38a169';
const COLOR_TEXT  = '#2d3748';
const COLOR_DIM   = '#718096';

function setDash(arr) { ctx.setLineDash(arr || []); }
function line(x1,y1,x2,y2,color,width,dash){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth   = width || 1;
  setDash(dash);
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
  ctx.stroke();
  setDash([]);
}
function dot(x,y,r,color){ ctx.beginPath(); ctx.fillStyle=color; ctx.arc(x,y,r||3,0,Math.PI*2); ctx.fill(); }
function label(text,x,y,color,size,weight){
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.font = (weight||'bold')+' '+(size||13)+'px "Segoe UI", sans-serif';
  ctx.fillText(text,x,y);
}
function arc(cx,cy,r,a1,a2,color,ccw){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  setDash([3,3]);
  ctx.arc(cx,cy,r,a1,a2,ccw||false);
  ctx.stroke();
  setDash([]);
}
function angleArc(cx,cy,r,a1,a2,color){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  setDash([]);
  ctx.arc(cx,cy,r,a1,a2);
  ctx.stroke();
}
/* Dimension line with tick endcaps + centred label */
function dim(x1,y1,x2,y2,offset,text){
  const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy);
  const nx=-dy/L, ny=dx/L;
  const ox=nx*offset, oy=ny*offset;
  const ax=x1+ox, ay=y1+oy, bx=x2+ox, by=y2+oy;
  // extension lines
  line(x1,y1,ax,ay,COLOR_DIM,0.8);
  line(x2,y2,bx,by,COLOR_DIM,0.8);
  // main bar
  line(ax,ay,bx,by,COLOR_DIM,0.9);
  // arrow ticks
  const tick = 4;
  line(ax-nx*tick,ay-ny*tick,ax+nx*tick,ay+ny*tick,COLOR_DIM,0.9);
  line(bx-nx*tick,by-ny*tick,bx+nx*tick,by+ny*tick,COLOR_DIM,0.9);
  // text
  const mx=(ax+bx)/2 + nx*8;
  const my=(ay+by)/2 + ny*8;
  ctx.save();
  ctx.fillStyle = COLOR_DIM;
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign='center';
  ctx.fillText(text,mx,my);
  ctx.restore();
}

/* ─── Render ────────────────────────────────────────────────────────── */
function render(){
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = rect.width;
  const ch = 560;
  ctx.clearRect(0,0,cw,ch);

  document.getElementById('problem-desc').innerHTML = PROBLEM.text;

  const scale = Math.min((cw-180)/(2*L+180), 2.1);  // fit two stages side-by-side
  const stageW = L*scale + 120;
  const gap = 70;
  const totalW = stageW*2 + gap;
  let ox1 = (cw-totalW)/2;
  let ox2 = ox1 + stageW + gap;
  const oy = 290;                                   // XY line y

  /* ── Stage 1: GIVEN projections ───────────────────────────────────── */
  drawXY(ox1, oy, stageW, "Stage 1 · Given projections");

  // Endpoint coordinates on canvas (Stage 1)
  const mx1  = ox1 + 50;
  const m_fv = { x: mx1, y: oy - mAboveHP*scale };
  const m_tv = { x: mx1, y: oy + (mInFrontVP*scale) };
  const nx1  = mx1 + L*scale;
  const n_fv = { x: nx1, y: oy - nAboveHP*scale };
  const n_tv = { x: nx1, y: oy + nInFrontVP*scale };

  // Projector verticals (dashed)
  line(mx1, m_fv.y-12, mx1, m_tv.y+12, COLOR_PROJ, 1, [4,4]);
  line(nx1, n_fv.y-12, nx1, n_tv.y+12, COLOR_PROJ, 1, [4,4]);

  // FV segment m'n'
  line(m_fv.x, m_fv.y, n_fv.x, n_fv.y, COLOR_FV, 2.4);
  dot(m_fv.x, m_fv.y, 3, COLOR_FV); dot(n_fv.x, n_fv.y, 3, COLOR_FV);
  label("m'", m_fv.x-14, m_fv.y-6);
  label("n'", n_fv.x+6,  n_fv.y-6);

  // TV segment mn
  line(m_tv.x, m_tv.y, n_tv.x, n_tv.y, COLOR_TV, 2.4);
  dot(m_tv.x, m_tv.y, 3, COLOR_TV); dot(n_tv.x, n_tv.y, 3, COLOR_TV);
  label("m", m_tv.x-12, m_tv.y+14);
  label("n", n_tv.x+6,  n_tv.y+14);

  // Apparent angle α at m' (between m'n' and the horizontal through m')
  angleArc(m_fv.x, m_fv.y, 26, -alpha, 0, COLOR_FV);
  label(alphaDeg+"° (α)", m_fv.x+30, m_fv.y-6, COLOR_FV, 12);

  // Apparent angle β at m (between mn and horizontal through m)
  angleArc(m_tv.x, m_tv.y, 26, 0, beta, COLOR_TV);
  label(betaDeg+"° (β)", m_tv.x+30, m_tv.y+18, COLOR_TV, 12);

  // Dimensions: projector distance L; heights
  dim(mx1, oy, nx1, oy, 60, L.toFixed(0)+" mm  (projector distance)");
  dim(m_fv.x-22, m_fv.y, m_fv.x-22, oy, 0, mAboveHP+" mm");
  dim(n_fv.x+22, n_fv.y, n_fv.x+22, oy, 0, nAboveHP.toFixed(1)+" mm");
  dim(n_tv.x+22, oy, n_tv.x+22, n_tv.y, 0, nInFrontVP.toFixed(1)+" mm");

  /* ── Stage 2: CONSTRUCTION — locus arcs to find TL ────────────────── */
  drawXY(ox2, oy, stageW, "Stage 2 · True length by rotation");

  const mx2 = ox2 + 50;
  const M_fv = { x: mx2, y: oy - mAboveHP*scale };
  const M_tv = { x: mx2, y: oy + mInFrontVP*scale };
  const NX   = mx2 + L*scale;
  const N_fv = { x: NX, y: oy - nAboveHP*scale };
  const N_tv = { x: NX, y: oy + nInFrontVP*scale };

  line(mx2, M_fv.y-12, mx2, M_tv.y+12, COLOR_PROJ, 1, [4,4]);
  line(NX,  N_fv.y-12, NX,  N_tv.y+12, COLOR_PROJ, 1, [4,4]);

  // Original FV (light) + TV (light)
  line(M_fv.x, M_fv.y, N_fv.x, N_fv.y, COLOR_FV, 1.5);
  line(M_tv.x, M_tv.y, N_tv.x, N_tv.y, COLOR_TV, 1.5);
  dot(M_fv.x, M_fv.y, 3, COLOR_FV); dot(N_fv.x, N_fv.y, 3, COLOR_FV);
  dot(M_tv.x, M_tv.y, 3, COLOR_TV); dot(N_tv.x, N_tv.y, 3, COLOR_TV);
  label("m'", M_fv.x-14, M_fv.y-6); label("n'", N_fv.x+6, N_fv.y-6);
  label("m",  M_tv.x-12, M_tv.y+14); label("n",  N_tv.x+6, N_tv.y+14);

  /* Construction A: swing TV mn about m, horizontal — produces n₁ on
     horizontal locus. Distance from m to n₁ along horizontal = TV_len.
     Then projector up to FV horizontal through m' meets at TL endpoint. */
  // Locus arc in TV about m
  const r_tv = TV_len*scale;
  arc(M_tv.x, M_tv.y, r_tv,
      Math.atan2(N_tv.y-M_tv.y, N_tv.x-M_tv.x), 0, COLOR_PROJ);
  // Landing point on horizontal through m (TV plane)
  const n1_tv = { x: M_tv.x + r_tv, y: M_tv.y };
  dot(n1_tv.x, n1_tv.y, 2.5, COLOR_PROJ);
  label("n₁", n1_tv.x+5, n1_tv.y+14, COLOR_DIM, 11, 'normal');

  // Projector up to FV through n1_tv
  line(n1_tv.x, n1_tv.y, n1_tv.x, M_fv.y - dz*scale, COLOR_PROJ, 1, [4,4]);

  /* Construction B: swing FV m'n' about m', horizontal — produces n₂. */
  const r_fv = FV_len*scale;
  arc(M_fv.x, M_fv.y, r_fv,
      Math.atan2(N_fv.y-M_fv.y, N_fv.x-M_fv.x), 0, COLOR_PROJ);
  const n2_fv = { x: M_fv.x + r_fv, y: M_fv.y };
  dot(n2_fv.x, n2_fv.y, 2.5, COLOR_PROJ);
  label("n₂'", n2_fv.x+5, n2_fv.y-6, COLOR_DIM, 11, 'normal');

  /* TL₁ line: from m to n₁_tv_rotated up to true height — this is the
     true-length construction in the TV plane. m → tlEndA where tlEndA is
     at height dz above m_tv on the projector through n₁_tv. */
  const tlEndA = { x: n1_tv.x, y: M_tv.y - dz*scale };
  line(M_tv.x, M_tv.y, tlEndA.x, tlEndA.y, COLOR_TL, 2.4);
  dot(tlEndA.x, tlEndA.y, 3, COLOR_TL);
  label("TL", (M_tv.x+tlEndA.x)/2 - 24, (M_tv.y+tlEndA.y)/2 + 4, COLOR_TL, 13);

  /* TL₂ line: in FV plane, from m' along to tlEndB at depth dy in front. */
  const tlEndB = { x: n2_fv.x, y: M_fv.y + dy*scale };
  line(M_fv.x, M_fv.y, tlEndB.x, tlEndB.y, COLOR_TL, 2.4);
  dot(tlEndB.x, tlEndB.y, 3, COLOR_TL);

  // True inclination arcs
  // θ_HP at m_tv between m→tlEndA and m→n1_tv (horizontal)
  angleArc(M_tv.x, M_tv.y, 34,
    Math.atan2(tlEndA.y-M_tv.y, tlEndA.x-M_tv.x), 0, COLOR_TL);
  label("θ = "+(thetaHP*180/Math.PI).toFixed(1)+"°",
        M_tv.x+44, M_tv.y-10, COLOR_TL, 12);

  // φ_VP at m_fv between m'→tlEndB and m'→n2_fv (horizontal)
  angleArc(M_fv.x, M_fv.y, 34, 0,
    Math.atan2(tlEndB.y-M_fv.y, tlEndB.x-M_fv.x), COLOR_TL);
  label("φ = "+(phiVP*180/Math.PI).toFixed(1)+"°",
        M_fv.x+44, M_fv.y+22, COLOR_TL, 12);

  // TL dimension
  dim(M_tv.x, tlEndA.y, tlEndA.x, tlEndA.y, -22,
      "TL = "+TL.toFixed(1)+" mm");

  /* ── Steps card ───────────────────────────────────────────────────── */
  const steps = [
    "<strong>Locate M:</strong> M is in VP, so its TV (<em>m</em>) lies ON the XY line. M is 20 mm above HP, so its FV (<em>m'</em>) is 20 mm above XY.",
    "<strong>Draw apparent FV:</strong> from <em>m'</em>, draw a line at <strong>40°</strong> above XY (the given α). Mark a projector 100 mm to the right — its intersection is <em>n'</em>.",
    "<strong>Draw apparent TV:</strong> from <em>m</em> on XY, draw a line at <strong>45°</strong> below XY (the given β). The same 100 mm projector locates <em>n</em>.",
    "<strong>Find TL by rotation (TV side):</strong> with centre <em>m</em>, swing the TV <em>mn</em> down to the horizontal through <em>m</em>, locating <em>n₁</em>. Project <em>n₁</em> up to the FV level of <em>n'</em>. The line from <em>m</em> to that intersection is the TRUE LENGTH; the angle it makes with the horizontal is <strong>θ</strong> — the true inclination with HP.",
    "<strong>Find TL by rotation (FV side):</strong> with centre <em>m'</em>, swing the FV <em>m'n'</em> down to the horizontal, locating <em>n₂'</em>. Project down to <em>n</em>'s TV depth. The line from <em>m'</em> to that intersection is the TRUE LENGTH; the angle with the horizontal is <strong>φ</strong> — the true inclination with VP.",
    "<strong>Verify:</strong> both rotations must yield the same TL. Check that sin θ = Δz / TL and sin φ = Δy / TL."
  ];
  const list = document.getElementById('steps-list');
  list.innerHTML = '';
  steps.forEach(s => { const li=document.createElement('li'); li.innerHTML=s; list.appendChild(li); });

  const res = document.getElementById('results');
  res.innerHTML =
    '<div class="result-pill"><strong>'+TL.toFixed(1)+' mm</strong>True Length (TL)</div>'+
    '<div class="result-pill"><strong>'+(thetaHP*180/Math.PI).toFixed(1)+'°</strong>θ — true inclination with HP</div>'+
    '<div class="result-pill"><strong>'+(phiVP*180/Math.PI).toFixed(1)+'°</strong>φ — true inclination with VP</div>'+
    '<div class="result-pill"><strong>'+FV_len.toFixed(1)+' mm</strong>FV length (m\\'n\\')</div>'+
    '<div class="result-pill"><strong>'+TV_len.toFixed(1)+' mm</strong>TV length (mn)</div>';
}

function drawXY(ox, oy, w, title){
  line(ox, oy, ox+w, oy, COLOR_XY, 1.5);
  label("X", ox-6, oy-10, COLOR_XY, 12);
  label("Y", ox+w+2, oy-10, COLOR_XY, 12);
  label("VP", ox-6, oy-26, COLOR_XY, 11, 'normal');
  label("HP", ox-6, oy+24, COLOR_XY, 11, 'normal');
  ctx.fillStyle = '#718096';
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText(title, ox + w/2 - ctx.measureText(title).width/2, oy + 240);
}

function resize(){
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width * window.devicePixelRatio;
  canvas.height = 560 * window.devicePixelRatio;
  canvas.style.height = '560px';
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

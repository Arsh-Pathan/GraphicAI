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
 *       – Swing TV (mn)   about m  up   to horizontal — gives n₁ on XY
 *         Project up to n's locus to find true length and θ.
 *       – Swing FV (m'n') about m' down to horizontal — gives n₂' on horizontal
 *         Project down to n's locus to find true length and φ.
 *     (Both TL lines drawn in green; labeled TL, θ, φ)
 *   • SINGLE STAGE: all construction happens on a single XY line layout.
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
  text: "<strong>Problem Statement:</strong> The point M of line MN is 20 mm above HP &amp; 15 mm in front of VP. Its FV &amp; TV make 40° &amp; 45° with HP &amp; VP respectively. Draw the projections if the distance between the end projectors is 100 mm. Find true inclinations."
};

/* ─── Given ─────────────────────────────────────────────────────────── */
const mAboveHP   = 20;          // height of M above XY (FV)
const mInFrontVP = 15;          // M in front of VP
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
function tiltedLabel(text, x1, y1, x2, y2, color, size, weight, above = true) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  let angle = Math.atan2(y2 - y1, x2 - x1);
  if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = color || COLOR_TEXT;
  ctx.font = (weight||'bold')+' '+(size||13)+'px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = above ? 'bottom' : 'top';
  ctx.fillText(text, 0, above ? -4 : 4);
  ctx.restore();
}
function angleLabel(text, cx, cy, radius, startAngle, endAngle, color) {
  const angle = (startAngle + endAngle) / 2;
  const tx = cx + radius * Math.cos(angle);
  const ty = cy + radius * Math.sin(angle);
  
  ctx.save();
  ctx.font = '12px "Segoe UI", sans-serif';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(tx - tw/2 - 2, ty - 7, tw + 4, 14);
  
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, tx, ty);
  ctx.restore();
}
function arc(cx,cy,r,a1,a2,color,ccw){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
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
  const dx=x2-x1, dy=y2-y1, dist=Math.hypot(dx,dy);
  const nx=-dy/dist, ny=dx/dist;
  const ox=nx*offset, oy=ny*offset;
  const ax=x1+ox, ay=y1+oy, bx=x2+ox, by=y2+oy;
  const dimLineCol = 'rgba(113, 128, 150, 0.35)';
  // extension lines
  line(x1,y1,ax,ay,dimLineCol,0.8);
  line(x2,y2,bx,by,dimLineCol,0.8);
  // main bar
  line(ax,ay,bx,by,dimLineCol,0.9);
  // arrow ticks
  const tick = 4;
  line(ax-nx*tick,ay-ny*tick,ax+nx*tick,ay+ny*tick,dimLineCol,0.9);
  line(bx-nx*tick,by-ny*tick,bx+nx*tick,by+ny*tick,dimLineCol,0.9);
  // text
  const mx=(ax+bx)/2;
  const my=(ay+by)/2;
  ctx.save();
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  const tw = ctx.measureText(text).width;
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(mx - tw/2 - 4, my - 8, tw + 8, 16);
  ctx.fillStyle = 'rgba(113, 128, 150, 0.8)';
  ctx.fillText(text,mx,my);
  ctx.restore();
}

/* ─── Render ────────────────────────────────────────────────────────── */
function render(){
  const rect = canvas.parentElement.getBoundingClientRect();
  const cw = rect.width;
  const ch = 650;
  ctx.clearRect(0,0,cw,ch);

  document.getElementById('problem-desc').innerHTML = PROBLEM.text;

  // Scale based on both maximum width and maximum height to ensure everything fits
  const max_len = Math.max(TV_len, FV_len);
  const max_h = Math.max(mAboveHP, nAboveHP) + Math.max(mInFrontVP, nInFrontVP);
  
  const scaleX = (cw - 150) / max_len; // 150px total horizontal margin
  const scaleY = (ch - 150) / max_h;   // 150px total vertical margin
  const scale = Math.min(scaleX, scaleY, 4.0); // allow small problems to scale up relatively
  
  // Center geometry perfectly: 
  // Content width = max_len*scale + ~75px (for right-side locus labels)
  // Left padding = 60px, Right padding = 60px -> Total stageW
  const stageW = max_len*scale + 195;
  let ox = (cw-stageW)/2;
  // Dynamically center the XY line so the drawing is perfectly centered vertically
  const oy = (ch - max_h*scale)/2 + Math.max(mAboveHP, nAboveHP)*scale;

  drawXY(ox, oy, stageW, "");

  // Coordinates
  const mx  = ox + 60;
  const M_fv = { x: mx, y: oy - mAboveHP*scale };
  const M_tv = { x: mx, y: oy + mInFrontVP*scale };
  const NX   = mx + L*scale;
  const N_fv = { x: NX, y: oy - nAboveHP*scale };
  const N_tv = { x: NX, y: oy + nInFrontVP*scale };

  // Projectors
  line(mx, M_fv.y-25, mx, M_tv.y+25, COLOR_PROJ, 1, [4,4]);
  line(NX, N_fv.y-25, NX, N_tv.y+25, COLOR_PROJ, 1, [4,4]);

  // Locus lines (extending past the largest arc)
  const right_edge = mx + max_len*scale + 20;
  if (Math.abs(M_fv.y - oy) > 1) {
    line(mx, M_fv.y, right_edge, M_fv.y, COLOR_PROJ, 1, [3,3]); // locus of m'
    label("locus of m'", right_edge+5, M_fv.y+4, COLOR_PROJ, 12, 'normal');
  }
  if (Math.abs(M_tv.y - oy) > 1) {
    line(mx, M_tv.y, right_edge, M_tv.y, COLOR_PROJ, 1, [3,3]); // locus of m
  }
  if (Math.abs(N_fv.y - oy) > 1) {
    line(mx, N_fv.y, right_edge, N_fv.y, COLOR_PROJ, 1, [3,3]); // locus of n'
    label("locus of n'", right_edge+5, N_fv.y+4, COLOR_PROJ, 12, 'normal');
  }
  if (Math.abs(N_tv.y - oy) > 1) {
    line(mx, N_tv.y, right_edge, N_tv.y, COLOR_PROJ, 1, [3,3]); // locus of n
    label("locus of n", right_edge+5, N_tv.y+4, COLOR_PROJ, 12, 'normal');
  }

  // FV & TV segments
  line(M_fv.x, M_fv.y, N_fv.x, N_fv.y, COLOR_FV, 2.4);
  line(M_tv.x, M_tv.y, N_tv.x, N_tv.y, COLOR_TV, 2.4);
  dot(M_fv.x, M_fv.y, 3.5, COLOR_FV); dot(N_fv.x, N_fv.y, 3.5, COLOR_FV);
  dot(M_tv.x, M_tv.y, 3.5, COLOR_TV); dot(N_tv.x, N_tv.y, 3.5, COLOR_TV);
  
  // Endpoint labels
  label("m'", M_fv.x-16, M_fv.y-6);
  label("n'", N_fv.x+8,  N_fv.y-6);
  label("m",  M_tv.x-16, M_tv.y+16);
  label("n",  N_tv.x+8,  N_tv.y+16);
  
  // Line labels
  tiltedLabel("EL", M_fv.x, M_fv.y, N_fv.x, N_fv.y, COLOR_FV, 12, 'normal', true);
  tiltedLabel("PL", M_tv.x, M_tv.y, N_tv.x, N_tv.y, COLOR_TV, 12, 'normal', false);

  // Angles at m' (FV) - single arc for both θ and α
  angleArc(M_fv.x, M_fv.y, 40, -alpha, 0, COLOR_DIM);
  // True angle (θ) is smaller, so it occupies the inner wedge from 0 to -thetaHP
  angleLabel("θ", M_fv.x, M_fv.y, 48, -thetaHP, 0, COLOR_TL);
  // Apparent angle (α) is larger, occupying the outer wedge from -thetaHP to -alpha
  angleLabel(alphaDeg+"° (α)", M_fv.x, M_fv.y, 48, -alpha, -thetaHP, COLOR_FV);

  // Angles at m (TV) - single arc for both φ and β
  angleArc(M_tv.x, M_tv.y, 40, 0, beta, COLOR_DIM);
  // True angle (φ) is smaller, so it occupies the inner wedge from 0 to phiVP
  angleLabel("φ", M_tv.x, M_tv.y, 48, 0, phiVP, COLOR_TL);
  // Apparent angle (β) is larger, occupying the outer wedge from phiVP to beta
  angleLabel(betaDeg+"° (β)", M_tv.x, M_tv.y, 48, phiVP, beta, COLOR_TV);

  // Dimensions
  const projectorDimOffset = Math.max(mInFrontVP, nInFrontVP) * scale + 45;
  dim(mx, oy, NX, oy, projectorDimOffset, L.toFixed(0)+" mm  (Projector Distance)");
  if (mAboveHP > 0) dim(mx-35, M_fv.y, mx-35, oy, 0, mAboveHP+" mm");
  if (mInFrontVP > 0) dim(mx-35, oy, mx-35, M_tv.y, 0, mInFrontVP+" mm");

  /* Construction A: TV mn swung to horizontal */
  const r_tv = TV_len*scale;
  arc(M_tv.x, M_tv.y, r_tv, 0, beta, COLOR_PROJ); 
  const n1_tv = { x: M_tv.x + r_tv, y: M_tv.y };
  dot(n1_tv.x, n1_tv.y, 2.5, COLOR_PROJ);
  label("n₁", n1_tv.x+5, n1_tv.y+14, COLOR_DIM, 11, 'normal');

  // Project n1 up to locus of n'
  const tlEndA = { x: n1_tv.x, y: N_fv.y }; 
  line(n1_tv.x, n1_tv.y, tlEndA.x, tlEndA.y, COLOR_PROJ, 1, [4,4]);
  line(M_fv.x, M_fv.y, tlEndA.x, tlEndA.y, COLOR_TL, 2.4);
  dot(tlEndA.x, tlEndA.y, 3, COLOR_TL);
  label("n₁'", tlEndA.x+6, tlEndA.y-8, COLOR_TL, 12);
  tiltedLabel("TL", M_fv.x, M_fv.y, tlEndA.x, tlEndA.y, COLOR_TL, 13, 'bold', false);
  
  /* Construction B: FV m'n' swung to horizontal */
  const r_fv = FV_len*scale;
  arc(M_fv.x, M_fv.y, r_fv, -alpha, 0, COLOR_PROJ);
  const n2_fv = { x: M_fv.x + r_fv, y: M_fv.y };
  dot(n2_fv.x, n2_fv.y, 2.5, COLOR_PROJ);
  label("n₂'", n2_fv.x+5, n2_fv.y-8, COLOR_DIM, 11, 'normal');

  // Project n2' down to locus of n
  const tlEndB = { x: n2_fv.x, y: N_tv.y };
  line(n2_fv.x, n2_fv.y, tlEndB.x, tlEndB.y, COLOR_PROJ, 1, [4,4]);
  line(M_tv.x, M_tv.y, tlEndB.x, tlEndB.y, COLOR_TL, 2.4);
  dot(tlEndB.x, tlEndB.y, 3, COLOR_TL);
  label("n₂", tlEndB.x+6, tlEndB.y+16, COLOR_TL, 12);
  tiltedLabel("TL", M_tv.x, M_tv.y, tlEndB.x, tlEndB.y, COLOR_TL, 13, 'bold', true);
  
  // True inclination arcs removed because they are drawn together with apparent angles above
}

function drawXY(ox, oy, w, title){
  line(ox, oy, ox+w, oy, COLOR_XY, 1.5);
  label("X", ox-15, oy+4, COLOR_XY, 14);
  label("Y", ox+w+8, oy+4, COLOR_XY, 14);
  label("VP", ox-15, oy-15, COLOR_XY, 12, 'normal');
  label("HP", ox-15, oy+24, COLOR_XY, 12, 'normal');
  if(title) {
    ctx.fillStyle = '#718096';
    ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText(title, ox + w/2 - ctx.measureText(title).width/2, oy + 280);
  }
}

function resize(){
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width * window.devicePixelRatio;
  canvas.height = 650 * window.devicePixelRatio;
  canvas.style.height = '650px';
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  render();
}
window.addEventListener('resize', resize);
window.onload = resize;

/* ─── Steps card ───────────────────────────────────────────────────── */
const steps = [
  "<strong>Draw the Given Projections:</strong> Mark M at 20 mm above XY (<em>m'</em>) and on XY (<em>m</em>). Draw the apparent FV <em>m'n'</em> at <strong>40° (α)</strong> to the horizontal and TV <em>mn</em> at <strong>45° (β)</strong> to the horizontal. Mark the projector distance of 100 mm to locate <em>n'</em> and <em>n</em>.",
  "<strong>Find True Length (TL) and θ (HP inclination):</strong> With centre <em>m</em>, swing the TV <em>mn</em> to the horizontal passing through <em>m</em>, locating <em>n₁</em>. Project <em>n₁</em> vertically up to the horizontal locus of <em>n'</em> to get <em>n₁'</em>. Join <em>m'</em> to <em>n₁'</em>. This is the <strong>True Length (TL)</strong>. Its angle with the horizontal is <strong>θ</strong>.",
  "<strong>Find True Length (TL) and φ (VP inclination):</strong> With centre <em>m'</em>, swing the FV <em>m'n'</em> to the horizontal passing through <em>m'</em>, locating <em>n₂'</em>. Project <em>n₂'</em> vertically down to the horizontal locus of <em>n</em> to get <em>n₂</em>. Join <em>m</em> to <em>n₂</em>. This is also the <strong>True Length (TL)</strong>. Its angle with the horizontal is <strong>φ</strong>."
];
document.addEventListener('DOMContentLoaded', () => {
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
});
</script>
</body>
</html>
`

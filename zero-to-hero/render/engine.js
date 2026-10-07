// Tiny deterministic motion-graphics engine: Canvas2D scene -> WebGL post pass.
const A = {};
let W, H, sc, ctx, out, gl, prog, tex, U = {};
const FX0 = () => ({ ca: 0.002, glitch: 0, flash: [1, 1, 1, 0], grain: 0.035, vig: 0.55, scan: 0, bloom: 0.6, lb: 0, zb: 0, dir: [0, 0], seed: 0 });
let FX = FX0();

function loadImgs(names) {
  return Promise.all(names.map(n => new Promise((ok, no) => {
    const i = new Image(); i.onload = () => { A[n.replace(/\.(jpg|png)$/, '')] = i; ok(); }; i.onerror = no; i.src = 'p/' + n;
  })));
}

function setup(w, h) {
  W = w; H = h;
  sc = document.createElement('canvas'); sc.width = w; sc.height = h; ctx = sc.getContext('2d');
  out = document.getElementById('out'); out.width = w; out.height = h;
  gl = out.getContext('webgl2', { preserveDrawingBuffer: true });
  const vs = `#version 300 es
  in vec2 p; out vec2 uv; void main(){uv=p*.5+.5; gl_Position=vec4(p,0,1);}`;
  const fs = `#version 300 es
  precision highp float;
  uniform sampler2D T; uniform vec2 R; uniform float t,ca,gli,grain,vig,scan,bloom,seed,lb,zb; uniform vec2 dir; uniform vec4 flash;
  in vec2 uv; out vec4 o;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed*13.7)*43758.5453);}
  vec3 S(vec2 u){
    if(dir.x==0. && dir.y==0. && zb==0.) return texture(T,u).rgb;
    vec3 c=vec3(0);
    for(int i=0;i<14;i++){ float k=float(i)/13.-.5; c+=texture(T,u+dir*k+(u-.5)*zb*k).rgb; }
    return c/14.;
  }
  void main(){
    vec2 u=uv;
    if(gli>0.){
      float by=floor(u.y*28.+floor(t*12.)*3.); float r=h(vec2(by,floor(t*24.)));
      if(r<gli*.6) u.x+=(h(vec2(by,t))-.5)*.18*gli;
      float by2=floor(u.y*7.); if(h(vec2(by2,floor(t*9.)+1.))<gli*.25) u.y+=(h(vec2(t,by2))-.5)*.05;
    }
    vec2 d=u-.5; float k=ca*(.4+length(d)*2.2)+gli*.012;
    vec3 c=vec3(S(u+d*k).r,S(u).g,S(u-d*k).b);
    if(bloom>0.){
      vec3 b=vec3(0);
      for(int i=0;i<18;i++){ float a=float(i)*2.39996; float rr=sqrt(float(i)+.5)/4.24*.045;
        vec3 s=texture(T,u+vec2(cos(a)*R.y/R.x,sin(a))*rr).rgb; b+=max(s-.66,0.); }
      c+=b/18.*bloom*3.;
    }
    c*=1.-scan*.35*(.5+.5*sin(uv.y*R.y*1.5708));
    c+=(h(uv*R+fract(t*7.)*91.)-.5)*grain;
    vec2 q=d*vec2(R.x/R.y,1.); c*=mix(1.,smoothstep(1.15,.2,length(q)*1.25),vig);
    c=mix(c,flash.rgb,clamp(flash.a,0.,1.));
    if(uv.y<lb||uv.y>1.-lb) c=vec3(0.);
    o=vec4(c,1);
  }`;
  const mk = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
  prog = gl.createProgram(); gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); gl.useProgram(prog);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const l = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  for (const n of ['T', 'R', 't', 'ca', 'gli', 'grain', 'vig', 'scan', 'bloom', 'seed', 'lb', 'zb', 'dir', 'flash']) U[n] = gl.getUniformLocation(prog, n);
}

function post(t) {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sc);
  gl.viewport(0, 0, W, H);
  gl.uniform2f(U.R, W, H); gl.uniform1f(U.t, t); gl.uniform1f(U.ca, FX.ca); gl.uniform1f(U.gli, FX.glitch);
  gl.uniform1f(U.grain, FX.grain); gl.uniform1f(U.vig, FX.vig); gl.uniform1f(U.scan, FX.scan); gl.uniform1f(U.bloom, FX.bloom);
  gl.uniform1f(U.seed, FX.seed); gl.uniform1f(U.lb, FX.lb); gl.uniform1f(U.zb, FX.zb); gl.uniform2f(U.dir, FX.dir[0], FX.dir[1]);
  gl.uniform4f(U.flash, ...FX.flash);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eo5 = x => 1 - Math.pow(1 - clamp(x), 5);
const ei = x => Math.pow(clamp(x), 3);
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const bump = (t, c, w) => Math.max(0, 1 - Math.abs(t - c) / w);
function rng(s) { s = s >>> 0 || 1; return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = (a, b = 0) => { const r = rng(a * 9301 + b * 49297 + 7); return r(); };

// ---------- drawing ----------
const C = { cyan: '#8fe0f2', win: '#6fe3a5', gold: '#e8c46a', red: '#ff4d5e', mag: '#ff4fd8' };
const F = { d: '"Inter Tight"', m: '"JetBrains Mono"' };

function cover(img, o = {}) {
  const { x = 0, y = 0, w = W, h = H, z = 1, cx = .5, cy = .5, a = 1, dx = 0, dy = 0, rot = 0 } = o;
  const s = Math.max(w / img.width, h / img.height) * z;
  const iw = img.width * s, ih = img.height * s;
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.translate(x + w / 2 + dx, y + h / 2 + dy); if (rot) ctx.rotate(rot);
  ctx.drawImage(img, -iw * cx, -ih * cy, iw, ih);
  ctx.restore();
}
function fill(c, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function grad(x0, y0, x1, y1, stops, a = 1, op = 'source-over', rect) {
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = op;
  const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g; rect ? ctx.fillRect(...rect) : ctx.fillRect(0, 0, W, H); ctx.restore();
}
function glow(x, y, r, c, a = 1, op = 'lighter') {
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.globalCompositeOperation = op;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function tint(c, a, op = 'soft-light') { ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }

function text(s, x, y, o = {}) {
  const { size = 20, w = 800, f = F.d, c = '#fff', al = 'left', bl = 'alphabetic', ls = 0, a = 1, sh = 0, shc = 'rgba(0,0,0,.6)', stroke = 0, op = 'source-over' } = o;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.globalCompositeOperation = op;
  ctx.font = `${w} ${size}px ${f}`; ctx.textAlign = al; ctx.textBaseline = bl; ctx.letterSpacing = ls + 'px';
  if (sh) { ctx.shadowColor = shc; ctx.shadowBlur = sh; }
  if (stroke) { ctx.lineWidth = stroke; ctx.strokeStyle = c; ctx.strokeText(s, x, y); } else { ctx.fillStyle = c; ctx.fillText(s, x, y); }
  ctx.restore();
}
function mono(s, x, y, o = {}) { text(s, x, y, Object.assign({ f: F.m, w: 500, size: 13, ls: 2.5, c: 'rgba(255,255,255,.85)' }, o)); }

// Big title slam: scale down from big + ghost trails + glow
function slam(s, x, y, p, o = {}) {
  if (p <= 0) return;
  const { size = 120, c = '#fff', al = 'center', glowc = C.cyan, out = 1 } = o;
  const k = eo5(p * 1.6); const sc2 = lerp(1.9, 1, k);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc2, sc2);
  for (let i = 3; i >= 1; i--) text(s, 0, 0, { size, c: glowc, al, a: (1 - k) * .2 * out / i, bl: 'middle', ls: -size * .04 + i * 6 * (1 - k) });
  text(s, 0, 0, { size, c, al, a: clamp(p * 4) * out, bl: 'middle', ls: -size * .045, sh: 18, shc: glowc });
  ctx.restore();
}

function brackets(x, y, w, h, o = {}) {
  const { l = 22, c = C.cyan, a = 1, lw = 2 } = o;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.shadowColor = c; ctx.shadowBlur = 8; ctx.beginPath();
  ctx.moveTo(x, y + l); ctx.lineTo(x, y); ctx.lineTo(x + l, y);
  ctx.moveTo(x + w - l, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + l);
  ctx.moveTo(x + w, y + h - l); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - l, y + h);
  ctx.moveTo(x + l, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - l);
  ctx.stroke(); ctx.restore();
}
function line(x0, y0, x1, y1, c, lw = 1, a = 1, blur = 0) {
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = c; ctx.lineWidth = lw; if (blur) { ctx.shadowColor = c; ctx.shadowBlur = blur; }
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
}
function rect(x, y, w, h, c, a = 1, r = 0) { ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.restore(); }
function srect(x, y, w, h, c, lw = 1, a = 1, r = 0, blur = 0) { ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = c; ctx.lineWidth = lw; if (blur) { ctx.shadowColor = c; ctx.shadowBlur = blur; } ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke(); ctx.restore(); }

const tc = t => { const f = Math.floor(t * 25) % 25, s = Math.floor(t) % 60; return `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`; };
const hex = (n, seed) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += '0123456789ABCDEF'[Math.floor(r() * 16)]; return s; };

// HUD chrome: corner brackets, REC, timecode
function hud(t, o = {}) {
  const { a = 1, label = 'NEYRA // PLAY', m = 22, rec = true } = o;
  brackets(m, m, W - m * 2, H - m * 2, { a: a * .9, l: 26, c: 'rgba(255,255,255,.85)', lw: 1.5 });
  mono(label, m + 18, m + 30, { a, size: 12 });
  mono(tc(t), W - m - 18, m + 30, { a, size: 12, al: 'right' });
  if (rec && Math.floor(t * 2) % 2 === 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(W - m - 18 - 160, m + 26, 4.5, 0, 7); ctx.fill(); ctx.restore(); }
}

// ---------- particles / atmosphere ----------
function rain(t, o = {}) {
  const { n = 260, ang = .18, len = 34, sp = 1500, a = .5, c = '200,220,255', seed = 1, lw = 1.2 } = o;
  const r = rng(seed); ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x0 = r() * (W + 200) - 100, y0 = r() * H, z = .4 + r() * .9, ph = r();
    const y = ((y0 + t * sp * z) % (H + len * 2)) - len; const x = x0 + y * ang;
    ctx.strokeStyle = `rgba(${c},${a * z * (.4 + ph * .6)})`; ctx.lineWidth = lw * z;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ang * len * z, y + len * z); ctx.stroke();
  }
  ctx.restore();
}
function motes(t, o = {}) { // embers / dust / sparks, periodic in loop L
  const { n = 80, c = '255,170,80', a = .9, seed = 3, vy = -60, vx = 15, size = 2.2, L = 0, wob = 20, x0 = 0, x1 = W, y0 = 0, y1 = H, glowr = 3 } = o;
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const bx = x0 + r() * (x1 - x0), by = y0 + r() * (y1 - y0), z = .3 + r(), ph = r() * 6.28, fl = r();
    const hh = y1 - y0 + 40, ww = x1 - x0 + 40;
    const tt = L ? (t % L) : t; const span = L ? hh / Math.abs(vy * z) : 0; void span;
    let y = by + vy * z * tt; y = ((y - y0) % hh + hh) % hh + y0 - 20;
    let x = bx + vx * z * tt + Math.sin(tt * 1.3 + ph) * wob; x = ((x - x0) % ww + ww) % ww + x0 - 20;
    const al = a * (.35 + .65 * Math.abs(Math.sin(t * (1 + fl * 3) + ph)));
    const s = size * z;
    ctx.fillStyle = `rgba(${c},${al})`; ctx.shadowColor = `rgba(${c},1)`; ctx.shadowBlur = glowr * s;
    ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function warp(t, o = {}) { // hyperspace star streaks
  const { n = 400, cx = W / 2, cy = H / 2, sp = 1, a = 1, seed = 9, c = '200,235,255', streak = 1 } = o;
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const R = Math.hypot(W, H);
  for (let i = 0; i < n; i++) {
    const ang = r() * 6.283, d0 = r(), v = .2 + r() * .8;
    const d = ((d0 + t * sp * v * .5) % 1); const dd = Math.pow(d, 2.2) * R;
    const len = Math.min(dd * .45, 30 + dd * .5) * streak + 1.5;
    const x = cx + Math.cos(ang) * dd, y = cy + Math.sin(ang) * dd;
    ctx.strokeStyle = `rgba(${c},${a * clamp(d * 2.5) * (.5 + v * .5)})`; ctx.lineWidth = .6 + d * 2.4;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(ang) * len, y - Math.sin(ang) * len); ctx.stroke();
  }
  ctx.restore();
}
function bokeh(t, o = {}) {
  const { n = 26, cols = ['255,80,160', '80,200,255', '255,190,80'], a = .35, seed = 5, rmin = 20, rmax = 70, drift = 12 } = o;
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x = r() * W + Math.sin(t * .5 + i) * drift, y = r() * H + Math.cos(t * .4 + i) * drift, rr = rmin + r() * (rmax - rmin), c = cols[i % cols.length];
    const al = a * (.5 + .5 * Math.sin(t * (1 + r()) + i));
    const g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(${c},${al})`); g.addColorStop(.7, `rgba(${c},${al * .6})`); g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function fog(t, o = {}) {
  const { n = 7, c = '220,230,255', a = .25, seed = 11, y0 = H * .5, y1 = H, sp = 20, r0 = .35 } = o;
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) {
    const rr = W * (r0 + r() * .4); const x = ((r() * W + t * sp * (.5 + r())) % (W + rr * 2)) - rr; const y = y0 + r() * (y1 - y0);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  ctx.restore();
}
function flare(x, y, s, a = 1, c = '255,200,140') {
  glow(x, y, s, `rgba(${c},.9)`, a); glow(x, y, s * .25, 'rgba(255,255,255,1)', a);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(a);
  const g = ctx.createLinearGradient(x - s * 4, 0, x + s * 4, 0); g.addColorStop(0, `rgba(${c},0)`); g.addColorStop(.5, `rgba(${c},.8)`); g.addColorStop(1, `rgba(${c},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - s * 4, y - 2.5, s * 8, 5); ctx.restore();
  for (let i = 1; i < 4; i++) { const k = i * .35; glow(lerp(x, W - x, k), lerp(y, H - y, k), s * .12 * i, `rgba(${c},.35)`, a); }
}
function speedLines(t, o = {}) {
  const { n = 60, cx = W / 2, cy = H / 2, a = .5, seed = 21, c = '255,255,255', r0 = .35 } = o;
  const r = rng(seed + Math.floor(t * 25)); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = Math.hypot(W, H);
  for (let i = 0; i < n; i++) {
    const ang = r() * 6.283, d = R * (r0 + r() * .3), len = R * (.2 + r() * .4), w = .5 + r() * 2.5;
    ctx.strokeStyle = `rgba(${c},${a * r()})`; ctx.lineWidth = w; ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * d, cy + Math.sin(ang) * d); ctx.lineTo(cx + Math.cos(ang) * (d + len), cy + Math.sin(ang) * (d + len)); ctx.stroke();
  }
  ctx.restore();
}
function lightning(t, seed, x, y0, y1, a = 1) {
  if (a <= 0) return;
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(210,225,255,${a})`; ctx.shadowColor = '#9cf'; ctx.shadowBlur = 25; ctx.lineWidth = 2.5;
  const bolt = (x, y, len, ang, w, depth) => {
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); let cx = x, cy = y;
    for (let i = 0; i < 14; i++) { cx += Math.sin(ang) * len / 14 + (r() - .5) * 40; cy += Math.cos(ang) * len / 14; ctx.lineTo(cx, cy); if (depth < 2 && r() < .18) { ctx.stroke(); bolt(cx, cy, len * .4, ang + (r() - .5) * 1.4, w * .5, depth + 1); ctx.beginPath(); ctx.moveTo(cx, cy); } }
    ctx.stroke();
  };
  bolt(x, y0, y1 - y0, 0, 3, 0); ctx.restore();
}
function grid(a = .2, step = 40, c = '143,224,242') {
  ctx.save(); ctx.strokeStyle = `rgba(${c},${a})`; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0; x <= W; x += step) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); }
  for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); }
  ctx.stroke(); ctx.restore();
}
function scanBeam(y, a = 1, c = '143,224,242', thick = 3) {
  grad(0, y - 120, 0, y, [[0, `rgba(${c},0)`], [1, `rgba(${c},.35)`]], a, 'lighter', [0, y - 120, W, 120]);
  rect(0, y - thick / 2, W, thick, `rgb(${c})`, a); glow(W / 2, y, W * .35, `rgba(${c},.25)`, a);
  rect(0, y - .75, W, 1.5, '#fff', a);
}
function sparks(t, x0, x1, y, seed, a = 1, c = '180,240,255') {
  const r = rng(seed + Math.floor(t * 25)); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) { const x = x0 + r() * (x1 - x0), l = 4 + r() * 22, an = -Math.PI / 2 + (r() - .5) * 2.4; ctx.strokeStyle = `rgba(${c},${a * r()})`; ctx.lineWidth = 1 + r(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); ctx.stroke(); }
  ctx.restore();
}
function wave(t, x, y, w, h, o = {}) {
  const { n = 64, c = C.cyan, a = 1, amp = 1, seed = 4 } = o; const r = rng(seed); const bw = w / n;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 12;
  for (let i = 0; i < n; i++) {
    const f1 = r() * 6, f2 = r() * 3; const env = Math.sin(i / n * Math.PI);
    const v = (.15 + .85 * Math.abs(Math.sin(t * (3 + f1) + i * .5) * Math.sin(t * (1.3 + f2) + i * .21))) * env * amp;
    const bh = Math.max(3, v * h); ctx.beginPath(); ctx.roundRect(x + i * bw + bw * .2, y - bh / 2, bw * .6, bh, 2); ctx.fill();
  }
  ctx.restore();
}

// Reveal an image with procedural "pencil strokes" (cached mask canvas).
const _mask = {};
function strokeReveal(img, p, key, o = {}) {
  const { x = 0, y = 0, w = W, h = H, z = 1, n = 520, seed = 77 } = o;
  let m = _mask[key]; if (!m) { m = _mask[key] = document.createElement('canvas'); m.width = w; m.height = h; }
  const mc = m.getContext('2d'); mc.clearRect(0, 0, w, h);
  const r = rng(seed); const k = Math.floor(n * clamp(p)); let tip = null;
  mc.lineCap = 'round'; mc.strokeStyle = '#000';
  for (let i = 0; i < n; i++) {
    // strokes concentrated toward the centre first (draw outline -> details)
    const cx = w * (.5 + (r() - .5) * (.3 + i / n * .9)), cy = h * (.12 + r() * .85);
    const len = 40 + r() * 160, an = r() * 6.28, lw = 10 + r() * 34;
    if (i < k) { mc.lineWidth = lw; mc.beginPath(); mc.moveTo(cx, cy); mc.quadraticCurveTo(cx + Math.cos(an) * len * .5 + 30, cy + Math.sin(an) * len * .5, cx + Math.cos(an) * len, cy + Math.sin(an) * len); mc.stroke(); if (i === k - 1) tip = [x + cx + Math.cos(an) * len, y + cy + Math.sin(an) * len]; }
  }
  if (p >= 1) { mc.fillRect(0, 0, w, h); }
  const tmp = _mask[key + 't'] || (_mask[key + 't'] = document.createElement('canvas')); tmp.width = w; tmp.height = h;
  const tc2 = tmp.getContext('2d'); tc2.clearRect(0, 0, w, h);
  const s = Math.max(w / img.width, h / img.height) * z; tc2.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s);
  tc2.globalCompositeOperation = 'destination-in'; tc2.drawImage(m, 0, 0);
  ctx.drawImage(tmp, x, y);
  return tip;
}

// Draw scene B over scene A below a horizontal scan line
function scanSwap(drawA, drawB, yLine) {
  drawA(); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, yLine); ctx.clip(); drawB(); ctx.restore();
}

// Shot-based timeline with whip-blur transitions
function shots(t, list, o = {}) {
  const { whip = .16, dirx = 1 } = o;
  let i = list.findIndex(s => t >= s.s && t < s.e); if (i < 0) i = list.length - 1;
  const s = list[i]; const lt = t - s.s, p = (t - s.s) / (s.e - s.s);
  s.d(lt, p, s);
  // transition energy around boundaries
  let e = 0, sign = 1;
  if (s.cut !== 'hard') { const toEnd = s.e - t, fromStart = t - s.s; if (toEnd < whip && i < list.length - 1) { e = 1 - toEnd / whip; sign = 1; } if (fromStart < whip && i > 0) { e = Math.max(e, 1 - fromStart / whip); sign = -1; } }
  if (e > 0) { const k = ei(e); FX.dir = [k * .22 * dirx * (s.vert ? 0 : 1), s.vert ? k * .22 : 0]; FX.flash = [1, 1, 1, Math.max(FX.flash[3], k * .55)]; FX.ca += k * .02; }
  return { i, lt, p };
}


// seamless loop: crossfade the tail into the head
let _lb;
function loopy(fn, t, L, ov = .7) {
  fn(t);
  if (t > L - ov) {
    _lb = _lb || document.createElement('canvas'); _lb.width = W; _lb.height = H;
    const b = _lb.getContext('2d'); b.clearRect(0, 0, W, H); b.drawImage(sc, 0, 0);
    const fx = FX; ctx.clearRect(0, 0, W, H); fn(t - L); const fx2 = FX; FX = fx; void fx2;
    const k = eio((t - (L - ov)) / ov);
    ctx.save(); ctx.globalAlpha = 1 - k; ctx.drawImage(_lb, 0, 0); ctx.restore();
  }
}
function typed(s, p) { return s.slice(0, Math.floor(s.length * clamp(p))); }
window.ENG = { setup, post };

// Each video: {w,h,dur,imgs,draw(t)}
const V = {};

// ============ 01 HERO REEL (sketch -> hero -> any scene) ============
V.hero = {
  w: 720, h: 900, dur: 12,
  imgs: ['sketch.jpg', 'face.jpg', 'city.jpg', 'space.jpg', 'cliff.jpg', 'close.jpg', 'space-girl.jpg', 'roof.jpg'],
  draw(t) {
    FX = FX0(); FX.seed = t;
    const paper = '#ebe6dc';
    if (t < 2.8) { // SKETCH draws itself
      fill(paper);
      const p = eo(seg(t, 0, 2.3));
      const tip = strokeReveal(A.sketch, p, 'h', { n: 420, seed: 5 });
      grid(.08, 36, '40,60,80');
      if (tip && p < 1) { glow(tip[0], tip[1], 40, 'rgba(143,224,242,.9)', 1); glow(tip[0], tip[1], 8, '#fff', 1); }
      mono('INPUT // HUMAN SKETCH', 40, 62, { c: 'rgba(20,24,30,.8)' });
      mono(tc(t), W - 40, 62, { c: 'rgba(20,24,30,.8)', al: 'right' });
      brackets(24, 24, W - 48, H - 48, { c: 'rgba(20,24,30,.7)', lw: 1.5 });
      const hs = seg(t, .6, 2.2);
      mono('SHA-256  ' + hex(24, Math.floor(t * 25)), 40, H - 58, { c: 'rgba(20,24,30,.75)', size: 12, a: hs > 0 ? 1 : 0 });
      const st = seg(t, 2.1, 2.35);
      if (st > 0) { // SEALED stamp
        ctx.save(); ctx.translate(W - 170, H - 150); ctx.rotate(-.12); const s = lerp(1.8, 1, eo5(st)); ctx.scale(s, s);
        srect(-120, -38, 240, 76, '#0a7a52', 4, st, 8); text('SEALED', 0, 4, { size: 40, c: '#0a7a52', al: 'center', bl: 'middle', a: st, ls: 4 });
        mono('NYR-0x7A3F', 0, 30, { c: '#0a7a52', al: 'center', a: st, size: 11 }); ctx.restore();
        FX.ca += (1 - st) * .02;
      }
      FX.grain = .05; FX.vig = .35; FX.bloom = .2;
      if (t > 2.55) { FX.glitch = seg(t, 2.55, 2.8) * .9; }
    } else if (t < 5.7) { // SCAN: sketch -> living hero
      const lt = t - 2.8; const y = eo(seg(lt, 0, 1.5)) * (H + 40) - 20; const z = 1 + lt * .02;
      scanSwap(() => { fill(paper); cover(A.sketch, { z }); }, () => { cover(A.face, { z }); tint('#1a3a55', .25, 'soft-light'); }, y);
      if (lt < 1.6) { scanBeam(y, 1 - seg(lt, 1.4, 1.6)); sparks(t, 0, W, y, 3, .9); FX.glitch = .25 * (1 - seg(lt, 1.2, 1.6)); FX.ca = .008; }
      // face lock
      const fl = seg(lt, 1.5, 1.9); const fx = 238, fy = 92, fw = 250, fh = 330;
      if (fl > 0) {
        const k = eo5(fl), g = lerp(140, 0, k);
        brackets(fx - g, fy - g, fw + g * 2, fh + g * 2, { a: fl * (lt < 2.6 ? 1 : 1 - seg(lt, 2.6, 2.9)), l: 24, c: C.cyan });
        const r = rng(8); for (let i = 0; i < 26; i++) { const px = fx + 40 + r() * (fw - 80), py = fy + 70 + r() * (fh - 110); if (r() < seg(lt, 1.6, 2.3)) rect(px - 2, py - 2, 4, 4, C.cyan, .9 * (1 - seg(lt, 2.6, 2.9))); }
        mono('IDENTITY LOCK', fx - 4, fy - 18 - g, { c: C.cyan, a: fl, size: 12 });
        mono((Math.min(99.7, 80 + seg(lt, 1.5, 2.3) * 19.7)).toFixed(1) + '%', fx + fw + 4, fy - 18 - g, { c: C.cyan, a: fl, size: 12, al: 'right' });
      }
      hud(t, { label: 'NEYRA // HERO SYNTH', a: seg(lt, 1.4, 1.8) });
      const nm = seg(lt, 2.0, 2.3);
      if (nm > 0) { text('MIRA HALE', 40, H - 70, { size: 64, a: nm, ls: -2, sh: 20, shc: 'rgba(0,0,0,.7)' }); mono('HERO · NYR-0x7A3F · SIGNED BY YOU', 42, H - 40, { c: C.win, a: nm, size: 12 }); }
      FX.bloom = .7; FX.vig = .6;
      if (lt > 2.65) { const e = seg(lt, 2.65, 2.9); FX.zb = ei(e) * .35; FX.flash = [1, 1, 1, ei(e) * .7]; }
    } else { // ANY SCENE: genre montage
      const tags = [];
      const list = [
        { s: 5.7, e: 6.95, g: 'EPIC', d: (lt, p) => { cover(A.city, { z: 1.25 - p * .12, cy: .45 }); flare(250, 230, 110, .45 + .1 * Math.sin(lt * 9)); motes(lt, { n: 70, vy: -90, vx: 30, seed: 2 }); tags.push(['EPIC', 'GOLDEN HOUR · 35MM', p]); } },
        { s: 6.95, e: 8.2, g: 'SCI-FI', d: (lt, p) => { cover(A['space-girl'], { z: 1.08 + p * .14, cy: .35 }); warp(lt + 1, { n: 260, sp: 1.6, a: .8, cx: W * .5, cy: H * .3 }); tint('#2a6cff', .25, 'soft-light'); tags.push(['SCI-FI', 'HYPERDRIVE · ANAMORPHIC', p]); FX.ca = .006; } },
        { s: 8.2, e: 9.3, g: 'NOIR', d: (lt, p) => { cover(A.close, { z: 1.05 + p * .12, cx: .55 }); ctx.save(); ctx.filter = 'grayscale(1) contrast(1.35)'; ctx.drawImage(sc, 0, 0); ctx.restore(); fill('#000', .3); rain(lt, { n: 220, a: .55, seed: 4 }); tint('#2040a0', .25, 'color'); glow(W * .85, H * .15, 260, 'rgba(255,40,120,.3)', 1); tags.push(['NEON NOIR', 'RAIN · 85MM · F/1.4', p]); } },
        { s: 9.3, e: 10.5, g: 'WORLD', d: (lt, p) => { cover(A.cliff, { z: 1.5 - p * .2, cy: .5 + p * .05 }); fog(lt, { a: .16, y0: H * .5, sp: 60 }); motes(lt, { n: 60, c: '220,235,255', vx: 160, vy: 20, size: 1.4, a: .6, seed: 6 }); tags.push(['ADVENTURE', 'CRANE UP · 24MM', p]); } },
        { s: 10.5, e: 12, g: 'END', cut: 'hard', d: (lt, p) => {
          cover(A.roof, { z: 1.35 + p * .1, cx: .5 }); fill('#000', .45 + p * .3);
          speedLines(lt, { a: .35 * (1 - p), n: 50 });
          slam('ZERO', W / 2, H * .40, seg(lt, .05, .45), { size: 150 });
          const s2 = seg(lt, .35, .75); if (s2 > 0) { text('→', W / 2, H * .5, { size: 60, al: 'center', bl: 'middle', c: C.cyan, a: s2 }); }
          slam('HERO', W / 2, H * .60, seg(lt, .45, .85), { size: 150, c: C.win, glowc: C.win });
          mono('$10,000 · 100 WINNERS', W / 2, H * .74, { al: 'center', a: seg(lt, .8, 1.0), c: '#fff', size: 14 });
          FX.flash = [0.92, 0.9, 0.86, ei(seg(lt, 1.15, 1.5))]; // to paper white -> loop
          FX.ca = .004 + (1 - seg(lt, .4, .9)) * .02;
        } },
      ];
      shots(t, list);
      if (tags.length) grad(0, 0, 0, 260, [[0, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']], 1, 'source-over', [0, 0, W, 260]);
      tags.forEach(([g, sub, p]) => {
        const k = eo5(seg(p, .02, .25)); const x = lerp(-300, 36, k);
        rect(x - 8, 112, 6, 64, C.cyan, k); text(g, x + 10, 156, { size: 56, a: k, ls: -2, sh: 18 });
        mono(sub, x + 12, 186, { c: C.cyan, a: k, size: 11 });
      });
      if (t < 10.5) hud(t, { label: 'NEYRA PLAY // ANY SCENE' });
      FX.bloom = .5; FX.vig = .6;
    }
  }
};


// ============ TRAILER: every genre, one Hero (16:9) ============
V.trailer = {
  w: 1280, h: 720, dur: 17,
  imgs: ['elara.jpg', 'yuki.jpg', 'kofi.jpg', 'ansel.jpg', 'space-girl.jpg', 'city.jpg', 'roof.jpg', 'sketch.jpg', 'face.jpg', 'market.jpg', 'space.jpg', 'cliff.jpg', 'close.jpg', 'neyra-logo.png'],
  draw(t) {
    FX = FX0(); FX.seed = t; FX.bloom = .5; FX.vig = .65;
    const card = (g, sub, lt, col = C.cyan) => {
      const k = eo5(seg(lt, .05, .35)), o = 1 - seg(lt, 1.25, 1.45);
      grad(0, H, 0, H - 260, [[0, 'rgba(0,0,0,.75)'], [1, 'rgba(0,0,0,0)']], 1, 'source-over', [0, H - 260, W, 260]);
      const x = lerp(-500, 70, k);
      rect(x - 18, H - 168, 7, 92, col, k * o);
      text(g, x, H - 96, { size: 92, a: k * o, ls: -4, sh: 24, shc: col });
      mono(sub, x + 4, H - 60, { c: col, a: k * o, size: 13 });
    };
    const list = [
      { s: 0, e: 1.3, cut: 'hard', d: (lt) => { fill('#000'); grid(.07, 48); mono(typed('> ONE SKETCH.', seg(lt, .1, .6)) + (Math.floor(lt * 6) % 2 ? '_' : ''), W / 2 - 150, H / 2, { size: 30, c: C.cyan, ls: 4 }); FX.glitch = bump(lt, 1.2, .15) * .8; } },
      { s: 1.3, e: 3.0, d: (lt, p) => { cover(A.elara, { z: 1.1 + p * .12, cx: .5 }); fill('#000', .15); bokeh(lt, { n: 18, a: .25 }); rain(lt, { n: 420, a: .6, sp: 1800, len: 44 }); const fl = bump(lt, .9, .08) + bump(lt, 1.05, .05); fill('#cfe0ff', fl * .35); card('NEON NOIR', 'ELARA VANCE · RAIN · 85MM', lt, C.mag); } },
      { s: 3.0, e: 4.5, d: (lt, p) => { cover(A.yuki, { z: 1.05 + p * .2 }); tint('#40a0ff', .3); bokeh(lt, { n: 20, cols: ['80,200,255', '255,80,220'], a: .3 }); FX.glitch = .15 + bump(lt, .7, .12) * .8; FX.scan = .5; card('CYBER', 'YUKI-9 · SYNTH IDOL', lt, C.cyan); } },
      { s: 4.5, e: 5.9, d: (lt, p) => { const sh = Math.sin(lt * 60) * 6 * (1 - p); cover(A.kofi, { z: lerp(1.6, 1.05, eo5(p * 2)), cy: .3, dx: sh, dy: sh * .5 }); speedLines(lt, { a: .45 * (1 - eo(p * 2)), n: 70 }); FX.zb = .25 * (1 - eo(p * 3)); card('STREET', 'KOFI RHEE · RUNWAY REBEL', lt, '#ff7a3d'); } },
      { s: 5.9, e: 7.4, d: (lt, p) => { const sh = (hash(Math.floor(lt * 25)) - .5) * 10; cover(A.ansel, { z: 1.1 + p * .1, dx: sh, dy: sh }); fill('#06121e', .25); rain(lt, { n: 300, ang: .5, a: .5, sp: 2200 }); motes(lt, { n: 90, c: '220,240,255', vx: 300, vy: -40, size: 2, a: .5 }); const fl = bump(lt, .55, .07) + bump(lt, .7, .05); fill('#dfe9ff', fl * .5); lightning(t, 4, W * .78, 0, H * .6, fl * 2); card('SEA STORM', 'OLD ANSEL · THE LAST SHIP', lt, '#9cc8ff'); } },
      { s: 7.4, e: 9.0, d: (lt, p) => { cover(A['space-girl'], { z: 1.0 + p * .12, cy: .32 }); warp(lt, { n: 320, sp: 1.5 + p, a: .7, cx: W * .5, cy: H * .5 }); tint('#3060ff', .2); FX.zb = p * .08; card('SCI-FI', 'HYPERDRIVE · ANAMORPHIC', lt, '#8fb0ff'); } },
      { s: 9.0, e: 10.5, d: (lt, p) => { cover(A.city, { z: 1.0 + p * .08, cy: .38 }); flare(W * .3, H * .3, 130, .5); motes(lt, { n: 120, vy: -100, vx: 50 }); card('EPIC', 'MIRA HALE · GOLDEN HOUR', lt, C.gold); } },
      { s: 10.5, e: 11.8, d: (lt) => { // strobe montage
        const pool = [A.elara, A.yuki, A.kofi, A.ansel, A['space-girl'], A.city, A.market, A.space, A.cliff, A.close];
        const i = Math.floor(lt * 9); cover(pool[i % pool.length], { z: 1.15 + (lt * 9 % 1) * .1 }); FX.flash = [1, 1, 1, Math.max(0, .5 - (lt * 9 % 1) * 2)]; FX.ca = .012; FX.glitch = .2; } },
      { s: 11.8, e: 13.6, d: (lt) => { // your hero: sketch -> face scan
        const y = eo(seg(lt, .3, 1.3)) * (H + 40) - 20;
        scanSwap(() => { fill('#ebe6dc'); cover(A.sketch, { z: 1.0, cy: .3 }); }, () => cover(A.face, { cy: .3 }), y);
        if (lt < 1.4) { scanBeam(y, 1); sparks(t, 0, W, y, 2); }
        text('YOUR HERO', W / 2, H - 70, { size: 76, al: 'center', a: seg(lt, 1.2, 1.5), ls: -3, sh: 24, shc: C.win, c: '#fff' }); } },
      { s: 13.6, e: 17, cut: 'hard', d: (lt, p) => {
        fill('#030507'); grid(.06 * seg(lt, 0, .5), 48);
        warp(lt, { n: 260, sp: .4, a: .45 });
        slam('ZERO TO HERO', W / 2, H * .42, seg(lt, .1, .55), { size: 132, c: '#fff' });
        const k = seg(lt, .6, 1.0);
        text('$10,000', W / 2 - 18, H * .62, { size: 64, al: 'right', c: C.win, a: k, ls: -2, sh: 20, shc: C.win });
        mono('PRIZE POOL · 100 WINNERS', W / 2 + 18, H * .62 - 8, { a: k, size: 15 });
        mono('HOLLYWOOD JURY · FREE TO START', W / 2 + 18, H * .62 + 16, { a: k, size: 15, c: 'rgba(255,255,255,.6)' });
        const k2 = seg(lt, 1.0, 1.4); const lw = 150, lh = lw * 98 / 600;
        ctx.save(); ctx.globalAlpha = k2; ctx.drawImage(A['neyra-logo'], W / 2 - lw - 30, H * .78 - lh / 2, lw, lh); ctx.restore();
        text('× Freelancer.com', W / 2 - 12, H * .78 + 8, { size: 24, w: 700, a: k2, ls: -.5 });
        FX.flash = [0, 0, 0, seg(lt, 3.0, 3.4)]; } },
    ];
    const r = shots(t, list); void r;
    if (t > 1.3 && t < 13.6) { hud(t, { label: 'ZERO TO HERO // GENRE REEL', a: .8 }); }
    FX.lb = t > 1.3 && t < 13.6 ? .055 : 0;
  }
};

// ============ IP ANATOMY (6 chapters x 3.2s, tabs seek here) ============
V.ip = {
  w: 960, h: 600, dur: 19.2,
  imgs: ['sketch-onset.jpg', 'face-close.jpg', 'face-onset.jpg', 'face-city.jpg', 'close.jpg', 'face.jpg', 'scene-filmset.jpg', 'space.jpg', 'elara.jpg', 'market.jpg'],
  draw(t) {
    FX = FX0(); FX.seed = t; FX.bloom = .45; FX.vig = .5;
    const ch = Math.min(5, Math.floor(t / 3.2)), lt = t - ch * 3.2;
    fill('#05070a'); grid(.06, 40);
    const chapter = (n, title) => { mono(`0${n + 1} / 06`, 34, 46, { c: C.cyan, size: 12 }); mono(title, 34, 66, { size: 12, c: 'rgba(255,255,255,.6)' }); };
    if (ch === 0) { // SKETCH
      const p = eo(seg(lt, 0, 2)); rect(300, 30, 360, 540, '#ece7dc', 1, 6);
      const tip = strokeReveal(A['sketch-onset'], p, 'ip0', { x: 300, y: 30, w: 360, h: 540, n: 300, seed: 9 });
      if (tip && p < 1) { glow(tip[0], tip[1], 30, 'rgba(143,224,242,.9)'); glow(tip[0], tip[1], 6, '#fff'); }
      chapter(0, 'HUMAN ORIGIN');
      mono('TIMESTAMP', 700, 200, { size: 11, c: 'rgba(255,255,255,.5)' }); mono('2026-10-07 ' + tc(t).slice(3), 700, 222, { size: 13 });
      mono('HASH', 700, 270, { size: 11, c: 'rgba(255,255,255,.5)' }); mono(hex(12, Math.floor(t * 20)), 700, 292, { size: 13 }); mono(hex(12, Math.floor(t * 20) + 9), 700, 312, { size: 13 });
      const st = seg(lt, 2.0, 2.25); if (st > 0) { ctx.save(); ctx.translate(560, 470); ctx.rotate(-.1); const k = lerp(1.8, 1, eo5(st)); ctx.scale(k, k); srect(-130, -34, 260, 68, C.win, 3, st, 8, 12); text('SIGNED TO YOU', 0, 2, { size: 30, c: C.win, al: 'center', bl: 'middle', a: st, ls: 1 }); ctx.restore(); FX.ca += (1 - st) * .02; }
    } else if (ch === 1) { // FACE — same in every shot
      chapter(1, 'IDENTITY LOCK');
      const ims = [A['face-close'], A['face-onset'], A['face-city']], cap = ['CLOSE-UP', 'ON SET', 'CITY'];
      for (let i = 0; i < 3; i++) {
        const k = eo5(seg(lt, i * .18, i * .18 + .5)); const x = 60 + i * 290, y = 90 + (1 - k) * 80;
        cover(ims[i], { x, y, w: 260, h: 420, a: k, z: 1.05 + lt * .02 });
        const bk = eo5(seg(lt, .8 + i * .15, 1.2 + i * .15));
        if (bk > 0) { const g = (1 - bk) * 60; brackets(x + 60 - g, y + 70 - g, 140 + g * 2, 170 + g * 2, { a: bk, l: 16 }); mono(cap[i], x + 10, y + 410, { a: k, size: 11 }); }
      }
      const m = seg(lt, 1.6, 2.0);
      if (m > 0) { line(260, 250, 350, 250, C.cyan, 1.5, m, 8); line(550, 250, 640, 250, C.cyan, 1.5, m, 8); rect(330, 535, 300, 40, 'rgba(111,227,165,.12)', m, 20); srect(330, 535, 300, 40, C.win, 1, m, 20); mono('MATCH  ' + (90 + m * 9.8).toFixed(1) + '%', 480, 561, { al: 'center', c: C.win, a: m, size: 14 }); }
    } else if (ch === 2) { // VOICE
      cover(A.close, { z: 1.1 + lt * .03, a: .55 }); fill('#04070b', .35); chapter(2, 'VOICE PRINT');
      for (let i = 0; i < 4; i++) { const r = ((lt * 120 + i * 90) % 360); ctx.save(); ctx.strokeStyle = `rgba(143,224,242,${(1 - r / 360) * .5})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W * .5, H * .5, r, 0, 7); ctx.stroke(); ctx.restore(); }
      wave(lt, 140, H * .5, W - 280, 220, { n: 72, amp: eo(seg(lt, 0, .6)) });
      text('“I paint so the city remembers me.”', W / 2, H - 70, { size: 26, w: 500, f: '"Inter Tight"', al: 'center', a: seg(lt, .8, 1.2), c: '#fff' });
      mono('MIRA HALE · VOICE ID ' + hex(6, 3), W / 2, H - 40, { al: 'center', c: C.cyan, a: seg(lt, .8, 1.2), size: 11 });
    } else if (ch === 3) { // MIND
      cover(A.face, { z: 1.1, a: .4, cx: .5 }); fill('#04070b', .3); chapter(3, 'CHARACTER MIND');
      const line1 = 'A girl who paints the city at night.';
      text(typed(line1, seg(lt, 0, .9)) + (lt < 1 && Math.floor(lt * 8) % 2 ? '|' : ''), W / 2, 130, { size: 32, w: 700, al: 'center' });
      const nodes = [['QUIET', 220, 260], ['STUBBORN', 740, 250], ['FEARLESS AT 3 A.M.', 250, 420], ['WANTS: ONE WALL THE CITY CAN’T PAINT OVER', 640, 480], ['FEAR: BEING FORGOTTEN', 720, 370]];
      const cx = W / 2, cy = 330; glow(cx, cy, 70, 'rgba(143,224,242,.5)', seg(lt, .9, 1.2)); rect(cx - 6, cy - 6, 12, 12, '#fff', seg(lt, .9, 1.1), 6);
      nodes.forEach(([s2, x, y], i) => { const k = eo5(seg(lt, 1.0 + i * .2, 1.4 + i * .2)); if (k <= 0) return; line(cx, cy, lerp(cx, x, k), lerp(cy, y, k), C.cyan, 1.2, .7, 6); const tw = s2.length * 8.6 + 26; rect(x - tw / 2, y - 16, tw, 32, 'rgba(10,20,26,.85)', k, 16); srect(x - tw / 2, y - 16, tw, 32, C.cyan, 1, k, 16); mono(s2, x, y + 5, { al: 'center', a: k, size: 11, ls: 1.5 }); });
    } else if (ch === 4) { // PASSPORT
      chapter(4, 'IP PASSPORT');
      const k = eo5(seg(lt, 0, .6)); ctx.save(); ctx.translate(W / 2, H / 2 + (1 - k) * 60); ctx.rotate((1 - k) * -.08);
      const cw = 560, chh = 340; rect(-cw / 2, -chh / 2, cw, chh, '#0d1318', k, 18); srect(-cw / 2, -chh / 2, cw, chh, 'rgba(143,224,242,.6)', 1.5, k, 18, 10);
      // holo shimmer
      ctx.save(); ctx.beginPath(); ctx.roundRect(-cw / 2, -chh / 2, cw, chh, 18); ctx.clip(); const sx = lerp(-cw, cw, (lt * .6) % 1);
      const g = ctx.createLinearGradient(sx - 80, 0, sx + 80, 0); g.addColorStop(0, 'rgba(143,224,242,0)'); g.addColorStop(.5, 'rgba(180,140,255,.18)'); g.addColorStop(1, 'rgba(111,227,165,0)'); ctx.fillStyle = g; ctx.fillRect(-cw / 2, -chh / 2, cw, chh); ctx.restore();
      mono('IP PASSPORT', -cw / 2 + 26, -chh / 2 + 38, { c: C.cyan, a: k });
      mono('NEYRA', cw / 2 - 26, -chh / 2 + 38, { al: 'right', a: k, c: 'rgba(255,255,255,.5)' });
      ctx.restore();
      cover(A['sketch-onset'], { x: W / 2 - 254, y: H / 2 - 100 + (1 - k) * 60, w: 120, h: 150, a: seg(lt, .3, .6), cy: .3 });
      const r1 = seg(lt, .4, .8); text('Mira Hale', W / 2 - 110, H / 2 - 60, { size: 44, a: r1, ls: -1.5 }); mono('NYR-0x7A3F', W / 2 - 108, H / 2 - 30, { c: C.cyan, a: r1 });
      [['AUTHOR', 'YOU'], ['ORIGIN', 'HUMAN SKETCH · TIMESTAMPED'], ['TIER', 'HUMAN-ORIGIN']].forEach(([a2, b2], i) => { const kk = seg(lt, .7 + i * .15, 1.0 + i * .15); line(W / 2 - 110, H / 2 + 2 + i * 30, W / 2 + 254, H / 2 + 2 + i * 30, 'rgba(255,255,255,.12)', 1, kk); mono(a2, W / 2 - 110, H / 2 + 22 + i * 30, { a: kk, size: 11, c: 'rgba(255,255,255,.5)' }); mono(b2, W / 2 + 254, H / 2 + 22 + i * 30, { a: kk, size: 11, al: 'right' }); });
      const r = rng(4); const qk = seg(lt, 1.0, 1.4); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if (r() < .5 || (i < 3 && j < 3)) rect(W / 2 - 254 + j * 6, H / 2 + 70 + i * 6, 5, 5, '#fff', qk);
      const st = seg(lt, 1.6, 1.85); if (st > 0) { ctx.save(); ctx.translate(W / 2 + 190, H / 2 + 120); ctx.rotate(-.14); const s2 = lerp(2.2, 1, eo5(st)); ctx.scale(s2, s2); srect(-100, -28, 200, 56, C.win, 3, st, 6, 14); text('VERIFIED', 0, 2, { size: 32, c: C.win, al: 'center', bl: 'middle', a: st, ls: 3 }); ctx.restore(); FX.ca += (1 - st) * .03; if (st < 1) FX.flash = [.4, 1, .7, (1 - st) * .2]; }
    } else { // EARN
      chapter(5, 'CAST · RENT · SELL');
      const tiles = [[A['scene-filmset'], 'CAST', 'Studios cast your Hero'], [A.space, 'RENT', 'Creators license it'], [A.elara, 'SELL', 'Transfer the IP']];
      tiles.forEach(([im, a2, b2], i) => { const k = eo5(seg(lt, i * .2, i * .2 + .5)); const x = 50 + i * 295, y = 110 + (1 - k) * 60; cover(im, { x, y, w: 270, h: 260, a: k, z: 1.1 + lt * .03 }); grad(0, y + 140, 0, y + 260, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.8)']], k, 'source-over', [x, y + 140, 270, 120]); text(a2, x + 16, y + 226, { size: 34, a: k, c: i === 2 ? C.win : '#fff', ls: -1 }); mono(b2.toUpperCase(), x + 18, y + 248, { a: k, size: 10, ls: 1.5 }); srect(x, y, 270, 260, i === 2 ? C.win : 'rgba(255,255,255,.15)', 1, k, 0); });
      const m = seg(lt, .8, 2.6); const v = Math.floor(eo(m) * 4820);
      text('+$' + v.toLocaleString('en-US'), W / 2, 450, { size: 64, al: 'center', c: C.win, a: seg(lt, .7, .9), ls: -2, sh: 20, shc: C.win });
      mono('YOU KEEP 80% OF EVERY LICENSE', W / 2, 490, { al: 'center', a: seg(lt, .9, 1.1), size: 12 });
      motes(lt, { n: 40, c: '111,227,165', vy: -80, vx: 0, y0: 380, y1: 560, size: 1.8, a: .7 });
    }
    // chapter transition glitch
    const edge = Math.min(lt, 3.2 - lt); if (edge < .12) { FX.glitch = (1 - edge / .12) * .7; FX.flash = [.56, .88, .95, Math.max(FX.flash[3], (1 - edge / .12) * .25)]; }
    brackets(14, 14, W - 28, H - 28, { a: .5, l: 18, c: 'rgba(255,255,255,.6)', lw: 1 });
  }
};

// ============ LIVING HERO CARDS (seamless loops) ============
const cardV = (img, w, h, fx, L = 6) => ({
  w, h, dur: L, imgs: [img + '.jpg'],
  draw(t) { FX = FX0(); FX.seed = t; FX.bloom = .45; loopy(tt => { const z = 1.08 + .05 * Math.sin(tt / L * 6.283); cover(A[img], { z, cx: .5 + .015 * Math.cos(tt / L * 6.283) }); fx(tt); }, t, L); }
});
V.c_elara = cardV('elara', 960, 832, tt => { fill('#000', .1); bokeh(tt, { n: 14, a: .22, rmax: 50 }); rain(tt, { n: 360, a: .5, sp: 1500, len: 40 }); fill('#ff3ca0', .05 * (Math.sin(tt * 17) > .7 ? 1 : 0)); });
V.c_kofi = cardV('kofi', 640, 560, tt => { glow(W * .8, H * .1, W * .6, 'rgba(255,170,90,.25)'); motes(tt, { n: 50, c: '255,220,170', vy: -20, vx: 12, size: 1.4, a: .6 }); const sx = ((tt / 6) * 2 % 1) * W * 2 - W * .5; grad(sx - 120, 0, sx + 120, H, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,240,220,.12)'], [1, 'rgba(255,255,255,0)']], 1, 'lighter'); });
V.c_yuki = cardV('yuki', 640, 560, tt => { bokeh(tt, { n: 16, cols: ['80,200,255', '255,80,220'], a: .22 }); rain(tt, { n: 160, a: .35, sp: 900, c: '180,160,255' }); FX.scan = .35; FX.glitch = bump(tt % 3, 1.5, .12) * .8; });
V.c_mira = cardV('mira-city', 640, 560, tt => { flare(W * .2, H * .25, 90, .4 + .08 * Math.sin(tt * 3)); motes(tt, { n: 60, vy: -60, vx: 25 }); });
V.c_ansel = cardV('ansel', 640, 560, tt => { fill('#06121e', .15); rain(tt, { n: 220, ang: .45, a: .45, sp: 1800 }); motes(tt, { n: 70, c: '220,240,255', vx: 160, vy: -20, size: 1.6, a: .45 }); const fl = bump(tt, 3.2, .07) + bump(tt, 3.35, .05); fill('#dfe9ff', fl * .45); lightning(0, 7, W * .8, 0, H * .5, fl * 2); });

// ============ PLAY: rendered scenes per location ============
const playV = (img, fx, L = 6) => ({
  w: 960, h: 600, dur: L, imgs: [img + '.jpg'],
  draw(t) { FX = FX0(); FX.seed = t; FX.bloom = .45; FX.lb = .05; loopy(tt => { fx(tt, tt / L); }, t, L, .8); }
});
V.p_market = playV('market', (t, p) => { cover(A.market, { z: 1.06 + p * .1, cx: .5 + .02 * p }); rain(t, { n: 260, a: .45 }); bokeh(t, { n: 12, a: .18 }); fill('#ff2a7a', Math.sin(t * 23) > .85 ? .04 : 0); });
V.p_space = playV('space', (t, p) => { cover(A.space, { z: 1.04 + p * .08 }); motes(t, { n: 90, c: '200,220,255', vy: 0, vx: -12, size: 1.1, a: .7, y1: H * .7 }); glow(W * .72, H * .35, 260, 'rgba(140,120,255,.18)'); });
V.p_cliff = playV('cliff', (t, p) => { cover(A.cliff, { z: 1.12, cy: .62 - p * .2 }); fog(t, { a: .14, y0: H * .45, sp: 40 }); motes(t, { n: 50, c: '230,240,255', vx: 120, vy: 10, size: 1.2, a: .5 }); });
V.p_roof = playV('roof', (t, p) => { cover(A.roof, { z: 1.12, cx: .45 + p * .1 }); flare(W * .3, H * .3, 90, .35); motes(t, { n: 70, vy: -60, vx: 30 }); });

// ============ PRIZE: Top Hero ============
V.prize = {
  w: 720, h: 1040, dur: 7, imgs: ['space-girl.jpg'],
  draw(t) {
    FX = FX0(); FX.seed = t; FX.bloom = .55;
    loopy(tt => {
      cover(A['space-girl'], { z: 1.06 + .04 * Math.sin(tt / 7 * 6.283), cy: .4 });
      const sx = ((tt / 3.5) % 1) * W * 2.4 - W * .7; grad(sx - 160, 0, sx + 160, H * .4, [[0, 'rgba(255,210,120,0)'], [.5, 'rgba(255,215,140,.22)'], [1, 'rgba(255,210,120,0)']], 1, 'lighter');
      motes(tt, { n: 90, c: '255,205,110', vy: -70, vx: 6, size: 2, a: .8 });
      glow(W / 2, H * .92, W * .7, 'rgba(232,196,106,.25)');
    }, t, 7, .8);
    // ring + laurel HUD
    const cx = W / 2, cy = 300; ctx.save(); ctx.strokeStyle = 'rgba(232,196,106,.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 10]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.arc(cx, cy, 210, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = 'rgba(232,196,106,.9)'; ctx.lineWidth = 2.5; ctx.shadowColor = C.gold; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(cx, cy, 230, -Math.PI / 2 + t * .9, -Math.PI / 2 + t * .9 + 1.1); ctx.stroke(); ctx.restore();
    brackets(22, 22, W - 44, H - 44, { c: 'rgba(232,196,106,.8)', lw: 1.5 });
    mono('ZERO TO HERO // FINAL', 40, 54, { c: C.gold }); mono('JURY SCORE', W - 40, 54, { al: 'right', c: C.gold });
    text((9 + (Math.sin(t * .9) * .5 + .5) * .8).toFixed(2), W - 40, 100, { size: 36, al: 'right', c: '#fff', ls: -1 });
  }
};

// ============ MAKE: look development (sketch -> look) ============
const lookV = img => ({
  w: 480, h: 432, dur: 4.5, imgs: ['sketch-onset.jpg', img + '.jpg'],
  draw(t) {
    FX = FX0(); FX.seed = t; FX.bloom = .45; FX.vig = .4;
    const y = eo(seg(t, .7, 1.9)) * (H + 40) - 20;
    scanSwap(() => { fill('#ebe6dc'); cover(A['sketch-onset'], { cy: .3, z: 1.02 }); }, () => cover(A[img], { z: 1.04 + t * .02 }), y);
    if (t > .7 && t < 2) { scanBeam(y, 1, '143,224,242', 2); sparks(t, 0, W, y, 5, .8); FX.glitch = .2; }
    brackets(14, 14, W - 28, H - 28, { a: .7, l: 16, lw: 1.2, c: t < 1.3 ? 'rgba(20,24,30,.6)' : 'rgba(255,255,255,.7)' });
    mono(t < 1.9 ? 'DEVELOPING ' + Math.floor(eo(seg(t, .1, 1.9)) * 100) + '%' : 'LOOK LOCKED ✓', 28, 40, { size: 11, c: t < 1.9 ? '#fff' : C.win, sh: 6, shc: 'rgba(0,0,0,.9)' });
  }
});
V.l_epic = lookV('mira-city'); V.l_noir = lookV('elara'); V.l_street = lookV('kofi'); V.l_couture = lookV('look-couture'); V.l_sea = lookV('ansel'); V.l_3d = lookV('look-3d');

// ============ ACADEMY previews ============
V.a1 = { w: 480, h: 300, dur: 5, imgs: ['sketch-onset.jpg'], draw(t) { FX = FX0(); FX.seed = t; fill('#ebe6dc'); const tip = strokeReveal(A['sketch-onset'], eo(seg(t, 0, 4.2)), 'a1', { n: 260, seed: 3, z: 1 }); if (tip && t < 4.2) { glow(tip[0], tip[1], 26, 'rgba(143,224,242,.9)'); } FX.flash = [0, 0, 0, seg(t, 4.6, 5)]; } };
V.a2 = { w: 480, h: 300, dur: 5, imgs: ['roof.jpg'], draw(t) { FX = FX0(); FX.seed = t; FX.bloom = .4; cover(A.roof, { z: 1.1 + t * .03 }); const p = seg(t, 1.6, 3.6); if (t < 3.8) { fill('#05070a', .6); rect(30, 200, 420, 60, 'rgba(15,17,20,.9)', 1, 12); srect(30, 200, 420, 60, 'rgba(143,224,242,.5)', 1, 1, 12); mono(typed('@Mira on a rooftop at sunset, orbit…', seg(t, .1, 1.5)), 46, 236, { size: 11, ls: .5 }); if (p > 0) { rect(30, 150, 420, 4, 'rgba(255,255,255,.1)', 1); rect(30, 150, 420 * p, 4, C.cyan, 1); mono('RENDERING ' + Math.floor(p * 100) + '%', 30, 138, { size: 11, c: C.cyan }); } } else { flare(150, 90, 70, .4); } FX.flash = [1, 1, 1, bump(t, 3.7, .12) * .7]; } };
V.a3 = { w: 480, h: 300, dur: 5, imgs: ['market.jpg'], draw(t) { FX = FX0(); FX.seed = t; FX.bloom = .4; cover(A.market, { z: 1.1 + t * .03 }); rain(t, { n: 120, a: .35 }); const st = seg(t, 1.2, 1.45); if (st > 0) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.1); const s2 = lerp(2, 1, eo5(st)); ctx.scale(s2, s2); rect(-120, -32, 240, 64, 'rgba(6,35,26,.7)', st, 8); srect(-120, -32, 240, 64, C.win, 3, st, 8, 12); text('SUBMITTED', 0, 2, { size: 34, c: C.win, al: 'center', bl: 'middle', a: st, ls: 2 }); ctx.restore(); motes(t, { n: 60, c: '111,227,165', vy: -90, size: 2, a: st * .8 }); } FX.flash = [0, 0, 0, seg(t, 4.6, 5)]; } };

// ============ ACADEMY hologram (point cloud) ============
let _pts;
V.holo = { w: 360, h: 1000, dur: 8, imgs: ['sketch-onset.jpg'], draw(t) {
  FX = FX0(); FX.seed = t; FX.bloom = .8; FX.vig = .2; FX.grain = .02;
  if (!_pts) { const im = A['sketch-onset'], c = document.createElement('canvas'), w = 160, h = 262; c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0, w, h); const d = x.getImageData(0, 0, w, h).data; _pts = []; const r = rng(2); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = d[(j * w + i) * 4]; if (v < 120 && r() < .5) _pts.push([i / w - .5, j / h, (r() - .5) * .25]); } }
  fill('#000'); const a = .7 * Math.sin(t / 8 * 6.283); const ca = Math.cos(a), sa = Math.sin(a);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, z] of _pts) { const X = x * ca - z * sa, Z = x * sa + z * ca; const px = W / 2 + X * 300, py = 120 + y * 760; const al = .35 + .3 * (Z + .5); ctx.fillStyle = `rgba(143,224,242,${al})`; ctx.fillRect(px, py, 1.6, 1.6); }
  ctx.restore();
  const sy = 120 + ((t / 2) % 1) * 760; scanBeam(sy, .6, '143,224,242', 1.5);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.strokeStyle = 'rgba(143,224,242,.35)'; ctx.beginPath(); ctx.ellipse(W / 2, 900 + i * 14, 120 - i * 20, 18 - i * 3, 0, 0, 7); ctx.stroke(); ctx.restore(); }
} };

window.V = V;

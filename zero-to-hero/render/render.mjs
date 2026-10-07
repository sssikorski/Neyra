// usage: node render.mjs name [--stills t1,t2] [--crf 24]
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
const [, , name, ...rest] = process.argv;
const arg = k => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : null; };
const FPS = 25;
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage();
p.on('console', m => console.log('[page]', m.text())); p.on('pageerror', e => { console.error('PAGEERR', e); process.exit(1); });
await p.goto('http://127.0.0.1:8765/engine.html');
const meta = await p.evaluate(n => window.init(n), name);
fs.mkdirSync('out', { recursive: true }); fs.mkdirSync('stills', { recursive: true });
const stills = arg('--stills');
if (stills) {
  for (const t of stills.split(',').map(Number)) {
    const d = await p.evaluate(([n, t]) => window.frame(n, t, .9), [name, t]);
    fs.writeFileSync(`stills/${name}_${t}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
  }
} else {
  const crf = arg('--crf') || '27';
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-tune', 'film', `out/${name}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(meta.dur * FPS); const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const d = await p.evaluate(([n, t]) => window.frame(n, t), [name, i / FPS]);
    if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(name, n, 'frames', ((Date.now() - t0) / 1000).toFixed(1) + 's', fs.statSync(`out/${name}.mp4`).size, 'bytes');
}
await b.close();

# Zero to Hero landing — hi-tech redesign

- `site/index.html` — the landing page (published as the "Zero to Hero (Copy)" artifact). Videos live next to it under `v/`, images under `img/`.
- `render/` — deterministic motion-graphics renderer used to make all 23 videos.
  - `engine.js` — Canvas2D scene + WebGL post pass (glitch, RGB split, bloom, grain, whip/zoom blur, letterbox) and effect library (rain, warp, sparks, lightning, HUD, title slams, scan reveals).
  - `videos.js` — the script for each video (hero, trailer, ip, c_*, p_*, prize, l_*, a1–a3, holo).
  - `render.mjs` — drives headless Chromium frame by frame and pipes JPEG frames to ffmpeg (H.264, 25 fps).

Render: serve the folder (with source plates in `p/`) on `http://127.0.0.1:8765`, then `node render.mjs <name>` (or `--stills 1.5,3` for test frames).

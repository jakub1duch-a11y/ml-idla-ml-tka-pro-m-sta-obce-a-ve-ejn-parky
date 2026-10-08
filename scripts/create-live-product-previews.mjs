import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ffmpegPath = 'ffmpeg';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'media');
const out = join(root, 'motion');
mkdirSync(out, { recursive: true });
const sources = {
  'mist-live': '9f0153e3a_ml_detailvparku_01.webm',
  'aura-live': 'feff82d99_Aura-mlzitko-video-01.webm',
};
function convert(args) {
  const result = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-filter_complex_threads', '1', ...args], { stdio: 'inherit' });
  if (result.status !== 0) { console.warn('[motion] Live preview generation skipped (ffmpeg unavailable).'); process.exit(0); }
  try {
    if (!statSync(args.at(-1)).size) { console.warn('[motion] Live preview generation skipped (ffmpeg produced empty output).'); process.exit(0); }
  } catch {
    console.warn('[motion] Live preview generation skipped (ffmpeg unavailable).'); process.exit(0);
  }
}
for (const [name, file] of Object.entries(sources)) {
  const source = join(root, 'optimized', file);
  convert(['-ss', '1', '-i', source, '-vf', 'scale=640:-2', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '85', join(out, `${name}-poster.webp`)]);
  convert(['-stream_loop', '-1', '-ss', '1', '-t', '6', '-i', source, '-an', '-vf', 'scale=480:-2,fps=20', '-c:v', 'libx264', '-preset', 'fast', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(out, `${name}.mp4`)]);
  convert(['-i', join(out, `${name}.mp4`), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-deadline', 'good', '-cpu-used', '4', join(out, `${name}.webm`)]);
  convert(['-i', join(out, `${name}.mp4`), '-filter_complex', 'fps=10,scale=360:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', join(out, `${name}.gif`)]);
}
console.log('[motion] Two six-second live previews created from existing product footage.');
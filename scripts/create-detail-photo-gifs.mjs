import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'media');
const out = join(root, 'motion');
mkdirSync(out, { recursive: true });
const nozzle = join(root, 'optimized', '7750acf57_mlzna-tryska-mlzidla.webp');
const scenes = {
  'steblo-gate': [1, 2, 3].map(index => ({ file: join(root, 'gates', `steblo-gate-${index}.webp`) })),
  'misting-details': [
    { file: nozzle, crop: 'crop=1024:683:0:160' },
    { file: nozzle, crop: 'crop=700:467:324:420' },
    { file: nozzle, crop: 'crop=800:534:224:360' },
  ],
  'public-spaces': [
    { file: join(root, 'optimized', '401d9b665_generated_image.webp') },
    { file: join(root, 'optimized', '1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp') },
    { file: join(root, 'gates', 'teepee.webp') },
  ],
};
function ffmpeg(args) {
  const result = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-filter_complex_threads', '1', ...args], { stdio: 'inherit' });
  if (result.status !== 0) { console.warn('[motion] Photo story generation skipped (ffmpeg unavailable).'); process.exit(0); }
  try {
    if (statSync(args.at(-1)).size === 0) { console.warn('[motion] Photo story generation skipped (ffmpeg produced empty output).'); process.exit(0); }
  } catch {
    console.warn('[motion] Photo story generation skipped (ffmpeg unavailable).'); process.exit(0);
  }
}
for (const [name, inputs] of Object.entries(scenes)) {
  for (const [size, width] of [['desktop', 640], ['mobile', 360]]) {
    const height = Math.round(width * 2 / 3);
    const frames = inputs.map((item, index) => {
      const file = join(out, `${name}-${size}-${index}.png`);
      ffmpeg(['-i', item.file, '-vf', [item.crop, `scale=${width}:${height}:force_original_aspect_ratio=increase`, `crop=${width}:${height}`, 'setsar=1'].filter(Boolean).join(','), '-frames:v', '1', file]);
      return file;
    });
    ffmpeg(['-i', frames[0], '-frames:v', '1', '-c:v', 'libwebp', '-q:v', '85', join(out, `${name}-${size}-poster.webp`)]);
    // 4.5 seconds on each photograph; 0.8-second crossfades, including back to the first view.
    const args = frames.concat(frames[0]).flatMap(file => ['-loop', '1', '-framerate', '8', '-t', '5.3', '-i', file]);
    const filter = '[0:v]format=yuv420p[a];[1:v]format=yuv420p[b];[2:v]format=yuv420p[c];[3:v]format=yuv420p[d];[a][b]xfade=transition=fade:duration=0.8:offset=4.5[x];[x][c]xfade=transition=fade:duration=0.8:offset=9[y];[y][d]xfade=transition=fade:duration=0.8:offset=13.5,trim=duration=14.3,split[p][q];[p]palettegen=max_colors=160:stats_mode=diff[pal];[q][pal]paletteuse=dither=bayer:bayer_scale=3';
    ffmpeg([...args, '-filter_complex', filter, '-loop', '0', join(out, `${name}-${size}.gif`)]);
    ffmpeg(['-ignore_loop', '1', '-i', join(out, `${name}-${size}.gif`), '-c:v', 'libwebp_anim', '-quality', '72', '-compression_level', '5', '-loop', '0', join(out, `${name}-${size}.webp`)]);
    frames.forEach(file => rmSync(file));
  }
}
console.log('[motion] Photo stories generated for desktop and mobile, with readable holds and seamless fade loops.');
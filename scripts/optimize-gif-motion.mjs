import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const mediaRoot = resolve(scriptDir, '..', 'dist', 'media');
const speed = '0.65';
const introFadeSeconds = '0.32';
const filter = `[0:v]setpts=${speed}*PTS,fade=t=in:st=0:d=${introFadeSeconds},split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a`;

function findGifs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findGifs(path);
    return extname(entry.name).toLowerCase() === '.gif' ? [path] : [];
  });
}

if (!ffmpegPath) throw new Error('ffmpeg-static není pro optimalizaci GIFů k dispozici.');

const gifs = findGifs(mediaRoot);
console.log(`Optimizing ${gifs.length} GIF files for motion playback.`);

for (const source of gifs) {
  const temporary = `${source}.tmp.gif`;
  rmSync(temporary, { force: true });
  const result = spawnSync(
    ffmpegPath,
    ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-filter_complex', filter, '-loop', '0', temporary],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) {
    rmSync(temporary, { force: true });
    throw new Error(`GIF optimization failed: ${source}`);
  }
  renameSync(temporary, source);
}

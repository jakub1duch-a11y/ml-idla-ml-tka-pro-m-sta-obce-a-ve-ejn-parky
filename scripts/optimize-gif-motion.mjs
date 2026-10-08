import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const mediaRoot = resolve(scriptDir, '..', 'dist', 'media');
const speed = '0.65';
const introFadeSeconds = '0.32';
const filter = `[0:v]setpts=${speed}*PTS,fade=t=in:st=0:d=${introFadeSeconds},split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a`;

function createStudioMotionAsset() {
  const uiDir = join(mediaRoot, 'ui');
  const output = join(uiDir, 'product-studio-motion.gif');
  mkdirSync(uiDir, { recursive: true });
  const motionFilter = [
    'drawgrid=w=96:h=96:t=1:c=0x62d6e8@0.12',
    "drawbox=x='mod(t*250,720)-240':y=0:w=220:h=540:color=0x6AE5F5@0.12:t=fill",
    "drawbox=x='mod(t*250+330,720)-200':y=0:w=85:h=540:color=white@0.08:t=fill",
    'fade=t=in:st=0:d=0.35',
    'fade=t=out:st=2.25:d=0.35',
    'split[a][b]',
    '[a]palettegen=stats_mode=diff[p]',
    '[b][p]paletteuse=dither=sierra2_4a',
  ].join(',');

  const result = spawnSync(
    ffmpegPath,
    ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0x07131D:s=720x540:r=20:d=2.6', '-vf', motionFilter, '-loop', '0', output],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) throw new Error('Produktový motion GIF se nepodařilo vytvořit.');
  return output;
}

function findGifs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findGifs(path);
    return extname(entry.name).toLowerCase() === '.gif' ? [path] : [];
  });
}

if (!ffmpegPath) throw new Error('ffmpeg-static není pro optimalizaci GIFů k dispozici.');

// Keep this generated asset in the production bundle so all shared product cards can use it.
const generatedStudioMotion = createStudioMotionAsset();
const gifs = findGifs(mediaRoot);
console.log(`Created ${generatedStudioMotion} and optimizing ${gifs.length} GIF files for motion playback.`);

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

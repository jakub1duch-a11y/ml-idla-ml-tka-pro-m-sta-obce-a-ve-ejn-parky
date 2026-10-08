import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'media');
if (!ffmpegPath) throw new Error('ffmpeg-static is unavailable.');
const ui = join(root, 'ui');
mkdirSync(ui, { recursive: true });
// Authoring holds and transparency in existing GIFs must survive the build unchanged.
const result = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0x07131D:s=480x360:r=6:d=10', '-filter_complex', "geq=r='7+8*exp(-pow((X-mod(N*16,720)+120)/100,2))':g='19+16*exp(-pow((X-mod(N*16,720)+120)/100,2))':b='29+20*exp(-pow((X-mod(N*16,720)+120)/100,2))',split[a][b];[a]palettegen[p];[b][p]paletteuse=dither=none", '-loop', '0', join(ui, 'product-studio-motion.gif')], { stdio: 'inherit' });
if (result.status !== 0) throw new Error('Studio motion generation failed.');
if (!existsSync(join(ui, 'product-studio-motion.gif'))) throw new Error('Studio motion asset is missing.');
console.log('[motion] Generated slow studio light; authored GIF timing and alpha are preserved.');

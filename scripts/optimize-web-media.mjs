import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const APP_ID = '6a3ee88c10959cd3588c4d68';
const MODE = process.argv[2] || 'images'; // images | videos | report
const BATCH = Math.max(1, Number(process.argv[3] || 4));
const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('public/media/optimized');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const TMP_DIR = await fs.mkdtemp(path.join(os.tmpdir(), 'mlzidla-media-'));
const MEDIA_RE = new RegExp(`https://media\\.base44\\.com/(images|videos)/public/${APP_ID}/[^'\\\"\\s)]+`, 'g');
const TEXT_EXTS = new Set(['.js','.jsx','.ts','.tsx','.css','.html','.json','.md']);
await fs.mkdir(OUT_DIR, { recursive: true });

async function walk(dir) {
  const out = [];
  for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...await walk(p));
    else if (TEXT_EXTS.has(path.extname(ent.name).toLowerCase())) out.push(p);
  }
  return out;
}
function safeBase(url) {
  const raw = decodeURIComponent(url.split('/').pop() || 'asset');
  const ext = path.extname(raw);
  return path.basename(raw, ext).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/-+/g, '-').slice(0, 120) || 'asset';
}
async function download(url, target) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(target, buf);
  return buf.length;
}
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore','ignore','pipe'] });
    let err = '';
    p.stderr.on('data', d => { err += d.toString(); if (err.length > 12000) err = err.slice(-12000); });
    p.on('error', reject);
    p.on('close', code => code === 0 ? resolve() : reject(new Error(err || `exit ${code}`)));
  });
}
async function loadManifest() {
  try { return JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8')); }
  catch { return { generatedAt: null, images: [], videos: [], skippedTransparent: [], skippedAlreadyOptimized: [], failed: [] }; }
}
const files = await walk(SRC_DIR);
const refs = new Set();
for (const file of files) {
  const txt = await fs.readFile(file, 'utf8');
  for (const m of txt.matchAll(MEDIA_RE)) refs.add(m[0]);
}
const images = [...refs].filter(u => u.includes('/images/'));
const videos = [...refs].filter(u => u.includes('/videos/'));
const map = new Map();
const manifest = await loadManifest();
manifest.generatedAt = new Date().toISOString();

async function processImage(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (ext === '.webp') return;
  const base = safeBase(url);
  const input = path.join(TMP_DIR, `${base}${ext || '.img'}`);
  const outputName = `${base}.webp`;
  const output = path.join(OUT_DIR, outputName);
  try {
    const before = await download(url, input);
    const meta = await sharp(input).metadata();
    if (meta.hasAlpha) {
      if (!manifest.skippedTransparent.some(x => x.url === url)) manifest.skippedTransparent.push({ url, width: meta.width, height: meta.height, format: meta.format });
      return;
    }
    await sharp(input).rotate().resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82, effort: 4, smartSubsample: true }).toFile(output);
    const stat = await fs.stat(output);
    map.set(url, `/media/optimized/${outputName}`);
    manifest.images = manifest.images.filter(x => x.url !== url);
    manifest.images.push({ url, output: `/media/optimized/${outputName}`, before, after: stat.size, width: meta.width, height: meta.height });
  } catch (e) { manifest.failed.push({ url, type: 'image', error: String(e.message || e).slice(0,600) }); }
}
async function processVideo(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (ext === '.webm') return;
  const base = safeBase(url);
  const input = path.join(TMP_DIR, `${base}${ext || '.video'}`);
  const outputName = `${base}.webm`;
  const output = path.join(OUT_DIR, outputName);
  try {
    const before = await download(url, input);
    await run(ffmpegPath, ['-y','-i',input,'-map_metadata','-1','-vf',"scale='min(1920,iw)':-2",'-c:v','libvpx-vp9','-crf','36','-b:v','0','-row-mt','1','-deadline','realtime','-cpu-used','6','-c:a','libopus','-b:a','96k',output]);
    const stat = await fs.stat(output);
    map.set(url, `/media/optimized/${outputName}`);
    manifest.videos = manifest.videos.filter(x => x.url !== url);
    manifest.videos.push({ url, output: `/media/optimized/${outputName}`, before, after: stat.size });
  } catch (e) { manifest.failed.push({ url, type: 'video', error: String(e.message || e).slice(0,600) }); }
}

if (MODE === 'images') {
  const todo = images.filter(u => path.extname(new URL(u).pathname).toLowerCase() !== '.webp');
  const q = [...todo];
  await Promise.all(Array.from({ length: Math.min(6, q.length || 1) }, async () => { while (q.length) await processImage(q.shift()); }));
} else if (MODE === 'videos') {
  const todo = videos.filter(u => path.extname(new URL(u).pathname).toLowerCase() !== '.webm').slice(0, BATCH);
  for (const url of todo) await processVideo(url);
}

let changedFiles = 0;
for (const file of files) {
  let txt = await fs.readFile(file, 'utf8');
  const original = txt;
  for (const [from, to] of map) txt = txt.split(from).join(to);
  if (txt !== original) { await fs.writeFile(file, txt); changedFiles++; }
}
manifest.changedFiles = (manifest.changedFiles || 0) + changedFiles;
manifest.rewrittenRefs = (manifest.rewrittenRefs || 0) + map.size;
await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

const remainingRefs = new Set();
for (const file of files) {
  const txt = await fs.readFile(file, 'utf8');
  for (const m of txt.matchAll(MEDIA_RE)) remainingRefs.add(m[0]);
}
const remainingImages = [...remainingRefs].filter(u => u.includes('/images/') && path.extname(new URL(u).pathname).toLowerCase() !== '.webp');
const remainingVideos = [...remainingRefs].filter(u => u.includes('/videos/') && path.extname(new URL(u).pathname).toLowerCase() !== '.webm');
console.log(JSON.stringify({ mode: MODE, convertedNow: map.size, changedFiles, totalConvertedImages: manifest.images.length, transparentKept: manifest.skippedTransparent.length, totalConvertedVideos: manifest.videos.length, failed: manifest.failed.length, remainingImages: remainingImages.length, remainingVideos: remainingVideos.length }, null, 2));

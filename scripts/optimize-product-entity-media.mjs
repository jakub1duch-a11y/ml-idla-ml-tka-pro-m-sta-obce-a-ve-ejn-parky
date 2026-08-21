import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const INPUT = path.resolve('scripts/product-media-input.json');
const OUT_DIR = path.resolve('public/media/optimized');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
const UPDATE_FILE = path.resolve('scripts/product-media-updates.json');
const TMP = await fs.mkdtemp(path.join(os.tmpdir(), 'mlzidla-product-media-'));
await fs.mkdir(OUT_DIR, { recursive: true });

const products = JSON.parse(await fs.readFile(INPUT, 'utf8'));
let manifest = { images: [], videos: [], skippedTransparent: [], failed: [] };
try { manifest = { ...manifest, ...JSON.parse(await fs.readFile(MANIFEST, 'utf8')) }; } catch {}

const mapped = new Map();
for (const x of manifest.images || []) if (x.url && x.output) mapped.set(x.url, x.output);
for (const x of manifest.videos || []) if (x.url && x.output) mapped.set(x.url, x.output);
const transparent = new Set((manifest.skippedTransparent || []).map(x => x.url));

const isVideo = (u) => /\/videos\//i.test(u) || /\.(mp4|mov|m4v|avi|webm)(\?|$)/i.test(u);
const isImage = (u) => !isVideo(u) && (/\.(png|jpe?g|webp|gif|tiff?)(\?|$)/i.test(u) || /google\.com\/thumbnail/i.test(u) || /base44\.app\/api\/apps\//i.test(u));
const shortHash = (u) => crypto.createHash('sha1').update(u).digest('hex').slice(0,10);
function basename(u) {
  let raw = 'asset';
  try { raw = decodeURIComponent(new URL(u).pathname.split('/').pop() || 'asset'); } catch {}
  raw = path.basename(raw, path.extname(raw)).replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,90) || 'asset';
  return `${shortHash(u)}-${raw}`;
}
async function download(url, file) {
  const r = await fetch(url, { redirect:'follow', headers:{'User-Agent':'Mozilla/5.0'} });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const b = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(file,b); return b.length;
}
function ffmpeg(args) {
  return new Promise((resolve,reject)=>{
    const p = spawn(ffmpegPath,args,{stdio:['ignore','ignore','pipe']});
    let e=''; p.stderr.on('data',d=>{e+=d.toString(); if(e.length>12000)e=e.slice(-12000)});
    p.on('error',reject); p.on('close',c=>c===0?resolve():reject(new Error(e||`exit ${c}`)));
  });
}
async function optimize(url) {
  if (!url || typeof url !== 'string') return url;
  if (mapped.has(url)) return mapped.get(url);
  if (transparent.has(url)) return url;
  if (url.startsWith('/media/optimized/')) return url;
  if (!isVideo(url) && !isImage(url)) return url;
  const base = basename(url);
  const temp = path.join(TMP, base + (isVideo(url)?'.input-video':'.input-image'));
  try {
    const before = await download(url,temp);
    if (isVideo(url)) {
      const outName = `db-${base}.webm`, out = path.join(OUT_DIR,outName);
      await ffmpeg(['-y','-i',temp,'-map_metadata','-1','-vf',"scale='min(1920,iw)':-2",'-c:v','libvpx-vp9','-crf','36','-b:v','0','-row-mt','1','-deadline','realtime','-cpu-used','6','-c:a','libopus','-b:a','96k',out]);
      const after=(await fs.stat(out)).size, output=`/media/optimized/${outName}`;
      mapped.set(url,output); manifest.videos=(manifest.videos||[]).filter(x=>x.url!==url); manifest.videos.push({url,output,before,after,source:'Product entity'}); return output;
    }
    const meta=await sharp(temp).metadata();
    if (meta.hasAlpha) {
      transparent.add(url); if (!(manifest.skippedTransparent||[]).some(x=>x.url===url)) manifest.skippedTransparent.push({url,width:meta.width,height:meta.height,format:meta.format,source:'Product entity'}); return url;
    }
    if ((meta.format||'').toLowerCase()==='webp') { mapped.set(url,url); return url; }
    const outName=`db-${base}.webp`, out=path.join(OUT_DIR,outName);
    await sharp(temp).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:82,effort:4,smartSubsample:true}).toFile(out);
    const after=(await fs.stat(out)).size, output=`/media/optimized/${outName}`;
    mapped.set(url,output); manifest.images=(manifest.images||[]).filter(x=>x.url!==url); manifest.images.push({url,output,before,after,width:meta.width,height:meta.height,source:'Product entity'}); return output;
  } catch(e) {
    manifest.failed=manifest.failed||[]; manifest.failed.push({url,type:isVideo(url)?'video':'image',source:'Product entity',error:String(e.message||e).slice(0,700)}); return url;
  }
}

const urls = new Set();
for (const p of products) {
  if (p.image_url) urls.add(p.image_url);
  if (p.video_url) urls.add(p.video_url);
  for (const u of p.gallery_urls || []) if (u) urls.add(u);
}
let done=0;
for (const u of urls) { await optimize(u); done++; if (done%10===0) console.log(`processed ${done}/${urls.size}`); }

const updates=[];
for (const p of products) {
  const next={};
  const ni=p.image_url?await optimize(p.image_url):p.image_url;
  const nv=p.video_url?await optimize(p.video_url):p.video_url;
  const ng=[]; for (const u of p.gallery_urls||[]) ng.push(await optimize(u));
  if (ni!==p.image_url) next.image_url=ni;
  if (nv!==p.video_url) next.video_url=nv;
  if (JSON.stringify(ng)!==JSON.stringify(p.gallery_urls||[])) next.gallery_urls=ng;
  if (Object.keys(next).length) updates.push({id:p.id,name:p.name,set:next});
}
manifest.generatedAt=new Date().toISOString();
await fs.writeFile(MANIFEST,JSON.stringify(manifest,null,2));
await fs.writeFile(UPDATE_FILE,JSON.stringify(updates,null,2));
console.log(JSON.stringify({products:products.length,uniqueUrls:urls.size,updates:updates.length,totalImages:(manifest.images||[]).length,totalVideos:(manifest.videos||[]).length,transparentKept:(manifest.skippedTransparent||[]).length,failed:(manifest.failed||[]).filter(x=>x.source==='Product entity').length},null,2));

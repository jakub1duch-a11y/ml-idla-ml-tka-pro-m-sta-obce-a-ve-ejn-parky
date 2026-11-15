import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const roots=['public/media/optimized','public/assets','public/media/responsive'];
const manifest={version:1,generatedAt:new Date().toISOString(),items:{},errors:[]};
async function walk(root){let out=[];for(const e of await fs.readdir(root,{withFileTypes:true}).catch(()=>[])){const p=path.join(root,e.name);if(e.isDirectory())out.push(...await walk(p));else if(/\.(webp|jpe?g|png)$/i.test(e.name))out.push(p);}return out;}
const files=(await Promise.all(roots.slice(0,2).map(walk))).flat();
const target='public/media/variants';await fs.mkdir(target,{recursive:true});
let done=0;
for(const file of files){
 const url='/'+file.replace(/^public\//,'');
 try{
  const meta=await sharp(file).metadata();
  if(!meta.width||!meta.height)continue;
  const hasAlpha=!!meta.hasAlpha;
  const stem=path.basename(file,path.extname(file)).replace(/[^a-zA-Z0-9_-]/g,'-');
  const key=(await import('node:crypto')).createHash('sha1').update(url).digest('hex').slice(0,10);
  const sizes=[480,960].filter(w=>w<meta.width);
  if(!sizes.length)continue;
  const entry={width:meta.width,height:meta.height,hasAlpha,variants:[]};
  for(const width of sizes){
   for(const format of ['avif','webp','jpeg']){
    const name=`${stem.slice(0,55)}-${key}-${width}.${format==='jpeg'?'jpg':format}`;
    const dest=path.join(target,name);
    const pipe=sharp(file).rotate().resize({width,withoutEnlargement:true});
    if(format==='avif')await pipe.avif({quality:52,effort:2}).toFile(dest);
    if(format==='webp')await pipe.webp({quality:78,effort:3}).toFile(dest);
    if(format==='jpeg')await pipe.flatten({background:'#ffffff'}).jpeg({quality:80,mozjpeg:true}).toFile(dest);
    entry.variants.push({width,format,url:'/media/variants/'+name});
   }
  }
  manifest.items[url]=entry;done++;
 }catch(e){manifest.errors.push({url,error:String(e.message).slice(0,140)});}
}
await fs.writeFile('src/lib/mediaVariantsManifest.json',JSON.stringify(manifest));
console.log(JSON.stringify({scanned:files.length,converted:done,variants:Object.values(manifest.items).reduce((n,v)=>n+v.variants.length,0),errors:manifest.errors.length}));

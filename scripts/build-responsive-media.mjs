import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const audit=JSON.parse(await fs.readFile('docs/audits/web-media-audit.json','utf8'));
const out={};
for(const item of audit.largestImages){
 if(!/\.(jpe?g|png|webp)$/i.test(item.file))continue;
 const input=item.file,base=path.basename(input,path.extname(input));
 const variants=[];
 for(const width of [480,960]){
  if(item.width<=width)continue;
  const dest=path.join('public/media/responsive',base+'-'+width+'.webp');
  await fs.mkdir(path.dirname(dest),{recursive:true});
  await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:78,effort:4}).toFile(dest);
  variants.push({width,url:'/'+dest.replace(/^public\//,'')});
 }
 if(variants.length)out['/'+input.replace(/^public\//,'')]={originalWidth:item.width,variants};
}
await fs.mkdir('src/lib',{recursive:true});
await fs.writeFile('src/lib/responsiveMediaManifest.json',JSON.stringify(out,null,2)+'\n');
console.log('Generated responsive variants for',Object.keys(out).length,'large local images');

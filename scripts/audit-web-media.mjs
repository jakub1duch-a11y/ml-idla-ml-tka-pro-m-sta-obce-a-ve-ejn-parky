import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const roots = ['src/pages', 'src/components', 'src/lib', 'public'];
const textExt = new Set(['.jsx','.js','.tsx','.ts','.html','.css','.md']);
const imageExt = new Set(['.jpg','.jpeg','.png','.webp','.avif','.gif']);
const files = [];
async function walk(root) { for (const ent of await fs.readdir(root,{withFileTypes:true}).catch(()=>[])) { const p=path.join(root,ent.name); if(ent.isDirectory()) await walk(p); else files.push(p); } }
for (const root of roots) await walk(root);
const sources=files.filter(f=>textExt.has(path.extname(f).toLowerCase()));
const images=files.filter(f=>imageExt.has(path.extname(f).toLowerCase()));
const findings=[];
const counts={sourceFiles:sources.length,imageFiles:images.length,jsxImages:0,missingAltCandidates:0,missingDimensionsCandidates:0,largeFiles:0,oversizedImages:0,animatedImages:0};
for (const file of sources) {
 const content=await fs.readFile(file,'utf8');
 const tags=[...content.matchAll(/<(?:motion\.)?img\b[\s\S]*?\/>/g)];
 counts.jsxImages+=tags.length;
 for(const match of tags) {
  const tag=match[0], line=content.slice(0,match.index).split('\n').length;
  if(!/\balt\s*=/.test(tag)){counts.missingAltCandidates++;findings.push({type:'missing_alt_candidate',file,line});}
  if(!/\b(width|height|aspectRatio)\s*=/.test(tag)&&!/aspect-|h-full|absolute/.test(tag)){counts.missingDimensionsCandidates++;findings.push({type:'layout_shift_candidate',file,line});}
 }
 if(file.includes('produkt/')&&/\bobject-cover\b/.test(content))findings.push({type:'review_product_cover',file});
}
const largest=[];
for (const file of images) {
 try {
  const stat=await fs.stat(file);const m=await sharp(file,{animated:false}).metadata();
  if(stat.size>750000){counts.largeFiles++;largest.push({file,bytes:stat.size,width:m.width,height:m.height});}
  if((m.width||0)>2400||(m.height||0)>2400){counts.oversizedImages++;findings.push({type:'oversized_dimensions',file,width:m.width,height:m.height});}
  if((m.pages||1)>1)counts.animatedImages++;
 }catch(e){findings.push({type:'metadata_error',file,error:String(e.message).slice(0,120)});}
}
largest.sort((a,b)=>b.bytes-a.bytes);
const report={generatedAt:new Date().toISOString(),scope:'Static source files and local public images; remote CMS/Drive media and runtime behavior not verified',counts,largestImages:largest.slice(0,30),findings:findings.slice(0,400)};
await fs.mkdir('docs/audits',{recursive:true});
await fs.writeFile('docs/audits/web-media-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts,top:largest.slice(0,5),findingCount:findings.length},null,2));

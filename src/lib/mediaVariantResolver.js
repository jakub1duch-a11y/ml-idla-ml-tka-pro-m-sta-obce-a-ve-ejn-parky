import manifest from './mediaVariantsManifest.json';
export function getMediaVariants(url){
 const item=manifest.items[url];
 if(!item)return null;
 const byFormat=(format)=>item.variants.filter(x=>x.format===format).map(x=>`${x.url} ${x.width}w`).join(', ')||undefined;
 return {avif:byFormat('avif'),webp:byFormat('webp'),jpeg:byFormat('jpeg'),width:item.width,height:item.height,hasAlpha:item.hasAlpha};
}

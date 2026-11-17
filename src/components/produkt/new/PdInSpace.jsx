import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Ruler } from 'lucide-react';
import { isProductMediaAllowed } from '@/lib/productMediaGuard';

// Produktově oddělené fotografie; žádná univerzální vizualizace pro všechny modely.
const CURATED_SCENES = Object.freeze({
  'mlzitko-bendy': '/media/optimized/eb80e8486_IMG_1789934399993.webp',
  'linea-mlzitko': '/media/optimized/6af16b6a9_linea-rezidencni-mlzeni.webp',
  'aura-mlzitko': '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
  'mlzitko-volavka': '/media/optimized/25f7cd749_volavka-rezidencnizahrady.webp',
  'teepee': '/media/optimized/06c42b5dc_Screenshot_20260920_171920.webp',
});
const MRAK_SCENES = Object.freeze({
  'mlzny-mrak-1413': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1f9721ea3_a_bright_realistic_high_detail_outdoor_commercia.png',
  'mlzny-mrak-1414': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ba3159d28_a_realistic_outdoor_product_styled_scene_in_a_sunn.png',
  'mlzny-mrak-2424': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/cba149a91_a_bright_outdoor_park_scene_with_greenery_in_the_b.png',
});

export default function PdInSpace({ product }) {
  const slug = String(product?.slug || '').toLowerCase();
  const gallery = (product?.gallery_urls || []).filter((url) => isProductMediaAllowed(product, url) && /\.(jpe?g|png|webp|avif)(\?|$)/i.test(url));
  const scene = MRAK_SCENES[slug] || CURATED_SCENES[slug] || gallery.find((url) => /vizualiz|realiz|prostred|prostřed|exterier|exteriér/i.test(url));
  if (!scene) return null;
  const dimensions = MRAK_SCENES[slug] ? [] : [product?.width && `Šířka: ${product.width}`, product?.height && `Výška: ${product.height}`].filter(Boolean);
  if (slug === 'mlzny-mrak-1414') {
    const fullImage = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a4389816d_file_0000000004e082108545726a647c5439.png';
    return (
      <section aria-labelledby="product-in-space-title" className="relative isolate w-full overflow-hidden bg-[#163E48]">
        <img src={fullImage} alt="Mlžítko MRAK 1414 v zelené zahradě s jemným mlžením" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[52%_center] md:object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#082C36]/90 via-[#082C36]/25 to-transparent md:bg-gradient-to-r md:from-[#082C36]/85 md:via-[#082C36]/30 md:to-transparent" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-6 pb-10 pt-28 sm:min-h-[720px] sm:px-10 md:min-h-[620px] md:justify-center md:py-20 lg:min-h-[760px] lg:px-14">
          <div className="max-w-xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-white/85">Mlžítko v prostoru</p>
            <h2 id="product-in-space-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">MRAK 1414 v zahradě i veřejném prostoru</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">Jemné vodní mlžení a nerezová plastika, která přirozeně doplní odpočinkovou zónu.</p>
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug || product.name)}`} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#0D4260] transition hover:bg-[#E6F4F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Poptat MRAK 1414 <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section aria-labelledby="product-in-space-title" className="bg-[#F3F8FA] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#087A9C]">Představa v reálném prostoru</p>
          <h2 id="product-in-space-title" className="mt-3 text-3xl font-semibold tracking-tight text-[#0D2F4F] sm:text-4xl">Jak vypadá {product.name} v prostoru</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#466477]">Vizualizace pomáhá představit si proporce mlžítka ve vztahu k lidem a okolnímu prostředí. Finální instalace se přizpůsobuje konkrétnímu místu.</p>
        </div>
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_18px_60px_rgba(13,47,79,.09)] lg:grid-cols-[1.65fr_1fr]">
          <figure className="relative min-h-[300px] bg-[#E6EFF2]">
            <img src={scene} alt={`${product.name} – prostorová vizualizace s lidmi`} loading="lazy" className="h-full w-full object-cover" />
          </figure>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <Ruler className="mb-5 text-[#087A9C]" size={29} aria-hidden="true" />
            <h3 className="text-xl font-semibold text-[#0D2F4F]">Představte si mlžítko u vás</h3>
            <p className="mt-3 text-sm leading-7 text-[#466477]">Nerezová konstrukce se může stát součástí náměstí, parku nebo odpočinkové zóny. Vhodnost umístění a připojení ověříme podle projektu.</p>
            {dimensions.length > 0 && <dl className="mt-6 space-y-2 border-t border-[#DFEBF0] pt-5">{dimensions.map((dimension) => <div key={dimension} className="text-sm font-medium text-[#0D2F4F]">{dimension}</div>)}</dl>}
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug || product.name)}`} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0B5EA8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#084A86] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087A9C]">Poptat toto mlžítko <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

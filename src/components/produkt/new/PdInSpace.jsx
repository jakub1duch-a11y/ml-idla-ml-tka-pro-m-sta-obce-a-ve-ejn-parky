import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

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
  // Only explicitly assigned product scenes; never infer a product from a filename.
  const scene = MRAK_SCENES[slug] || CURATED_SCENES[slug];
  if (!scene) return null;
  const fullImage = scene;
  const displayName = product?.name || 'Mlžítko';
  return (
    <section aria-labelledby="product-in-space-title" className="relative isolate w-full overflow-hidden bg-[#163E48]">
      <img src={fullImage} alt={`${displayName} v prostoru`} loading="lazy" className="absolute inset-0 h-full w-full object-contain object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#082C36]/90 via-[#082C36]/25 to-transparent md:bg-gradient-to-r md:from-[#082C36]/85 md:via-[#082C36]/30 md:to-transparent" />
      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-6 pb-10 pt-28 sm:min-h-[720px] sm:px-10 md:min-h-[620px] md:justify-center md:py-20 lg:min-h-[760px] lg:px-14">
        <div className="max-w-xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-white/85">Mlžítko v prostoru</p>
          <h2 id="product-in-space-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{displayName} v zahradě i veřejném prostoru</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">Jemné vodní mlžení a nerezová konstrukce pro příjemnější pobyt venku.</p>
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug || displayName)}`} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#0D4260] transition hover:bg-[#E6F4F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Poptat {displayName} <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
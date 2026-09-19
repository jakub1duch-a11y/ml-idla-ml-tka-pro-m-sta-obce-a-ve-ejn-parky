import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const HIGGSFIELD_PROMO = 'https://d8j0ntlcm91z4.cloudfront.net/user_3G2ZRSWvwxGD0OuqrTwOUdZhUBQ/hf_20260916_123317_5fa61fff-2065-4f84-874b-c94e4f37be15.mp4';

// Důležité: AI video používáme pouze jako atmosférický/motion asset.
// Produktové tvary se na webu nikdy nesmí nahrazovat generickou AI vizualizací.
const VERIFIED_SLUGS = ['mlzitko-bendy','bendy-field','ostrev-mlzitko','mlzitko-linea','mlzitko-aura-garden','mlzitko-y-armist','mlzny-mrak','mlezne-lizatko'];

export default function HiggsfieldCityPromo() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    base44.entities.Product.list('name', 200).then((items) => {
      const verified = (items || []).filter((p) => VERIFIED_SLUGS.includes(p.slug) && p.image_url).slice(0, 4);
      setProducts(verified);
    });
  }, []);

  return (
    <section aria-labelledby="higgsfield-city-promo" className="relative overflow-hidden bg-[#071a2a] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div className="text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">MLŽIDLA × AI vizualizace</p>
          <h2 id="higgsfield-city-promo" className="text-3xl font-semibold tracking-tight sm:text-4xl">Městské ochlazování jako prostor, ne jen produkt.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75">Video je použité jako atmosférická ukázka. Konkrétní produkty na webu zobrazujeme výhradně z ověřené produktové databáze MLŽIDLA.cz.</p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {products.map((p) => <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"><img src={p.image_url} alt={p.name} className="aspect-square w-full object-contain bg-white" loading="lazy" /><div className="px-3 py-2 text-xs font-semibold text-white">{p.name}</div></div>)}
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl shadow-cyan-950/30">
          <video className="block aspect-[9/16] w-full max-h-[720px] object-cover lg:aspect-video" src={HIGGSFIELD_PROMO} autoPlay muted loop playsInline preload="metadata" controls aria-label="MLŽIDLA – městské ochlazování, promo video vytvořené v Higgsfieldu" />
        </div>
      </div>
    </section>
  );
}

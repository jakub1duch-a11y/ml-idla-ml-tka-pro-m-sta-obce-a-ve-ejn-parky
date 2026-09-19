import React from 'react';

const HIGGSFIELD_PROMO = 'https://d8j0ntlcm91z4.cloudfront.net/user_3G2ZRSWvwxGD0OuqrTwOUdZhUBQ/hf_20260916_123317_5fa61fff-2065-4f84-874b-c94e4f37be15.mp4';

export default function HiggsfieldCityPromo() {
  return (
    <section aria-labelledby="higgsfield-city-promo" className="relative overflow-hidden bg-[#071a2a] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div className="text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">MLŽIDLA × AI vizualizace</p>
          <h2 id="higgsfield-city-promo" className="text-3xl font-semibold tracking-tight sm:text-4xl">Městské ochlazování jako prostor, ne jen produkt.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75">Krátká filmová ukázka vytvořená v Higgsfieldu představuje princip modulárního ochlazovacího místa pro města a obce.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-medium">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Modulární řešení</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Jemná vodní mlha</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Pro veřejný prostor</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl shadow-cyan-950/30">
          <video className="block aspect-[9/16] w-full max-h-[720px] object-cover lg:aspect-video" src={HIGGSFIELD_PROMO} autoPlay muted loop playsInline preload="metadata" controls aria-label="MLŽIDLA – městské ochlazování, promo video vytvořené v Higgsfieldu" />
        </div>
      </div>
    </section>
  );
}

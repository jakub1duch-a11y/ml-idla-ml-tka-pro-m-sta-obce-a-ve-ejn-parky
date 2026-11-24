import React from 'react';
import { Link } from 'react-router-dom';

const variants = [
  ['01', 'Single', 'Jedno kruhové mlžítko jako samostatný bod v prostoru.'],
  ['02', 'Duo', 'Dvojice prvků pro širší pobytovou nebo průchozí zónu.'],
  ['03', 'Play Zone', 'Více prvků rozmístěných podle projektu a charakteru místa.'],
];

export default function LizatkoEditorialSections({ product }) {
  const inquiry = `/poptavka?produkt=${encodeURIComponent(product.slug)}`;
  return (
    <div className="lizatko-editorial">
      <section aria-labelledby="lizatko-tvar" className="overflow-hidden bg-[#071D2B] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-cyan-200">LOLLI · MLŽIDLA</p>
            <h2 id="lizatko-tvar" className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Jednoduchý kruh. Hravý prostor.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">Kruhový nerezový prvek s jemným mlžením. Samostatně tvoří výrazný bod, ve skupině může vytvářet rytmus celého prostoru.</p>
            <Link to={inquiry} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-cyan-200 px-6 py-3 font-semibold text-[#071D2B] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Navrhnout umístění LÍZÁTKA</Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-[#143647] p-5 sm:p-8">
            {product.image_url ? <img src={product.image_url} alt={`Produktová fotografie ${product.name}`} loading="lazy" className="aspect-[4/5] w-full object-contain" /> : <div className="flex aspect-[4/5] items-center justify-center text-center text-slate-200">Produktová fotografie bude doplněna po ověření.</div>}
            <p className="mt-3 text-sm text-slate-200">Skutečná podoba produktu podle katalogového podkladu</p>
          </div>
        </div>
      </section>
      <section aria-labelledby="lizatko-varianty" className="bg-[#F3F7F7] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-[#0B6F7D]">Možnosti sestavy</p>
          <h2 id="lizatko-varianty" className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#071D2B] sm:text-4xl">Jedno LÍZÁTKO, dvojice nebo celá zóna.</h2>
          <p className="mt-5 max-w-3xl leading-8 text-slate-700">Rozmístění navrhneme podle prostoru, pohybu návštěvníků a připojení vody. Konkrétní počet a konfiguraci prvků potvrdíme při návrhu.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {variants.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-[#CFE2E5] bg-white p-7 shadow-sm"><span className="font-mono text-xs tracking-widest text-[#0B6F7D]">{number}</span><h3 className="mt-5 text-xl font-semibold text-[#071D2B]">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p></article>)}
          </div>
        </div>
      </section>
      <section aria-labelledby="lizatko-instalace" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div><p className="font-mono text-xs uppercase tracking-[.2em] text-[#0B6F7D]">Návrh a instalace</p><h2 id="lizatko-instalace" className="mt-4 text-3xl font-semibold tracking-tight text-[#071D2B] sm:text-4xl">Připravené pro konkrétní místo.</h2><p className="mt-5 leading-8 text-slate-700">Prověříme vhodné umístění, povrch, kotvení, napojení na vodu a provozní režim. Pro veřejné prostory posoudíme požadavky na odolnost a údržbu.</p><p className="mt-4 text-sm leading-6 text-slate-600">Mlžítko není herní prvek a nesplňuje ČSN EN 1176. Návrh instalace musí respektovat charakter prostoru a bezpečnost provozu.</p><Link to={inquiry} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#071D2B] px-6 py-3 font-semibold text-white hover:bg-[#16465A]">Poptat technické řešení</Link></div>
          <div className="rounded-3xl border border-[#CFE2E5] bg-[#F3F7F7] p-8 sm:p-10"><p className="font-mono text-xs uppercase tracking-[.2em] text-[#0B6F7D]">Před návrhem upřesníme</p><ul className="mt-6 space-y-5 text-lg text-[#071D2B]"><li>01 / Umístění a typ povrchu</li><li>02 / Počet prvků a jejich rozestupy</li><li>03 / Připojení vody a případnou filtraci</li><li>04 / Kotvení, řízení a údržbu</li></ul></div>
        </div>
      </section>
    </div>
  );
}

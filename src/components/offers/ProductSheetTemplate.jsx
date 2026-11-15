import React from 'react';
import { MLZ_BRAND } from '@/lib/mlz-brand-offer-templates';
import { OFFER_TEMPLATE_KINDS, checkOfferTemplateReadiness } from '@/lib/offer-template-system';

const money = n => typeof n === 'number' && Number.isFinite(n)
  ? new Intl.NumberFormat('cs-CZ', {maximumFractionDigits:0}).format(n) + ' Kč'
  : 'K nacenění';
const text = x => typeof x === 'string' && x.trim() ? x.trim() : 'K technickému ověření';

/** Original MLŽIDLA artwork and verifiable source data only; A4 review preview, not a sendable quote. */
export default function ProductSheetTemplate({
  kind = OFFER_TEMPLATE_KINDS.PRODUCT_NO_PRICE,
  product = {},
  clientName = '',
  siteName = '',
  projectSummary = '',
  catalogImageUrl = '',
  siteImageUrl = '',
  visualizationApproved = false,
  geometryRevision = '',
  priceExVat = null,
  vatRate = null,
  priceSource = '',
  priceRevision = '',
  priceConfirmed = false,
  inclusions = [],
  exclusions = [],
  nextStep = 'Pošlete nám fotografii místa a popis požadovaného provozu.',
}) {
  const priced = kind !== OFFER_TEMPLATE_KINDS.PRODUCT_NO_PRICE;
  const name = product?.name || product?.productName || '';
  const readiness = checkOfferTemplateReadiness({
    kind, productName:name, verifiedImageUrl:catalogImageUrl, geometryRevision,
    visualizationUrl:siteImageUrl, visualizationApproved, clientName,
    priceExVat, vatRate, priceSource, priceRevision, priceConfirmed,
  });
  const approvedPrice = priced && readiness.ready && priceConfirmed;
  const specs = [
    ['Varianta', product.variant || product.code],
    ['Rozměry', product.dimensions],
    ['Materiál', product.material],
    ['Počet trysek', product.nozzle_count != null ? String(product.nozzle_count) : ''],
    ['Přívod vody', product.water_connection],
    ['Kotvení', product.anchoring],
  ];
  return <article lang="cs" className="mx-auto max-w-[790px] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm print:rounded-none print:border-0 print:shadow-none">
    <div className="h-1.5 bg-gradient-to-r from-[#083849] via-[#007789] to-[#3cb9d4]"/>
    <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-8">
      <div>
        <img src={MLZ_BRAND.logoMaster} className="h-auto w-44 object-contain sm:w-52" alt="MLŽIDLA – oficiální logo"/>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#007789]">{kind === 'project_offer' ? 'Projektový návrh a cenová nabídka' : priced ? 'Produktový list s cenou' : 'Katalogový produktový list bez ceny'}</p>
      </div>
      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800">Pracovní náhled</span>
    </header>
    <div className="space-y-5 px-5 py-6 sm:px-8">
      <div><h2 className="text-3xl font-bold tracking-tight text-[#092d3a]">{name || 'Vybraný produkt'}</h2>
        {(clientName || siteName) && <p className="mt-2 text-xs text-slate-500">{[clientName,siteName].filter(Boolean).join(' · ')}</p>}
        {projectSummary && <p className="mt-3 text-sm leading-6 text-slate-700">{projectSummary}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-xl border border-slate-200 bg-[#f2f6f7]">
          {catalogImageUrl ? <img src={catalogImageUrl} alt={name+' – ověřený katalogový snímek'} className="aspect-[4/3] w-full object-contain"/> : <div className="flex aspect-[4/3] items-center justify-center p-5 text-center text-xs text-slate-400">Zde bude skutečná produktová fotografie</div>}
          <figcaption className="p-3 text-[10px] font-semibold text-[#075266]">Produkt · katalogová fotografie</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-xl border border-slate-200 bg-[#f2f6f7]">
          {siteImageUrl ? <img src={siteImageUrl} alt={name+' – vizualizace v prostoru'} className="aspect-[4/3] w-full object-cover"/> : <div className="flex aspect-[4/3] items-center justify-center p-5 text-center text-xs text-slate-400">Zde bude vizualizace v konkrétním prostředí</div>}
          <figcaption className="p-3 text-[10px] font-semibold text-[#075266]">{visualizationApproved ? 'Schválená vizualizace' : 'Koncepční vizualizace – ke schválení'}</figcaption>
        </figure>
      </div>
      <section><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#07465a]">Technické provedení</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{specs.map(([label,value])=><div key={label} className="border-b border-slate-200 pb-2"><p className="text-[10px] text-slate-500">{label}</p><p className="mt-1 text-xs font-semibold">{text(value)}</p></div>)}</div>
        <p className="mt-3 text-[10px] text-slate-500">Údaje platí pouze pro uvedenou ověřenou variantu. Kotvení, tlak, rozvod vody a údržba podle projektu. Mlžítko není herní prvek dle ČSN EN 1176.</p>
      </section>
      <div className="rounded-lg border border-cyan-100 bg-[#f0f9fa] p-3 text-xs text-slate-700">Volitelně: řízení SUPLA, čidla, filtrace a technologie úpravy vody. Rozsah a ceny vždy podle potvrzené konfigurace.</div>
      {priced && <section className="rounded-xl border border-[#add4dd] bg-[#eef7f9] p-4">
        <h3 className="text-sm font-bold text-[#07465a]">Cenová nabídka · rekapitulace</h3>
        {approvedPrice ? <>
          <div className="mt-3 flex justify-between text-sm"><span>Celkem bez DPH</span><strong>{money(priceExVat)}</strong></div>
          <div className="mt-2 flex justify-between text-sm"><span>DPH ({Math.round(vatRate * 100)} %)</span><span>{money(Math.round(priceExVat * vatRate))}</span></div>
          <div className="mt-3 flex justify-between border-t border-[#add4dd] pt-3 text-lg font-bold"><span>Celkem s DPH</span><span>{money(Math.round(priceExVat * (1 + vatRate)))}</span></div>
        </> : <p className="mt-3 text-xs font-semibold text-amber-900">Cena k ověření. Do zákaznického PDF nesmí být doplněna ilustrativní ani historická částka.</p>}
        <p className="mt-3 text-[10px] text-slate-500">Zdroj ceny: {priceSource || 'nepotvrzen'} · Revize: {priceRevision || 'nepotvrzena'}</p>
      </section>}
      {(inclusions.length>0 || exclusions.length>0) && <div className="grid gap-4 sm:grid-cols-2">{[['Součást nabídky',inclusions],['Není zahrnuto / upřesnit',exclusions]].map(([heading,items])=><section key={heading}><h3 className="text-xs font-bold text-[#075266]">{heading}</h3><ul className="mt-2 space-y-1 text-xs text-slate-600">{items.filter(Boolean).map((v,i)=><li key={i}>• {v}</li>)}</ul></section>)}</div>}
      <div className="border-t border-slate-200 pt-4"><h3 className="text-xs font-bold uppercase tracking-wider text-[#007789]">Další krok</h3><p className="mt-2 text-xs leading-5 text-slate-700">{nextStep}</p></div>
      {(readiness.blockers.length>0 || readiness.warnings.length>0) && <section className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 print:hidden"><strong>Interní kontrola před exportem</strong><ul className="mt-2 space-y-1">{[...readiness.blockers,...readiness.warnings].map((v,i)=><li key={i}>• {v}</li>)}</ul></section>}
    </div>
    <footer className="bg-[#083849] px-5 py-4 text-[11px] font-semibold text-white sm:px-8">MLŽIDLA.cz · by HolmTec · česká výroba v Trutnově</footer>
  </article>;
}

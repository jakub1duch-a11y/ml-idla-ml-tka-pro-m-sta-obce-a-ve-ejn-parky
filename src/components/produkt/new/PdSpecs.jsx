import React from 'react';
import { Droplets, Gauge, Layers3, PlugZap, Ruler, Scan, Waves } from 'lucide-react';
import PdSpecTable from '@/components/produkt/new/PdSpecTable';
import PdDocuments from '@/components/produkt/new/PdDocuments';

export default function PdSpecs({ product }) {
  const isGate = product.slug === 'mlzna-brana-gate';
  const variants = Array.isArray(product.variants) ? product.variants.filter((item) => item?.name) : [];
  const gateProfiles = [...new Set(variants.map((item) => item.profile).filter(Boolean))];
  const construction = isGate
    ? [
        gateProfiles.length && { label: 'Profily katalogových variant', value: gateProfiles.join(' · '), icon: Layers3 },
        { label: 'Rozměry a provedení', value: 'Liší se podle zvolené varianty GATE (viz výběr výše)', icon: Ruler },
      ].filter(Boolean)
    : [
        product.material && { label: 'Materiál', value: product.material, icon: Layers3 },
        product.coverage_area && { label: 'Plocha pokrytí / dosah', value: product.coverage_area, icon: Ruler },
      ].filter(Boolean);
  const operation = isGate
    ? [
        product.pressure && { label: 'Katalogový provozní tlak', value: product.pressure, icon: Gauge },
        { label: 'Mlžicí trysky', value: 'Počet dle vybrané katalogové varianty; upřesníme typ a průtok', icon: Droplets },
        { label: 'Ovládání', value: 'Vhodné řešení zvolíme dle požadavků na provoz; není automaticky součástí konstrukce', icon: PlugZap },
      ].filter(Boolean)
    : [
        product.pressure && { label: 'Provozní tlak', value: product.pressure, icon: Gauge },
        product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption, icon: Droplets },
        product.micron_size && { label: 'Velikost kapek', value: product.micron_size, icon: Waves },
        product.power_supply && { label: 'Napájení / řízení', value: product.power_supply, icon: PlugZap },
      ].filter(Boolean);
  return (
    <section className="bg-[#F6FBFD] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-primary">Technická specifikace</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-.035em] text-[#0A2342] sm:text-4xl">Parametry pro váš projekt</h2>
          <p className="mt-4 text-base text-muted-foreground">Konstrukce a provozní údaje produktu {product.name}. Rozměry a počty trysek jednotlivých provedení najdete ve variantách.</p>
        </div>
        {construction.length + operation.length > 0 ? (
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <PdSpecTable title="Konstrukce a provedení" rows={construction} icon={Ruler} />
            <PdSpecTable title="Voda, mlžení a napájení" rows={operation} icon={Gauge} />
          </div>
        ) : <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">Technické parametry připravujeme. Konkrétní hodnoty potvrdíme při návrhu řešení.</p>}
        {variants.length > 0 && !isGate && (
          <div id="varianty" className="mt-8 scroll-mt-36 overflow-hidden rounded-[1.75rem] border border-[#D8E8ED] bg-white shadow-[0_16px_48px_rgba(7,26,47,.055)]">
            <div className="flex items-center gap-3 border-b border-[#E6F0F3] p-5 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4F6FA] text-[#087E9D]"><Scan size={21} aria-hidden="true" /></span>
              <div><h3 className="font-heading text-xl font-bold text-[#0A2342]">Dostupná provedení</h3>
                <p className="mt-1 text-sm text-[#5A7080]">Pouze údaje z katalogu konkrétního produktu.</p></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-left text-sm">
                <thead className="bg-[#F2F8FB] text-xs uppercase tracking-wide text-[#486776]">
                  <tr><th scope="col" className="px-5 py-3 font-semibold sm:px-6">Varianta</th><th scope="col" className="px-5 py-3 font-semibold">Profil</th><th scope="col" className="px-5 py-3 font-semibold">Rozměry</th><th scope="col" className="px-5 py-3 font-semibold">Trysky</th></tr>
                </thead>
                <tbody className="divide-y divide-[#E9F0F3]">
                  {variants.map((variant, index) => (
                    <tr key={`${variant.name}-${index}`}>
                      <th scope="row" className="px-5 py-4 font-semibold text-[#0A2342] sm:px-6">{variant.name}</th>
                      <td className="px-5 py-4 text-[#426272]">{variant.profile || '—'}</td>
                      <td className="px-5 py-4 text-[#426272]">{variant.dimensions || '—'}</td>
                      <td className="px-5 py-4 text-[#426272]">{variant.nozzles || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <PdDocuments product={product} />
        <p className="mt-7 border-l-2 border-primary pl-4 text-sm text-muted-foreground">Kotvení, přívod vody, filtrace a případné řízení se upřesňují podle konkrétního místa a zvolené konfigurace. Chybějící údaje potvrdíme v technickém návrhu.</p>
      </div>
    </section>
  );
}
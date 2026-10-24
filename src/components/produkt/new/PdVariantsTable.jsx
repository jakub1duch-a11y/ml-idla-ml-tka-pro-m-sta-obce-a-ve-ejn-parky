import React from 'react';

const fmt = (n) => (typeof n === 'number' ? `${n.toLocaleString('cs-CZ')} Kč` : 'Na poptávku');

export default function PdVariantsTable({ variants }) {
  if (!variants?.length) return null;
  return (
    <section className="mt-8 overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white">
      <div className="border-b border-[#E7F0F4] px-5 py-5 sm:px-6">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#0B97E8]">Katalog produktových listů MLŽIDLA.cz 2026</p>
        <h3 className="mt-1 font-heading text-xl font-bold text-[#0A2342]">Varianty a rozměry</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[#F7FBFD] font-mono text-[10px] uppercase tracking-[.11em] text-[#0D2F4F]/50">
            <tr><th className="px-5 py-3">Varianta</th><th className="px-5 py-3">Profil</th><th className="px-5 py-3">V × Š (mm)</th><th className="px-5 py-3">Trysky</th><th className="px-5 py-3 text-right">Cena bez DPH</th></tr>
          </thead>
          <tbody className="divide-y divide-[#EDF3F6] font-semibold text-[#0D2F4F]">
            {variants.map((v) => (
              <tr key={v.name}><td className="px-5 py-3">{v.name}</td><td className="px-5 py-3">{v.profile || '–'}</td><td className="px-5 py-3">{v.dimensions || '–'}</td><td className="px-5 py-3">{v.nozzles || '–'}</td><td className="px-5 py-3 text-right">{fmt(v.price_ex_vat)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-[11px] text-[#0D2F4F]/55 sm:px-6">Provozní tlak 2–8 bar, mikrokapky 10–30 µm, nerez AISI 304 / 316L. Finální provedení potvrzuje výrobní výkres.</p>
    </section>
  );
}
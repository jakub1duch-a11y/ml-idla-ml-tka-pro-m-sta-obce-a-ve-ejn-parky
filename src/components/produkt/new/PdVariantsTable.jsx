import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Ruler, Droplets, Layers } from 'lucide-react';

const fmt = (n) => (typeof n === 'number' ? `${n.toLocaleString('cs-CZ')} Kč` : 'Na poptávku');

export default function PdVariantsTable({ variants }) {
  const [active, setActive] = useState(0);
  if (!variants?.length) return null;
  const sel = variants[active] || variants[0];
  return (
    <section className="mt-8 overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E7F0F4] px-5 py-5 sm:px-6">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#0B97E8]">Katalog produktových listů MLŽIDLA.cz 2026</p>
          <h3 className="mt-1 font-heading text-xl font-bold text-[#0A2342]">Varianty a rozměry</h3>
        </div>
        <span className="text-xs font-semibold text-[#0D2F4F]/55">{variants.length} {variants.length === 1 ? 'varianta' : variants.length < 5 ? 'varianty' : 'variant'}</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {variants.map((v, i) => {
          const on = i === active;
          return (
            <button key={v.name} type="button" onClick={() => setActive(i)} aria-pressed={on}
              className={`relative rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B97E8] ${on ? 'border-[#0B97E8] bg-[#F0F9FE] shadow-[0_12px_32px_rgba(11,151,232,.14)]' : 'border-[#E3EEF3] bg-white hover:border-[#B9DDF0]'}`}>
              {on && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B97E8] text-white"><Check size={14} /></span>}
              <strong className="block pr-8 font-heading text-base text-[#0A2342]">{v.name}</strong>
              <div className="mt-3 space-y-1.5 text-[13px] text-[#0D2F4F]/75">
                <p className="flex items-center gap-2"><Layers size={14} className="text-[#0B97E8]" />{v.profile || '–'}</p>
                <p className="flex items-center gap-2"><Ruler size={14} className="text-[#0B97E8]" />{v.dimensions ? `${v.dimensions} mm` : '–'}</p>
                <p className="flex items-center gap-2"><Droplets size={14} className="text-[#0B97E8]" />{v.nozzles || '–'}</p>
              </div>
              <p className="mt-4 border-t border-[#E7F0F4] pt-3 font-heading text-lg font-bold text-[#0A2342]">{fmt(v.price_ex_vat)}{typeof v.price_ex_vat === 'number' && <span className="ml-1 text-[11px] font-semibold text-[#0D2F4F]/50">bez DPH</span>}</p>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 border-t border-[#E7F0F4] bg-[#F7FBFD] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-[11px] text-[#0D2F4F]/60">Provozní tlak 2–8 bar, mikrokapky 10–30 µm, nerez AISI 304 / 316L. Finální provedení potvrzuje výrobní výkres.</p>
        <Link to={`/poptavka?varianta=${encodeURIComponent(sel.name)}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0A2342] px-5 text-sm font-bold text-white transition hover:bg-[#0B97E8]">
          Poptat {sel.name} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
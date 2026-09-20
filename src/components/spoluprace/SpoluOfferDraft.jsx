import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Clock3, Wrench, Coins, ShieldCheck } from 'lucide-react';

const ROWS = [
  { icon: FileText, label: '01 · Zadání a doporučení', value: 'Typ prvku, umístění, počet trysek, návaznost na přívod vody' },
  { icon: Wrench, label: '02 · Technické řešení', value: 'Nerez AISI 316L, provozní tlak 3–5 bar, kotvení, volitelné Smart řízení' },
  { icon: Coins, label: '03 · Cenová rekapitulace', value: 'Katalogová cena · partnerská sleva · instalace · doprava — každá položka zvlášť' },
  { icon: Clock3, label: '04 · Termíny', value: 'Výroba do 8 týdnů od schválení výkresu, instalace v dohodnutém okně' },
  { icon: ShieldCheck, label: '05 · Záruka a servis', value: '24 měsíců záruka, servisní režim a zazimování' },
];

export default function SpoluOfferDraft() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div data-reveal className="lg:sticky lg:top-28">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-700">Návrh nabídky</p>
            <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900 lg:text-4xl">Co partner dostane do 48 hodin</h2>
            <p className="mt-4 font-light leading-relaxed text-slate-500">
              Nabídku posíláme jako jeden přehledný dokument — bez dohadování, s rozpadem ceny po položkách a s technickými podklady jako přílohou.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#partnerska-poptavka" className="btn-metallic-mist px-6 py-3 text-sm font-bold">Vyžádat nabídku <ArrowRight size={14} /></a>
              <Link to="/ke-stazeni" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Technické podklady</Link>
            </div>
          </div>

          <div data-reveal className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Ukázka struktury nabídky</p>
              <p className="font-mono text-[10px] text-white/40">MLŽIDLA® / HolmTec</p>
            </div>
            <div className="divide-y divide-slate-100">
              {ROWS.map((r) => (
                <div key={r.label} className="flex items-start gap-4 px-5 py-4">
                  <r.icon size={16} className="mt-0.5 shrink-0 text-cyan-600" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{r.label}</p>
                    <p className="mt-1 text-sm font-light leading-relaxed text-slate-700">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="bg-slate-50 px-5 py-3 text-xs font-light text-slate-400">
              Přílohy: výkres, materiálový list AISI 316L, schéma zapojení, vizualizace do vašeho prostoru.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
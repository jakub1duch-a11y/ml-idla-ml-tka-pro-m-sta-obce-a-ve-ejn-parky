import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, CloudSun, Gauge, MapPinned, SlidersHorizontal, ThermometerSun } from 'lucide-react';

const PILLARS = [
  { icon: MapPinned, title: 'Místo', text: 'Navrhneme počet prvků, rozmístění a zóny podle reálného prostoru a pohybu lidí.' },
  { icon: ThermometerSun, title: 'Podmínky', text: 'Teplota, čas a provozní režim určují, kdy má systém skutečně smysl spustit.' },
  { icon: SlidersHorizontal, title: 'Řízení', text: 'Ventily, časování a automatizační scénáře omezují zbytečný provoz a zjednodušují správu.' },
  { icon: Activity, title: 'Data', text: 'Spotřebu a provozní chování lze sledovat a využít pro servis i další optimalizaci.' }
];

export default function SmartCoolingConcept() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-mono uppercase tracking-[.18em] text-slate-500">
              <CloudSun size={14} /> Smart Cooling
            </div>
            <h2 className="mt-5 max-w-2xl font-heading text-4xl leading-[1.03] tracking-[-.03em] text-slate-950 sm:text-5xl lg:text-6xl">
              Nejen mlžítko. Řízený ochlazovací bod pro veřejný prostor.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Smart Cooling spojuje designové mlžítko, hydrauliku, chytré řízení a provozní data do jednoho řešení. Cílem není nechat systém běžet déle, ale spouštět ho přesně tehdy a tam, kde přináší největší efekt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Navrhnout Smart Cooling <ArrowRight size={15} />
              </Link>
              <Link to="/mestske-mlzitka" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
                Vybrat městské mlžítko
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 font-heading text-2xl text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{text}</p>
              </article>
            ))}
            <article className="sm:col-span-2 rounded-2xl bg-slate-950 p-6 text-white lg:p-7">
              <div className="flex items-center gap-3">
                <Gauge size={20} className="text-white/60" />
                <p className="font-mono text-[11px] uppercase tracking-[.18em] text-white/50">Výstup projektu</p>
              </div>
              <p className="mt-4 max-w-3xl font-heading text-2xl leading-tight sm:text-3xl">Produkt + rozmístění + řízení + provozní scénář + servisní plán.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
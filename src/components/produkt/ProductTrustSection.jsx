import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Building2, FileCheck2, MapPinned, ShieldCheck, Wrench } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Building2,
    title: 'Český návrh a výroba',
    text: 'Výrobce HolmTec s.r.o., Trutnov. Produkt i technické řešení řešíme přímo s vlastním týmem.'
  },
  {
    icon: BadgeCheck,
    title: '20+ let zkušeností',
    text: 'Zázemí výrobní firmy HolmTec a zkušenosti s prvky pro veřejný i soukromý prostor.'
  },
  {
    icon: ShieldCheck,
    title: '24 měsíců záruka',
    text: 'Standardní záruční rámec doplňuje záruční a pozáruční servis podle konkrétní dodávky.'
  },
  {
    icon: FileCheck2,
    title: 'Technická dokumentace',
    text: 'K dispozici jsou instalační podklady, návody k údržbě a technické dokumenty podle typu produktu.'
  }
];

export default function ProductTrustSection({ product }) {
  return (
    <section className="border-y border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0b4860]/10 bg-white px-3 py-1.5 text-[#0b4860] shadow-sm">
              <BadgeCheck size={14} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.16em]">Ověřené zázemí projektu</span>
            </div>
            <h2 className="mt-4 font-heading text-2xl font-medium tracking-tight text-slate-950 sm:text-3xl">
              Produkt od výrobce, ne anonymní katalogová položka.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              U produktu {product?.name || 'MLŽIDLA®'} vidíte technické podklady, reference a jasný další krok. Parametry, cenu i rozsah instalace potvrzujeme pro konkrétní projekt.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/reference" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-slate-400">
              <MapPinned size={14} /> Realizace <ArrowRight size={13} />
            </Link>
            <Link to="/ke-stazeni" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-slate-400">
              <FileCheck2 size={14} /> Dokumentace <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.035)] sm:p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef8fb] text-[#0b4860]">
                <Icon size={17} strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-950">{title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-4 sm:flex-row sm:items-start sm:px-5">
          <Wrench size={17} className="mt-0.5 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Instalace je vždy uvedena samostatně.</p>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              Pokud instalace není v cenové nabídce výslovně uvedena, cena je bez instalace. Produkt dodáváme připravený pro montáž a spolu s dodávkou předáváme instalační, provozní a servisní instrukce podle konkrétního řešení.
            </p>
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-5 text-slate-400">
          HolmTec s.r.o. · Horní Staré Město 698, 541 02 Trutnov · IČ 27486893
        </p>
      </div>
    </section>
  );
}

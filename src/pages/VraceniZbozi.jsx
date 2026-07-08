import React from 'react';
import { ShieldCheck, PackageX, RotateCcw } from 'lucide-react';

export default function VraceniZbozi() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Informace pro zákazníky</p>
        <h1 className="font-heading text-4xl lg:text-5xl text-slate-900 tracking-tight mb-6">Zásady pro vracení zboží</h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-12 text-measure">
          Přečtěte si, za jakých podmínek přijímáme vratky a jak probíhá reklamace vadného mlžítka.
        </p>

        <section className="mb-10 p-7 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 mb-3">
            <PackageX size={20} className="text-slate-900" />
            <h2 className="font-heading text-xl text-slate-900">Přijímáme pouze vratky vadných produktů</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Vzhledem k tomu, že naše mlžítka jsou vyráběna zakázkově na míru konkrétnímu projektu, přijímáme vratky
            výhradně u produktů, které vykazují funkční vadu nebo vadu materiálu. Zboží bez vady k výměně ani vrácení
            nepřijímáme.
          </p>
        </section>

        <section className="mb-10 p-7 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2.5 mb-3">
            <RotateCcw size={20} className="text-slate-900" />
            <h2 className="font-heading text-xl text-slate-900">Předvolby pro výměny produktů</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Ne, neumožňujeme výměnu zboží. Pokud je produkt funkční a bez vady, výměnu za jiný model ani velikost
            bohužel nenabízíme.
          </p>
        </section>

        <section className="mb-10 p-7 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck size={20} className="text-slate-900" />
            <h2 className="font-heading text-xl text-slate-900">Vrácení nefunkčního či vadného mlžítka</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            Pokud vaše mlžítko po dodání nefunguje správně nebo vykazuje vadu, postupujte prosím následovně:
          </p>
          <ol className="space-y-3 text-slate-600 leading-relaxed list-decimal list-inside">
            <li>Kontaktujte nás e-mailem nebo telefonicky a popište zjištěnou vadu, ideálně s fotografií nebo videem.</li>
            <li>Náš servisní tým vadu posoudí a domluví s vámi další postup (oprava, náhradní díl nebo vrácení).</li>
            <li>V případě uznané reklamace zajistíme svoz vadného produktu na naše náklady.</li>
            <li>Po posouzení produktu v naší dílně vás informujeme o výsledku a případném vrácení platby nebo opravě.</li>
          </ol>
        </section>

        <section className="p-7 rounded-2xl border border-slate-200">
          <h2 className="font-heading text-xl text-slate-900 mb-3">Kontakt pro reklamace</h2>
          <div className="space-y-1 text-slate-600 font-mono text-sm">
            <p>Tel.: +420 774 700 390</p>
            <p>Email: meduna@holmtec.cz</p>
          </div>
        </section>
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calculator, Images, Package, Cpu, Building2 } from 'lucide-react';

const LINKS = [
  { icon: Package, label: 'Katalog 2026', desc: 'Všechna mlžítka, brány a mlhoviště s parametry.', to: '/mlzidla-mlzitka' },
  { icon: BookOpen, label: 'Ke stažení', desc: 'Výkresy, technické listy, materiálové certifikáty.', to: '/ke-stazeni' },
  { icon: Images, label: 'Reference', desc: '120+ realizací pro města, zahrady i eventy.', to: '/reference' },
  { icon: Calculator, label: 'Kalkulačka', desc: 'Orientační spotřeba vody a provozní náklady.', to: '/kalkulacka' },
  { icon: Cpu, label: 'Smart ovládání', desc: 'Automatizace, senzory a vzdálená správa provozu.', to: '/smart-ovladani' },
  { icon: Building2, label: 'Města a obce', desc: 'Podklady pro zastupitelstvo i veřejnou zakázku.', to: '/mlzitka-pro-mesta-obce' },
];

export default function SpoluResources() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl" data-reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-700">Podklady pro spolupráci</p>
          <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900 lg:text-4xl">Vše, co potřebujete k prvnímu návrhu</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((l) => (
            <div key={l.to} data-reveal>
              <Link to={l.to} className="group flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
                <l.icon size={18} className="mt-0.5 shrink-0 text-cyan-600" />
                <div>
                  <p className="font-heading text-base text-slate-900">{l.label}</p>
                  <p className="mt-1 text-sm font-light leading-relaxed text-slate-500">{l.desc}</p>
                </div>
                <ArrowRight size={14} className="ml-auto mt-1 shrink-0 text-slate-300 transition group-hover:text-cyan-600" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
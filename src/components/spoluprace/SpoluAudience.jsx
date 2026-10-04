import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Palette, Wrench, Flower2 } from 'lucide-react';

const GROUPS = [
  { icon: Palette, title: 'Architekti a projektanti', gain: 'Výkresy, 3D a BIM podklady, fotovizualizace do studie a konzultace k přívodu vody.', to: '/kategorie/architekti', label: 'Podklady pro architekty' },
  { icon: Building2, title: 'Města a obce', gain: 'Argumentace pro zastupitelstvo, provozní náklady, podklady pro veřejnou zakázku.', to: '/mlzitka-pro-mesta-obce', label: 'Řešení pro města' },
  { icon: Wrench, title: 'Realizační firmy', gain: 'Partnerská cenová hladina, zaškolení montáže, přednostní výrobní termíny.', to: '/servis-udrzba', label: 'Servis a montáž' },
  { icon: Flower2, title: 'Zahradní studia', gain: 'Designová mlžítka pro zahrady, terasy a pergoly bez čerpadla, na vodovodní řad.', to: '/zahradni-mlzitka', label: 'Zahradní kolekce' },
];

export default function SpoluAudience() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl" data-reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-700">Pro koho</p>
          <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900 lg:text-4xl">S kým spolupracujeme</h2>
          <p className="mt-4 font-light leading-relaxed text-slate-500">Každá role potřebuje jiné podklady. Vyberte tu svou a uvidíte, co od nás dostanete.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.title} data-reveal className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <g.icon size={20} className="text-cyan-600" />
              </div>
              <h3 className="font-heading text-xl text-slate-900">{g.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-slate-500">{g.gain}</p>
              <Link to={g.to} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
                {g.label} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
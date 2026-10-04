import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Landmark, School, Route, Home, CheckCircle2 } from 'lucide-react';
import { MUNICIPAL_CATEGORIES } from '@/lib/municipalProductPhotosInline';

const ICONS = {
  'mesta-obce': Building2,
  namesti: Landmark,
  promenady: Route,
  parky: Trees,
  'hriste-skoly': School,
  rezidence: Home,
};

export default function MunicipalUseCasesSection() {
  return (
    <section className="relative overflow-hidden bg-[#F6FAFC] py-16 lg:py-24" aria-labelledby="municipal-use-cases-title">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#22D3EE]/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#8AEAF5]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="mb-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.22em] text-[#0B8EC5]">// Kategorie pro města a obce</p>
            <h2 id="municipal-use-cases-title" className="mt-3 max-w-3xl font-heading text-3xl font-black leading-[1.02] tracking-[-.055em] text-[#07131D] sm:text-5xl lg:text-6xl">
              Každý prostor potřebuje jiný rytmus mlhy.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#516574] lg:justify-self-end">
            Pro samosprávy rozdělujeme návrh podle provozu místa: kde se lidé potkávají, kde čekají, kudy procházejí a kde v horkých dnech chybí stín. Díky tomu je návrh čitelný pro starostu, technické služby i projektanta.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MUNICIPAL_CATEGORIES.map((item) => {
            const Icon = ICONS[item.id] || Building2;
            return (
              <Link key={item.id} to={item.href} className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[#DCE9EF] bg-white shadow-[0_22px_70px_rgba(7,19,29,.09)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(7,19,29,.15)]">
                <div className="relative h-56 overflow-hidden bg-[#07131D]">
                  <img src={item.image} alt={`${item.title} — vhodné využití mlžítek MLŽIDLA.CZ`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.055]" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/76 via-[#07131D]/16 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-black/30 text-[#26C6E9] backdrop-blur-md">
                    <Icon size={23} strokeWidth={1.6} />
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0B8EC5]">{item.subtitle}</p>
                  <h3 className="mt-2 font-heading text-2xl font-black tracking-[-.045em] text-[#07131D]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#516574]">{item.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.recommended.map((product) => (
                      <span key={product} className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE9EF] bg-[#F7FBFD] px-3 py-1.5 text-[11px] font-bold text-[#0D2F4F]/72">
                        <CheckCircle2 size={12} className="text-[#0B8EC5]" /> {product}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#07131D]">
                    Navrhnout řešení <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

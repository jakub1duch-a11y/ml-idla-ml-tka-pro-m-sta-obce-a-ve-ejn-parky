import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Factory, FileCheck2, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: Camera,
    title: '1. Pošlete prostor a podklady',
    desc: 'Fotografie místa, situační výkres, PDF, DWG/DXF, skica nebo jen popis. Čím konkrétnější podklady máme, tím přesnější návrh připravíme.',
  },
  {
    icon: Sparkles,
    title: '2. Ověříme vhodné řešení',
    desc: 'Posoudíme měřítko prostoru, provoz, dostupnost vody, požadovaný efekt mlhy a doporučíme vhodnou kolekci nebo atypické řešení.',
  },
  {
    icon: FileCheck2,
    title: '3. Připravíme vizualizaci a nabídku',
    desc: 'Dostanete srozumitelný návrh s produktem, rozmístěním, řízením a cenovým rámcem. U veřejného prostoru umíme připravit podklady pro rozhodování.',
  },
  {
    icon: Factory,
    title: '4. Výroba, instalace, servis',
    desc: 'Po schválení vyrábíme nerezové prvky, řešíme instalaci, zprovoznění i dlouhodobý servis podle charakteru projektu.',
  },
];

export default function HowItWorksSteps() {
  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-3xl">
          <p className="font-mono tracking-[.2em] uppercase text-[#0b7280] mb-3 text-[11px] font-semibold">Jak probíhá návrh</p>
          <h2 className="font-heading font-semibold tracking-[-.04em] text-slate-950 text-[clamp(2rem,5vw,4rem)] leading-[.98]">
            Od první fotografie k řešení, které dává technický i provozní smysl.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Nezačínáme katalogem. Začínáme tím, jak se místo používá a co od mlhy očekáváte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="group relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-[#eefbfc] hover:shadow-xl hover:shadow-cyan-950/5"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-100 opacity-0 blur-2xl transition group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#0b7280] shadow-sm">
                    <Icon size={23} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold leading-tight text-slate-950">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight size={18} className="absolute right-5 top-6 hidden text-slate-300 lg:block" />
                )}
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#062f35] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b4860]">
            Poslat podklady k projektu <ArrowRight size={16} />
          </Link>
          <Link to="/ai-vizualizace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50">
            <Sparkles size={16} /> Připravit AI vizualizaci
          </Link>
        </div>
      </div>
    </section>
  );
}

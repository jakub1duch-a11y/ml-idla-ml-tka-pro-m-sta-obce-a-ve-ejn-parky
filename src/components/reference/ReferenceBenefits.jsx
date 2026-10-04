import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplets, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

const DEFAULTS = {
  mestsky: ['Příjemnější pobyt v horkých dnech', 'Odolné nerezové řešení pro veřejný provoz', 'Čisté začlenění do architektury místa'],
  soukromy: ['Diskrétní ochlazení zahrady nebo terasy', 'Prémiový nerezový prvek s minimální vizuální zátěží', 'Jednoduchý provoz a servis'],
  event: ['Rychlé osvěžení návštěvníků', 'Výrazný zážitkový prvek', 'Flexibilní použití v prostoru akce'],
  prumyslovy: ['Lokální zlepšení tepelného komfortu', 'Robustní provozní řešení', 'Servisovatelná nerezová konstrukce'],
};

const ICONS = [Droplets, ShieldCheck, Sparkles, Wrench];

export function getReferenceBenefits(project) {
  const custom = Array.isArray(project?.benefits) ? project.benefits.filter(Boolean).slice(0, 4) : [];
  return custom.length ? custom : (DEFAULTS[project?.category] || DEFAULTS.mestsky);
}

export default function ReferenceBenefits({ project, compact = false }) {
  const reduceMotion = useReducedMotion();
  const benefits = getReferenceBenefits(project);

  if (compact) {
    return (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {benefits.slice(0, 2).map((benefit, index) => (
          <motion.span
            key={benefit}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .22, delay: index * .04 }}
            className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1.5 text-[10px] font-semibold leading-tight text-white/85 backdrop-blur-md"
          >
            {benefit}
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-teal-700">Přínos realizace</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl">Co tato realizace přinesla místu a jeho uživatelům.</h2>
            {project?.design_note && <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{project.design_note}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = ICONS[index % ICONS.length];
              return (
                <motion.article
                  key={benefit}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: .25 }}
                  transition={{ duration: .3, delay: index * .045, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf7fb] text-[#0b6c8e]"><Icon size={17}/></span>
                  <p className="mt-5 text-base font-semibold leading-6 text-slate-900">{benefit}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

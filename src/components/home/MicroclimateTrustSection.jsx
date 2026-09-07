import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Droplets, FileText, Leaf, Ruler, ShieldCheck, ThermometerSun } from 'lucide-react';
import { Link } from 'react-router-dom';

const TRUST_ITEMS = [
  { icon: ThermometerSun, title: 'Ochlazení podle podmínek místa', text: 'Účinek vždy závisí na teplotě, vlhkosti, větru a stínění. Proto řešení navrhujeme pro konkrétní prostor, ne jako univerzální set.' },
  { icon: Droplets, title: 'Jemná mlha bez pocitu mokra', text: 'Cílem je lokální mikroklima a příjemný pobyt, ne vodní atrakce. Důležitá je velikost kapek, rozmístění trysek a řízení cyklů.' },
  { icon: ShieldCheck, title: 'Nerez pro veřejný provoz', text: 'Produkty stavíme jako exteriérové objekty: odolné, čisté vizuálně a připravené pro běžné zatížení městského prostoru.' },
  { icon: Ruler, title: 'Vizualizace před výrobou', text: 'Fotografie, výkresy a skici pomohou ověřit měřítko, tvar mřížky, počet prvků i nejlepší umístění v prostoru.' },
];

const PROCESS = [
  'Pošlete fotografie prostoru nebo situační výkres.',
  'Navrhneme produkt, rozmístění a způsob řízení.',
  'Připravíme orientační cenový rámec a vizualizaci.',
];

export default function MicroclimateTrustSection() {
  return (
    <section className="relative overflow-hidden bg-[#eef7f6] py-16 sm:py-20 lg:py-24">
      <div className="absolute left-[-18rem] top-[-18rem] h-[36rem] w-[36rem] rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="absolute bottom-[-20rem] right-[-16rem] h-[38rem] w-[38rem] rounded-full bg-teal-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.86fr_1.14fr] lg:gap-16 lg:items-start">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5 }}>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[.22em] text-[#0b7280]">Proč MLŽIDLA.CZ</p>
            <h2 className="mt-4 max-w-2xl font-heading text-[clamp(2.2rem,5vw,4.6rem)] font-semibold leading-[.95] tracking-[-.055em] text-slate-950">
              Mikroklima navrhujeme podle prostoru. Ne podle katalogové zkratky.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
              Dobré mlžení není jen tryska a voda. Rozhoduje měřítko místa, pohyb lidí, vítr, povrch, dostupnost vody, servis a způsob ovládání. Proto už v poptávce sbíráme podklady, ze kterých jde připravit smysluplný návrh.
            </p>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#062f35] text-cyan-200">
                  <FileText size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950">Co pomůže pro rychlý návrh</p>
                  <p className="text-xs text-slate-500">Fotka z mobilu často stačí jako první krok.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {PROCESS.map((item, index) => (
                  <div key={item} className="flex gap-3 text-sm text-slate-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-[#0b7280]">{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/poptavka" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b4860] transition hover:gap-3">
                Poslat podklady k posouzení <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TRUST_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * .07, duration: .45 }}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefbfc] text-[#0b7280] transition group-hover:scale-105">
                      <Icon size={21} />
                    </div>
                    <CheckCircle2 size={17} className="text-cyan-600/60" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold leading-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </motion.article>
              );
            })}

            <motion.article
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: .18, duration: .45 }}
              className="relative overflow-hidden rounded-[1.75rem] bg-[#071719] p-6 text-white sm:col-span-2"
            >
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-200/70">Použití</p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Města, školy, parky, areály i zahrady.</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/62">Každý typ prostoru má jiný provoz, jiné riziko vandalismu, jinou návštěvnost a jinou potřebu ovládání. Návrh tomu musí odpovídat.</p>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/12 bg-white/8 text-cyan-200">
                  <Building2 size={26} />
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}

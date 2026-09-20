import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Wind, Droplets, Gauge, ShieldCheck } from 'lucide-react';

const benefits = [
  { icon: Wind, text: 'Snižuje pocitovou teplotu o 5–10 °C' },
  { icon: Droplets, text: 'Váže prach a pyl pro čistší vzduch' },
  { icon: Gauge, text: 'Úsporný provoz a chytré řízení' },
  { icon: ShieldCheck, text: 'Odolná nerezová konstrukce' },
];

const tiles = [
  {
    title: 'LINEA',
    text: 'Minimalistické sloupové mlžítko',
    image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp',
    link: '/produkt/linea-mlzitko',
  },
  {
    title: 'KVĚT',
    text: 'Hravé osvěžení pro děti a hřiště',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    link: '/kategorie/skoly-skolky-deti',
  },
  {
    title: 'MLŽNÁ BRÁNA',
    text: 'Průchozí vodní mlha pro náměstí',
    image: '/media/optimized/a2d77392e_Mlnbranyaportaly.webp',
    link: '/mlzne-brany',
  },
  {
    title: 'BENDY',
    text: 'Organická linie pro pobytové zóny',
    image: '/media/optimized/31478e4b3_bendymlzitko02.webp',
    link: '/produkt/brana-bendy',
  },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#07131D] text-white" aria-label="MLŽIDLA.CZ hero">
      <div className="relative min-h-[82svh] overflow-hidden">
        <motion.img
          src="/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp"
          alt="Mlžítka ve veřejném prostoru s jemnou vodní mlhou"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(38,198,233,.20),transparent_34%),linear-gradient(90deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.48)_42%,rgba(0,0,0,.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#07131D] to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[82svh] max-w-[1540px] items-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_420px] lg:px-12 xl:px-20">
          <motion.div className="max-w-3xl" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.22em] text-[#26C6E9]">MLŽENÍ, KTERÉ DÁVÁ SMYSL</p>
            <h1 className="mt-6 max-w-[10ch] font-heading text-[clamp(4rem,9vw,8.6rem)] font-black leading-[.86] tracking-[-.085em] text-white">
              Město se nadechne.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-white/82 sm:text-2xl">
              Chytrá nerezová mlžítka pro města, obce i soukromé prostory. Příjemnější klima, čistší vzduch a místa, kde se lidé chtějí zdržet.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/mlzidla-mlzitka" className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#18B7E6] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white shadow-[0_22px_60px_rgba(24,183,230,.28)] transition hover:-translate-y-0.5 hover:bg-[#1098C8]">
                Zobrazit produkty <ArrowRight size={17} />
              </Link>
              <Link to="/reference" className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/22 bg-white/8 px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white backdrop-blur-md transition hover:bg-white/14">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/28"><Play size={15} fill="currentColor" /></span>
                Přehrát video
              </Link>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="hidden rounded-[2rem] border border-white/12 bg-black/28 p-5 backdrop-blur-xl lg:block" aria-label="Hlavní přínosy mlžítek">
            <div className="space-y-4">
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="grid grid-cols-[44px_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-white/[.06] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#26C6E9]/55 text-[#26C6E9]">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-bold leading-6 text-white/86">{text}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-16 max-w-[1540px] px-4 pb-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, index) => (
            <motion.div key={tile.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.46, delay: index * 0.05 }}>
              <Link to={tile.link} className="group relative block min-h-[180px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B2034] shadow-[0_22px_70px_rgba(7,19,29,.26)]">
                <img src={tile.image} alt={`${tile.title} — produkt MLŽIDLA.CZ`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/24 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="font-heading text-2xl font-bold tracking-[-.04em] text-white">{tile.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-white/76">{tile.text}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

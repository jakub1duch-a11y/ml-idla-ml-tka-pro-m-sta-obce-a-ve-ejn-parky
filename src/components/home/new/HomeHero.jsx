import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import { ArrowRight, Wind, Droplets, Gauge, ShieldCheck } from 'lucide-react';

const benefits = [
  { icon: Wind, text: 'Cíleně osvěžuje pobytovou zónu' },
  { icon: Droplets, text: 'Jemná mlha pro příjemnější pobyt' },
  { icon: Gauge, text: 'Úsporný provoz a chytré řízení' },
  { icon: ShieldCheck, text: 'Odolná nerezová konstrukce' },
];

const tiles = [
  {
    title: 'LINEA CE',
    text: 'Nerezová linie s charakteristickým ohybem',
    image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp',
    link: '/produkt/linea-solo',
  },
  {
    title: 'MRAK',
    text: 'Hravé osvěžení pro děti a hřiště',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    link: '/produkt/mlzitko-mrak',
  },
  {
    title: 'MLŽNÁ BRÁNA',
    text: 'Průchozí vodní mlha pro náměstí',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bec7f86a9_generated_image.png',
    link: '/mlzne-brany',
  },
  {
    title: 'BENDY',
    text: 'Organická linie pro pobytové zóny',
    image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg',
    link: '/produkt/mlzitko-bendy',
  },
];

export default function HomeHero() {
  return (
    <MotionConfig reducedMotion="user">
    <section className="hero-motion-surface relative overflow-hidden bg-[#07131D] text-white" aria-label="MLŽIDLA.CZ hero">
      <div className="relative min-h-[82svh] overflow-hidden">
        <HeroAtmosphere />
        <motion.img
          src="https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg"
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
            <h1 className="mt-6 max-w-[10ch] font-heading text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-normal text-white">
              Mlžítka pro příjemnější města.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-slate-200 sm:text-2xl">
              Nízkotlaká mlžítka pro náměstí, sportoviště i zahrady. Napojení na běžný vodovodní řad, nerezový design a chytré řízení SUPLA.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/mlzidla-mlzitka" className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#18B7E6] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white shadow-[0_22px_60px_rgba(24,183,230,.28)] transition hover:-translate-y-0.5 hover:bg-[#1098C8]">
                Zobrazit produkty <ArrowRight size={17} />
              </Link>
              <a href="#home-product-gallery" className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/22 bg-white/[.08] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white backdrop-blur-md transition hover:bg-white/14">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/28"><ArrowRight size={15} /></span>
                Prohlédnout galerii
              </a>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="hidden rounded-[2rem] border border-white/12 bg-black/28 p-5 backdrop-blur-xl lg:block" aria-label="Hlavní přínosy mlžítek">
            <div className="space-y-4">
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="grid grid-cols-[44px_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-white/[.06] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#26C6E9]/55 text-[#26C6E9]">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-bold leading-6 text-slate-200">{text}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-[1540px] px-4 pb-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, index) => (
            <motion.div key={tile.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} whileTap={{ scale: 0.985 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.46, delay: index * 0.05 }}>
              <Link to={tile.link} className="group relative block min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B2034] shadow-[0_22px_70px_rgba(7,19,29,.26)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]">
                <img src={tile.image} alt={`${tile.title} — produkt MLŽIDLA.CZ`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/[.88] via-black/24 to-transparent" />
                <motion.span className="absolute inset-x-6 top-5 h-px origin-left rounded-full bg-gradient-to-r from-transparent via-[#26C6E9] to-transparent opacity-0 group-hover:opacity-100" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.12 + index * 0.04 }} />
                <div className="relative pt-24 p-5">
                  <h2 className="font-heading text-2xl font-bold tracking-[-.04em] text-white">{tile.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{tile.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] opacity-90 transition group-hover:translate-x-1">
                    Detail produktu <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}

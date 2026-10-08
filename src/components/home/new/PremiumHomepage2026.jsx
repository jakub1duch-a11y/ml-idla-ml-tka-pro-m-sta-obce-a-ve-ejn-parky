import React from 'react';
import AnchoringInstallationSection from '@/components/installation/AnchoringInstallationSection';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATALOG_CATEGORIES } from '@/lib/catalogCategories';
import HomeProductOverview from './HomeProductOverview';
import PlanningZoneSection from './PlanningZoneSection';
import {
  ArrowRight,
  Download,
  Droplets,
  Gauge,
  Landmark,
  Play,
  ShieldCheck,
  Sparkles,
  Timer,
  Wifi } from
'lucide-react';

const media = {
  cityHero: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg',
  bendy: '/media/optimized/31478e4b3_bendymlzitko02.webp',
  aura: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
  mrak: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
  gate: '/media/optimized/a2d77392e_Mlnbranyaportaly.webp',
  linea: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/6af16b6a9_linea---rezidencni-mlzeni.jpg',
  steblo: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b94c771e1_a982a794f_mlzitkosteblo.jpg',
  brochure: '/media/optimized/874fb533f_kotveniproduktu.webp'
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } }
};

const categoryIcons = [Landmark, Droplets, Sparkles, Droplets];
const categories = CATALOG_CATEGORIES.map((category, index) => ({
  ...category, subtitle: category.eyebrow, text: category.description,
  icon: categoryIcons[index], link: category.href,
}));

const smartPoints = [
{ icon: Gauge, title: 'Podle teploty', text: 'Mlžení se spustí při nastavených venkovních podmínkách.' },
{ icon: Timer, title: 'Podle času', text: 'Provozní okna pro ráno, odpoledne, akci nebo víkend.' },
{ icon: Wifi, title: 'Z aplikace', text: 'Vzdálené zapnutí, vypnutí a přehled provozu přes SUPLA.' }];


export default function PremiumHomepage2026() {
  return (
    <div className="premium-homepage-2026 overflow-x-clip bg-white text-[#07131D]">
      <section className="relative overflow-hidden bg-[#07131D] text-white" aria-labelledby="premium-hero-title">
        <div className="absolute inset-0">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fabf797f7_teepee-namesti-deti.webp" alt="Mlžné instalace ve veřejném prostoru" className="h-full w-full object-cover" loading="eager" decoding="async" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(38,198,233,.18),transparent_34%),linear-gradient(90deg,rgba(5,13,22,.88),rgba(5,13,22,.58)_45%,rgba(5,13,22,.1))]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07131D] to-transparent" />
        </div>

        <div className="premium-shell relative grid min-h-[86svh] items-center gap-10 py-24 sm:py-28 lg:grid-cols-[1fr_.82fr] lg:py-32">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="max-w-3xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#26C6E9]">Chladnější města · spokojenější lidé</p>
            <h1 id="premium-hero-title" className="mt-6 font-heading text-5xl font-black leading-[.98] tracking-[-.06em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Mlžné instalace, které <span className="text-[#26C6E9]">mění města.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Designová nerezová mlžítka pro náměstí, parky, sportoviště, školy, eventy i rezidenční zahrady. Voda, architektura a chytré řízení v jednom řešení.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/mlzidla-mlzitka" className="premium-action inline-flex min-h-14 items-center gap-3 rounded-full bg-[#26C6E9] px-7 py-4 text-sm font-extrabold uppercase tracking-[.06em] text-[#04131F] shadow-[0_22px_60px_rgba(38,198,233,.35)] transition hover:-translate-y-0.5 hover:bg-white">
                Prohlédnout produkty <ArrowRight size={17} />
              </Link>
              <Link to="/ke-stazeni" className="premium-action inline-flex min-h-14 items-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-extrabold uppercase tracking-[.06em] text-white backdrop-blur-md transition hover:bg-white/[.16]">
                <Download size={17} /> Brožury ke stažení
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-4">
              {[
              ['5–10 °C', 'pocitově příjemnější zóna'],
              ['AISI', 'nerezová konstrukce'],
              ['SUPLA', 'chytré řízení'],
              ['B2G', 'řešení pro města']].
              map(([value, label]) =>
              <div key={value} className="premium-glass-card rounded-2xl border border-white/[.12] bg-white/[.07] p-4 backdrop-blur-md">
                  <strong className="block text-2xl font-black text-white">{value}</strong>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-white/64">{label}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="hidden lg:block">
            <div className="relative rounded-[2.4rem] border border-white/14 p-5 backdrop-blur-xl shadow-[0_32px_100px_rgba(0,0,0,.28)] bg-[hsl(var(--background))]">
              <div className="relative overflow-hidden rounded-[1.8rem] bg-[#0B2034]">
                <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/20c6958fe_file_000000006f94821096150eb04577a01b.jpg" alt="Mlžná brána ve veřejném prostoru" className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
                <button type="button" className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-3 text-sm font-bold backdrop-blur-md bg-[hsl(var(--ring))] text-[hsl(var(--accent-foreground))] uppercase">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#07131D]"><Play size={16} fill="currentColor" /></span>
                  Přehrát video
                </button>
              </div>
              <div className="absolute -right-5 top-8 rounded-2xl border border-[#26C6E9]/35 bg-[#07131D]/80 px-5 py-4 text-sm font-bold text-white shadow-2xl backdrop-blur-md">
                Chladnější města<br /><span className="text-[#26C6E9]">pro lepší zítřky</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-section premium-pattern-light relative overflow-hidden bg-[#F4FBFF]" aria-labelledby="categories-premium-title">
        <div className="premium-shell">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="mx-auto max-w-3xl text-center">
            <p className="font-mono font-bold uppercase tracking-[.28em] text-[#0B8EC5] text-base">Řešení pro města a obce</p>
            <h2 id="categories-premium-title" className="premium-heading mt-4 font-heading text-4xl font-black tracking-[-.055em] text-[#07131D] sm:text-5xl lg:text-6xl">Kategorie mlžítek</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Jednotlivý bod osvěžení, průchozí brána nebo celá mlžná zóna. Vyberte řešení podle svého místa a prohlédněte si konkrétní produkty.</p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} variants={fadeUp} initial="hidden" whileInView="show" whileHover={{ y: -6 }} whileTap={{ scale: 0.99 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }}>
                  <Link to={item.link} className="premium-card-interactive group block overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(11,142,197,.12)] hover:shadow-[0_32px_100px_rgba(11,142,197,.22)]">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={item.image} alt={item.imageAlt} style={{ objectPosition: item.imagePosition }} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/[.86] text-[#0B8EC5] shadow-lg backdrop-blur-sm">
                        <Icon size={26} />
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#0B8EC5]">{item.subtitle}</p>
                      <h3 className="mt-2 font-heading text-2xl font-black tracking-[-.04em] text-[#07131D]">{item.title}</h3>
                      <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{item.text}</p>
                      <span className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold transition group-hover:bg-[#26C6E9] group-hover:text-[#04131F] bg-[hsl(var(--primary))] text-[hsl(var(--background))]">
                        Zobrazit kategorii <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                </motion.div>);

            })}
          </div>
        </div>
      </section>

      <HomeProductOverview />

      <section className="premium-section premium-pattern-dark relative overflow-hidden bg-[#071A2F] text-white" aria-labelledby="smart-title">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(38,198,233,.22),transparent_35%)] opacity-100" />
        <div className="premium-shell relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.32 }}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#26C6E9]">Smart řízení SUPLA</p>
            <h2 id="smart-title" className="premium-heading mt-4 font-heading text-4xl font-black leading-[1.02] tracking-[-.055em] sm:text-5xl lg:text-6xl">Chytré řízení, kdy je potřeba.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/[.68]">Systém lze navrhnout podle konkrétního místa, přívodu vody, provozního režimu a požadovaného komfortu. Vhodné pro města, areály, sportoviště i rezidenční zahrady.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {smartPoints.map(({ icon: Icon, title, text }) =>
              <motion.div key={title} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 320, damping: 24 }} className="premium-glass-card rounded-2xl border border-white/[.12] bg-white/[.06] p-4 backdrop-blur-md">
                  <Icon className="text-[#26C6E9]" size={24} />
                  <strong className="mt-4 block text-base">{title}</strong>
                  <p className="mt-2 text-xs leading-5 text-white/[.60]">{text}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,.44fr)] items-center gap-3 sm:gap-5">
            <figure className="min-w-0">
              <img src="/media/smart/smart-control-system.webp" alt="Ilustrační sestava chytrého řízení mlžení s ventilem, snímači a mobilním ovládáním" width="1254" height="1254" className="h-auto w-full object-contain" loading="lazy" decoding="async" />
              <figcaption className="mt-3 text-xs leading-5 text-white/70">Ilustrační sestava. Konkrétní vybavení dle návrhu řešení.</figcaption>
            </figure>
            <figure className="min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-black">
              <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f80b74fc4_ovladani_mlzitek_z_mobilu.png" alt="Ilustrační náhled ovládání mlžení v mobilním telefonu" width="1024" height="1536" className="h-auto w-full object-contain" loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      <PlanningZoneSection />

      <section className="premium-section bg-white" aria-labelledby="eventy-title">
        <div className="premium-shell">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[#0B8EC5]">Sportoviště · eventy · parky</p>
              <h2 id="eventy-title" className="premium-heading mt-4 max-w-4xl font-heading text-4xl font-black tracking-[-.055em] text-[#07131D] sm:text-5xl">Mlžítka pro horké dny, kde se lidé opravdu pohybují.</h2>
            </div>
            <Link to="/poptavka" className="premium-action inline-flex items-center gap-2 self-start rounded-full bg-[#07131D] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0B8EC5] lg:self-auto">Poptat řešení pro akci <ArrowRight size={16} /></Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
            ['Sportoviště a cyklotrasy', media.gate, 'Mlžná alej podél trasy vytváří krátké osvěžení pro sportovce i návštěvníky.'],
            ['Městské parky', media.aura, 'AURA a tvarové prvky podporují setkávání a delší pobyt ve stínu zeleně.'],
            ['Slavnosti a eventy', media.steblo, 'Mobilní nebo dočasné osvěžení pro akce, trhy a letní program města.']].
            map(([title, image, text], index) =>
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" whileHover={{ y: -6 }} whileTap={{ scale: 0.99 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.06 }} className="premium-card-interactive overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(7,19,29,.10)]">
                <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/d19f07acb_40c8a362-0fb9-40af-a332-f6566b1d3ee2__1_.jpeg" alt={`${title} — využití mlžítek MLŽIDLA.CZ`} className="aspect-[16/10] w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-6">
                  <h3 className="font-heading text-2xl font-black tracking-[-.04em] text-[#07131D]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <AnchoringInstallationSection />
    </div>);

}

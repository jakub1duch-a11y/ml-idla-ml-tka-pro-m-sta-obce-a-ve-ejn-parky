import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, Leaf, ShieldCheck, Smartphone, Sparkles, Wind } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const HERO_IMAGE = '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp';
const DETAIL_IMAGE = '/media/optimized/cfc837b23_image.webp';
const ARCH_IMAGE = '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp';

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

function SectionLabel({ children }) {
  return <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-cyan-700">{children}</p>;
}

export default function RezidencniMlzeni() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [0.8, 0.35, 0]);

  useEffect(() => {
    setSEO({
      title: 'Rezidenční mlžení pro zahrady a terasy | MLŽIDLA.cz',
      description: 'Prémiové rezidenční mlžení pro zahrady, terasy a venkovní relaxační zóny. Nízkotlaké řešení bez čerpadla, chytré řízení a návrh na míru.',
      canonicalPath: '/rezidencni-mlzeni',
    });
  }, []);

  return (
    <div className="overflow-hidden bg-[#f4f7f7] text-slate-950">
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-slate-950">
        <motion.img
          src={HERO_IMAGE}
          alt="Rezidenční mlžení MLŽIDLA.cz v zahradním prostředí"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ y: heroY, scale: heroScale }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,17,24,.92)_0%,rgba(3,17,24,.62)_42%,rgba(3,17,24,.18)_72%,rgba(3,17,24,.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(128,243,255,.18),transparent_34%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-8%] bottom-[-11%] h-[52%] rounded-[50%] bg-white/15 blur-3xl"
          style={{ opacity: mistOpacity }}
        />

        <motion.div style={{ y: copyY }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-6 pb-16 pt-28 sm:px-8 lg:items-center lg:pb-0 lg:pt-20">
          <div className="max-w-4xl">
            <motion.div initial="hidden" animate="visible" variants={reveal}>
              <SectionLabel>Rezidenční kolekce · zahrada · terasa · wellness</SectionLabel>
              <h1 className="mt-5 max-w-4xl font-heading text-[clamp(3.2rem,8.5vw,8.2rem)] font-medium leading-[0.86] tracking-[-0.055em] text-white">
                Léto, které<br />zůstává venku.
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.75 }}
              className="mt-7 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg lg:text-xl"
            >
              Jemná vodní mlha pro terasy, zahrady a soukromé venkovní zóny. Elegantní nerezové prvky, napojení přímo na vodovod a chytré ovládání bez zbytečné technologie v prostoru.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link to="/poptavka?produkt=Rezidenční%20mlžení" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
                Navrhnout řešení <ArrowRight size={16} />
              </Link>
              <Link to="/ai-vizualizace" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/14">
                Vizualizovat v mém prostoru <Sparkles size={15} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-5 right-6 z-10 hidden items-center gap-3 text-white/50 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">scroll to feel it</span>
          <span className="h-px w-20 bg-white/30" />
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-7 px-6 sm:grid-cols-4 lg:px-8">
          {[
            ['50–100 μm', 'jemná vodní mlha'],
            ['316L', 'nerezová ocel'],
            ['bez čerpadla', 'nízkotlaké řešení'],
            ['SUPLA / TUYA', 'chytré řízení'],
          ].map(([value, label]) => (
            <div key={value} className="border-l border-slate-200 pl-4 sm:pl-6">
              <div className="text-xl font-semibold tracking-tight text-slate-950">{value}</div>
              <div className="mt-1 text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <SectionLabel>01 · Komfort bez vizuálního hluku</SectionLabel>
            <h2 className="mt-5 font-heading text-5xl leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Ochladí prostor. Neubere mu charakter.</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-slate-600 lg:justify-self-end">
            Rezidenční instalace navrhujeme jako součást architektury zahrady. Minimalistické mlžítko může stát samostatně, doplnit pergolu nebo vytvořit jemnou osvěžující zónu u terasy, bazénu či venkovního posezení.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { icon: Wind, title: 'Osvěžení vzduchu', text: 'Mikrokapičky se rozptylují do prostoru a v horkých dnech vytvářejí příjemnější mikroklima.' },
            { icon: Droplets, title: 'Přirozeně jednoduché', text: 'Napojení na vodovodní řad. Bez hlučného čerpadla a bez techniky, která by rušila zahradu.' },
            { icon: Leaf, title: 'Prostor zůstává prostorem', text: 'Čistý nerezový detail, skryté nebo subtilní kotvení a návrh podle konkrétní kompozice zahrady.' },
          ].map(({ icon: Icon, title, text }) => (
            <motion.article key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65 }} className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-50 text-cyan-800"><Icon size={19} /></div>
              <h3 className="mt-7 text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#06171f] text-white">
        <div className="mx-auto grid min-h-[88vh] max-w-[1600px] lg:grid-cols-2">
          <div className="relative min-h-[52vh] overflow-hidden lg:min-h-[88vh]">
            <img src={DETAIL_IMAGE} alt="Detail nerezového mlžítka MLŽIDLA.cz" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06171f]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#06171f]/35" />
          </div>
          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={reveal} className="max-w-xl">
              <SectionLabel>02 · Materiál a detail</SectionLabel>
              <h2 className="mt-5 font-heading text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl">Nerez 316L. Čistá linie. Minimum zásahů.</h2>
              <p className="mt-7 text-base leading-relaxed text-white/65">
                Konstrukce vychází z dlouhodobě odolného nerezu 316L. U rezidenčních realizací preferujeme nenápadné vedení vody, čisté napojení a kotvení, které neruší dlažbu ani výsadbu.
              </p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                {[
                  ['Skryté vedení', 'Přívod vody lze připravit pod povrchem a vyvést přímo u patky.'],
                  ['Jemná tryska', 'Standardní mlžení 50–100 μm pro osvěžení prostoru.'],
                  ['Individuální návrh', 'Výška, počet trysek a rozmístění podle konkrétního prostoru.'],
                  ['Servisovatelný systém', 'Filtrace, ventil a přístup k důležitým částem pro snadnou údržbu.'],
                ].map(([title, text]) => (
                  <div key={title} className="border-t border-white/15 pt-4">
                    <div className="font-semibold">{title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24 lg:py-36">
        <div className="absolute -right-20 top-12 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="max-w-3xl">
            <SectionLabel>03 · Chytré řízení</SectionLabel>
            <h2 className="mt-5 font-heading text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Spustí se, když dává smysl.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Ventil lze ovládat z telefonu a nastavit podle času, teploty nebo konkrétního scénáře. Systém tak může fungovat automaticky, ale stále zůstává jednoduše ovladatelný ručně.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              { icon: Smartphone, n: '01', title: 'Mobilní ovládání', text: 'Zapnutí, vypnutí a scénáře přes SUPLA nebo TUYA podle zvolené konfigurace.' },
              { icon: Gauge, n: '02', title: 'Teplota a čas', text: 'Automatické spuštění při horku nebo v předem nastavených intervalech.' },
              { icon: ShieldCheck, n: '03', title: 'Kontrola spotřeby', text: 'Snímač průtoku a chytré scénáře pomáhají držet provoz pod kontrolou.' },
            ].map(({ icon: Icon, n, title, text }) => (
              <motion.article key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="group rounded-[30px] bg-slate-950 p-7 text-white transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between"><Icon size={21} className="text-cyan-300" /><span className="font-mono text-[10px] tracking-[0.2em] text-white/35">{n}</span></div>
                <h3 className="mt-16 text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[88vh] overflow-hidden bg-slate-900">
        <img src={ARCH_IMAGE} alt="Architektonická mlžná instalace MLŽIDLA.cz" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,15,20,.9)_0%,rgba(4,15,20,.15)_65%,rgba(4,15,20,.28)_100%)]" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-end px-6 pb-14 lg:px-8 lg:pb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={reveal} className="max-w-4xl text-white">
            <SectionLabel>04 · Návrh pro váš prostor</SectionLabel>
            <h2 className="mt-5 font-heading text-5xl leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-8xl">Pošlete fotografii.<br />My navrhneme mlhu.</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
              Stačí fotografie zahrady nebo terasy, přibližné rozměry a informace o přívodu vody. Připravíme vhodné rozmístění, vizuální náhled a doporučení dalšího postupu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/ai-vizualizace" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950">Vytvořit vizualizaci <Sparkles size={15} /></Link>
              <Link to="/poptavka?produkt=Rezidenční%20mlžení" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md">Nezávazně poptat <ArrowRight size={16} /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

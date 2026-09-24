import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock3, CloudRain, Gauge, Wifi, Leaf, Droplets, ShieldCheck, Settings2, Users } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Clock3,
    title: 'Časovače',
    text: 'Nastavte přesný čas mlžení podle provozu a denního režimu.',
  },
  {
    icon: CloudRain,
    title: 'Dešťový senzor',
    text: 'Automatické vypnutí při dešti a ochrana vašeho zařízení.',
  },
  {
    icon: Gauge,
    title: 'Tlakový snímač',
    text: 'Kontrola tlaku pro bezpečný a spolehlivý provoz.',
  },
  {
    icon: Wifi,
    title: 'Wi‑Fi / aplikace',
    text: 'Ovládání odkudkoliv přes aplikaci SUPLA v češtině.',
  },
];

const BENEFITS = [
  { icon: Leaf, title: 'Pohodlí a automatizace' },
  { icon: Droplets, title: 'Úspora vody a nákladů' },
  { icon: ShieldCheck, title: 'Spolehlivý a bezpečný provoz' },
];

const APP_FEATURES = ['Ovládání odkudkoliv', 'Automatické režimy', 'Notifikace a přehled', 'Snadná instalace'];

export default function SmartHero() {
  return (
    <section className="relative overflow-hidden bg-[#f6fbff] pt-[68px] text-[#061a32]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute right-[8%] top-10 h-[28rem] w-[28rem] rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute bottom-8 left-[40%] h-64 w-64 rounded-full bg-white/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 pb-10 pt-14 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] xl:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-10"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[.28em] text-[#244361] sm:text-xs">
              Chytré příslušenství
            </p>

            <h1 className="mt-5 max-w-2xl font-heading text-[clamp(2.8rem,5.2vw,5.8rem)] font-semibold leading-[.95] tracking-[-.055em] text-[#061a32]">
              Smart řízení SUPLA
            </h1>
            <p className="mt-3 max-w-2xl font-heading text-[clamp(2rem,3.4vw,3.7rem)] font-semibold leading-[1.02] tracking-[-.045em] text-[#08aeea]">
              Chytré mlžení pod kontrolou.
            </p>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Automatizujte své mlžicí systémy a získejte maximální pohodlí, úsporu vody a spolehlivý provoz.
              S chytrým řešením SUPLA máte vše pod kontrolou — odkudkoliv, kdykoliv.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              {BENEFITS.map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-start gap-3 sm:block">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-cyan-400 bg-white/85 text-cyan-500 shadow-sm">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <p className="mt-0 text-sm font-semibold leading-5 text-[#0b2a4c] sm:mt-3">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/poptavka?produkt=Chytr%C3%A9%20SUPLA%20%C5%99%C3%ADzen%C3%AD%20ml%C5%BE%C3%ADtek"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 text-base font-bold text-white shadow-[0_14px_35px_rgba(0,174,234,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,174,234,.35)]"
              >
                Zjistit více <ArrowRight size={18} />
              </Link>

              <div className="relative pl-1 sm:pl-3">
                <p className="-rotate-3 font-heading text-xl italic leading-tight text-[#123e76] sm:text-2xl">
                  Technologie,
                  <br />
                  <span className="text-cyan-500">která dýchá.</span>
                </p>
                <div className="mt-1 h-0.5 w-32 bg-cyan-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-white/90 via-cyan-100/40 to-sky-200/20 blur-xl" />

            <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/65 shadow-[0_28px_80px_rgba(4,50,83,.16)] backdrop-blur-xl">
              <div className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[620px]">
                <img
                  src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp"
                  alt="Smart řízení SUPLA pro ovládání mlžítek z mobilní aplikace"
                  className="absolute inset-0 h-full w-full bg-white object-contain object-center p-3 sm:p-6"
                  loading="eager"
                  fetchPriority="high"
                />

                <div className="absolute bottom-4 right-4 hidden w-[250px] rounded-3xl border border-white/80 bg-white/72 p-5 shadow-xl backdrop-blur-xl xl:block">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[.28em] text-[#1e4670]">
                    Vše v jedné aplikaci
                  </p>
                  <ul className="mt-4 space-y-3">
                    {APP_FEATURES.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-[#13395d]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400 text-cyan-500">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-sky-100 pt-4 font-heading text-lg italic leading-tight text-[#123e76]">
                    Chytřejší prostor.
                    <br />
                    <span className="text-cyan-500">Příjemnější život.</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURE_CARDS.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group rounded-[1.5rem] border border-white/90 bg-white/72 p-5 shadow-[0_18px_55px_rgba(10,70,110,.10)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-[#0c3d73]">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-[#0c3d73] transition group-hover:bg-cyan-400 group-hover:text-white">
                  <ArrowRight size={16} />
                </div>
              </div>
              <h2 className="mt-5 font-heading text-xl font-semibold tracking-[-.03em] text-[#08284b]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-7 grid gap-3 rounded-[1.5rem] border border-sky-100/80 bg-white/70 px-5 py-5 shadow-sm backdrop-blur lg:grid-cols-5 lg:items-center">
          {[
            { icon: Leaf, text: 'Chytré řešení pro moderní prostor' },
            { icon: Droplets, text: 'Vyšší komfort každý den' },
            { icon: Settings2, text: 'Snadná instalace a rozšíření' },
            { icon: Users, text: 'Kompatibilní s našimi systémy' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm font-semibold text-[#193a5a]">
              <Icon size={22} className="text-cyan-500" strokeWidth={1.8} />
              <span>{text}</span>
            </div>
          ))}
          <div className="font-mono text-[10px] uppercase tracking-[.28em] text-slate-500 lg:text-right">
            Mlžení
            <br />
            s inteligencí
          </div>
        </div>
      </div>
    </section>
  );
}

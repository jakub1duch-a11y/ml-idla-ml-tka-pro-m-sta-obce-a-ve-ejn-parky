import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Ruler, FlaskConical, ShieldCheck, Wrench } from 'lucide-react';

const EXPERTISE = [
  {
    icon: Ruler,
    title: 'Návrh na míru',
    desc: 'Rozměr, tvar i kotvení navrhneme přesně pro váš prostor — nikdy neúčtovány katalogové kompromisy.',
  },
  {
    icon: FlaskConical,
    title: 'Vývoj a testování',
    desc: 'Vlastní vývoj trysek, tlakových cest a řízení. Každé řešení se ověřuje v reálném provozu.',
  },
  {
    icon: ShieldCheck,
    title: 'Certifikace a kvalita',
    desc: 'Nerez AISI 304/316L, svařované spoje, projektové kotvení. Stejná certifikace jako HolmTec s.r.o.',
  },
  {
    icon: Wrench,
    title: 'Výroba a servis',
    desc: 'Vyrábíme v Trutnově v vlastní dílně. Servis, náhradní díly a podpora po celou sezónu.',
  },
];

export default function CommercialIndustrialSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#0A1628] py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0)_60%,rgba(10,22,40,0.5)_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#22D3EE]"
            >
              Špičková řešení pro komerční a průmyslové mlžení
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.05 }}
              className="mt-4 font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.02em]"
            >
              Zakázková nerezová mlžítka. Postavená na odbornosti, ne na katalogu.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.12 }}
              className="mt-5 max-w-xl text-base leading-7 text-white/72 sm:text-lg"
            >
              S využitím silných odborných znalostí v oblasti návrhu a vývoje se specializujeme na
              vytváření zakázkových rozprašovacích nerezových mlžítek, přizpůsobených jedinečným
              požadavkům zákazníků — což zajišťuje efektivitu a spolehlivost každého námi poskytovaného
              řešení.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/poptavka"
                className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                Nezávazná poptávka <ArrowRight size={16} />
              </Link>
              <Link
                to="/mlzidla-mlzitka"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Prohlédnout kolekci
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {EXPERTISE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: (i % 2) * 0.08 }}
                className="rounded-sm border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-[#22D3EE]/40 hover:bg-white/[0.06]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#22D3EE]/12 text-[#22D3EE]">
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/64">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CITY_ITEMS, GARDEN_ITEMS } from '@/components/kolekce/useCaseData';
import UseCaseCard from '@/components/kolekce/UseCaseCard';

export default function UseCaseExperience({ variant = 'city' }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const items = variant === 'garden' ? GARDEN_ITEMS : CITY_ITEMS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [36, -36]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-24, 32]);
  const lineWidth = useTransform(scrollYProgress, [0.05, 0.6], ['0%', '100%']);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-[#D3E2E8] bg-[#F4FAFC] py-20 sm:py-24">
      <motion.div style={{ y }} className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#22D3EE]/15 blur-3xl" />
      <motion.div style={{ y: ySecondary }} className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#153863]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#153863]">// Kde MLŽIDLA dávají smysl</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-.035em] text-[#0A1628] sm:text-5xl">
              {variant === 'garden' ? 'Ochlazení pro místa, kde chcete zůstat déle.' : 'Ochlazení tam, kde se město skutečně používá.'}
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-7 text-[#5A6B78] sm:text-lg">
              {variant === 'garden'
                ? 'Od soukromé zahrady přes hotelovou terasu až po lázeňský nebo seniorský areál. Jemná mlha vytváří příjemnější mikroklima bez toho, aby přebila architekturu prostoru.'
                : 'Náměstí, parky, sportoviště, nádraží, promenády, hotely, lázně i domovy seniorů. Navrhujeme ochlazovací body podle pohybu lidí, stínu, větru a skutečného provozu.'}
            </p>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mt-5 font-heading text-xl font-semibold tracking-[-.02em] text-[#153863] sm:text-2xl"
            >
              Ochlazujeme vzduch kolem vás. Dýchejte lépe.
            </motion.p>
          </div>
        </div>

        <div className="mt-10 h-[2px] w-full bg-[#D3E2E8]">
          <motion.div style={{ width: lineWidth }} className="h-full bg-[#22D3EE]" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <UseCaseCard key={item.title} item={item} index={index} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
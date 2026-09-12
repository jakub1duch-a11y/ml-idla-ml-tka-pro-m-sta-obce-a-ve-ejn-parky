import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { getProductSpatialConfigurations } from '@/lib/productDetailConfig';
import PdArPromo from '@/components/produkt/new/PdArPromo';

export default function PdVariants({ product }) {
  const variants = getProductSpatialConfigurations(product);
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const glowY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [50, -50]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0D2338] py-16 lg:py-24">
      {/* technický blueprint grid + mlžný glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.16]"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(120% 80% at 20% 0%, black 20%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(120% 80% at 20% 0%, black 20%, transparent 78%)',
        }}
      />
      <motion.div style={{ y: glowY }} aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[#22D3EE]/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#22D3EE]">// Produkt ≠ konfigurace</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold leading-[1.03] tracking-[-.035em] text-white lg:text-[3.4rem]">
            Jeden tvar,<br />nekonečně prostorů.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65">
            Geometrie produktu zůstává schválená a nemění se. Co se mění, je počet kusů, rozmístění v prostoru a výrobcem definovaná varianta — a právě to rozhoduje, jak bude mlha ve vašem místě fungovat.
          </p>
        </div>

        <div className={`mt-12 grid gap-4 ${variants.length >= 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3'}`}>
          {variants.map(([title, sub, desc], i) => (
            <motion.div
              key={`${title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="group border border-white/12 bg-white/[.04] p-7 backdrop-blur-sm transition-colors hover:border-[#22D3EE]/45 hover:bg-white/[.07]"
            >
              <span className="font-mono text-sm text-[#22D3EE]">0{i + 1}</span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-white">{title}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-white/45">{sub}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{desc}</p>
              <div className="mt-6 h-px w-8 bg-[#22D3EE] transition-all duration-500 group-hover:w-20" />
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <PdArPromo product={product} />
        </div>
      </div>
    </section>
  );
}
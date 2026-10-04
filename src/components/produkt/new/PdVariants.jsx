import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import PdConfigurator from '@/components/produkt/new/PdConfigurator';
import PdArPromo from '@/components/produkt/new/PdArPromo';

export default function PdVariants({ product }) {
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

        <div className="mt-12">
          <PdConfigurator product={product} />
        </div>

        <div className="mt-12">
          <PdArPromo product={product} />
        </div>
      </div>
    </section>
  );
}
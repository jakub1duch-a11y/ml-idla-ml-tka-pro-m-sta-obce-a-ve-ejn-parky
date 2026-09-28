import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Droplets } from 'lucide-react';

export default function SmartCTA() {
  const reduced = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-secondary py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/[.07] blur-3xl" />
        <div className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[.18em] text-accent backdrop-blur">
            <Droplets size={14} /> Smart Cooling · Poptávka
          </div>
          <h2 className="mt-7 font-heading text-3xl font-semibold leading-[1.05] tracking-[-.03em] text-white sm:text-4xl lg:text-5xl">
            Připraveni navrhnout Smart Cooling?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Navrhneme vhodný produkt, rozmístění, zóny, senzory, provozní scénář a úroveň vzdálené správy podle konkrétního veřejného prostoru.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/poptavka?produkt=Smart%20Cooling"
              className="product-sweep inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[.02em] text-secondary shadow-[0_18px_50px_rgba(34,211,238,.25)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Navrhnout Smart Cooling <ArrowRight size={16} />
            </Link>
            <Link
              to="/katalog-mlzitek"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-accent/50 hover:bg-white/5"
            >
              Zobrazit mlžítka →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
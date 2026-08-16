import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplets, Gauge, Sparkles } from 'lucide-react';

const FALLBACK_VIDEO = '/media/optimized/bc59d4ed7_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.webm';

export default function ProductMotionSection({ product }) {
  const reduceMotion = useReducedMotion();
  const videoUrl = product?.motion_video_url || product?.video_url || FALLBACK_VIDEO;
  const poster = product?.image_url || product?.gallery_urls?.[0];

  return (
    <section className="border-t border-slate-200 bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-[.74fr_1.26fr] lg:gap-14 lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5">
            <Sparkles size={13} className="text-cyan-300" />
            <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/65">Product motion</span>
          </div>
          <h2 className="mt-5 font-heading text-3xl font-medium leading-tight tracking-[-.035em] sm:text-4xl">{product?.name} v detailu pohybu.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Krátký filmový loop ukazuje povrch nerezi, osazení trysek a charakter jemného mlžení bez rušivých titulků. Je navržený pro rychlý autoplay na desktopu i mobilu.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.05] px-3 py-2 text-xs text-white/72"><Droplets size={13} className="text-cyan-300"/>Jemná mlha</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.05] px-3 py-2 text-xs text-white/72"><Gauge size={13} className="text-cyan-300"/>Nízkotlaký provoz</span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-[28px] border border-white/12 bg-black shadow-2xl shadow-black/30">
          <video src={videoUrl} poster={poster} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" className="aspect-video w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

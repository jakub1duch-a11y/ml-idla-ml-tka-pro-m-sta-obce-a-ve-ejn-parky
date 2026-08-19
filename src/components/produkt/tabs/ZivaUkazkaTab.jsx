import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Maximize2, VideoOff, PlayCircle, Images, Sparkles } from 'lucide-react';

export default function ZivaUkazkaTab({ product, allImages, onOpenLightbox }) {
  const reduceMotion = useReducedMotion();
  const gallery = (allImages || []).filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-[#eef7fa] py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(112,196,220,.22),transparent_32%),radial-gradient(circle_at_88%_76%,rgba(255,255,255,.9),transparent_34%)]" />
      <motion.div aria-hidden="true" className="pointer-events-none absolute left-[-8%] top-[18%] h-36 w-[62%] rounded-full bg-white/70 blur-3xl" animate={reduceMotion ? undefined : { x: ['-4%', '10%', '-4%'], opacity: [.35, .7, .35] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .5 }} className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0b4860]/10 bg-white/70 px-3 py-1.5 text-[#0b4860] backdrop-blur-md"><Sparkles size={12} /><span className="font-mono text-[9px] uppercase tracking-[.18em]">Galerie & živý provoz</span></div>
            <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-.035em] text-[#082f3f] sm:text-4xl lg:text-5xl">{product.name} <span className="font-light text-[#5f7d89]">v prostoru.</span></h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Detail materiálu, charakter jemné mlhy a reálné instalace v jednom vizuálním příběhu. Kliknutím otevřete fotografii přes celou obrazovku.</p>
          </div>
          {gallery.length > 0 && <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-semibold text-[#0b4860] shadow-sm backdrop-blur-md lg:self-auto"><Images size={14} /> {gallery.length} fotografií</div>}
        </motion.div>

        {product.video_url ? (
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .5 }} className="relative mb-8 overflow-hidden rounded-[30px] border border-white/70 bg-slate-950 shadow-[0_28px_90px_rgba(8,47,63,.18)] sm:mb-10">
            <video src={product.video_url} controls playsInline poster={product.image_url} className="aspect-video w-full object-cover" />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md"><PlayCircle size={13} /> Video produktu</div>
          </motion.div>
        ) : (
          <div className="mb-8 flex max-w-md items-center gap-2.5 rounded-2xl border border-dashed border-[#0b4860]/15 bg-white/70 p-5 text-sm text-slate-400 backdrop-blur-md sm:mb-10"><VideoOff size={16} /> Video zatím není k dispozici.</div>
        )}

        {gallery.length > 0 ? (
          <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[230px] sm:gap-4 lg:grid-cols-4 lg:auto-rows-[220px]">
            {gallery.map((src, i) => {
              const featured = i === 0;
              const wide = i === 3 || i === 6;
              return (
                <motion.button key={`${src}-${i}`} type="button" onClick={() => onOpenLightbox(i)} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .42, delay: Math.min(i * .035, .18) }} className={`group relative overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_14px_40px_rgba(8,47,63,.08)] ${featured ? 'col-span-2 row-span-2' : ''} ${wide ? 'col-span-2' : ''}`}>
                  <img src={src} alt={`${product.name} – galerie ${i + 1}`} loading="lazy" decoding="async" className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.035] ${featured ? 'object-contain bg-white p-5 sm:p-7' : 'object-cover'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062d3a]/35 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left text-white">
                    <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/70">{featured ? 'Produktový pohled' : `Pohled ${i + 1}`}</p>{featured && <p className="mt-1 text-sm font-semibold">{product.name}</p>}</div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/25 backdrop-blur-md transition-transform group-hover:scale-105"><Maximize2 size={14} /></span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 font-light">Galerie zatím není k dispozici.</p>
        )}
      </div>
    </section>
  );
}
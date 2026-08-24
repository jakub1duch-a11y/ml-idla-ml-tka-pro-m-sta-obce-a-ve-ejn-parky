import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Maximize2, VideoOff, PlayCircle, Images, Sparkles } from 'lucide-react';

export default function ZivaUkazkaTab({ product, allImages, onOpenLightbox }) {
  const reduceMotion = useReducedMotion();
  const gallery = (allImages || []).filter(Boolean);
  const [loaded, setLoaded] = useState({});

  const markLoaded = (src) => setLoaded((current) => current[src] ? current : { ...current, [src]: true });

  return (
    <section className="relative overflow-hidden bg-[#eef7fa] py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(112,196,220,.20),transparent_32%),radial-gradient(circle_at_88%_76%,rgba(255,255,255,.92),transparent_34%)]" />
      <motion.div aria-hidden="true" className="pointer-events-none absolute left-[-8%] top-[18%] h-36 w-[62%] rounded-full bg-white/70 blur-3xl" animate={reduceMotion ? undefined : { x: ['-4%', '10%', '-4%'], opacity: [.35, .7, .35] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .5 }} className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0b4860]/10 bg-white/75 px-3 py-1.5 text-[#0b4860] backdrop-blur-md"><Sparkles size={12} /><span className="font-mono text-[9px] uppercase tracking-[.18em]">Galerie produktu</span></div>
            <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-.035em] text-[#082f3f] sm:text-4xl lg:text-5xl">{product.name} <span className="font-light text-[#5f7d89]">v reálném prostoru.</span></h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Hlavní produktové fotografie, realizace a vizualizace v přehledné galerii. Kliknutím otevřete originální snímek přes celou obrazovku.</p>
          </div>
          {gallery.length > 0 && <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-semibold text-[#0b4860] shadow-sm backdrop-blur-md lg:self-auto"><Images size={14} /> {gallery.length} fotografií</div>}
        </motion.div>

        {product.video_url ? (
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .5 }} className="relative mb-10 overflow-hidden rounded-[30px] border border-white/70 bg-slate-950 shadow-[0_28px_90px_rgba(8,47,63,.18)]">
            <video src={product.video_url} controls playsInline poster={product.image_url} className="aspect-video w-full object-cover" />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md"><PlayCircle size={13} /> Video produktu</div>
          </motion.div>
        ) : (
          <div className="mb-10 flex max-w-md items-center gap-2.5 rounded-2xl border border-dashed border-[#0b4860]/15 bg-white/70 p-5 text-sm text-slate-400 backdrop-blur-md"><VideoOff size={16} /> Video zatím není k dispozici.</div>
        )}

        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {gallery.map((src, i) => {
              const featured = i === 0;
              const wide = !featured && (i % 5 === 1 || i % 5 === 4);
              const colClass = featured ? 'sm:col-span-2 lg:col-span-8 lg:row-span-2' : wide ? 'lg:col-span-4' : 'lg:col-span-4';
              const ratioClass = featured ? 'aspect-[16/10] lg:h-full lg:min-h-[520px]' : 'aspect-[4/3]';

              return (
                <motion.button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => onOpenLightbox(i)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: .12 }}
                  transition={{ duration: .42, delay: Math.min(i * .035, .18) }}
                  className={`group relative overflow-hidden rounded-[26px] border border-white/85 bg-slate-200 text-left shadow-[0_16px_44px_rgba(8,47,63,.10)] ${colClass} ${ratioClass}`}
                >
                  {!loaded[src] && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
                  <img
                    src={src}
                    alt={`${product.name} – galerie ${i + 1}`}
                    loading={i > 3 ? 'lazy' : 'eager'}
                    decoding="async"
                    onLoad={() => markLoaded(src)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031d26]/60 via-transparent to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/70">{featured ? 'Hlavní fotografie' : `Fotografie ${String(i + 1).padStart(2, '0')}`}</p>
                      {featured && <p className="mt-1 text-sm font-semibold sm:text-base">{product.name}</p>}
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/25 backdrop-blur-md transition-transform group-hover:scale-105"><Maximize2 size={15} /></span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <p className="font-light text-slate-400">Galerie zatím není k dispozici.</p>
        )}
      </div>
    </section>
  );
}

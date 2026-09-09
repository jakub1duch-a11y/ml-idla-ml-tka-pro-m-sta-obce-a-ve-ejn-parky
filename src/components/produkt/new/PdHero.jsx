import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { VIDEO_ASSETS, BENDY_SLUGS } from '@/lib/newMedia';

function isVideo(url) {
  return typeof url === 'string' && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
}

export default function PdHero({ product }) {
  const [lightbox, setLightbox] = useState(null);
  const isBendy = BENDY_SLUGS.includes(product.slug);

  const media = [
    ...(product.image_url ? [{ type: 'image', url: product.image_url }] : []),
    ...(isBendy
      ? [
          { type: 'video', url: VIDEO_ASSETS.heroJicin.src, poster: VIDEO_ASSETS.heroJicin.poster },
          { type: 'video', url: VIDEO_ASSETS.realizaceKlip.src, poster: VIDEO_ASSETS.realizaceKlip.poster },
        ]
      : product.video_url && isVideo(product.video_url)
        ? [{ type: 'video', url: product.video_url, poster: product.image_url }]
        : []),
    ...(product.gallery_urls || []).filter(Boolean).filter((u) => !isVideo(u)).map((u) => ({ type: 'image', url: u })),
  ].filter(Boolean);

  const trustItems = ['Vizualizace zdarma do 48 h', 'Česká výroba', 'Nerez'];

  return (
    <section className="border-b border-[#EAF5FB] bg-white pt-24 lg:pt-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Moderní mlžítko</p>
          <h1 className="mt-4 font-heading text-4xl leading-[1.08] text-[#0D2F4F] lg:text-5xl xl:text-6xl">{product.name}</h1>
          {product.short_description && (
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#0D2F4F]/65 lg:text-lg">{product.short_description}</p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/ai-vizualizace?produkt=${product.slug}`}
              className="inline-flex items-center gap-2 bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]"
            >
              Vizualizovat do mého prostoru
            </Link>
            <Link
              to={`/poptavka?produkt=${product.slug}`}
              className="inline-flex items-center gap-2 border border-[#0D2F4F]/20 px-7 py-4 text-sm font-semibold uppercase tracking-wide text-[#0D2F4F] transition-colors hover:bg-[#EAF5FB]"
            >
              Poptat s instalací
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#EAF5FB] pt-5">
            {trustItems.map((t, i) => (
              <span key={t} className="flex items-center gap-2 text-xs text-[#0D2F4F]/55">
                {i > 0 && <span className="text-[#0D2F4F]/20">·</span>}
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {media.slice(0, 5).map((m, i) => (
            <button
              key={`${m.type}-${i}`}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden bg-[#EAF5FB] ${i === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/3]'}`}
            >
              {m.type === 'video' ? (
                <video
                  src={m.url} poster={m.poster} autoPlay muted loop playsInline preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src={m.url} alt={`${product.name} — foto ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && media.length > 0 && (
        <Lightbox media={media} initial={lightbox} productName={product.name} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

function Lightbox({ media, initial, productName, onClose }) {
  const [idx, setIdx] = useState(initial);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % media.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + media.length) % media.length);
    };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', h); };
  }, [media.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0D2F4F]/95 p-4 backdrop-blur-xl" onClick={onClose}>
      <button onClick={onClose} aria-label="Zavřít" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-white/70 hover:text-white">
        <X size={22} />
      </button>
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {media[idx]?.type === 'video' ? (
            <motion.video
              key={media[idx].url} src={media[idx].url} poster={media[idx].poster} controls autoPlay
              className="max-h-[80vh] w-full object-contain"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
          ) : (
            <motion.img
              key={media[idx]?.url} src={media[idx]?.url} alt={`${productName} — foto ${idx + 1}`}
              className="max-h-[80vh] w-full object-contain"
              initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {media.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/10 text-white hover:bg-white/20">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % media.length)} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/10 text-white hover:bg-white/20">
              <ChevronRight size={20} />
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wide text-white/40">{idx + 1} / {media.length}</p>
          </>
        )}
      </div>
    </div>
  );
}
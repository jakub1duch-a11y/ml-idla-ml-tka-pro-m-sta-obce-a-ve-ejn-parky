import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  ExternalLink,
  Leaf,
  Play,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
} from 'lucide-react';
import { VIDEO_ASSETS, BENDY_SLUGS } from '@/lib/newMedia';
import { getProductDetailConfig } from '@/lib/productDetailConfig';
import { getLine, getFamily } from '@/lib/productFamilies';

function isVideo(url) {
  return typeof url === 'string' && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
}

export default function PdHero({ product }) {
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState(0);
  const isBendy = BENDY_SLUGS.includes(product.slug);
  const detailConfig = getProductDetailConfig(product);
  const heroBackground = product.hero_background_url;
  const heroProduct = product.hero_product_image_url;
  const hasVerifiedComposite = Boolean(product.hero_visual_verified && heroBackground && heroProduct);
  const heroProductIsPhoto = Boolean(heroProduct && /\.(jpe?g|webp)(\?|#|$)/i.test(heroProduct));

  const media = useMemo(() => {
    const items = [
      ...(product.image_url ? [{ type: 'image', url: product.image_url }] : []),
      ...(product.video_url && isVideo(product.video_url)
        ? [{ type: 'video', url: product.video_url, poster: product.image_url, title: `${product.name} – video` }]
        : []),
      ...(product.gallery_urls || [])
        .filter(Boolean)
        .filter(isVideo)
        .map((url, index) => ({ type: 'video', url, poster: product.image_url, title: `${product.name} – video ${index + 1}` })),
      ...(isBendy
        ? [
            { type: 'video', url: VIDEO_ASSETS.heroJicin.src, poster: VIDEO_ASSETS.heroJicin.poster, title: 'BENDY – realizace Jičín' },
            { type: 'video', url: VIDEO_ASSETS.realizaceKlip.src, poster: VIDEO_ASSETS.realizaceKlip.poster, title: 'BENDY – ukázka realizace' },
          ]
        : []),
      ...(product.gallery_urls || [])
        .filter(Boolean)
        .filter((u) => !isVideo(u))
        .map((url) => ({ type: 'image', url })),
    ].filter(Boolean);

    return [...new Map(items.map((item) => [item.url, item])).values()];
  }, [product, isBendy]);

  useEffect(() => {
    setActive(0);
  }, [product.slug]);

  const hero = media[active] || media[0];
  const showVerifiedComposite = hasVerifiedComposite && active === 0;
  const prev = () => setActive((i) => (i - 1 + media.length) % media.length);
  const next = () => setActive((i) => (i + 1) % media.length);

  const featureTiles = [
    { icon: ScanLine, title: 'Vizualizace prostoru', text: 'Uvidíte návrh přímo ve vašem prostředí.' },
    { icon: ShieldCheck, title: 'Česká výroba', text: product.material || 'Nerezové provedení HolmTec.' },
    { icon: Wifi, title: 'Chytré řízení', text: product.power_supply || 'Volitelné scénáře a automatizace.' },
    { icon: Droplets, title: 'Jemná mlha', text: product.micron_size || 'Konfigurace podle prostoru.' },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0A1628]">
      {/* Desktop: two-column — text left, media right */}
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
        {/* Text column */}
        <div className="relative z-10 flex flex-col justify-center px-5 py-12 sm:px-7 sm:py-16 lg:px-10 lg:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-[#22D3EE]" />
            <p className="font-mono text-[11px] uppercase tracking-[.24em] text-[#22D3EE]">{getFamily(product).label} · {getLine(product).label}</p>
          </div>
          <p className="mt-4 font-heading text-sm font-semibold uppercase tracking-[.08em] text-white/60">{product.name}</p>

          <h1 className="mt-5 max-w-[12ch] font-heading text-[clamp(2.25rem,9vw,4rem)] font-bold leading-[.95] tracking-[-.03em] text-white">
            {detailConfig.tagline}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
            <span className="inline-flex items-center gap-2"><Leaf size={14} strokeWidth={1.5} className="text-[#22D3EE]" /> Český návrh a výroba</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={14} strokeWidth={1.5} className="text-[#22D3EE]" /> Nerez AISI 316L</span>
            <span className="inline-flex items-center gap-2"><Sparkles size={14} strokeWidth={1.5} className="text-[#22D3EE]" /> Návrh na míru</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
              className="btn-brand-primary-dark"
            >
              Vizualizovat produkt <ArrowRight size={16} />
            </Link>
            <Link
              to={`/poptavka?produkt=${product.slug}`}
              className="btn-brand-outline-dark"
            >
              Poptat řešení <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Media column */}
        <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px] lg:min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${hero?.type}-${hero?.url}`}
              className="absolute inset-0"
              initial={{ opacity: 0.4, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.3, scale: 1.01 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {showVerifiedComposite ? (
                <>
                  <img
                    src={heroBackground}
                    alt={`${product.name} – vizualizace prostředí`}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/40 via-transparent to-transparent" />
                  {heroProductIsPhoto ? (
                    <img
                      src={heroProduct}
                      alt={`${product.name} – referenční produkt`}
                      className="absolute inset-0 h-full w-full object-cover object-center lg:hidden"
                    />
                  ) : (
                    <img
                      src={heroProduct}
                      alt={`${product.name} – referenční produkt`}
                      className="absolute right-[2%] top-[10%] h-[60%] w-[60%] object-contain object-center drop-shadow-[0_20px_28px_rgba(0,20,35,.3)]"
                      style={{ objectPosition: product.hero_focal_position || 'center bottom' }}
                    />
                  )}
                  {heroProductIsPhoto && (
                    <div className="absolute right-[4%] top-[14%] hidden h-[50%] w-[42%] overflow-hidden border border-white/20 bg-white/80 shadow-[0_20px_60px_rgba(0,15,30,.25)] backdrop-blur-sm lg:block">
                      <img src={heroProduct} alt={`${product.name} – referenční produkt`} className="h-full w-full object-cover object-center" />
                    </div>
                  )}
                </>
              ) : hero?.type === 'video' ? (
                <video
                  src={hero.url}
                  poster={hero.poster}
                  autoPlay muted loop playsInline preload="metadata"
                  className="h-full w-full object-cover object-center"
                />
              ) : hero?.url ? (
                <img
                  src={hero.url}
                  alt={`${product.name} – hlavní vizualizace`}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#0A1628] via-[#0B4F5C] to-[#0A1628]" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Mobile gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent lg:hidden" />

          {/* Gallery button */}
          {hero && (
            <button
              type="button"
              onClick={() => setLightbox(active)}
              className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 border border-white/25 bg-[#0A1628]/60 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-[#0A1628]/80"
            >
              <Play size={12} fill="currentColor" /> Galerie
            </button>
          )}

          {/* Carousel controls */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-between px-5">
              <div className="flex items-center gap-1.5">
                {media.slice(0, 6).map((m, i) => (
                  <button
                    key={`${m.type}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Médium ${i + 1}`}
                    className={`h-2 transition-all ${active === i ? 'w-8 bg-[#22D3EE]' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={prev} aria-label="Předchozí" className="flex h-9 w-9 items-center justify-center border border-white/30 bg-[#0A1628]/60 text-white backdrop-blur-sm transition hover:bg-[#0A1628]/80">
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button type="button" onClick={next} aria-label="Další" className="flex h-9 w-9 items-center justify-center border border-white/30 bg-[#0A1628]/60 text-white backdrop-blur-sm transition hover:bg-[#0A1628]/80">
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature tiles — on dark, hairline borders */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {featureTiles.map((item) => (
              <div key={item.title} className="border border-white/10 bg-white/[.03] p-4 transition-colors hover:border-[#22D3EE]/30 sm:p-5">
                <item.icon size={22} strokeWidth={1.5} className="text-[#22D3EE]" />
                <p className="mt-3 font-heading text-sm font-semibold leading-tight text-white">{item.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-white/50">{item.text}</p>
              </div>
            ))}
          </div>
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % media.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + media.length) % media.length);
    };
    window.addEventListener('keydown', h);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', h);
    };
  }, [media.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#061723]/95 p-4 backdrop-blur-xl" onClick={onClose}>
      <button onClick={onClose} aria-label="Zavřít" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white">
        <X size={22} strokeWidth={1.5} />
      </button>
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {media[idx]?.type === 'video' ? (
            <motion.video
              key={media[idx].url}
              src={media[idx].url}
              poster={media[idx].poster}
              controls
              autoPlay
              className="max-h-[82vh] w-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : (
            <motion.img
              key={media[idx]?.url}
              src={media[idx]?.url}
              alt={`${productName} — foto ${idx + 1}`}
              className="max-h-[82vh] w-full object-contain"
              initial={{ opacity: 0, scale: .98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {media.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-[#061723]/60 text-white backdrop-blur-md transition hover:bg-[#061723]/80">
              <ChevronLeft size={21} strokeWidth={1.5} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % media.length)} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-[#061723]/60 text-white backdrop-blur-md transition hover:bg-[#061723]/80">
              <ChevronRight size={21} strokeWidth={1.5} />
            </button>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[.18em] text-white/50">{idx + 1} / {media.length}</p>
          </>
        )}
      </div>
    </div>
  );
}
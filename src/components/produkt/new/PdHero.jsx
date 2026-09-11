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

function isVideo(url) {
  return typeof url === 'string' && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
}

function FeatureTile({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[22px] border border-white/55 bg-white/88 p-4 shadow-[0_12px_36px_rgba(8,47,79,.10)] backdrop-blur-xl sm:p-5">
      <Icon size={25} strokeWidth={1.75} className="text-[#0B97E8]" />
      <p className="mt-3 font-heading text-[15px] font-bold leading-tight text-[#0A2342] sm:text-base">{title}</p>
      <p className="mt-1 text-[11px] leading-snug text-[#0D2F4F]/58 sm:text-xs">{text}</p>
    </div>
  );
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
    {
      icon: ScanLine,
      title: 'Vizualizace prostoru',
      text: 'Uvidíte návrh přímo ve vašem prostředí.',
    },
    {
      icon: ShieldCheck,
      title: 'Česká výroba',
      text: product.material || 'Nerezové provedení HolmTec.',
    },
    {
      icon: Wifi,
      title: 'Chytré řízení',
      text: product.power_supply || 'Volitelné scénáře a automatizace.',
    },
    {
      icon: Droplets,
      title: 'Jemná mlha',
      text: product.micron_size || 'Konfigurace podle konkrétního prostoru.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#EEF8FD] pt-20 sm:pt-24 lg:pt-0">
      <div className="relative mx-auto min-h-[760px] max-w-[1600px] overflow-hidden bg-[#DDEFF7] lg:min-h-[830px] lg:rounded-b-[34px] xl:min-h-[880px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${hero?.type}-${hero?.url}`}
            className="absolute inset-0"
            initial={{ opacity: 0.45, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.35, scale: 1.01 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {showVerifiedComposite ? (
              <>
                <img
                  src={heroBackground}
                  alt={`${product.name} – vizualizace prostředí`}
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(255,255,255,.18),transparent_34%),linear-gradient(180deg,rgba(3,31,48,.02),rgba(3,31,48,.12))]" />
                {heroProductIsPhoto ? (
                  <>
                    <img
                      src={heroProduct}
                      alt={`${product.name} – referenční produkt`}
                      className="absolute inset-0 h-full w-full object-cover object-center lg:hidden"
                    />
                    <div className="absolute right-[4%] top-[16%] hidden h-[56%] w-[44%] overflow-hidden rounded-[30px] border border-white/55 bg-white/75 shadow-[0_28px_80px_rgba(2,25,42,.22)] backdrop-blur-sm lg:block xl:right-[5%] xl:h-[60%] xl:w-[46%]">
                      <img src={heroProduct} alt={`${product.name} – referenční produkt`} className="h-full w-full object-cover object-center" />
                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/30" />
                    </div>
                  </>
                ) : (
                  <img
                    src={heroProduct}
                    alt={`${product.name} – referenční produkt`}
                    className="absolute right-[-3%] top-[9%] h-[54%] w-[68%] object-contain object-center drop-shadow-[0_28px_32px_rgba(0,30,45,.28)] sm:right-[0%] sm:h-[58%] sm:w-[62%] lg:right-[1%] lg:top-[12%] lg:h-[68%] lg:w-[58%] xl:right-[2%] xl:h-[72%] xl:w-[60%]"
                    style={{ objectPosition: product.hero_focal_position || 'center bottom' }}
                  />
                )}
                <div className="pointer-events-none absolute right-[5%] top-[25%] h-44 w-[48%] rounded-full bg-white/25 blur-3xl lg:h-56" />
                <div className="pointer-events-none absolute bottom-[18%] right-[3%] h-28 w-[52%] rounded-full bg-[#dff8ff]/35 blur-3xl" />
              </>
            ) : hero?.type === 'video' ? (
              <video
                src={hero.url}
                poster={hero.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover object-center"
              />
            ) : hero?.url ? (
              <img
                src={hero.url}
                alt={`${product.name} – hlavní vizualizace`}
                fetchPriority="high"
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_72%_30%,#dff5ff_0%,#bfdfed_38%,#e9f6fb_100%)]" />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,253,255,.98)_0%,rgba(248,253,255,.94)_30%,rgba(248,253,255,.68)_48%,rgba(248,253,255,.18)_70%,rgba(248,253,255,.04)_100%)] max-lg:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.18)_0%,rgba(255,255,255,.12)_38%,rgba(5,28,48,.18)_66%,rgba(5,28,48,.72)_100%)] lg:hidden" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl flex-col px-5 pb-5 pt-9 sm:px-7 lg:min-h-[830px] lg:px-10 lg:pb-8 lg:pt-28 xl:min-h-[880px] xl:px-12">
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[.92fr_1.08fr]">
            <div className="relative z-10 max-w-[650px] self-end pb-7 text-white lg:self-center lg:pb-20 lg:text-[#0A2342]">
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="h-px w-12 bg-[#15A9F4]" />
                <p className="font-mono text-[11px] font-medium uppercase tracking-[.24em] text-[#55C7FF] lg:text-[#0B97E8]">{product.name}</p>
              </div>

              <h1 className="max-w-[11ch] font-heading text-[clamp(2.85rem,12vw,5.2rem)] font-extrabold leading-[.9] tracking-[-.065em] drop-shadow-[0_5px_24px_rgba(0,0,0,.22)] lg:text-[clamp(4rem,6.2vw,6.6rem)] lg:drop-shadow-none">
                {detailConfig.tagline}
              </h1>

              <p className="mt-5 max-w-[34rem] text-[15px] font-medium leading-6 text-white/88 lg:text-lg lg:leading-7 lg:text-[#0D2F4F]/76">
                {detailConfig.intro || product.short_description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
                  className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#0BA4F5] px-7 text-sm font-bold text-white shadow-[0_16px_40px_rgba(11,164,245,.32)] transition hover:-translate-y-0.5 hover:bg-[#0794df]"
                >
                  Vizualizovat produkt <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to={`/poptavka?produkt=${product.slug}`}
                  className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full border border-white/35 bg-white/92 px-7 text-sm font-bold text-[#0A2342] shadow-[0_10px_30px_rgba(7,47,79,.08)] backdrop-blur-xl transition hover:bg-white lg:border-[#0D2F4F]/12"
                >
                  Poptat řešení <ExternalLink size={15} />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/80 lg:text-[#0D2F4F]/62">
                <span className="inline-flex items-center gap-2"><Leaf size={15} className="text-[#36B77C]" /> Český návrh a výroba</span>
                {hasVerifiedComposite && <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#0BA4F5]" /> Produkt podle ověřené reference</span>}
                <span className="hidden sm:inline-flex items-center gap-2"><Sparkles size={15} className="text-[#0BA4F5]" /> Návrh pro konkrétní prostor</span>
              </div>
            </div>

            <div className="pointer-events-none absolute right-5 top-28 hidden max-w-[300px] space-y-3 lg:block xl:right-10 xl:top-32">
              {hasVerifiedComposite && (
                <div className="rounded-[22px] border border-white/45 bg-[#062d3d]/72 px-4 py-3 text-white shadow-[0_18px_50px_rgba(10,35,66,.12)] backdrop-blur-2xl">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#79dcff]">Transparentní vizualizace</p>
                  <p className="mt-1 text-xs font-semibold">Produkt: referenční podklad</p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-white/65">Prostředí: {product.hero_environment || 'návrhová vizualizace'}</p>
                </div>
              )}
              <div className="rounded-[26px] border border-white/40 bg-white/58 px-5 py-4 shadow-[0_18px_50px_rgba(10,35,66,.10)] backdrop-blur-2xl">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4F8FF] text-[#0BA4F5]"><Wifi size={23}/></span>
                  <div>
                    <p className="font-heading text-sm font-bold text-[#0A2342]">Chytré řízení</p>
                    <p className="mt-0.5 text-xs text-[#0D2F4F]/55">čas · teplota · scénáře</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 mt-auto">
            <div className="mb-4 flex items-center justify-between gap-4 lg:mb-5">
              <div className="flex items-center gap-2">
                {media.slice(0, 6).map((m, i) => (
                  <button
                    key={`${m.type}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Zobrazit médium ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${active === i ? 'w-8 bg-[#0BA4F5]' : 'w-2.5 bg-white/60 lg:bg-[#0D2F4F]/20'}`}
                  />
                ))}
              </div>

              {media.length > 1 && (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={prev} aria-label="Předchozí" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/88 text-[#0A2342] shadow-sm backdrop-blur-xl transition hover:bg-white"><ChevronLeft size={20}/></button>
                  <button type="button" onClick={next} aria-label="Další" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/88 text-[#0A2342] shadow-sm backdrop-blur-xl transition hover:bg-white"><ChevronRight size={20}/></button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {featureTiles.map((item) => <FeatureTile key={item.title} {...item} />)}
            </div>
          </div>
        </div>

        {hero && (
          <button
            type="button"
            onClick={() => setLightbox(active)}
            className="absolute bottom-[188px] right-5 z-20 hidden items-center gap-3 rounded-full border border-white/45 bg-black/28 px-4 py-3 text-xs font-semibold text-white backdrop-blur-xl transition hover:bg-black/40 md:flex lg:bottom-[168px] lg:right-10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A2342]"><Play size={14} fill="currentColor" /></span>
            Prohlédnout galerii
          </button>
        )}
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
      <button onClick={onClose} aria-label="Zavřít" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/15 hover:text-white">
        <X size={22} />
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
              className="max-h-[82vh] w-full rounded-2xl object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : (
            <motion.img
              key={media[idx]?.url}
              src={media[idx]?.url}
              alt={`${productName} — foto ${idx + 1}`}
              className="max-h-[82vh] w-full rounded-2xl object-contain"
              initial={{ opacity: 0, scale: .98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {media.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/50"><ChevronLeft size={21}/></button>
            <button onClick={() => setIdx((i) => (i + 1) % media.length)} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/50"><ChevronRight size={21}/></button>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[.18em] text-white/50">{idx + 1} / {media.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  ExternalLink,
  FileText,
  Leaf,
  Play,
  ScanLine,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Wifi,
  X,
} from 'lucide-react';
import { VIDEO_ASSETS, BENDY_SLUGS } from '@/lib/newMedia';
import { getProductDetailConfig } from '@/lib/productDetailConfig';
import { getLine, getFamily } from '@/lib/productFamilies';
import TechnicalBlueprintBackground from '@/components/products/TechnicalBlueprintBackground';

function isVideo(url) {
  return typeof url === 'string' && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
}

const LINEA_HERO_VIDEO = '/media/products/linea/linea-urban-cooling-hero.mp4';
const isLineaProduct = (product) => product?.slug === 'linea-mlzitko';

function getHeroTitle(product, detailConfig) {
  if (detailConfig?.tagline) return detailConfig.tagline;
  return 'Nerezové mlžítko pro prostor, kde chcete zůstat';
}

function getHeroIntro(product, detailConfig) {
  return detailConfig?.intro || product?.short_description || 'Čistý design, jemná vodní mlha a projektové řešení podle konkrétního prostoru.';
}

export default function PdHero({ product }) {
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState(0);
  const isBendy = BENDY_SLUGS.includes(product.slug);
  const detailConfig = getProductDetailConfig(product);
  const family = getFamily(product);
  const line = getLine(product);
  const heroDisplayName = product.name.replace(/^MLŽÍTKO\s+/i, '');
  const heroBackground = product.hero_background_url;
  const heroProduct = product.hero_product_image_url;
  const hasVerifiedComposite = Boolean(product.hero_visual_verified && heroBackground && heroProduct);
  const heroProductIsPhoto = Boolean(heroProduct && /\.(jpe?g|webp|png)(\?|#|$)/i.test(heroProduct));

  const media = useMemo(() => {
    const resolvedVideo = product.video_url || (isLineaProduct(product) ? LINEA_HERO_VIDEO : '');
    const ownVideo = resolvedVideo && isVideo(resolvedVideo)
      ? [{ type: 'video', url: resolvedVideo, poster: product.image_url, title: `${product.name} – ochlazení prostoru` }]
      : [];
    const items = [
      ...(isBendy ? ownVideo : []),
      ...(product.image_url ? [{ type: 'image', url: product.image_url, title: `${product.name} – hlavní fotografie` }] : []),
      ...(isBendy ? [] : ownVideo),
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
        .map((url, index) => ({ type: 'image', url, title: `${product.name} – fotografie ${index + 1}` })),
    ].filter(Boolean);

    return [...new Map(items.map((item) => [item.url, item])).values()];
  }, [product, isBendy]);

  useEffect(() => {
    setActive(0);
  }, [product.slug]);

  const hero = media[active] || media[0];
  const showVerifiedComposite = hasVerifiedComposite && active === 0 && hero?.type === 'image';
  const prev = () => setActive((i) => (i - 1 + media.length) % media.length);
  const next = () => setActive((i) => (i + 1) % media.length);

  const featureTiles = [
    { icon: ThermometerSun, title: 'Pocitové ochlazení', text: 'Navrženo pro horké dny a pobyt lidí venku.' },
    { icon: ShieldCheck, title: 'Nerezová konstrukce', text: product.material || 'Odolné venkovní provedení HolmTec.' },
    { icon: Wifi, title: 'Smart řízení', text: 'Volitelně SUPLA, čas, teplota a provozní scénáře.' },
    { icon: Droplets, title: 'Jemná vodní mlha', text: product.micron_size || 'Konfigurace podle prostoru a typu provozu.' },
  ];

  const heroCallouts = [
    { label: 'MATERIÁL', value: product.material || 'nerez pro venkovní provoz', pos: 'left-5 top-[18%]' },
    { label: 'NAPOJENÍ', value: 'vodovodní řád 3–6 barů dle projektu', pos: 'right-5 top-[28%]' },
    { label: 'ŘÍZENÍ', value: 'SUPLA / čas / teplota', pos: 'left-6 bottom-[232px]' },
  ];

  return (
    <section className="relative overflow-hidden bg-[#07131D] text-white">
      <TechnicalBlueprintBackground product={product} theme="dark" autoRotate />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(34,211,238,.20),transparent_32%),radial-gradient(circle_at_12%_88%,rgba(135,223,207,.14),transparent_36%)]" />

      <div className="relative z-10 mx-auto grid min-h-[86svh] max-w-[1540px] gap-8 px-5 pt-28 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:pt-32 xl:px-20">
        <div className="flex flex-col justify-center pb-10 lg:pb-20">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/48" aria-label="Drobečková navigace produktu">
            <Link to="/mlzidla-mlzitka" className="transition hover:text-[#22D3EE]">Katalog</Link>
            <span>/</span>
            <Link to="/mlzidla-mlzitka#catalog" className="transition hover:text-[#22D3EE]">{family.label}</Link>
            <span>/</span>
            <span className="font-semibold text-[#22D3EE]">{line.label}</span>
          </nav>

          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/12 bg-white/[.045] px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_18px_rgba(34,211,238,.8)]" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-white/68">{family.label} · {line.label}</p>
          </div>

          <p className="mt-7 font-heading text-sm font-bold uppercase tracking-[.12em] text-[#8AEAF5]">{product.name}</p>
          <h1 className="mt-4 max-w-[13ch] font-heading text-[clamp(2.9rem,7.8vw,6.4rem)] font-black leading-[.88] tracking-[-.065em] text-white">
            {getHeroTitle(product, detailConfig)}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            {getHeroIntro(product, detailConfig)}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-white/64">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.045] px-3 py-2"><Leaf size={14} className="text-[#22D3EE]" /> Český návrh a výroba</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.045] px-3 py-2"><ShieldCheck size={14} className="text-[#22D3EE]" /> Nerez pro venkovní provoz</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.045] px-3 py-2"><Sparkles size={14} className="text-[#22D3EE]" /> Návrh do konkrétního místa</span>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#22D3EE] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-[#07131D] shadow-[0_22px_60px_rgba(34,211,238,.24)] transition hover:-translate-y-0.5 hover:bg-white">
              Poptat produkt <ArrowRight size={16} />
            </Link>
            <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/18 bg-white/[.07] px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/[.12]">
              Vizualizace v prostoru <ExternalLink size={15} />
            </Link>
            <Link to="/ke-stazeni" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/12 px-6 py-4 text-sm font-bold text-white/78 transition hover:border-[#22D3EE]/60 hover:text-white">
              Technické podklady <FileText size={15} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-t-[2.5rem] border border-white/10 bg-white/[.035] shadow-[0_30px_100px_rgba(0,0,0,.28)] lg:mb-16 lg:min-h-[640px] lg:rounded-[2.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${hero?.type}-${hero?.url}`}
              className="absolute inset-0"
              initial={{ opacity: 0.35, scale: 1.018 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.25, scale: 1.012 }}
              transition={{ duration: 0.48, ease: 'easeOut' }}
            >
              {showVerifiedComposite ? (
                <>
                  <img src={heroBackground} alt={`${product.name} – vizualizace prostředí`} className="absolute inset-0 h-full w-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/72 via-transparent to-transparent" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2 text-center">
                    <motion.p className="font-heading text-[clamp(4rem,12vw,9rem)] font-black uppercase leading-[.78] tracking-[-.07em] text-white/22" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
                      {heroDisplayName}
                    </motion.p>
                  </div>
                  {heroProductIsPhoto ? (
                    <img src={heroProduct} alt={`${product.name} – referenční produkt`} className="absolute inset-0 z-[2] h-full w-full object-cover object-center lg:hidden" />
                  ) : (
                    <img src={heroProduct} alt={`${product.name} – referenční produkt`} className="absolute right-[2%] top-[10%] z-[2] h-[60%] w-[60%] object-contain object-center drop-shadow-[0_20px_28px_rgba(0,20,35,.3)]" style={{ objectPosition: product.hero_focal_position || 'center bottom' }} />
                  )}
                  {heroProductIsPhoto && (
                    <div className="absolute right-[4%] top-[14%] z-[2] hidden h-[50%] w-[42%] overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/80 shadow-[0_20px_60px_rgba(0,15,30,.25)] backdrop-blur-sm lg:block">
                      <img src={heroProduct} alt={`${product.name} – referenční produkt`} className="h-full w-full object-cover object-center" />
                    </div>
                  )}
                </>
              ) : hero?.type === 'video' ? (
                <video src={hero.url} poster={hero.poster} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover object-center" />
              ) : hero?.url ? (
                <img src={hero.url} alt={`${product.name} – hlavní vizualizace`} className="h-full w-full object-cover object-center" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#0A1628] via-[#0B4F5C] to-[#0A1628]" />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,29,.04)_0%,rgba(7,19,29,.1)_48%,rgba(7,19,29,.86)_100%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-12%] bottom-[-12%] z-[3] h-[34%] opacity-60 blur-2xl" style={{ background: 'radial-gradient(ellipse at 28% 70%, rgba(255,255,255,.72), transparent 42%), radial-gradient(ellipse at 72% 58%, rgba(155,232,242,.6), transparent 38%)' }} />

          <div className="absolute left-5 top-5 z-20 rounded-full border border-white/18 bg-black/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[.18em] text-white/78 backdrop-blur-md">
            {hero?.type === 'video' ? 'Video produktu' : 'Produktový hero'}
          </div>

          {hero && (
            <button type="button" onClick={() => setLightbox(active)} className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/22 bg-black/34 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-black/52">
              <Play size={12} fill="currentColor" /> Galerie
            </button>
          )}

          <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block" aria-hidden="true">
            {heroCallouts.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.46, delay: 0.22 + index * 0.08 }}
                className={`absolute ${item.pos} max-w-[230px] rounded-2xl border border-white/14 bg-black/32 px-4 py-3 text-white shadow-[0_18px_54px_rgba(0,0,0,.25)] backdrop-blur-xl`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#22D3EE]">{item.label}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-white/82">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-20 rounded-[1.5rem] border border-white/12 bg-[#07131D]/70 p-4 backdrop-blur-xl">
            <div className="grid gap-3 sm:grid-cols-4">
              {featureTiles.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[.045] p-3">
                  <item.icon size={18} strokeWidth={1.6} className="text-[#22D3EE]" />
                  <p className="mt-2 font-heading text-sm font-bold leading-tight text-white">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-white/52">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {media.length > 1 && (
            <div className="absolute bottom-[158px] left-5 right-5 z-20 flex items-center justify-between sm:bottom-[142px]">
              <div className="flex items-center gap-1.5">
                {media.slice(0, 6).map((m, i) => (
                  <button key={`${m.type}-${i}`} type="button" onClick={() => setActive(i)} aria-label={`Médium ${i + 1}`} className={`h-2 rounded-full transition-all ${active === i ? 'w-8 bg-[#22D3EE]' : 'w-2 bg-white/34'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={prev} aria-label="Předchozí" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-black/34 text-white backdrop-blur-md transition hover:bg-black/52"><ChevronLeft size={18} strokeWidth={1.5} /></button>
                <button type="button" onClick={next} aria-label="Další" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-black/34 text-white backdrop-blur-md transition hover:bg-black/52"><ChevronRight size={18} strokeWidth={1.5} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#07131D]">
        <div className="mx-auto grid max-w-[1540px] gap-4 px-5 py-7 sm:px-8 lg:grid-cols-4 lg:px-12 xl:px-20">
          <Link to="/mlzidla-mlzitka" className="rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:border-[#22D3EE]/40 hover:bg-white/[.06]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#22D3EE]">Katalog</p><strong className="mt-2 block text-white">Další mlžítka</strong><span className="mt-1 block text-sm text-white/52">Porovnat produkty a kolekce.</span></Link>
          <Link to="/mlzne-brany" className="rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:border-[#22D3EE]/40 hover:bg-white/[.06]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#22D3EE]">Sestavy</p><strong className="mt-2 block text-white">Mlžné brány</strong><span className="mt-1 block text-sm text-white/52">Průchozí ochlazení veřejného prostoru.</span></Link>
          <Link to="/mestske-mlzitka" className="rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:border-[#22D3EE]/40 hover:bg-white/[.06]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#22D3EE]">Města</p><strong className="mt-2 block text-white">Městské ochlazování</strong><span className="mt-1 block text-sm text-white/52">Řešení pro náměstí, parky a školy.</span></Link>
          <Link to="/kontakt" className="rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:border-[#22D3EE]/40 hover:bg-white/[.06]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#22D3EE]">Kontakt</p><strong className="mt-2 block text-white">Konzultace projektu</strong><span className="mt-1 block text-sm text-white/52">Technické dotazy a návrh prostoru.</span></Link>
        </div>
      </div>

      {lightbox !== null && media.length > 0 && (
        <Lightbox media={media} initial={lightbox} productName={product.name} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

function Lightbox({ media, initial, productName, onClose }) {
  const [index, setIndex] = useState(initial);
  const item = media[index] || media[0];
  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const next = () => setIndex((i) => (i + 1) % media.length);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020711]/95 p-4 text-white backdrop-blur-xl" role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20" aria-label="Zavřít galerii"><X size={20} /></button>
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
        <button type="button" onClick={prev} className="mr-3 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20 md:flex" aria-label="Předchozí"><ChevronLeft size={22} /></button>
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/12 bg-white/5">
          {item?.type === 'video' ? (
            <video src={item.url} poster={item.poster} controls autoPlay className="max-h-[82vh] w-full object-contain" />
          ) : (
            <img src={item?.url} alt={`${productName} – galerie`} className="max-h-[82vh] w-full object-contain" />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/78 to-transparent p-5">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#22D3EE]">{index + 1} / {media.length}</p>
            <p className="mt-1 font-heading text-xl font-bold">{item?.title || productName}</p>
          </div>
        </div>
        <button type="button" onClick={next} className="ml-3 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20 md:flex" aria-label="Další"><ChevronRight size={22} /></button>
      </div>
    </div>
  );
}

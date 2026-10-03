import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getStudioMedia } from '@/lib/studioMedia';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { getOptimizedMediaUrl } from '@/lib/optimizedMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const TECHNICAL_RE = /(technick|schema|schéma|vykres|výkres|montaz|montáž|instalac|edraw)/i;
const isImage = (url) => typeof url === 'string' && url && !VIDEO_RE.test(url) && !TECHNICAL_RE.test(url);
const optimize = (url) => (isImage(url) ? getOptimizedMediaUrl(url) : url);

function dedupe(items) {
  return [...new Map(items.filter((item) => item?.url).map((item) => [item.url, item])).values()];
}

function StoryFrame({ item, index, total, progress, productName, onOpen }) {
  const segment = 1 / Math.max(total, 1);
  const enterStart = Math.max(0, index * segment - segment * 0.34);
  const enterEnd = Math.min(0.98, index * segment + segment * 0.05);
  const exitStart = Math.max(enterEnd + 0.01, (index + 1) * segment - segment * 0.20);
  const exitEnd = Math.min(1, (index + 1) * segment);
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const y = useTransform(
    progress,
    isFirst
      ? [0, exitStart, exitEnd]
      : isLast
        ? [enterStart, enterEnd, 1]
        : [enterStart, enterEnd, exitStart, exitEnd],
    isFirst
      ? ['0%', '0%', '-112%']
      : isLast
        ? ['112%', '0%', '0%']
        : ['112%', '0%', '0%', '-112%'],
  );

  const opacity = useTransform(
    progress,
    isFirst
      ? [0, exitStart, exitEnd]
      : isLast
        ? [enterStart, enterEnd, 1]
        : [enterStart, enterEnd, exitStart, exitEnd],
    isFirst
      ? [1, 1, 0]
      : isLast
        ? [0, 1, 1]
        : [0, 1, 1, 0],
  );

  const scale = useTransform(
    progress,
    isFirst
      ? [0, exitStart, exitEnd]
      : isLast
        ? [enterStart, enterEnd, 1]
        : [enterStart, enterEnd, exitStart, exitEnd],
    isFirst
      ? [1, 1, 0.965]
      : isLast
        ? [1.04, 1, 1]
        : [1.04, 1, 1, 0.965],
  );

  return (
    <motion.article
      style={{ y, opacity, scale }}
      className="group absolute inset-0 will-change-transform"
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="relative h-full w-full overflow-hidden bg-[#07131D] text-left"
        aria-label={`Otevřít fotografii ${index + 1} přes celou obrazovku`}
      >
        <motion.img
          src={optimize(item.url)}
          alt={item.alt || `${productName} — fotografie ${index + 1}`}
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035] ${item.fit === 'contain' ? 'object-contain p-6 sm:p-10 lg:p-14' : 'object-cover'}`}
          style={{ objectPosition: item.focal || 'center center' }}
          loading={index < 2 ? 'eager' : 'lazy'}
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,20,.10)_0%,rgba(3,12,20,.05)_48%,rgba(3,12,20,.82)_100%)]" />

        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[.16em] text-cyan-200">{item.badge || 'Galerie'}</span>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-white/80 backdrop-blur-md sm:flex sm:right-6 sm:top-6">
          <Maximize2 size={13} />
          <span className="text-[10px] font-semibold">Otevřít</span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white sm:p-7 lg:p-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-200">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h3 className="mt-2 max-w-3xl font-heading text-2xl font-bold leading-[1.02] tracking-[-.035em] sm:text-3xl lg:text-5xl">
            {item.title || productName}
          </h3>
          {item.caption && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">{item.caption}</p>}
        </div>
      </button>
    </motion.article>
  );
}

function FullscreenViewer({ items, index, productName, onClose, onChange }) {
  const item = items[index];

  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight') onChange((index + 1) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onChange, onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020A11]/96 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} aria-label="Zavřít galerii" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20">
        <X size={20} />
      </button>

      <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={item.url}
            src={optimize(item.url)}
            alt={item.alt || `${productName} — fotografie ${index + 1}`}
            className="max-h-[86vh] w-full rounded-[1.5rem] object-contain"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.985 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          />
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button type="button" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Předchozí fotografie" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#07131D] shadow-xl sm:left-5">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => onChange((index + 1) % items.length)} aria-label="Další fotografie" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#07131D] shadow-xl sm:right-5">
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute bottom-4 left-1/2 w-[min(92vw,760px)] -translate-x-1/2 rounded-[1.25rem] border border-white/12 bg-black/42 px-4 py-3 text-white backdrop-blur-xl sm:bottom-6 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-cyan-200">{index + 1} / {items.length}</p>
          <p className="mt-1 truncate text-sm font-semibold sm:text-base">{item.title || productName}</p>
        </div>
      </div>
    </div>
  );
}

export default function PdScrollGallery({ product }) {
  const sectionRef = useRef(null);
  const [approvedVisuals, setApprovedVisuals] = useState([]);
  const [adminMedia, setAdminMedia] = useState([]);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      base44.entities.VisualizationAsset
        .filter({ product_slug: product.slug, approval_status: 'approved', approved_for_presentation: true }, '-updated_date', 40)
        .catch(() => []),
      base44.entities.MediaFile
        .filter({ product_slug: product.slug }, '-sort_order', 100)
        .catch(() => []),
    ]).then(([visuals, media]) => {
      if (cancelled) return;
      setApprovedVisuals((visuals || []).filter((item) => item?.image_url));
      setAdminMedia((media || []).filter((item) => item?.file_url));
    });
    return () => { cancelled = true; };
  }, [product.slug]);

  const items = useMemo(() => {
    const studio = getStudioMedia(product);
    const curated = getCuratedProductMedia(product);

    const approved = approvedVisuals.map((item) => ({
      url: item.thumbnail_url || item.image_url,
      title: item.title || `${product.name} — vizualizace umístění`,
      caption: [item.environment, item.configuration].filter(Boolean).join(' · '),
      badge: item.is_primary_for_variant ? 'Hlavní vizualizace' : 'Schválená vizualizace',
      fit: 'cover',
    }));

    const admin = adminMedia
      .filter((item) => ['hero', 'gallery', 'detail', 'reference', 'realization'].includes(item.media_role))
      .filter((item) => isImage(item.file_url))
      .map((item) => ({
        url: item.file_url,
        title: item.file_name || `${product.name} — produktová fotografie`,
        caption: item.media_role === 'realization' ? 'Reálná realizace' : 'Produktový detail',
        badge: item.media_role === 'realization' ? 'Realizace' : 'Produkt',
        fit: 'cover',
      }));

    const curatedItems = curated
      .filter((item) => isImage(item.url))
      .map((item) => ({
        url: item.url,
        title: item.title || `${product.name} — ${item.kind === 'visualization' ? 'vizualizace' : 'fotografie'}`,
        caption: item.caption || (item.kind === 'visualization' ? 'Vizualizace umístění' : 'Produktová fotografie'),
        badge: item.kind === 'visualization' ? 'Vizualizace' : 'Fotografie',
        fit: 'cover',
      }));

    const hero = product.hero_visual_verified && isImage(product.hero_product_image_url)
      ? [{
          url: product.hero_product_image_url,
          title: `${product.name} — produkt`,
          caption: 'Schválený produktový vizuál',
          badge: 'Produkt',
          fit: 'contain',
          focal: product.hero_focal_position || 'center center',
        }]
      : [];

    const base = product.image_url && isImage(product.image_url)
      ? [{ url: product.image_url, title: product.name, caption: product.short_description || 'Produktový náhled', badge: 'Produkt', fit: 'cover' }]
      : [];

    const gallery = (product.gallery_urls || [])
      .filter(isImage)
      .map((url, index) => ({
        url,
        title: `${product.name} — fotografie ${index + 1}`,
        caption: 'Produktová fotografie',
        badge: 'Galerie',
        fit: 'cover',
      }));

    const studioItem = studio && isImage(studio)
      ? [{ url: studio, title: `${product.name} — studiový náhled`, caption: 'Studiové zobrazení produktu', badge: 'Studio', fit: 'contain' }]
      : [];

    return dedupe([...approved, ...hero, ...base, ...curatedItems, ...admin, ...studioItem, ...gallery]).slice(0, 10);
  }, [product, approvedVisuals, adminMedia]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!items.length) return;
    const index = Math.min(items.length - 1, Math.floor(Math.min(0.9999, Math.max(0, value)) * items.length));
    setActive(index);
  });

  const shellScale = useTransform(scrollYProgress, [0, 0.05, 0.88, 1], [0.965, 1, 1, 0.90]);
  const shellOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0.72, 1, 1, 0.58]);
  const shellFilter = useTransform(scrollYProgress, [0, 0.06, 0.90, 1], ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(12px)']);
  const shellRadius = useTransform(scrollYProgress, [0, 0.05, 0.90, 1], [28, 0, 0, 32]);

  if (!items.length) return null;

  const storyHeight = Math.max(260, items.length * 96 + 92);

  return (
    <section className="relative bg-[#07131D] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300 sm:text-[11px]">Fotogalerie produktu</p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="max-w-4xl font-heading text-3xl font-bold leading-[1.02] tracking-[-.04em] sm:text-4xl lg:text-6xl">
              Produkt v prostoru. Jeden snímek za druhým.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64 sm:text-base">
              Scrollujte dolů. Každá další fotografie vystoupí odspodu přes celou obrazovku. Kliknutím otevřete aktivní snímek bez rušivých popisků.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[.05] px-4 py-2 text-xs text-white/68 lg:flex">
            <ArrowDown size={14} className="text-cyan-300" />
            Scroll gallery
          </div>
        </div>
      </div>

      <div ref={sectionRef} className="relative" style={{ height: `${storyHeight}svh` }}>
        <motion.div
          style={{ scale: shellScale, opacity: shellOpacity, filter: shellFilter, borderRadius: shellRadius }}
          className="sticky top-0 h-[100svh] overflow-hidden bg-[#07131D] shadow-[0_30px_100px_rgba(0,0,0,.35)] will-change-transform"
        >
          {items.map((item, index) => (
            <StoryFrame
              key={item.url}
              item={item}
              index={index}
              total={items.length}
              progress={scrollYProgress}
              productName={product.name}
              onOpen={setLightbox}
            />
          ))}

          <div className="pointer-events-none absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1.5 sm:left-6">
            {items.map((item, index) => (
              <span
                key={item.url}
                className={`block rounded-full transition-all duration-300 ${active === index ? 'h-8 w-1.5 bg-cyan-300' : 'h-1.5 w-1.5 bg-white/28'}`}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-5 right-5 z-20 rounded-full border border-white/15 bg-black/32 px-3 py-2 font-mono text-[9px] uppercase tracking-[.16em] text-white/72 backdrop-blur-md sm:bottom-6 sm:right-6">
            {active + 1} / {items.length}
          </div>
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 pb-14 pt-8 text-white/48 sm:px-6 lg:px-10 lg:pb-20">
        <p className="text-xs leading-5 sm:text-sm">Po posledním snímku se galerie zmenší a zamlží, aby navázala na technickou část produktu.</p>
        <ArrowDown size={16} className="shrink-0 text-cyan-300" />
      </div>

      {lightbox !== null && (
        <FullscreenViewer
          items={items}
          index={lightbox}
          productName={product.name}
          onClose={() => setLightbox(null)}
          onChange={setLightbox}
        />
      )}
    </section>
  );
}

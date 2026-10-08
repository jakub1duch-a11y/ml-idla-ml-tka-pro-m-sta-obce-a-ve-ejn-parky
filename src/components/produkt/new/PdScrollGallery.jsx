import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getStudioMedia } from '@/lib/studioMedia';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { getOptimizedMediaUrl } from '@/lib/optimizedMedia';
import '@/styles/product-scroll-gallery.css';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const TECHNICAL_RE = /(technick|schema|schéma|vykres|výkres|montaz|montáž|instalac|edraw)/i;
const isImage = (url) => typeof url === 'string' && url && !VIDEO_RE.test(url) && !TECHNICAL_RE.test(url);
const optimize = (url) => isImage(url) ? getOptimizedMediaUrl(url) : url;

gsap.registerPlugin(ScrollTrigger);

function dedupe(items) {
  return [...new Map(items.filter((item) => item?.url).map((item) => [item.url, item])).values()];
}

function StoryFrame({ item, index, total, productName, onOpen, active }) {
  return (
    <article
      className="scroll-photo-frame group absolute inset-0 will-change-transform"
      style={{ zIndex: index + 1 }}
      aria-hidden={active !== index}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        tabIndex={active === index ? 0 : -1}
        className="relative h-full w-full overflow-hidden bg-[#07131D] text-left"
        aria-label={`Otevřít fotografii ${index + 1} přes celou obrazovku`}
      >
        {item.fit === 'contain' && <img src={optimize(item.url)} alt="" aria-hidden="true" className="scroll-photo-backdrop" loading="lazy" />}
        <img
          src={optimize(item.url)}
          alt={item.alt || `${productName} — fotografie ${index + 1}`}
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035] ${item.fit === 'contain' ? 'object-contain p-6 sm:p-10 lg:p-14' : 'object-cover'}`}
          style={{ objectPosition: item.focal || 'center center' }}
          loading={Math.abs(active - index) <= 1 ? 'eager' : 'lazy'}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,20,.10)_0%,rgba(3,12,20,.05)_48%,rgba(3,12,20,.82)_100%)]" />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[.16em] text-cyan-200">{item.badge || 'Galerie'}</span>
        </div>
        <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-white/80 backdrop-blur-md sm:flex sm:right-6 sm:top-6">
          <Maximize2 size={13} /><span className="text-[10px] font-semibold">Otevřít</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white sm:p-7 lg:p-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-200">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <h3 className="mt-2 max-w-3xl font-heading text-2xl font-bold leading-[1.02] tracking-[-.035em] sm:text-3xl lg:text-5xl">{item.title || productName}</h3>
          {item.caption && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">{item.caption}</p>}
        </div>
      </button>
    </article>
  );
}

function FullscreenViewer({ items, index, productName, onClose, onChange }) {
  const item = items[index];
  const dialogRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => { const previous = document.activeElement; dialogRef.current?.querySelector('button')?.focus(); return () => previous?.focus(); }, []);

  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Tab') {
        const nodes = [...dialogRef.current.querySelectorAll('button')];
        const first = nodes[0], last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020A11]/96 p-3 backdrop-blur-xl sm:p-6" ref={dialogRef} role="dialog" aria-modal="true" aria-label={`Fotografie produktu ${productName}`}>
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
            transition={{ duration: reduced ? 0 : 0.28, ease: 'easeOut' }} />
          
        </AnimatePresence>

        {items.length > 1 &&
        <>
            <button type="button" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Předchozí fotografie" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#07131D] shadow-xl sm:left-5">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => onChange((index + 1) % items.length)} aria-label="Další fotografie" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#07131D] shadow-xl sm:right-5">
              <ChevronRight size={22} />
            </button>
          </>
        }

        <div className="pointer-events-none absolute bottom-4 left-1/2 w-[min(92vw,760px)] -translate-x-1/2 rounded-[1.25rem] border border-white/12 bg-black/42 px-4 py-3 text-white backdrop-blur-xl sm:bottom-6 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-cyan-200">{index + 1} / {items.length}</p>
          <p className="mt-1 truncate text-sm font-semibold sm:text-base">{item.title || productName}</p>
        </div>
      </div>
    </div>);

}

export default function PdScrollGallery({ product }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reduced = useReducedMotion();
  const [approvedVisuals, setApprovedVisuals] = useState([]);
  const [adminMedia, setAdminMedia] = useState([]);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setApprovedVisuals([]); setAdminMedia([]); setLightbox(null); setActive(0);
    Promise.all([
    base44.entities.VisualizationAsset.
    filter({ product_slug: product.slug, approval_status: 'approved', approved_for_presentation: true }, '-updated_date', 40).
    catch(() => []),
    base44.entities.MediaFile.
    filter({ product_slug: product.slug }, '-sort_order', 100).
    catch(() => [])]
    ).then(([visuals, media]) => {
      if (cancelled) return;
      setApprovedVisuals((visuals || []).filter((item) => item?.image_url));
      setAdminMedia((media || []).filter((item) => item?.file_url));
    });
    return () => {cancelled = true;};
  }, [product.slug]);

  const items = useMemo(() => {
    const studio = getStudioMedia(product);
    const curated = getCuratedProductMedia(product);

    const approved = approvedVisuals.map((item) => ({
      url: item.image_url,
      title: `${product.name} · ${(item.environment_label || item.space_name || item.environment || 'konkrétní prostor').toString().replace(/[_-]+/g, ' ')}`,
      caption: [item.environment_label || item.space_name || item.environment, item.configuration].filter(Boolean).join(' · '),
      badge: 'Náhled v prostoru',
      fit: 'cover'
    }));

    const admin = adminMedia.
    filter((item) => ['hero', 'gallery', 'detail', 'reference', 'realization'].includes(item.media_role)).
    filter((item) => isImage(item.file_url)).
    map((item) => ({
      url: item.file_url,
      title: `${product.name} — produktová fotografie`,
      caption: item.media_role === 'realization' ? 'Reálná realizace' : 'Produktový detail',
      badge: item.media_role === 'realization' ? 'Realizace' : 'Produkt',
      fit: 'cover'
    }));

    const curatedItems = curated.
    filter((item) => isImage(item.url)).
    map((item) => ({
      url: item.url,
      title: item.title || `${product.name} — ${item.kind === 'visualization' ? 'vizualizace' : 'fotografie'}`,
      caption: item.caption || (item.kind === 'visualization' ? 'Vizualizace umístění' : 'Produktová fotografie'),
      badge: item.kind === 'visualization' ? 'Vizualizace' : 'Fotografie',
      fit: 'cover'
    }));

    const hero = product.hero_visual_verified && isImage(product.hero_product_image_url) ?
    [{
      url: product.hero_product_image_url,
      title: `${product.name} — produkt`,
      caption: 'Schválený produktový vizuál',
      badge: 'Produkt',
      fit: 'contain',
      focal: product.hero_focal_position || 'center center'
    }] :
    [];

    const base = product.image_url && isImage(product.image_url) ?
    [{ url: product.image_url, title: product.name, caption: product.short_description || 'Produktový náhled', badge: 'Produkt', fit: 'cover' }] :
    [];

    const gallery = (product.gallery_urls || []).
    filter(isImage).
    map((url, index) => ({
      url,
      title: `${product.name} — fotografie ${index + 1}`,
      caption: 'Produktová fotografie',
      badge: 'Galerie',
      fit: 'cover'
    }));

    const studioItem = studio && isImage(studio) ?
    [{ url: studio, title: `${product.name} — studiový náhled`, caption: 'Studiové zobrazení produktu', badge: 'Studio', fit: 'contain' }] :
    [];

    return dedupe([...approved, ...hero, ...base, ...curatedItems, ...admin, ...studioItem, ...gallery]).slice(0, 10);
  }, [product, approvedVisuals, adminMedia]);

  useLayoutEffect(() => {
    if (reduced || items.length < 2 || !sectionRef.current || !stageRef.current) return undefined;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    if (!desktop) return undefined;

    const context = gsap.context(() => {
      const frames = gsap.utils.toArray('.scroll-photo-frame', stageRef.current);
      gsap.set(frames, { yPercent: (index) => index === 0 ? 0 : 100, autoAlpha: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            const next = Math.min(items.length - 1, Math.round(trigger.progress * (items.length - 1)));
            setActive((current) => current === next ? current : next);
          },
        },
      });

      frames.slice(1).forEach((frame) => {
        timeline.to(frame, { yPercent: 0, duration: 1, ease: 'none' });
      });
    }, stageRef);

    return () => context.revert();
  }, [items.length, reduced]);

  if (!items.length) return null;

  // Enough scroll room for each image transition, without a long empty tail below the gallery.
  const storyHeight = Math.min(560, Math.max(155, items.length * 58 + 36));

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
              Prohlédněte si celý produkt, jeho detaily a umístění v prostoru. Posouvejte stránku nebo vyberte konkrétní snímek.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[.05] px-4 py-2 text-xs text-white/68 lg:flex">
            <ArrowDown size={14} className="text-cyan-300" />
            Prohlédnout fotografie
          </div>
        </div>
      </div>

      {reduced ? <div className="scroll-photo-static">{items.map((item, index) => <button key={item.url} type="button" onClick={() => setLightbox(index)} aria-label={`Zvětšit fotografii ${index + 1}: ${product.name}`}><img src={optimize(item.url)} alt={item.alt || `${product.name} — fotografie ${index + 1}`} loading="lazy" /><span>{index + 1} / {items.length} · {item.title || product.name}</span></button>)}</div> : <div ref={sectionRef} className="scroll-photo-track" style={{ height: items.length > 1 ? `${storyHeight}svh` : '100svh' }}>
        <div ref={stageRef} className="scroll-photo-stage">
          {items.map((item, index) => <StoryFrame key={item.url} item={item} index={index} total={items.length} productName={product.name} onOpen={setLightbox} active={active} />)}
          <nav className="scroll-photo-nav" aria-label="Vybrat fotografii produktu">{items.map((item, index) => <button type="button" key={item.url} aria-current={active === index ? 'true' : undefined} aria-label={`Přejít na fotografii ${index + 1}`} onClick={() => { const node = sectionRef.current; if (!node) return; const max = node.offsetHeight - window.innerHeight; const progress = index === 0 ? 0 : (index + .6) / items.length; window.scrollTo({ top: window.scrollY + node.getBoundingClientRect().top + max * progress, behavior: 'smooth' }); }}>{index + 1}</button>)}</nav>
          <a className="scroll-photo-skip" href="#parametry">Přejít na parametry ↓</a>
        </div>
      </div>}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 pb-14 pt-8 text-white/48 sm:px-6 lg:px-10 lg:pb-20">
        <p className="text-xs leading-5 sm:text-sm">Prohlédli jste si produkt. Níže najdete parametry, možnosti instalace a ovládání.</p>
        <ArrowDown size={16} className="shrink-0 text-cyan-300" />
      </div>

      {lightbox !== null &&
      <FullscreenViewer
        items={items}
        index={lightbox}
        productName={product.name}
        onClose={() => setLightbox(null)}
        onChange={setLightbox} />

      }
    </section>);

}

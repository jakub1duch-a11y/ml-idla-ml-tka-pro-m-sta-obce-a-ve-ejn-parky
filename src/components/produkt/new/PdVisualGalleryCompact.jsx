import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { getOptimizedMediaUrl } from '@/lib/optimizedMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const TECH_RE = /(technick|schema|schéma|vykres|výkres|montaz|montáž|edraw)/i;
const isImage = (url = '') => Boolean(url && !VIDEO_RE.test(url) && !TECH_RE.test(url));
const optimize = (url) => isImage(url) ? getOptimizedMediaUrl(url) : url;

function dedupe(items) {
  return [...new Map(items.filter((item) => item?.url).map((item) => [item.url, item])).values()];
}

function Fullscreen({ items, index, onClose, onChange, productName }) {
  const item = items[index];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight') onChange((index + 1) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onChange, onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020A11]/96 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} aria-label="Zavřít galerii" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
        <X size={20} />
      </button>
      <img src={optimize(item.url)} alt={item.alt || `${productName} — fotografie ${index + 1}`} className="max-h-[88vh] max-w-[94vw] rounded-[1.5rem] object-contain" />
      {items.length > 1 && (
        <>
          <button type="button" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Předchozí fotografie" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#07131D] sm:left-6">
            <ChevronLeft size={22} />
          </button>
          <button type="button" onClick={() => onChange((index + 1) % items.length)} aria-label="Další fotografie" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#07131D] sm:right-6">
            <ChevronRight size={22} />
          </button>
        </>
      )}
      <div className="pointer-events-none absolute bottom-4 left-1/2 w-[min(90vw,720px)] -translate-x-1/2 rounded-2xl border border-white/12 bg-black/40 px-4 py-3 text-white backdrop-blur-xl">
        <p className="font-mono text-[9px] uppercase tracking-[.16em] text-cyan-200">{index + 1} / {items.length}</p>
        <p className="mt-1 truncate text-sm font-semibold">{item.title || productName}</p>
        {item.caption && <p className="mt-1 truncate text-xs text-white/55">{item.caption}</p>}
      </div>
    </div>
  );
}

export default function PdVisualGalleryCompact({ product }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.MediaFile
      .filter({ product_slug: product.slug }, '-sort_order', 100)
      .then((items = []) => { if (active) setMediaFiles(items || []); })
      .catch(() => { if (active) setMediaFiles([]); });
    return () => { active = false; };
  }, [product.slug]);

  const items = useMemo(() => {
    const admin = mediaFiles
      .filter((item) => ['hero', 'gallery', 'detail', 'reference', 'realization', 'render'].includes(item.media_role))
      .filter((item) => isImage(item.file_url))
      .map((item) => ({
        url: item.file_url,
        title: item.media_role === 'realization' ? 'Reálná realizace' : item.media_role === 'render' ? 'Studiový render' : 'Produktový detail',
        caption: item.media_role === 'realization' ? 'Produkt v reálném prostoru' : 'Detail produktu bez rušivého textu',
        badge: item.media_role === 'realization' ? 'Realizace' : item.media_role === 'render' ? 'Studio' : 'Produkt',
      }));

    const curated = getCuratedProductMedia(product)
      .filter((item) => isImage(item.url))
      .map((item) => ({
        url: item.url,
        title: item.title || product.name,
        caption: item.kind === 'visualization' ? 'Vizualizace umístění' : 'Produktová fotografie',
        badge: item.kind === 'visualization' ? 'Vizualizace' : 'Fotografie',
      }));

    const productItems = [
      product.hero_visual_verified && isImage(product.hero_product_image_url) && {
        url: product.hero_product_image_url,
        title: 'Ověřený produktový vizuál',
        caption: 'Referenční zobrazení skutečného produktu',
        badge: 'Produkt',
      },
      isImage(product.image_url) && {
        url: product.image_url,
        title: product.name,
        caption: 'Hlavní produktová fotografie',
        badge: 'Produkt',
      },
      ...(product.gallery_urls || []).filter(isImage).map((url, index) => ({
        url,
        title: index < 2 ? 'Produkt v detailu' : 'Produkt v prostoru',
        caption: index < 2 ? 'Materiál, tvar a provedení' : 'Příklad použití a měřítka',
        badge: index < 2 ? 'Detail' : 'Galerie',
      })),
    ].filter(Boolean);

    return dedupe([...admin, ...curated, ...productItems]).slice(0, 8);
  }, [mediaFiles, product]);

  if (!items.length) return null;

  return (
    <section id="galerie" className="scroll-mt-24 bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-4 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#0B8EC5]">Galerie produktu</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-[.98] tracking-[-.045em] text-[#07131D] sm:text-4xl lg:text-5xl">
              Tvar. Detail. Reálný prostor.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#5A6B78] lg:justify-self-end">
            Krátká galerie ukazuje produkt z více úhlů bez dlouhého scrollování. Každou fotografii lze otevřít přes celý displej.
          </p>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:gap-4 lg:overflow-visible lg:pb-0">
          {items.slice(0, 6).map((item, index) => {
            const desktop = index === 0
              ? 'lg:col-span-7 lg:row-span-2'
              : index === 1
                ? 'lg:col-span-5 lg:row-span-1'
                : index === 2
                  ? 'lg:col-span-5 lg:row-span-1'
                  : 'lg:hidden';
            return (
              <button
                key={item.url}
                type="button"
                onClick={() => setLightbox(index)}
                className={`group relative min-h-[340px] w-[86vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-[#07131D] text-left sm:w-[64vw] ${desktop}`}
              >
                <img src={optimize(item.url)} alt={`${product.name} — ${item.title}`} loading={index < 2 ? 'eager' : 'lazy'} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/82 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/18 bg-black/28 px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[.18em] text-white/78 backdrop-blur-md">
                  {item.badge}
                </span>
                <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white backdrop-blur-md">
                  <Maximize2 size={15} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <h3 className="font-heading text-xl font-bold tracking-[-.03em] sm:text-2xl">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/62 sm:text-sm">{item.caption}</p>
                </div>
              </button>
            );
          })}
        </div>

        {items.length > 6 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.slice(6).map((item, index) => {
              const realIndex = index + 6;
              return (
                <button key={item.url} type="button" onClick={() => setLightbox(realIndex)} className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#07131D]">
                  <img src={optimize(item.url)} alt={`${product.name} — další fotografie`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/65 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold text-white">{item.badge}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Fullscreen
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

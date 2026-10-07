import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { getOptimizedMediaUrl } from '@/lib/optimizedMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const TECH_RE = /(technick|schema|schéma|vykres|výkres|montaz|montáž|edraw)/i;
const isImage = (url = '') => Boolean(typeof url === 'string' && url && !VIDEO_RE.test(url) && !TECH_RE.test(url));
const optimize = (url) => isImage(url) ? getOptimizedMediaUrl(url) : url;

function dedupe(items) {
  return [...new Map(items.filter((item) => item?.url).map((item) => [optimize(item.url.trim()), item])).values()];
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
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white" aria-live="polite">{index + 1} / {items.length}</p>
    </div>
  );
}

export default function PdVisualGalleryCompact({ product }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let active = true;
    setMediaFiles([]);
    setLightbox(null);
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
      ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : []).filter(isImage).map((url, index) => ({
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
    <section id="galerie" className="scroll-mt-24 !px-0 bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-4 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#0B8EC5]">Galerie produktu</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-black leading-[.98] tracking-[-.045em] text-[#07131D] sm:text-4xl lg:text-5xl">
              Tvar. Detail. Reálný prostor.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#5A6B78] lg:justify-self-end">
            Prohlédněte si produkt zblízka. Klepnutím fotografii zvětšíte na celý displej.
          </p>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:auto-rows-[240px] xl:auto-rows-[280px] lg:gap-4 lg:overflow-visible lg:pb-0">
          {items.slice(0, 3).map((item, index) => {
            const desktop = index === 0
              ? items.length === 1 ? 'lg:col-span-12 lg:row-span-2' : 'lg:col-span-7 lg:row-span-2'
              : index === 1
                ? items.length === 2 ? 'lg:col-span-5 lg:row-span-2' : 'lg:col-span-5 lg:row-span-1'
                : index === 2
                  ? 'lg:col-span-5 lg:row-span-1'
                  : 'lg:hidden';
            return (
              <button
                key={item.url}
                type="button"
                onClick={() => setLightbox(index)}
                aria-label={`Zvětšit fotografii ${index + 1}: ${product.name}`}
                className={`group relative aspect-[4/5] min-w-0 w-[86vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-[#07131D] text-left sm:w-[64vw] lg:aspect-auto lg:w-full ${desktop}`}
              >
                <img src={optimize(item.url)} alt={`${product.name} — ${item.title}`} loading={index < 2 ? 'eager' : 'lazy'} className="absolute inset-0 h-full w-full object-cover transition duration-700 motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none" />
                <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-black/28 text-white backdrop-blur-md">
                  <Maximize2 size={15} />
                </span>

              </button>
            );
          })}
        </div>

        {items.length > 3 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.slice(3).map((item, index) => {
              const realIndex = index + 3;
              return (
                <button key={item.url} type="button" onClick={() => setLightbox(realIndex)} aria-label={`Zvětšit fotografii ${realIndex + 1}: ${product.name}`} className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#07131D]">
                  <img src={optimize(item.url)} alt={`${product.name} — další fotografie`} loading="lazy" className="h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/65 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold text-white">{item.badge}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightbox !== null && items[lightbox] && (
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

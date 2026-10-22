import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const TABS = [
  { key: 'realization', label: 'Realizace', roles: ['realization', 'reference', 'gallery'] },
  { key: 'detail', label: 'Detaily a geometrie', roles: ['detail', 'technology'] },
  { key: 'render', label: 'Vizualizace', roles: ['render'] },
];
const IMG_RE = /^image\//;

export default function PdRealGallery({ product }) {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('realization');
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!product?.slug) return;
    const shown = new Set([product.image_url, ...(product.gallery_urls || [])]);
    base44.entities.MediaFile.filter({ product_slug: product.slug }, { sort: 'sort_order', limit: 60 }).then((page) => {
      setItems((page.items || []).filter((m) => IMG_RE.test(m.file_type || '') && !shown.has(m.file_url)));
    });
  }, [product?.slug]);

  const tabs = TABS.map((t) => ({ ...t, list: items.filter((m) => t.roles.includes(m.media_role)) })).filter((t) => t.list.length);
  if (!tabs.length) return null;
  const current = tabs.find((t) => t.key === tab) || tabs[0];

  return (
    <section className="bg-white px-5 py-16 sm:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-hydro">Další fotografie</p>
        <h2 className="mt-3 max-w-2xl text-ink">{product.name} v reálném prostoru</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${current.key === t.key ? 'border-ink bg-ink text-white' : 'border-slate-200 text-slate-600 hover:border-ink'}`}>
              {t.label} <span className="opacity-60">{t.list.length}</span>
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {current.list.map((m, i) => (
            <button key={m.id} type="button" onClick={() => setOpen(m)}
              className={`group overflow-hidden rounded-2xl bg-mist ${i === 0 ? 'col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto' : 'aspect-square'}`}>
              <img src={m.file_url} alt={m.file_name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div role="dialog" aria-label={open.file_name} onClick={() => setOpen(null)} className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/90 p-4">
          <img src={open.file_url} alt={open.file_name} className="max-h-[88vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  );
}
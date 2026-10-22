import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const VIDEO_RE = /\.(mp4|webm|mov)(\?|$)/i;
const TABS = [
  { key: 'real', label: 'Realizace', test: (t, r) => ['realization', 'reference'].includes(r) || /realiz|reference/.test(t) },
  { key: 'viz', label: 'Vizualizace v prostoru', test: (t, r) => r === 'render' || /viz|render|generated|chatgpt/.test(t) },
  { key: 'studio', label: 'Studio a produkt', test: (t, r) => ['hero', 'gallery'].includes(r) || /studio|produkt|product/.test(t) },
  { key: 'konstrukce', label: 'Detail konstrukce', test: (t, r) => r === 'detail' || /detail|konstruk|svar|tryska|nozzle/.test(t) },
  { key: 'mlha', label: 'Detail mlhy', test: (t) => /mlha|mist|fog/.test(t) },
  { key: 'kotveni', label: 'Kotvení', test: (t, r) => r === 'technology' || /kotv|anchor|patk|instal/.test(t) },
];

export default function PdRealGallery({ product }) {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!product?.slug) return;
    base44.entities.MediaFile.filter({ product_slug: product.slug }, { sort: 'sort_order', limit: 80 }).then((page) => {
      const base = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean).map((url) => ({ id: url, file_url: url, file_name: '', media_role: 'gallery' }));
      const all = [...base, ...(page.items || [])].filter((m) => m.file_url && !VIDEO_RE.test(m.file_url));
      setItems(all.filter((m, i) => all.findIndex((x) => x.file_url === m.file_url) === i));
    });
  }, [product?.slug]);

  const tabs = TABS.map((t) => ({ ...t, list: items.filter((m) => t.test(`${m.file_name} ${m.file_url}`.toLowerCase(), m.media_role)) })).filter((t) => t.list.length);
  if (!items.length) return null;
  const all = { key: 'all', label: 'Vše', list: items };
  const current = [all, ...tabs].find((t) => t.key === tab) || all;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-hydro">Galerie</p>
        <h2 className="mt-3 max-w-2xl text-ink">{product.name} v prostoru i v detailu</h2>
        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[all, ...tabs].map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${current.key === t.key ? 'border-ink bg-ink text-white' : 'border-slate-200 text-slate-600 hover:border-ink'}`}>
              {t.label} <span className="opacity-60">{t.list.length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2 px-2 sm:gap-3 sm:px-3 lg:grid-cols-4">
        {current.list.map((m, i) => (
          <button key={m.id} type="button" onClick={() => setOpen(m)}
            className={`group relative overflow-hidden bg-mist ${i % 7 === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
            <img src={m.file_url} alt={m.file_name || product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {open && (
        <div role="dialog" aria-label="Náhled fotografie" onClick={() => setOpen(null)} className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/90 p-4">
          <img src={open.file_url} alt={open.file_name || product.name} className="max-h-[88vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  );
}
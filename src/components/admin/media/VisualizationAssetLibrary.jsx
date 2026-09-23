import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Filter, ImageIcon, Loader, RefreshCw, ShieldCheck, Star, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS = [
  ['all', 'Vše'],
  ['needs_review', 'K ověření'],
  ['approved', 'Schválené'],
  ['rejected', 'Zamítnuté'],
  ['generated', 'Vygenerované'],
  ['draft', 'Koncepty'],
];

const STATUS_STYLE = {
  approved: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  needs_review: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  generated: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  draft: 'bg-white/5 text-white/45 border-white/10',
  rejected: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
};

export default function VisualizationAssetLibrary() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [status, setStatus] = useState('all');
  const [productSlug, setProductSlug] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [assets, productRows] = await Promise.all([
        base44.entities.VisualizationAsset.list('-created_date', 500).catch(() => []),
        base44.entities.Product.list('name', 300).catch(() => []),
      ]);
      setItems(assets || []);
      setProducts((productRows || []).filter((p) => p?.slug && !p.slug.startsWith('archived-')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    if (status !== 'all' && item.approval_status !== status) return false;
    if (productSlug !== 'all' && item.product_slug !== productSlug) return false;
    return true;
  }), [items, status, productSlug]);

  const counts = useMemo(() => ({
    all: items.length,
    needs_review: items.filter((i) => i.approval_status === 'needs_review').length,
    approved: items.filter((i) => i.approval_status === 'approved').length,
    rejected: items.filter((i) => i.approval_status === 'rejected').length,
  }), [items]);

  const patch = async (item, data) => {
    setBusyId(item.id);
    try {
      await base44.entities.VisualizationAsset.update(item.id, data);
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, ...data } : row));
    } finally {
      setBusyId('');
    }
  };

  const approve = async (item) => {
    setBusyId(item.id);
    try {
      await base44.entities.VisualizationAsset.update(item.id, { approval_status: 'approved', approved_for_presentation: true });
      const existing = await base44.entities.MediaFile.filter({ file_url: item.image_url }).catch(() => []);
      if (!existing?.length) {
        await base44.entities.MediaFile.create({
          file_url: item.image_url,
          file_name: item.title || `${item.product_name || item.product_slug || 'MLŽIDLA'} — schválená vizualizace`,
          file_type: 'image/visualization',
          product_slug: item.product_slug || '',
          media_group: item.product_name || 'VIZUALIZACE',
          media_role: 'render',
          sort_order: Date.now(),
        });
      }
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, approval_status: 'approved', approved_for_presentation: true } : row));
    } finally {
      setBusyId('');
    }
  };

  const reject = async (item) => {
    setBusyId(item.id);
    try {
      await base44.entities.VisualizationAsset.update(item.id, { approval_status: 'rejected', approved_for_presentation: false, is_primary_for_variant: false });
      const publicCopies = await base44.entities.MediaFile.filter({ file_url: item.image_url }).catch(() => []);
      await Promise.all((publicCopies || []).filter((row) => row.media_role === 'render').map((row) => base44.entities.MediaFile.delete(row.id)));
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, approval_status: 'rejected', approved_for_presentation: false, is_primary_for_variant: false } : row));
    } finally {
      setBusyId('');
    }
  };
  const toggleWeb = async (item) => {
    const next = !item.approved_for_presentation;
    setBusyId(item.id);
    try {
      await base44.entities.VisualizationAsset.update(item.id, { approved_for_presentation: next });
      const publicCopies = await base44.entities.MediaFile.filter({ file_url: item.image_url }).catch(() => []);
      if (next && !publicCopies?.length) {
        await base44.entities.MediaFile.create({
          file_url: item.image_url,
          file_name: item.title || `${item.product_name || item.product_slug || 'MLŽIDLA'} — schválená vizualizace`,
          file_type: 'image/visualization',
          product_slug: item.product_slug || '',
          media_group: item.product_name || 'VIZUALIZACE',
          media_role: 'render',
          sort_order: Date.now(),
        });
      }
      if (!next) {
        await Promise.all((publicCopies || []).filter((row) => row.media_role === 'render').map((row) => base44.entities.MediaFile.delete(row.id)));
      }
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, approved_for_presentation: next } : row));
    } finally {
      setBusyId('');
    }
  };
  const togglePrimary = async (item) => {
    const next = !item.is_primary_for_variant;
    setBusyId(item.id);
    try {
      if (next) {
        const siblings = items.filter((row) =>
          row.id !== item.id &&
          row.product_slug === item.product_slug &&
          row.configuration === item.configuration &&
          row.is_primary_for_variant
        );
        await Promise.all(siblings.map((row) => base44.entities.VisualizationAsset.update(row.id, { is_primary_for_variant: false })));
      }
      await base44.entities.VisualizationAsset.update(item.id, { is_primary_for_variant: next });
      setItems((current) => current.map((row) => {
        if (row.id === item.id) return { ...row, is_primary_for_variant: next };
        if (next && row.product_slug === item.product_slug && row.configuration === item.configuration) {
          return { ...row, is_primary_for_variant: false };
        }
        return row;
      }));
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-cyan/15 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.10),transparent_35%),rgba(255,255,255,.025)] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan"><ShieldCheck size={15}/><p className="font-mono text-[10px] uppercase tracking-[.18em]">Produktová galerie · approval gate</p></div>
            <h3 className="mt-2 text-xl font-medium text-white">Vizualizace pro web a marketing</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Na veřejný web se smějí používat pouze výstupy se stavem Schválené a povolením pro prezentaci. MASTER geometrie produktu zůstává povinná.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:border-cyan/30 hover:text-cyan">
            <RefreshCw size={13}/> Obnovit
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['Všechna média', counts.all],
            ['K ověření', counts.needs_review],
            ['Schválená', counts.approved],
            ['Zamítnutá', counts.rejected],
          ].map(([label, value]) => <div key={label} className="rounded-xl border border-white/8 bg-black/10 p-3"><p className="text-xl font-light text-white">{value}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/30">{label}</p></div>)}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[.025] p-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-white/35"><Filter size={14}/><span className="font-mono text-[10px] uppercase tracking-wider">Filtry</span></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-[#111820] px-3 py-2 text-xs text-white">
          {STATUS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={productSlug} onChange={(e) => setProductSlug(e.target.value)} className="min-w-[220px] rounded-xl border border-white/10 bg-[#111820] px-3 py-2 text-xs text-white">
          <option value="all">Všechny produkty</option>
          {products.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
        </select>
        <span className="ml-auto font-mono text-[10px] text-white/30">{filtered.length} výsledků</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-cyan/50" size={24}/></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center"><ImageIcon className="mx-auto text-white/20" size={28}/><p className="mt-3 text-sm text-white/30">Pro zvolený filtr nejsou žádné vizualizace.</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const busy = busyId === item.id;
            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[.025]">
                <div className="relative aspect-[4/3] bg-black/20">
                  <img src={item.thumbnail_url || item.image_url} alt={item.title || item.product_name || 'Vizualizace'} className="h-full w-full object-cover"/>
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-wide ${STATUS_STYLE[item.approval_status] || STATUS_STYLE.draft}`}>{item.approval_status || 'draft'}</span>
                    {item.approved_for_presentation && <span className="rounded-full border border-cyan/20 bg-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-cyan">WEB OK</span>}
                    {item.is_primary_for_variant && <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-amber-200">PRIMARY</span>}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[.14em] text-cyan/75">{item.product_name || item.product_slug}</p>
                  <h4 className="mt-1 line-clamp-1 text-sm font-semibold text-white">{item.title || 'Produktová vizualizace'}</h4>
                  <p className="mt-2 text-xs text-white/35">{item.configuration || 'custom'} · {item.quantity || 1} ks · {item.environment || 'prostředí'}</p>
                  {item.scene_description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/35">{item.scene_description}</p>}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button disabled={busy} onClick={() => approve(item)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/12 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40"><CheckCircle2 size={13}/> Schválit</button>
                    <button disabled={busy} onClick={() => reject(item)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/18 disabled:opacity-40"><XCircle size={13}/> Zamítnout</button>
                    <button disabled={busy || item.approval_status !== 'approved'} onClick={() => toggleWeb(item)} className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-30 ${item.approved_for_presentation ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/10 text-white/45'}`}><ShieldCheck size={13}/>{item.approved_for_presentation ? 'Na webu povoleno' : 'Povolit pro web'}</button>
                    <button disabled={busy || item.approval_status !== 'approved'} onClick={() => togglePrimary(item)} className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-30 ${item.is_primary_for_variant ? 'border-amber-300/30 bg-amber-300/10 text-amber-200' : 'border-white/10 text-white/45'}`}><Star size={13}/>{item.is_primary_for_variant ? 'Primární' : 'Nastavit primární'}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

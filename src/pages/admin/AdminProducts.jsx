import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader, Image, Images, ArrowUp, ArrowDown, Star, Link2, Video, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductAnalyticsPanel from '@/components/admin/products/ProductAnalyticsPanel';

const EMPTY = { name: '', slug: '', short_description: '', description: '', image_url: '', gallery_urls: [], video_url: '', water_consumption: '', micron_size: '', pressure: '', coverage_area: '', material: '', power_supply: '', price_from: '', featured: false };

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState('');

  const load = () => {
    setLoading(true);
    base44.entities.Product.list().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => {load();}, []);

  const startEdit = (p) => {setEditing(p);setForm({ ...EMPTY, ...(p || {}), gallery_urls: Array.isArray(p?.gallery_urls) ? p.gallery_urls : [] });setGalleryUrl('');};
  const startNew = () => {setEditing('new');setForm(EMPTY);setGalleryUrl('');};
  const cancel = () => {setEditing(null);setForm(EMPTY);setGalleryUrl('');};

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const updated = { ...f, [field]: val };
      if (field === 'name' && (!f.slug || f.slug === slugify(f.name))) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const upload = await base44.integrations.Core.UploadFile({ file }).catch(() => null);
    if (upload?.file_url) setForm((f) => ({ ...f, image_url: upload.file_url }));
    setUploading(false);
  };

  const addGalleryUrl = () => {
    const url = galleryUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, gallery_urls: [...(f.gallery_urls || []), url].filter((item, index, arr) => arr.indexOf(item) === index) }));
    setGalleryUrl('');
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setGalleryUploading(true);
    const uploaded = [];
    for (const file of files) {
      const result = await base44.integrations.Core.UploadFile({ file }).catch(() => null);
      if (result?.file_url) uploaded.push(result.file_url);
    }
    if (uploaded.length) {
      setForm((f) => ({ ...f, gallery_urls: [...(f.gallery_urls || []), ...uploaded].filter((item, index, arr) => arr.indexOf(item) === index) }));
    }
    e.target.value = '';
    setGalleryUploading(false);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    const result = await base44.integrations.Core.UploadFile({ file }).catch(() => null);
    if (result?.file_url) setForm((f) => ({ ...f, video_url: result.file_url }));
    e.target.value = '';
    setVideoUploading(false);
  };

  const removeGalleryItem = (index) => setForm((f) => ({ ...f, gallery_urls: (f.gallery_urls || []).filter((_, i) => i !== index) }));

  const moveGalleryItem = (index, direction) => setForm((f) => {
    const items = [...(f.gallery_urls || [])];
    const target = index + direction;
    if (target < 0 || target >= items.length) return f;
    [items[index], items[target]] = [items[target], items[index]];
    return { ...f, gallery_urls: items };
  });

  const setGalleryAsMain = (url) => setForm((f) => ({
    ...f,
    image_url: url,
    gallery_urls: [url, ...(f.gallery_urls || []).filter((item) => item !== url)]
  }));

  const save = async () => {
    setSaving(true);
    if (editing === 'new') {
      await base44.entities.Product.create(form);
    } else {
      await base44.entities.Product.update(editing.id, form);
    }
    setSaving(false);
    cancel();
    load();
  };

  const remove = async (id) => {
    if (!confirm('Opravdu smazat produkt?')) return;
    await base44.entities.Product.delete(id);
    load();
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:border-cyan/40 focus:outline-none';

  if (editing) return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">{editing === 'new' ? 'Nový produkt' : `Editace: ${editing.name}`}</h2>
        <button onClick={cancel} className="text-white/40 hover:text-white"><X size={20} /></button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Název *</label>
            <input value={form.name} onChange={set('name')} placeholder="OSTEV" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Slug *</label>
            <input value={form.slug} onChange={set('slug')} placeholder="ostev-mlzny-strom" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Krátký popis</label>
          <input value={form.short_description} onChange={set('short_description')} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Popis</label>
          <textarea value={form.description} onChange={set('description')} rows={4} className={inputCls + ' resize-none'} />
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Hlavní fotografie</label>
          <div className="flex gap-3 items-start">
            {form.image_url && <img src={form.image_url} alt="" className="w-20 h-14 object-cover rounded-lg border border-white/10" />}
            <div className="flex-1 space-y-2">
              <input value={form.image_url} onChange={set('image_url')} placeholder="URL fotografie" className={inputCls} />
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/40 cursor-pointer hover:text-white hover:border-white/30 transition-all w-fit">
                {uploading ? <Loader size={12} className="animate-spin" /> : <Image size={12} />}
                {uploading ? 'Nahrávám...' : 'Nahrát soubor'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white">
                <Images size={16} className="text-cyan" />
                <h3 className="text-sm font-semibold">Galerie produktu</h3>
              </div>
              <p className="mt-1 text-xs leading-5 text-white/35">Přidávejte fotografie, měňte pořadí a jedním kliknutím nastavte hlavní fotografii produktu.</p>
            </div>
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-4 py-2 text-xs font-semibold text-cyan transition hover:bg-cyan/15">
              {galleryUploading ? <Loader size={13} className="animate-spin" /> : <Plus size={13} />}
              {galleryUploading ? 'Nahrávám…' : 'Nahrát fotografie'}
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
            </label>
          </div>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                value={galleryUrl}
                onChange={(e) => setGalleryUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGalleryUrl(); } }}
                placeholder="Vložit URL fotografie"
                className={`${inputCls} pl-9`}
              />
            </div>
            <button type="button" onClick={addGalleryUrl} disabled={!galleryUrl.trim()} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:border-white/25 hover:text-white disabled:opacity-30">Přidat URL</button>
          </div>

          {(form.gallery_urls || []).length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {(form.gallery_urls || []).map((url, index) => {
                const isMain = form.image_url === url;
                return (
                  <div key={`${url}-${index}`} className={`overflow-hidden rounded-xl border ${isMain ? 'border-cyan/50 bg-cyan/[.05]' : 'border-white/10 bg-black/10'}`}>
                    <div className="relative aspect-[4/3] bg-white/5">
                      <img src={url} alt={`Galerie ${index + 1}`} className="h-full w-full object-contain" />
                      <div className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 font-mono text-[9px] text-white/80">{index + 1}</div>
                      {isMain && <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-cyan px-2 py-1 text-[9px] font-bold text-ink"><Star size={9} fill="currentColor" /> HLAVNÍ</div>}
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-white/10 p-2">
                      <button type="button" onClick={() => setGalleryAsMain(url)} className={`flex-1 rounded-lg px-2 py-2 text-[10px] font-semibold transition ${isMain ? 'bg-cyan/10 text-cyan' : 'bg-white/5 text-white/55 hover:text-white'}`}>{isMain ? 'Hlavní fotografie' : 'Nastavit jako hlavní'}</button>
                      <button type="button" onClick={() => moveGalleryItem(index, -1)} disabled={index === 0} aria-label="Posunout vlevo" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/45 hover:text-white disabled:opacity-20"><ArrowUp size={12} /></button>
                      <button type="button" onClick={() => moveGalleryItem(index, 1)} disabled={index === (form.gallery_urls || []).length - 1} aria-label="Posunout vpravo" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/45 hover:text-white disabled:opacity-20"><ArrowDown size={12} /></button>
                      <button type="button" onClick={() => removeGalleryItem(index)} aria-label="Odebrat fotografii" className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/15 text-red-300/60 hover:border-red-400/35 hover:text-red-300"><Trash2 size={12} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-white/10 text-center">
              <div className="px-4 py-6 text-white/30">
                <Images size={20} className="mx-auto mb-2" />
                <p className="text-xs">Galerie je zatím prázdná.</p>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-white">
            <Video size={16} className="text-cyan" />
            <h3 className="text-sm font-semibold">Video produktu</h3>
          </div>
          <p className="mb-4 text-xs leading-5 text-white/35">Nahrajte produktové video přímo z počítače/telefonu, nebo vložte jeho URL. Po uložení se video zobrazí v detailu produktu.</p>

          {form.video_url && (
            <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <video src={form.video_url} controls playsInline preload="metadata" className="aspect-video w-full bg-black object-contain" />
              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2">
                <span className="truncate font-mono text-[10px] text-white/35">{form.video_url}</span>
                <button type="button" onClick={() => setForm((f) => ({ ...f, video_url: '' }))} className="shrink-0 rounded-lg border border-red-400/15 px-2.5 py-1.5 text-[10px] font-semibold text-red-300/70 hover:border-red-400/35 hover:text-red-300">Odebrat</button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input value={form.video_url || ''} onChange={set('video_url')} placeholder="https://.../video.mp4" className={`${inputCls} pl-9`} />
            </div>
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-cyan/25 bg-cyan/10 px-4 py-2 text-xs font-semibold text-cyan transition hover:bg-cyan/15">
              {videoUploading ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />}
              {videoUploading ? 'Nahrávám video…' : 'Nahrát video'}
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[['coverage_area', 'Výška / rozměry'], ['water_consumption', 'Spotřeba vody'], ['pressure', 'Tlak'], ['micron_size', 'Trysky (μm)'], ['material', 'Materiál'], ['power_supply', 'Napájení']].map(([field, label]) =>
          <div key={field}>
              <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">{label}</label>
              <input value={form[field] || ''} onChange={set(field)} className={inputCls} />
            </div>
          )}
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Cena od (Kč)</label>
            <input type="number" value={form.price_from || ''} onChange={set('price_from')} placeholder="např. 89000" className={inputCls} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input type="checkbox" checked={!!form.featured} onChange={set('featured')} className="rounded" />
          Vybraný produkt (featured)
        </label>
        {editing !== 'new' && editing?.slug && <ProductAnalyticsPanel slug={editing.slug} />}
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving || !form.name || !form.slug}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all disabled:opacity-50">
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Uložit
          </button>
          <button onClick={cancel} className="px-5 py-2.5 border border-white/10 text-white/50 text-sm rounded-full hover:text-white transition-all">Zrušit</button>
        </div>
      </div>
    </div>);


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Produkty ({products.length})</h2>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink font-bold rounded-full hover:bg-cyan/90 transition-all text-2xl">
          <Plus size={14} /> Přidat produkt
        </button>
      </div>
      {loading ?
      <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div> :

      <div className="space-y-2">
          {products.map((p) =>
        <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                <p className="text-white/35 text-xs font-mono truncate">/produkt/{p.slug}</p>
              </div>
              {p.featured && <span className="text-[10px] font-mono text-cyan border border-cyan/30 px-2 py-0.5 rounded-full">Featured</span>}
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

}
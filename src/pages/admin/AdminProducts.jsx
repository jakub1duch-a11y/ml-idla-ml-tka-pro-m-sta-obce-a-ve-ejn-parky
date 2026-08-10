import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader, Image, Link2, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductAnalyticsPanel from '@/components/admin/products/ProductAnalyticsPanel';

const EMPTY = { name: '', slug: '', category_id: '', short_description: '', description: '', image_url: '', gallery_urls: [], video_url: '', water_consumption: '', micron_size: '', pressure: '', coverage_area: '', material: '', power_supply: '', price_from: '', documents_urls: [], featured: false };

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [productItems, categoryItems] = await Promise.all([
        base44.entities.Product.list(),
        base44.entities.ProductCategory.list(),
      ]);
      setProducts(productItems || []);
      setCategories(categoryItems || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {load();}, []);

  const startEdit = (p) => {setEditing(p);setForm({ ...EMPTY, ...p, gallery_urls: p.gallery_urls || [], documents_urls: p.documents_urls || [] });};
  const startNew = () => {setEditing('new');setForm({ ...EMPTY });};
  const cancel = () => {setEditing(null);setForm(EMPTY);};

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

  const handleFileUpload = async (e, field, multiple = false) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of (multiple ? files : files.slice(0, 1))) {
        const result = await base44.integrations.Core.UploadFile({ file }).catch(() => ({}));
        if (result?.file_url) uploaded.push(result.file_url);
      }
      if (uploaded.length) setForm((f) => ({ ...f, [field]: field === 'image_url' ? uploaded[0] : [...(f[field] || []), ...uploaded] }));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addUrl = (field, value) => {
    const url = value.trim();
    if (!url) return;
    setForm((f) => ({ ...f, [field]: [...(f[field] || []), url] }));
  };

  const removeItem = (field, index) => setForm((f) => ({ ...f, [field]: (f[field] || []).filter((_, i) => i !== index) }));

  const moveItem = (field, index, direction) => setForm((f) => {
    const items = [...(f[field] || [])];
    const target = index + direction;
    if (target < 0 || target >= items.length) return f;
    [items[index], items[target]] = [items[target], items[index]];
    return { ...f, [field]: items };
  });

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim() || !form.category_id) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim(),
        price_from: form.price_from === '' ? undefined : Number(form.price_from),
      };
      if (editing === 'new') await base44.entities.Product.create(payload);
      else await base44.entities.Product.update(editing.id, payload);
      cancel();
      await load();
    } finally {
      setSaving(false);
    }
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
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">URL videa (zobrazí se v záložce Video, jen pokud je vyplněno)</label>
          <input value={form.video_url || ''} onChange={set('video_url')} placeholder="https://.../video.mp4" className={inputCls} />
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
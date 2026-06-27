import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Save, X, Trash2, Star, Search, Filter, Image } from 'lucide-react';

const EMPTY = {
  name: '', slug: '', category_id: '', short_description: '', description: '',
  image_url: '', gallery_urls: [], micron_size: '', water_consumption: '',
  material: '', pressure: '', coverage_area: '', power_supply: '', featured: false
};

const SPEC_FIELDS = [
  { field: 'material', label: 'Materiál' },
  { field: 'pressure', label: 'Tlak' },
  { field: 'micron_size', label: 'Micron size' },
  { field: 'water_consumption', label: 'Spotřeba vody' },
  { field: 'coverage_area', label: 'Plocha pokrytí' },
  { field: 'power_supply', label: 'Napájení' },
];

function Field({ label, field, editing, setEditing, type = 'text', rows }) {
  return (
    <div>
      <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={editing[field] || ''} onChange={e => setEditing({ ...editing, [field]: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none resize-none" />
      ) : (
        <input type={type} value={editing[field] || ''} onChange={e => setEditing({ ...editing, [field]: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
      )}
    </div>
  );
}

function GalleryEditor({ editing, setEditing }) {
  const urls = editing.gallery_urls || [];
  const add = () => setEditing({ ...editing, gallery_urls: [...urls, ''] });
  const update = (i, v) => { const a = [...urls]; a[i] = v; setEditing({ ...editing, gallery_urls: a }); };
  const remove = (i) => { const a = urls.filter((_, idx) => idx !== i); setEditing({ ...editing, gallery_urls: a }); };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-mono text-white/40 tracking-widest uppercase">Galerie (URL obrázků)</label>
        <button type="button" onClick={add} className="text-xs text-cyan hover:text-cyan/80 flex items-center gap-1"><Plus size={11} /> Přidat</button>
      </div>
      <div className="space-y-2">
        {urls.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input value={url} onChange={e => update(i, e.target.value)} placeholder={`URL obrázku ${i + 1}`}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 px-2"><X size={14} /></button>
          </div>
        ))}
        {urls.length === 0 && <p className="text-xs text-white/20 italic">Žádné obrázky galerie</p>}
      </div>
    </div>
  );
}

export default function AdminProdukty() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFeatured, setFilterFeatured] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      base44.entities.Product.list(),
      base44.entities.ProductCategory.list(),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        const { id, created_date, updated_date, created_by_id, ...data } = editing;
        await base44.entities.Product.update(editing.id, data);
      } else {
        await base44.entities.Product.create(editing);
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Smazat produkt?')) return;
    await base44.entities.Product.delete(id);
    load();
  };

  const toggleFeatured = async (p) => {
    await base44.entities.Product.update(p.id, { featured: !p.featured });
    load();
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.short_description || '').toLowerCase().includes(search.toLowerCase());
    const matchFeatured = !filterFeatured || p.featured;
    return matchSearch && matchFeatured;
  });

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—';

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">SPRÁVA</p>
          <h1 className="text-2xl font-light text-white">Produkty</h1>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
          <Plus size={16} /> Nový produkt
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hledat produkt..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
        </div>
        <button onClick={() => setFilterFeatured(!filterFeatured)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${filterFeatured ? 'bg-cyan/10 border-cyan/30 text-cyan' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
          <Star size={14} /> Jen zvýrazněné
        </button>
        <span className="text-xs text-white/30 font-mono ml-auto">{filtered.length} / {products.length} produktů</span>
      </div>

      {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-sm">Žádné produkty nenalezeny.</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
              <div className="relative h-36 bg-white/5">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Image size={24} className="text-white/10" /></div>
                }
                {/* Featured toggle */}
                <button onClick={() => toggleFeatured(p)}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${p.featured ? 'bg-cyan text-ink' : 'bg-black/40 text-white/40 hover:text-white'}`}>
                  <Star size={13} fill={p.featured ? 'currentColor' : 'none'} />
                </button>
                {/* Gallery badge */}
                {(p.gallery_urls || []).length > 0 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/60 text-white/60 px-2 py-0.5 rounded-full">
                    +{p.gallery_urls.length} foto
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-medium">{p.name}</h3>
                  <span className="text-[10px] font-mono text-white/30 shrink-0">{getCatName(p.category_id)}</span>
                </div>
                <p className="text-xs text-white/40 mb-1 font-mono">/produkt/{p.slug || '—'}</p>
                <p className="text-xs text-white/40 mb-4 line-clamp-2">{p.short_description}</p>
                {/* Specs mini-grid */}
                {(p.material || p.pressure || p.micron_size) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.material && <span className="text-[10px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded">{p.material}</span>}
                    {p.pressure && <span className="text-[10px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded">{p.pressure}</span>}
                    {p.micron_size && <span className="text-[10px] font-mono bg-cyan/5 text-cyan/60 px-2 py-0.5 rounded">{p.micron_size} µm</span>}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ ...p })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-all">
                    <Edit2 size={12} /> Upravit
                  </button>
                  <button onClick={() => del(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all">
                    <Trash2 size={12} /> Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-8">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-medium">{editing.id ? 'Upravit produkt' : 'Nový produkt'}</h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Název" field="name" editing={editing} setEditing={setEditing} />
                <Field label="Slug (URL)" field="slug" editing={editing} setEditing={setEditing} />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Kategorie</label>
                <select value={editing.category_id || ''} onChange={e => setEditing({ ...editing, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none">
                  <option value="">— Vyberte kategorii —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <Field label="Krátký popis" field="short_description" editing={editing} setEditing={setEditing} />
              <Field label="Popis" field="description" editing={editing} setEditing={setEditing} rows={4} />
              <Field label="Hlavní obrázek (URL)" field="image_url" editing={editing} setEditing={setEditing} />

              {/* Preview */}
              {editing.image_url && (
                <img src={editing.image_url} alt="preview" className="w-full h-32 object-cover rounded-xl border border-white/10" />
              )}

              <GalleryEditor editing={editing} setEditing={setEditing} />

              {/* Technical specs */}
              <div>
                <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-3">Technické specifikace</p>
                <div className="grid grid-cols-2 gap-4">
                  {SPEC_FIELDS.map(({ field, label }) => (
                    <Field key={field} label={label} field={field} editing={editing} setEditing={setEditing} />
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.featured || false}
                  onChange={e => setEditing({ ...editing, featured: e.target.checked })}
                  className="w-4 h-4 accent-cyan" />
                <span className="text-sm text-white/60">Zvýraznit na úvodní stránce</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-50 transition-all">
                <Save size={14} /> {saving ? 'Ukládám...' : 'Uložit'}
              </button>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 bg-white/5 text-white/60 text-sm rounded-full hover:bg-white/10">Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
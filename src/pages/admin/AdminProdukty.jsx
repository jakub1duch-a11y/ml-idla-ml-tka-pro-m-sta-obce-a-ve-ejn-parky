import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Save, X, Trash2, Eye, EyeOff } from 'lucide-react';

const EMPTY = {
  name: '', slug: '', category_id: '', short_description: '', description: '',
  image_url: '', gallery_urls: [], micron_size: '', water_consumption: '',
  material: '', pressure: '', coverage_area: '', power_supply: '', featured: false
};

export default function AdminProdukty() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    base44.entities.Product.list().then(setProducts).finally(() => setLoading(false));
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

  const F = ({ label, field, type = 'text', rows }) => (
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

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">SPRÁVA</p>
          <h1 className="text-2xl font-light text-white">Produkty</h1>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
          <Plus size={16} /> Nový produkt
        </button>
      </div>

      {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-36 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-medium">{p.name}</h3>
                  {p.featured && <span className="text-[10px] font-mono bg-cyan/10 text-cyan px-2 py-0.5 rounded-full">Highlighted</span>}
                </div>
                <p className="text-xs text-white/40 mb-4 line-clamp-2">{p.short_description}</p>
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-10">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-medium">{editing.id ? 'Upravit produkt' : 'Nový produkt'}</h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="Název" field="name" />
                <F label="Slug (URL)" field="slug" />
              </div>
              <F label="Krátký popis" field="short_description" />
              <F label="Popis" field="description" rows={4} />
              <F label="Hlavní obrázek (URL)" field="image_url" />
              <div className="grid grid-cols-2 gap-4">
                <F label="Materiál" field="material" />
                <F label="Tlak" field="pressure" />
                <F label="Micron size" field="micron_size" />
                <F label="Spotřeba vody" field="water_consumption" />
                <F label="Plocha pokrytí" field="coverage_area" />
                <F label="Napájení" field="power_supply" />
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
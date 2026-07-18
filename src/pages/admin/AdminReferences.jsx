import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader, Image, Eye, EyeOff, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EMPTY = { name: '', client: '', location: '', year: new Date().getFullYear(), category: 'mestsky', description: '', image_url: '', video_url: '', source_url: '', product_used: '', featured: false, published: false, show_product_promo: true };

const CATS = [
  { value: 'mestsky', label: 'Městský prostor' },
  { value: 'event', label: 'Event' },
  { value: 'soukromy', label: 'Soukromý' },
  { value: 'prumyslovy', label: 'Průmyslový' },
];

export default function AdminReferences() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.Realizace.list().then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (p) => { setEditing(p); setForm(p); };
  const startNew = () => { setEditing('new'); setForm(EMPTY); };
  const startDuplicate = (p) => {
    const { id, created_date, updated_date, created_by_id, ...rest } = p;
    setEditing('new');
    setForm({ ...rest, name: `${p.name} (kopie)`, published: false });
  };
  const cancel = () => { setEditing(null); };

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file }).catch(() => ({}));
    if (file_url) setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    if (editing === 'new') {
      await base44.entities.Realizace.create(form);
    } else {
      await base44.entities.Realizace.update(editing.id, form);
    }
    setSaving(false);
    cancel();
    load();
  };

  const togglePublished = async (item) => {
    await base44.entities.Realizace.update(item.id, { published: !item.published });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Smazat referenci?')) return;
    await base44.entities.Realizace.delete(id);
    load();
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:border-cyan/40 focus:outline-none';

  if (editing) return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">{editing === 'new' ? 'Nová reference' : `Editace: ${editing.name}`}</h2>
        <button onClick={cancel} className="text-white/40 hover:text-white"><X size={20} /></button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Název projektu *</label>
            <input value={form.name} onChange={set('name')} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Klient</label>
            <input value={form.client || ''} onChange={set('client')} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Lokalita</label>
            <input value={form.location || ''} onChange={set('location')} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Rok</label>
            <input type="number" value={form.year || ''} onChange={set('year')} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Kategorie</label>
            <select value={form.category} onChange={set('category')} className={inputCls + ' cursor-pointer'}>
              {CATS.map(c => <option key={c.value} value={c.value} className="bg-surface">{c.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Popis</label>
          <textarea value={form.description || ''} onChange={set('description')} rows={4} className={inputCls + ' resize-none'} />
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Použitý produkt</label>
          <input value={form.product_used || ''} onChange={set('product_used')} placeholder="OSTEV, MRAK..." className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Video z realizace (URL)</label>
          <input value={form.video_url || ''} onChange={set('video_url')} placeholder="https://.../video.mp4" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Odkaz na sdílení klientem (Facebook/Instagram)</label>
          <input value={form.source_url || ''} onChange={set('source_url')} placeholder="https://www.facebook.com/..." className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Hlavní fotografie</label>
          <div className="flex gap-3 items-start">
            {form.image_url && <img src={form.image_url} alt="" className="w-20 h-14 object-cover rounded-lg border border-white/10" />}
            <div className="flex-1 space-y-2">
              <input value={form.image_url || ''} onChange={set('image_url')} placeholder="URL fotografie" className={inputCls} />
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/40 cursor-pointer hover:text-white hover:border-white/30 transition-all w-fit">
                {uploading ? <Loader size={12} className="animate-spin" /> : <Image size={12} />}
                {uploading ? 'Nahrávám...' : 'Nahrát soubor'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
            <input type="checkbox" checked={!!form.featured} onChange={set('featured')} />
            Featured (na homepage)
          </label>
          <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
            <input type="checkbox" checked={!!form.published} onChange={set('published')} />
            Publikovat (zobrazit na webu)
          </label>
          <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
            <input type="checkbox" checked={form.show_product_promo !== false} onChange={set('show_product_promo')} />
            Zobrazit nabídku BENDY_60
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving || !form.name}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all disabled:opacity-50">
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Uložit
          </button>
          <button onClick={cancel} className="px-5 py-2.5 border border-white/10 text-white/50 text-sm rounded-full hover:text-white transition-all">Zrušit</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Reference ({items.length})</h2>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink text-xs font-bold rounded-full hover:bg-cyan/90 transition-all">
          <Plus size={14} /> Přidat referenci
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all">
              {item.image_url && <img src={item.image_url} alt={item.name} className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <p className="text-white/35 text-xs font-mono">{item.location} · {item.year} · {CATS.find(c => c.value === item.category)?.label}</p>
              </div>
              <button onClick={() => togglePublished(item)} className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${item.published ? 'text-emerald-400 border-emerald-400/30' : 'text-white/30 border-white/10 hover:text-white/60'}`}>
                {item.published ? <Eye size={10} /> : <EyeOff size={10} />}
                {item.published ? 'Pub' : 'Draft'}
              </button>
              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => startDuplicate(item)} title="Duplikovat" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Copy size={13} />
                </button>
                <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-white/25 py-16 text-sm">Žádné reference.</p>}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Folder, Eye, Edit, CheckCircle, Loader, Plus, X, Save, Calendar, MapPin, FileText, Share2, Copy } from 'lucide-react';

const STATUS_MAP = {
  draft: { label: 'Koncept', color: 'bg-slate-500/10 text-slate-400', icon: '📝' },
  sent: { label: 'Odeslána', color: 'bg-blue-500/10 text-blue-400', icon: '📤' },
  approved: { label: 'Odsouhlasena', color: 'bg-green-500/10 text-green-400', icon: '✓' },
  in_production: { label: 'Ve výrobě', color: 'bg-orange-500/10 text-orange-400', icon: '⚙️' },
  ready: { label: 'Hotovo', color: 'bg-cyan/10 text-cyan', icon: '📦' },
  delivered: { label: 'Doručeno', color: 'bg-emerald-500/10 text-emerald-400', icon: '✓✓' },
};

const DELIVERY_METHODS = {
  pickup: 'Vyzvednutí',
  delivery: 'Doručení',
  installation: 'Instalace na místě',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.ProjectOrder.list('-created_date').then(setProjects).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    try {
      const { id, created_date, updated_date, created_by_id, ...data } = editing;
      if (id) {
        await base44.entities.ProjectOrder.update(id, data);
      } else {
        const token = Math.random().toString(36).substr(2, 12);
        await base44.entities.ProjectOrder.create({ ...data, shared_token: token });
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const generateShareUrl = (token) => {
    const url = `${window.location.origin}/project/${token}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">SPRÁVA</p>
          <h1 className="text-2xl font-light text-white">Projekty & Výroba</h1>
        </div>
        <button onClick={() => setEditing({ project_name: '', client_name: '', client_email: '', status: 'draft' })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
          <Plus size={16} /> Nový projekt
        </button>
      </div>

      {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="space-y-3">
          {projects.length === 0 && <div className="text-center py-16 text-white/30 text-sm">Žádné projekty</div>}
          {projects.map(p => {
            const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.draft;
            return (
              <div key={p.id} className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                      <span className="text-white font-medium">{p.project_name}</span>
                    </div>
                    <p className="text-xs text-white/50">{p.client_name} · {p.client_email}</p>
                    {p.total_price && <p className="text-sm text-cyan font-mono mt-1">{p.total_price.toLocaleString('cs-CZ')} Kč</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {p.shared_token && (
                      <button onClick={() => generateShareUrl(p.shared_token)}
                        className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all"
                        title="Kopírovat odkaz pro zákazníka">
                        <Share2 size={14} />
                      </button>
                    )}
                    <button onClick={() => setEditing(p)}
                      className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all">
                      <Edit size={14} />
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                {(p.production_start_date || p.completion_date) && (
                  <div className="px-5 py-3 border-t border-white/5 bg-black/20 space-y-1 text-xs text-white/40">
                    {p.production_start_date && <p>Výroba: {new Date(p.production_start_date).toLocaleDateString('cs-CZ')}</p>}
                    {p.completion_date && <p>Hotovo: {new Date(p.completion_date).toLocaleDateString('cs-CZ')}</p>}
                    {p.delivery_method && <p>Předání: {DELIVERY_METHODS[p.delivery_method] || p.delivery_method}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-8">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-medium">{editing.id ? 'Upravit projekt' : 'Nový projekt'}</h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={editing.project_name || ''} onChange={e => setEditing({ ...editing, project_name: e.target.value })}
                  placeholder="Název projektu *"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
                <input value={editing.quote_number || ''} onChange={e => setEditing({ ...editing, quote_number: e.target.value })}
                  placeholder="Číslo nabídky"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input value={editing.client_name || ''} onChange={e => setEditing({ ...editing, client_name: e.target.value })}
                  placeholder="Jméno klienta *"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
                <input type="email" value={editing.client_email || ''} onChange={e => setEditing({ ...editing, client_email: e.target.value })}
                  placeholder="Email klienta *"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select value={editing.status || 'draft'} onChange={e => setEditing({ ...editing, status: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none">
                  {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={editing.delivery_method || ''} onChange={e => setEditing({ ...editing, delivery_method: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none">
                  <option value="">Způsob předání</option>
                  {Object.entries(DELIVERY_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={editing.production_start_date || ''} onChange={e => setEditing({ ...editing, production_start_date: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
                <input type="date" value={editing.completion_date || ''} onChange={e => setEditing({ ...editing, completion_date: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
              </div>

              <input value={editing.delivery_location || ''} onChange={e => setEditing({ ...editing, delivery_location: e.target.value })}
                placeholder="Místo předání/instalace"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />

              <input type="number" value={editing.total_price || ''} onChange={e => setEditing({ ...editing, total_price: Number(e.target.value) })}
                placeholder="Celková cena (bez DPH)"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />

              <textarea rows={3} value={editing.production_notes || ''} onChange={e => setEditing({ ...editing, production_notes: e.target.value })}
                placeholder="Poznámky k průběhu výroby..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none resize-none" />

              <textarea rows={2} value={editing.special_requirements || ''} onChange={e => setEditing({ ...editing, special_requirements: e.target.value })}
                placeholder="Speciální požadavky..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none resize-none" />
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
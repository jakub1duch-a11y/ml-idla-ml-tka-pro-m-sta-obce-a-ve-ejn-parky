import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Save, X, Trash2, Sparkles, Loader } from 'lucide-react';

const CATS = { inspirace: 'Inspirace', realizace: 'Realizace', technika: 'Technika', novinky: 'Novinky' };
const EMPTY = { title: '', slug: '', category: 'inspirace', perex: '', content: '', image_url: '', published: false, published_date: '', tags: [] };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.BlogPost.list('-created_date').then(setPosts).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        const { id, created_date, updated_date, created_by_id, ...data } = editing;
        await base44.entities.BlogPost.update(editing.id, data);
      } else {
        await base44.entities.BlogPost.create(editing);
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Smazat příspěvek?')) return;
    await base44.entities.BlogPost.delete(id);
    load();
  };

  const generateWithAI = async () => {
    if (!aiPrompt) return;
    setAiGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi copywriter pro českou firmu HolmTec, která vyrábí luxusní mlžné sochy a chladicí instalace z nerezové oceli. 
Napiš blogový článek/inspiraci na téma: "${aiPrompt}".
Styl: profesionální, inspirativní, moderní. Jazyk: čeština. 
Výstup jako JSON s klíči: title (název článku), perex (krátký úvod max 2 věty), content (plný text v markdown, min 300 slov), tags (pole 3-5 tagů).`,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            perex: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      });
      const slug = result.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60) || '';
      setEditing(prev => ({
        ...(prev || { ...EMPTY }),
        title: result.title || '',
        perex: result.perex || '',
        content: result.content || '',
        tags: result.tags || [],
        slug,
      }));
      setShowAiPanel(false);
      setAiPrompt('');
    } finally {
      setAiGenerating(false);
    }
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
          <h1 className="text-2xl font-light text-white">Blog & Inspirace</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAiPanel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium rounded-full hover:bg-indigo-500/30 transition-all">
            <Sparkles size={14} /> Generovat AI
          </button>
          <button onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            <Plus size={16} /> Nový příspěvek
          </button>
        </div>
      </div>

      {/* AI panel */}
      {showAiPanel && (
        <div className="mb-6 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <p className="text-sm text-indigo-300 font-medium mb-3">Generovat příspěvek pomocí AI</p>
          <div className="flex gap-3">
            <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              placeholder="Téma článku (např. 'Mlžné sochy v letních zahradách', 'Ochlazení terasy restaurace')"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-400/40 focus:outline-none"
              onKeyDown={e => e.key === 'Enter' && generateWithAI()} />
            <button onClick={generateWithAI} disabled={aiGenerating || !aiPrompt}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-400 disabled:opacity-50 transition-all whitespace-nowrap">
              {aiGenerating ? <><Loader size={14} className="animate-spin" /> Generuji...</> : <><Sparkles size={14} /> Generovat</>}
            </button>
            <button onClick={() => setShowAiPanel(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>
        </div>
      )}

      {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="space-y-3">
          {posts.length === 0 && <div className="text-center py-16 text-white/30 text-sm">Žádné příspěvky. Vytvořte první nebo vygenerujte pomocí AI.</div>}
          {posts.map(post => (
            <div key={post.id} className="bg-card_bg border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              {post.image_url && <img src={post.image_url} alt={post.title} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded-full">{CATS[post.category]}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                    {post.published ? 'Publikováno' : 'Koncept'}
                  </span>
                </div>
                <h3 className="text-white text-sm font-medium truncate">{post.title}</h3>
                <p className="text-xs text-white/30 truncate mt-0.5">{post.perex}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing({ ...post })}
                  className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => del(post.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-10">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-medium">{editing.id ? 'Upravit příspěvek' : 'Nový příspěvek'}</h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <F label="Název" field="title" />
              <div className="grid grid-cols-2 gap-4">
                <F label="Slug (URL)" field="slug" />
                <div>
                  <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Kategorie</label>
                  <select value={editing.category || 'inspirace'} onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none">
                    {Object.entries(CATS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <F label="Perex (krátký úvod)" field="perex" rows={2} />
              <F label="Obsah (Markdown)" field="content" rows={8} />
              <F label="Obrázek (URL)" field="image_url" />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.published || false}
                    onChange={e => setEditing({ ...editing, published: e.target.checked })} className="w-4 h-4 accent-cyan" />
                  <span className="text-sm text-white/60">Publikovat</span>
                </label>
                <F label="Datum publikace" field="published_date" type="date" />
              </div>
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
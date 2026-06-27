import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Save, X, Trash2, Sparkles, Loader, Wand2, Eye, EyeOff, Shuffle, Image } from 'lucide-react';

const CATS = { inspirace: 'Inspirace', realizace: 'Realizace', technika: 'Technika', novinky: 'Novinky' };

const EMPTY = {
  title: '', slug: '', category: 'inspirace', perex: '', content: '',
  image_url: '', published: false, published_date: '', tags: []
};

// Quick-start AI templates
const AI_TEMPLATES = [
  { label: '🌿 Mlžná socha v parku', prompt: 'Mlžné sochy jako dominanta veřejných parků a náměstí — různé tvary: spirála, mrak, strom, kruh. Estetika, funkce a atmosféra jemné mlhy rozptylující se do okolí.', category: 'inspirace' },
  { label: '🏙️ Mlžná odpočinková zóna', prompt: 'Návrh mlžné odpočinkové zóny v přehřátém městě — mlžítka jemně rozptylující vodní mlhu do okolí, přinášející příjemné ochlazení v horkých dnech. Různé tvary a rozmístění.', category: 'inspirace' },
  { label: '🎪 Event & festival', prompt: 'Mlžné brány a portály na festivalech — WOW efekt pro návštěvníky a nezapomenutelný vstup skrze mlhu', category: 'inspirace' },
  { label: '🏡 Soukromá zahrada', prompt: 'Mlžení pro soukromé zahrady a terasy — mlžítka různých tvarů, luxus, komfort a elegance bez kompromisů', category: 'inspirace' },
  { label: '🔬 Jak mlha funguje', prompt: 'Fyzika mlžení — jak mikro-kapičky 5–10 µm ochlazují vzduch bez pocitu mokra. Různé produkty mlžítek a jejich technické parametry.', category: 'technika' },
  { label: '💡 Inventivní tvary mlžítek', prompt: 'Inspirace pro mlžná mlžítka netradiční tvarů — geometrické formy, abstraktní sochy, vlny, hvězdice. Jak jemná mlha přináší ochlazení a atmosféru.', category: 'inspirace' },
  { label: '🌊 Mlha a mikroklima', prompt: 'Jak mlžné instalace různých tvarů mění mikroklima veřejných prostranství. Vědecké a vizuální vysvětlení ochlazení pomocí jemně rozptýlené vodní mlhy.', category: 'technika' },
  { label: '🏗️ Nová realizace', prompt: 'Úspěšná instalace mlžného systému HolmTec — případová studie projektu pro veřejný prostor s mlžnými sochami', category: 'realizace' },
];

const RANDOM_TOPICS = [
  'Mlžná odpočinková zóna na náměstí — spirálové a kruhové mlžné sochy přinášející jemnou mlhu a ochlazení v horkých dnech',
  'Inventivní tvary mlžítek pro zahrady: vlnité linie, abstraktní formy, minimalistické pruty — jak mlha rozptýlená do okolí mění atmosféru',
  'Mlžítka pro dětská hřiště — bezpečné, hravé tvary z nerezové oceli s jemnou mlhou pro příjemné ochlazení',
  'Mlžné portály a brány jako dominanta vstupu na festival nebo do hotelu — efekt procházení mlhou',
  'Jak kombinovat různé mlžné sochy v jednom prostoru — strom, mrak, linea, aura — pro maximální ochlazení a vizuální dojem',
  'Mlžné instalace na terasách restaurací a kaváren — diskrétní systémy pro příjemné ochlazení hostů',
  'Geometrické mlžné sochy: krystal, duna, silueta — jak abstraktní tvary z nerezové oceli přinášejí mlhu a chlad',
  'Mlžení jako součást smart city — automaticky řízené mlžné zóny reagující na teplotu a počasí',
];

const TONES = [
  { value: 'inspirativni', label: '✨ Inspirativní' },
  { value: 'technicke', label: '🔧 Technické' },
  { value: 'lifestylove', label: '☀️ Lifestyle' },
  { value: 'odborne', label: '📐 Odborné' },
];

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  // AI state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('inspirace');
  const [aiTone, setAiTone] = useState('inspirativni');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [aiImageGenerating, setAiImageGenerating] = useState(false);

  // Content preview in modal
  const [showPreview, setShowPreview] = useState(false);

  const pickRandomTopic = () => {
    const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    setAiPrompt(topic);
    setAiCategory('inspirace');
  };

  const generateImage = async (titleHint) => {
    setAiImageGenerating(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Futuristic stainless steel misting sculpture, ${titleHint || 'urban plaza'}, soft water mist floating in air, industrial minimalist aesthetic, photorealistic, dramatic dark background, cyan mist glow effect, architectural art installation, high-end design photography`,
      });
      setAiPreview(prev => prev ? { ...prev, image_url: result.url } : prev);
    } finally {
      setAiImageGenerating(false);
    }
  };

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

  const generateWithAI = async (promptOverride) => {
    const finalPrompt = promptOverride || aiPrompt;
    if (!finalPrompt) return;
    setAiGenerating(true);
    setAiPreview(null);
    try {
      const toneDesc = {
        inspirativni: 'inspirativní, poetický, emocionální',
        technicke: 'technický, přesný, faktický',
        lifestylove: 'přátelský, lifestyle, čtivý',
        odborne: 'odborný, autoritativní, detailní',
      }[aiTone];

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi expert copywriter pro českou firmu HolmTec, která vyrábí luxusní mlžné sochy a chladicí instalace z nerezové oceli AISI 304/316L.
Napiš ${aiTone === 'technicke' ? 'odborný článek' : 'blogový příspěvek/inspiraci'} na téma: "${finalPrompt}".
Tón: ${toneDesc}. Jazyk: čeština. Kategorie: ${CATS[aiCategory] || aiCategory}.
Výstup jako JSON: title (poutavý název), perex (2 věty max, láká ke čtení), content (plný text markdown, min 400 slov, použij nadpisy ##, odrážky, buď konkrétní a zajímavý), tags (3-5 tagů v češtině).`,
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
      const preview = { ...result, category: aiCategory, slug: slugify(result.title || ''), image_url: '' };
      setAiPreview(preview);
      // Auto-generate image in background
      setAiImageGenerating(true);
      base44.integrations.Core.GenerateImage({
        prompt: `Futuristic stainless steel misting sculpture, ${result.title || 'urban plaza'}, soft water mist floating in air, industrial minimalist aesthetic, photorealistic, dramatic dark background, cyan mist glow, architectural art installation`,
      }).then(img => {
        setAiPreview(prev => prev ? { ...prev, image_url: img.url } : prev);
      }).finally(() => setAiImageGenerating(false));
    } finally {
      setAiGenerating(false);
    }
  };

  const applyAiContent = (saveNow = false) => {
    if (!aiPreview) return;
    const post = { ...EMPTY, ...aiPreview };
    if (saveNow) {
      // Save directly
      base44.entities.BlogPost.create(post).then(() => {
        setAiPreview(null);
        setShowAiGenerator(false);
        load();
      });
    } else {
      setEditing(post);
      setAiPreview(null);
      setShowAiGenerator(false);
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">SPRÁVA</p>
          <h1 className="text-2xl font-light text-white">Blog & Inspirace</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowAiGenerator(!showAiGenerator); setAiPreview(null); }}
            className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-full transition-all ${showAiGenerator ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20'}`}>
            <Sparkles size={14} /> AI Generátor
          </button>
          <button onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 px-4 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            <Plus size={16} /> Nový příspěvek
          </button>
        </div>
      </div>

      {/* ── AI GENERATOR PANEL ─────────────────────────────────────────────── */}
      {showAiGenerator && (
        <div className="mb-6 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-indigo-500/10">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 size={16} className="text-indigo-400" />
              <p className="text-sm text-indigo-200 font-medium">AI Generátor obsahu</p>
            </div>

            {/* Quick templates */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/30 font-mono tracking-widest uppercase">Rychlé šablony</p>
                <button onClick={() => { pickRandomTopic(); }} disabled={aiGenerating}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/30 disabled:opacity-40 transition-all">
                  <Shuffle size={11} /> Náhodné téma
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_TEMPLATES.map(t => (
                  <button key={t.label} onClick={() => { setAiPrompt(t.prompt); setAiCategory(t.category); generateWithAI(t.prompt); }}
                    disabled={aiGenerating}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-indigo-500/20 hover:border-indigo-400/30 hover:text-indigo-200 transition-all disabled:opacity-40">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom prompt */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/30 font-mono tracking-widest uppercase mb-2">Nebo zadejte vlastní téma</p>
                <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Téma článku (např. 'Mlžné sochy na dětských hřištích v létě')"
                  onKeyDown={e => e.key === 'Enter' && generateWithAI()}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-400/40 focus:outline-none placeholder-white/20" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-xs text-white/30 mb-1.5">Kategorie</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.entries(CATS).map(([v, l]) => (
                      <button key={v} onClick={() => setAiCategory(v)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${aiCategory === v ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30 mb-1.5">Tón</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {TONES.map(t => (
                      <button key={t.value} onClick={() => setAiTone(t.value)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${aiTone === t.value ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => generateWithAI()} disabled={aiGenerating || !aiPrompt}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-400 disabled:opacity-40 transition-all">
                {aiGenerating ? <><Loader size={14} className="animate-spin" /> Generuji článek...</> : <><Sparkles size={14} /> Generovat</>}
              </button>
            </div>
          </div>

          {/* AI Preview */}
          {aiGenerating && (
            <div className="p-8 flex items-center justify-center gap-3 text-indigo-300/60">
              <Loader size={20} className="animate-spin" />
              <span className="text-sm">AI píše váš článek...</span>
            </div>
          )}

          {aiPreview && !aiGenerating && (
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Náhled vygenerovaného obsahu</span>
                <button onClick={() => setShowPreview(!showPreview)} className="ml-auto text-xs text-white/30 hover:text-white flex items-center gap-1">
                  {showPreview ? <><EyeOff size={12} /> Skrýt</> : <><Eye size={12} /> Zobrazit obsah</>}
                </button>
              </div>
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <div className="flex gap-4">
                  {/* AI Generated Image */}
                  <div className="w-28 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                    {aiImageGenerating ? (
                      <div className="flex flex-col items-center gap-1">
                        <Loader size={14} className="animate-spin text-indigo-400" />
                        <span className="text-[9px] text-white/30">Generuji...</span>
                      </div>
                    ) : aiPreview.image_url ? (
                      <img src={aiPreview.image_url} alt="AI" className="w-full h-full object-cover" />
                    ) : (
                      <Image size={18} className="text-white/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm mb-1">{aiPreview.title}</p>
                    <p className="text-white/50 text-xs mb-2">{aiPreview.perex}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(aiPreview.tags || []).map(tag => (
                        <span key={tag} className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {showPreview && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {aiPreview.content}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => applyAiContent(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-400 transition-all">
                  <Edit2 size={13} /> Upravit před uložením
                </button>
                <button onClick={() => applyAiContent(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-all">
                  <Save size={13} /> Uložit jako koncept
                </button>
                <button onClick={() => generateWithAI()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/50 text-sm rounded-full hover:bg-white/10 transition-all">
                  <Sparkles size={13} /> Znovu generovat
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post list */}
      {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="space-y-3">
          {posts.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">
              <Sparkles size={24} className="mx-auto mb-3 text-white/10" />
              Žádné příspěvky. Klikněte na <strong className="text-white/50">AI Generátor</strong> a vytvořte první článek za pár sekund.
            </div>
          )}
          {posts.map(post => (
            <div key={post.id} className="bg-card_bg border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              {post.image_url && <img src={post.image_url} alt={post.title} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />}
              {!post.image_url && (
                <div className="w-20 h-14 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center">
                  <Sparkles size={16} className="text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded-full">{CATS[post.category]}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                    {post.published ? 'Publikováno' : 'Koncept'}
                  </span>
                  {(post.tags || []).slice(0, 2).map(t => (
                    <span key={t} className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300/60 px-2 py-0.5 rounded-full hidden sm:inline">{t}</span>
                  ))}
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-8">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-medium">{editing.id ? 'Upravit příspěvek' : 'Nový příspěvek'}</h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>

            {/* Quick AI regenerate inside modal */}
            {!editing.id && (
              <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
                <Wand2 size={14} className="text-indigo-400 flex-shrink-0" />
                <p className="text-xs text-indigo-300/70 flex-1">Obsah byl vygenerován AI. Upravte dle potřeby nebo uložte rovnou.</p>
              </div>
            )}

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
              <F label="Obsah (Markdown)" field="content" rows={10} />
              <F label="Obrázek (URL)" field="image_url" />
              {editing.image_url && (
                <img src={editing.image_url} alt="preview" className="w-full h-32 object-cover rounded-xl border border-white/10" />
              )}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.published || false}
                    onChange={e => setEditing({ ...editing, published: e.target.checked })} className="w-4 h-4 accent-cyan" />
                  <span className="text-sm text-white/60">Publikovat</span>
                </label>
                <div className="flex-1">
                  <F label="Datum publikace" field="published_date" type="date" />
                </div>
              </div>
              {/* Tags */}
              <div>
                <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Tagy (oddělené čárkou)</label>
                <input value={(editing.tags || []).join(', ')}
                  onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="mlžení, design, zahrada"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-50 transition-all">
                <Save size={14} /> {saving ? 'Ukládám...' : 'Uložit'}
              </button>
              <button onClick={() => { setEditing({ ...editing, published: true }); setTimeout(save, 100); }}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm rounded-full hover:bg-emerald-500/30 disabled:opacity-50 transition-all">
                Uložit & Publikovat
              </button>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 bg-white/5 text-white/60 text-sm rounded-full hover:bg-white/10">Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useMemo, useState } from 'react';
import { Trash2, Sparkles, Send, Loader, Pencil, CalendarDays, ListTodo, ImageIcon, X, Save, RefreshCw, Clock3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MarketingPostPreview from './MarketingPostPreview';

const STATUS_COLOR = { draft: 'text-white/50 border-white/15 bg-white/5', scheduled: 'text-amber-300 border-amber-400/30 bg-amber-400/10', published: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' };
const STATUS_LABEL = { draft: 'Koncept', scheduled: 'Naplánováno', published: 'Publikováno' };
const PLATFORM_LABEL = { instagram:'Instagram', facebook:'Facebook', google_ads:'Google Ads', blog:'Web / článek' };
const INPUT = 'w-full rounded-xl border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan/30';

export default function ContentPlanList({ posts, onChange }) {
  const [publishingId, setPublishingId] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState('');
  const [taskingId, setTaskingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => posts.filter(p => filter === 'all' || p.platform === filter), [posts, filter]);

  const setStatus = async (id, status) => { await base44.entities.MarketingPost.update(id, { status }); onChange(); };
  const remove = async (id) => { if (!confirm('Smazat tuto marketingovou položku?')) return; await base44.entities.MarketingPost.delete(id); onChange(); };
  const publishNow = async (post) => {
    setError(''); setPublishingId(post.id);
    try {
      if (post.platform === 'instagram') await base44.functions.invoke('publishInstagramPost', { postId: post.id });
      else await base44.entities.MarketingPost.update(post.id, { status: 'published', published_at: new Date().toISOString() });
      onChange();
    } catch (err) { setError(err?.response?.data?.error?.error_message || 'Publikace se nezdařila. U kanálu bez přímého publisheru byla zachována bezpečná kontrola stavu.'); }
    finally { setPublishingId(null); }
  };

  const edit = (post) => { setEditing(post); setForm({ ...post, scheduled_date: post.scheduled_date ? String(post.scheduled_date).slice(0,16) : '' }); };
  const save = async () => { if (!editing || !form) return; setSaving(true); try { await base44.entities.MarketingPost.update(editing.id, { title: form.title, platform: form.platform, caption: form.caption, image_url: form.image_url, video_url: form.video_url, scheduled_date: form.scheduled_date || null, status: form.scheduled_date && form.status === 'draft' ? 'scheduled' : form.status, cta_label: form.cta_label, cta_url: form.cta_url, visual_prompt: form.visual_prompt, post_format: form.post_format }); setEditing(null); setForm(null); onChange(); } finally { setSaving(false); } };

  const regenerateCaption = async () => {
    if (!form?.title) return; setGenerating('caption');
    try {
      const res = await base44.integrations.Core.InvokeLLM({ prompt: `Vytvoř finální český marketingový text značky MLŽIDLA® pro kanál ${PLATFORM_LABEL[form.platform] || form.platform}. Téma: ${form.title}. Zachovej technickou přesnost, nepoužívej neověřené hodnoty ochlazení. Cíl: města, obce, architekti a kvalitní venkovní projekty. Text musí odpovídat reálnému formátu daného kanálu, mít jasný hook, konkrétní přínos a CTA na mlzidla.cz/poptavka. Původní text pro kontext: ${form.caption || ''}` });
      setForm(f => ({ ...f, caption: typeof res === 'string' ? res : JSON.stringify(res) }));
    } finally { setGenerating(''); }
  };

  const regenerateImage = async () => {
    if (!form?.title) return; setGenerating('image');
    try {
      const ratio = form.platform === 'instagram' ? 'čtvercová 1:1 kompozice' : form.platform === 'blog' ? 'široká 16:9 editorial kompozice' : 'široká reklamní 1.91:1 kompozice';
      const res = await base44.integrations.Core.GenerateImage({ prompt: `Prémiový fotorealistický marketingový vizuál MLŽIDLA® k tématu „${form.title}“. ${ratio}. Moderní český nebo evropský veřejný prostor, skutečně působící nerezové mlžítko, jemná průsvitná mlha unášená větrem, přirození lidé pro měřítko, čistá architektura, bez generického stock vzhledu, bez vodoznaku, bez textu v obraze. Brand feeling: bílá, deep steel, mist aqua, technicko-architektonický B2B. ${form.visual_prompt || ''}` });
      if (res?.url) setForm(f => ({ ...f, image_url: res.url, ai_generated: true }));
    } finally { setGenerating(''); }
  };

  const createTask = async (post) => {
    setTaskingId(post.id);
    try {
      await base44.entities.AdminTask.create({ title: `Marketing · ${post.title}`, description: `Připravit, zkontrolovat a dokončit marketingový výstup pro ${PLATFORM_LABEL[post.platform] || post.platform}.\n\n${post.caption || ''}`, status: post.status === 'published' ? 'completed' : 'planned', priority: 'normal', area: 'marketing', subtype: post.platform === 'google_ads' ? 'Google Ads kreativa' : `${PLATFORM_LABEL[post.platform] || post.platform} obsah`, tool: post.ai_generated ? 'ChatGPT + Base44' : 'Marketing Hub', connector: post.platform, assignee_email: 'jakub1duch@gmail.com', assignee_name: 'Jakub Duch', creator_email: 'jakub1duch@gmail.com', creator_name: 'Jakub Duch', reviewer_email: 'meduna@holmtec.cz', reviewer_name: 'Radek Meduna', related_type: 'MarketingPost', related_id: post.id, related_label: post.title, related_url: '', handoff_note: 'Marketingový výstup je propojen s Marketing Hubem a lze jej upravit před publikací.', source: post.ai_generated ? 'chatgpt' : 'manual', estimated_hours: 0.75, actual_hours: null, tags: ['marketing', post.platform] });
    } finally { setTaskingId(null); }
  };

  if (posts.length === 0) return <p className="text-white/25 text-sm py-8 text-center">Zatím žádné naplánované příspěvky.</p>;

  return <div className="space-y-5">
    {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">{error}</p>}
    <div className="flex flex-wrap gap-2">{[['all','Vše'],['instagram','Instagram'],['facebook','Facebook'],['google_ads','Google Ads'],['blog','Web']].map(([k,l]) => <button key={k} onClick={()=>setFilter(k)} className={`rounded-full px-3 py-1.5 text-[11px] font-mono ${filter===k?'bg-cyan text-slate-950':'border border-white/10 text-white/40 hover:text-white'}`}>{l}</button>)}</div>
    <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {filtered.map(p => <div key={p.id} className="rounded-2xl border border-white/8 bg-white/[.025] p-3">
        <MarketingPostPreview post={p} compact />
        <div className="mt-3 flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-semibold text-white">{p.title}</p>{p.ai_generated && <Sparkles size={12} className="shrink-0 text-cyan"/>}</div><p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] text-white/30"><span>{PLATFORM_LABEL[p.platform] || p.platform}</span>{p.scheduled_date ? <span className="inline-flex items-center gap-1"><CalendarDays size={10}/>{new Date(p.scheduled_date).toLocaleString('cs-CZ')}</span>:null}</p></div><select value={p.status} onChange={e=>setStatus(p.id,e.target.value)} className={`rounded-full border bg-transparent px-2 py-1 text-[10px] font-mono ${STATUS_COLOR[p.status] || STATUS_COLOR.draft}`}>{Object.entries(STATUS_LABEL).map(([k,v])=><option key={k} value={k} className="bg-slate-950 text-white">{v}</option>)}</select></div>
        <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>edit(p)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white"><Pencil size={12}/> Upravit</button><button onClick={()=>createTask(p)} disabled={taskingId===p.id} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs text-violet-300 disabled:opacity-50">{taskingId===p.id?<Loader size={12} className="animate-spin"/>:<ListTodo size={12}/>} Do úkolů</button>{p.status!=='published' && <button onClick={()=>publishNow(p)} disabled={publishingId===p.id} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50">{publishingId===p.id?<Loader size={12} className="animate-spin"/>:<Send size={12}/>} {p.platform==='instagram'?'Publikovat':'Označit / publikovat'}</button>}<button onClick={()=>remove(p.id)} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-400/15 px-3 py-2 text-xs text-red-300/70 hover:bg-red-400/10"><Trash2 size={12}/> Smazat</button></div>
      </div>)}
    </div>

    {editing && form && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="grid max-h-[94vh] w-full max-w-6xl gap-5 overflow-auto rounded-3xl border border-white/10 bg-[#0d1117] p-5 lg:grid-cols-[1fr_.85fr]"><div><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Editor marketingového výstupu</p><h3 className="mt-1 text-xl font-medium text-white">{form.title}</h3></div><button onClick={()=>setEditing(null)} className="text-white/30 hover:text-white"><X size={18}/></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="sm:col-span-2 text-xs text-white/35">Název<input className={`${INPUT} mt-1`} value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></label><label className="text-xs text-white/35">Kanál<select className={`${INPUT} mt-1`} value={form.platform||'instagram'} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="google_ads">Google Ads</option><option value="blog">Web / článek</option></select></label><label className="text-xs text-white/35">Formát<select className={`${INPUT} mt-1`} value={form.post_format||'feed'} onChange={e=>setForm(f=>({...f,post_format:e.target.value}))}><option value="feed">Feed</option><option value="reel">Reel / video</option><option value="story">Story</option><option value="article">Článek</option><option value="display">Display reklama</option></select></label><label className="sm:col-span-2 text-xs text-white/35">Text<textarea rows={8} className={`${INPUT} mt-1 resize-none`} value={form.caption||''} onChange={e=>setForm(f=>({...f,caption:e.target.value}))}/></label><label className="sm:col-span-2 text-xs text-white/35">Vizuální prompt<textarea rows={2} className={`${INPUT} mt-1 resize-none`} value={form.visual_prompt||''} onChange={e=>setForm(f=>({...f,visual_prompt:e.target.value}))}/></label><label className="sm:col-span-2 text-xs text-white/35">URL obrázku<input className={`${INPUT} mt-1`} value={form.image_url||''} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))}/></label><label className="sm:col-span-2 text-xs text-white/35">URL videa<input className={`${INPUT} mt-1`} value={form.video_url||''} onChange={e=>setForm(f=>({...f,video_url:e.target.value}))}/></label><label className="text-xs text-white/35">CTA<input className={`${INPUT} mt-1`} value={form.cta_label||''} onChange={e=>setForm(f=>({...f,cta_label:e.target.value}))}/></label><label className="text-xs text-white/35">CTA URL<input className={`${INPUT} mt-1`} value={form.cta_url||''} onChange={e=>setForm(f=>({...f,cta_url:e.target.value}))}/></label><label className="sm:col-span-2 text-xs text-white/35">Naplánovat<input type="datetime-local" className={`${INPUT} mt-1`} value={form.scheduled_date||''} onChange={e=>setForm(f=>({...f,scheduled_date:e.target.value,status:e.target.value?'scheduled':f.status}))}/></label></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={regenerateCaption} disabled={!!generating} className="inline-flex items-center gap-2 rounded-full border border-cyan/25 px-3 py-2 text-xs text-cyan disabled:opacity-40">{generating==='caption'?<Loader size={12} className="animate-spin"/>:<RefreshCw size={12}/>} Nový text</button><button onClick={regenerateImage} disabled={!!generating} className="inline-flex items-center gap-2 rounded-full border border-cyan/25 px-3 py-2 text-xs text-cyan disabled:opacity-40">{generating==='image'?<Loader size={12} className="animate-spin"/>:<ImageIcon size={12}/>} Nový obrázek</button><button onClick={save} disabled={saving} className="ml-auto inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50">{saving?<Loader size={12} className="animate-spin"/>:<Save size={12}/>} Uložit změny</button></div></div><div className="lg:sticky lg:top-0 lg:self-start"><p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Živý náhled kanálu</p><MarketingPostPreview post={form}/><div className="mt-3 rounded-xl border border-white/8 bg-white/3 p-3 text-xs text-white/35"><Clock3 size={12} className="mb-2 text-amber-300"/>Náhled simuluje reálnější podobu feedu, reklamního bloku nebo webového článku. Finální platforma může drobně měnit ořezy a typografii.</div></div></div></div>}
  </div>;
}
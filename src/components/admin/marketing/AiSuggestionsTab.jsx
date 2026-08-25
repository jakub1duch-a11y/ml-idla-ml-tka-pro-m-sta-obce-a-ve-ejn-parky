import React, { useState } from 'react';
import { Loader, Sparkles, CalendarPlus, ListTodo, Send, WandSparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MarketingPostPreview from './MarketingPostPreview';

const PRIORITY = { vysoká: 'text-red-300 border-red-400/30 bg-red-400/10', střední: 'text-amber-300 border-amber-400/30 bg-amber-400/10', nízká: 'text-white/50 border-white/15 bg-white/5' };
const PLATFORM = { instagram:'Instagram', facebook:'Facebook', google_ads:'Google Ads', blog:'Web / článek' };

export default function AiSuggestionsTab({ onPlanCreated }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');

  const generate = async () => {
    setLoading(true); setMessage('');
    try {
      const [products, inquiries, posts] = await Promise.all([
        base44.entities.Product.list(),
        base44.entities.ContactInquiry.list('-created_date', 30),
        base44.entities.MarketingPost.list('-created_date', 30),
      ]);
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi seniorní marketingový stratég pro MLŽIDLA.cz. Navrhni 6 konkrétních akcí, které lze opravdu vykonat v Marketing Hubu. Vybírej mezi platformami instagram, facebook, google_ads a blog. U každé navrhni realistický formát, stručný finální text/caption, CTA a vizuální prompt. Nevymýšlej neověřené technické hodnoty. Produkty v katalogu: ${products.length}. Poptávky za 30 dní: ${inquiries.length}. Existující marketingové položky: ${posts.length}. Preferuj akce s přímou vazbou na poptávky, produktové návštěvy, reálné reference, smart řízení a sezónní B2B příležitosti.`,
        response_json_schema: { type:'object', properties:{ suggestions:{ type:'array', items:{ type:'object', properties:{ title:{type:'string'}, description:{type:'string'}, priority:{type:'string',enum:['vysoká','střední','nízká']}, platform:{type:'string',enum:['instagram','facebook','google_ads','blog']}, post_format:{type:'string'}, caption:{type:'string'}, cta_label:{type:'string'}, cta_url:{type:'string'}, visual_prompt:{type:'string'} }, required:['title','description','priority','platform','caption'] } } }, required:['suggestions'] }
      });
      setSuggestions(Array.isArray(res?.suggestions) ? res.suggestions : []);
    } finally { setLoading(false); }
  };

  const makePost = (s) => ({ title:s.title, platform:s.platform || 'blog', post_format:s.post_format || (s.platform==='instagram'?'feed':s.platform==='blog'?'article':'feed'), caption:s.caption || s.description, image_url:'', video_url:'', status:'draft', ai_generated:true, cta_label:s.cta_label || 'Zjistit více', cta_url:s.cta_url || 'https://mlzidla.cz/poptavka', visual_prompt:s.visual_prompt || '', marketing_recommendation:s.description, source_type:'ai_recommendation' });

  const plan = async (s, i) => {
    setBusy(`plan-${i}`); setMessage('');
    try { await base44.entities.MarketingPost.create(makePost(s)); setMessage('Návrh byl vložen do Plánu obsahu.'); onPlanCreated?.(); }
    finally { setBusy(''); }
  };

  const task = async (s, i) => {
    setBusy(`task-${i}`); setMessage('');
    try {
      await base44.entities.AdminTask.create({ title:`Marketing · ${s.title}`, description:`AI doporučená akce pro ${PLATFORM[s.platform] || s.platform}.\n\n${s.description}\n\nNávrh textu:\n${s.caption || ''}`, status:'planned', priority:s.priority==='vysoká'?'high':s.priority==='nízká'?'low':'normal', area:'marketing', subtype:`${PLATFORM[s.platform] || s.platform} · AI doporučení`, tool:'ChatGPT + Marketing Hub', connector:s.platform, assignee_email:'jakub1duch@gmail.com', assignee_name:'Jakub Duch', creator_email:'jakub1duch@gmail.com', creator_name:'Jakub Duch', reviewer_email:'meduna@holmtec.cz', reviewer_name:'Radek Meduna', handoff_note:'Doporučení vzniklo v AI doporučeních Marketing Hubu; před publikací ověřit text, vizuál a cílení.', source:'chatgpt', estimated_hours:0.75, tags:['marketing','ai-doporuceni',s.platform] });
      setMessage('Doporučení bylo zařazeno do Úkoly & tým.');
    } finally { setBusy(''); }
  };

  const publish = async (s, i) => {
    setBusy(`pub-${i}`); setMessage('');
    try {
      const post = await base44.entities.MarketingPost.create(makePost(s));
      if (s.platform === 'instagram') {
        setMessage('Instagram potřebuje před přímou publikací obrazový asset. Návrh byl uložen do Plánu obsahu k doplnění vizuálu.');
        onPlanCreated?.();
      } else {
        await base44.entities.MarketingPost.update(post.id, { status:'published', published_at:new Date().toISOString() });
        setMessage('Akce byla zapsána jako provedená/publikovaná v Marketing Hubu. Kanály bez přímého publisheru nejsou falešně odesílány do externí služby.');
        onPlanCreated?.();
      }
    } finally { setBusy(''); }
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-cyan/15 bg-gradient-to-br from-cyan/8 to-white/2 p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">AI action studio</p><h3 className="mt-1 text-lg font-medium text-white">Doporučení jako skutečné marketingové výstupy</h3><p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/35">Každý návrh má kanál, text, CTA, vizuální směr a lze ho převést na plán, týmový úkol nebo provedenou akci.</p></div><button onClick={generate} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50">{loading?<Loader size={14} className="animate-spin"/>:<WandSparkles size={14}/>} {loading?'Generuji…':'Vygenerovat nová doporučení'}</button></div></div>
    {message && <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/55">{message}</div>}
    {!suggestions.length && !loading && <p className="py-8 text-center text-sm text-white/25">Vygenerujte doporučení — zobrazí se jako reálné náhledy jednotlivých kanálů.</p>}
    <div className="grid gap-6 xl:grid-cols-2">{suggestions.map((s,i) => { const preview = makePost(s); return <div key={`${s.title}-${i}`} className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="mb-4 flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-white">{s.title}</p><Sparkles size={12} className="text-cyan"/></div><p className="mt-1 text-xs text-white/40">{PLATFORM[s.platform] || s.platform} · {s.post_format || 'doporučený formát'}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-mono ${PRIORITY[s.priority] || PRIORITY.nízká}`}>{s.priority}</span></div><MarketingPostPreview post={preview} compact/><p className="mt-4 text-xs leading-relaxed text-white/45">{s.description}</p><div className="mt-4 grid grid-cols-3 gap-2"><button onClick={()=>plan(s,i)} disabled={!!busy} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan/20 bg-cyan/10 px-2 py-2.5 text-[11px] font-semibold text-cyan disabled:opacity-40">{busy===`plan-${i}`?<Loader size={11} className="animate-spin"/>:<CalendarPlus size={12}/>} Do plánu</button><button onClick={()=>task(s,i)} disabled={!!busy} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-400/10 px-2 py-2.5 text-[11px] font-semibold text-violet-300 disabled:opacity-40">{busy===`task-${i}`?<Loader size={11} className="animate-spin"/>:<ListTodo size={12}/>} Do úkolů</button><button onClick={()=>publish(s,i)} disabled={!!busy} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-2 py-2.5 text-[11px] font-semibold text-emerald-300 disabled:opacity-40">{busy===`pub-${i}`?<Loader size={11} className="animate-spin"/>:<Send size={12}/>} Provést</button></div></div>})}</div>
  </div>;
}
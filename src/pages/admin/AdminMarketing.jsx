import React, { useMemo, useState, useEffect } from 'react';
import { Loader, CalendarClock, Palette, Sparkles, Gauge, Megaphone, CheckCircle2, Clock3, Layers3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ContentPlanForm from '@/components/admin/marketing/ContentPlanForm';
import ContentPlanList from '@/components/admin/marketing/ContentPlanList';
import BrandProfileTab from '@/components/admin/marketing/BrandProfileTab';
import AiSuggestionsTab from '@/components/admin/marketing/AiSuggestionsTab';
import InstagramConnectCard from '@/components/admin/marketing/InstagramConnectCard';
import MarketingBriefingTab from '@/components/admin/marketing/MarketingBriefingTab';

const SUBTABS = [
  { id:'briefing', label:'Briefing', sub:'Výkon, práce a priority', icon:Gauge },
  { id:'plan', label:'Plán obsahu', sub:'Náhledy, editace a publikace', icon:CalendarClock },
  { id:'brand', label:'Brand styl', sub:'Pravidla značky a vizuálů', icon:Palette },
  { id:'ai', label:'AI doporučení', sub:'Akce → plán → úkol → provedení', icon:Sparkles },
];

export default function AdminMarketing(){
  const [subtab,setSubtab]=useState('briefing');
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]=useState(true);
  const loadPosts=()=>{setLoading(true);base44.entities.MarketingPost.list('-scheduled_date',250).then(setPosts).finally(()=>setLoading(false));};
  useEffect(()=>{loadPosts();},[]);

  const stats=useMemo(()=>({draft:posts.filter(p=>p.status==='draft').length,scheduled:posts.filter(p=>p.status==='scheduled').length,published:posts.filter(p=>p.status==='published').length,platforms:new Set(posts.map(p=>p.platform).filter(Boolean)).size}),[posts]);

  return <div className="space-y-6 p-6">
    <section className="overflow-hidden rounded-3xl border border-cyan/15 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.015))] p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><div className="flex items-center gap-2 text-cyan"><Megaphone size={15}/><p className="font-mono text-[10px] uppercase tracking-[.2em]">Marketing control center</p></div><h2 className="mt-2 text-2xl font-medium tracking-tight text-white">Marketing Hub</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Obsah, kampaně, AI doporučení, vizuály a analytické signály v jednom pracovním prostředí. Náhledy simulují skutečný formát kanálu místo generických administračních řádků.</p></div><div className="grid grid-cols-4 gap-2"><Stat icon={Layers3} value={stats.draft} label="koncept"/><Stat icon={Clock3} value={stats.scheduled} label="plán"/><Stat icon={CheckCircle2} value={stats.published} label="hotovo"/><Stat icon={Megaphone} value={stats.platforms} label="kanály"/></div></div>
    </section>

    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{SUBTABS.map(t=>{const Icon=t.icon;const active=subtab===t.id;return <button key={t.id} onClick={()=>setSubtab(t.id)} className={`rounded-2xl border p-4 text-left transition ${active?'border-cyan/30 bg-cyan/10 shadow-[0_14px_40px_rgba(34,211,238,.08)]':'border-white/8 bg-white/[.025] hover:border-white/15 hover:bg-white/[.04]'}`}><div className="flex items-center justify-between"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${active?'bg-cyan text-slate-950':'bg-white/5 text-white/45'}`}><Icon size={16}/></div>{active?<span className="rounded-full bg-cyan/15 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-cyan">aktivní</span>:null}</div><p className={`mt-4 text-sm font-semibold ${active?'text-white':'text-white/65'}`}>{t.label}</p><p className="mt-1 text-xs leading-5 text-white/30">{t.sub}</p></button>})}</div>

    {subtab==='briefing'&&<MarketingBriefingTab/>}
    {subtab==='plan'&&<div className="space-y-6"><InstagramConnectCard/><div><div className="mb-3"><p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Composer</p><h3 className="mt-1 text-lg font-medium text-white">Nový marketingový výstup</h3></div><ContentPlanForm onCreated={loadPosts}/></div><div><div className="mb-3"><p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Content board</p><h3 className="mt-1 text-lg font-medium text-white">Naplánované a vytvořené akce</h3></div>{loading?<div className="flex justify-center py-16"><Loader size={22} className="animate-spin text-cyan/40"/></div>:<ContentPlanList posts={posts} onChange={loadPosts}/>}</div></div>}
    {subtab==='brand'&&<BrandProfileTab/>}
    {subtab==='ai'&&<AiSuggestionsTab onPlanCreated={()=>{setSubtab('plan');loadPosts();}}/>}
  </div>;
}
function Stat({icon:Icon,value,label}){return <div className="min-w-[76px] rounded-xl border border-white/8 bg-black/10 p-3"><Icon size={12} className="text-cyan"/><p className="mt-2 text-xl font-light text-white">{value}</p><p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-white/25">{label}</p></div>}

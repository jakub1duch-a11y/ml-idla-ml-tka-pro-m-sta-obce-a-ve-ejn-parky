import React, { useState, useEffect } from 'react';
import { Loader, Eye, MousePointerClick, Users, Play, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductAnalyticsPanel({ slug }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true); setError(false);
    base44.functions.invoke('getAnalyticsData', { days: 28 }).then(res => {
      const rows = res.data?.productClicks || [];
      const engagement = res.data?.productEngagement || [];
      const path = `/produkt/${slug}`;
      const row = rows.find(r => r.path === path);
      const e = engagement.find(r => r.path === path) || {};
      const intent = Number(e.quick_inquiry_click||0)+Number(e.cta_click||0)+Number(e.form_start||0)+Number(e.phone_click||0)+Number(e.email_click||0)+Number(e.generate_lead||0);
      setStats({ views:row?.views||0, users:row?.users||0, rank:row?rows.indexOf(row)+1:null, total:rows.length, intent, video:Number(e.video_start||0), videoComplete:Number(e.video_complete||0), leads:Number(e.generate_lead||0) });
    }).catch(()=>setError(true)).finally(()=>setLoading(false));
  },[slug]);

  return <div className="rounded-xl border border-white/8 bg-white/3 p-4"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Zájem o produkt · 28 dní</p><p className="mt-1 text-xs text-white/25">GA4 views + produktové události</p></div>{stats?.rank?<span className="rounded-full border border-cyan/20 bg-cyan/10 px-2.5 py-1 font-mono text-[10px] text-cyan">#{stats.rank} / {stats.total}</span>:null}</div>{loading?<div className="flex justify-center py-5"><Loader size={18} className="animate-spin text-cyan/40"/></div>:error?<p className="mt-4 text-xs text-white/30">Nelze načíst GA4 data.</p>:<div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5"><Metric icon={Eye} value={stats.views} label="Zobrazení" tone="text-cyan"/><Metric icon={Users} value={stats.users} label="Uživatelé" tone="text-violet-300"/><Metric icon={MousePointerClick} value={stats.intent} label="Intent akce" tone="text-amber-300"/><Metric icon={Play} value={stats.video} label="Video start" tone="text-sky-300"/><Metric icon={Target} value={stats.leads} label="Lead event" tone="text-emerald-300"/></div>}</div>;
}
function Metric({icon:Icon,value,label,tone}){return <div className="rounded-lg border border-white/7 bg-black/10 p-3"><Icon size={13} className={tone}/><p className={`mt-2 text-lg font-light ${tone}`}>{Number(value||0).toLocaleString('cs-CZ')}</p><p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-white/25">{label}</p></div>}

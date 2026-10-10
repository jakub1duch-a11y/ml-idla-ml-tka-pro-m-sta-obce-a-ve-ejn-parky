import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { setSEO } from '@/lib/seo';
import PortalOverview from '@/components/portal/PortalOverview';
import PortalProjectCard from '@/components/portal/PortalProjectCard';
import PortalInquiries from '@/components/portal/PortalInquiries';
import PortalAssistant from '@/components/portal/PortalAssistant';
import '@/components/portal/portal.css';
const tabs=[['overview','Přehled'],['inquiries','Moje poptávky'],['offers','Nabídky a objednávky'],['documents','Dokumentace'],['assistant','Asistent MLŽIDLA']];
export default function RegisteredPortal() {
  const {user}=useAuth();
  const [tab,setTab]=useState('overview');
  const scope=tab==='documents'?'documents':'offers';
  const query=useInfiniteQuery({queryKey:['registered-portal',user?.id,scope],enabled:!!user?.id,initialPageParam:null,queryFn:async({pageParam})=>(await base44.functions.invoke('loginPortalWithBase44Session',{mode:'workspace',tab:scope,cursor:pageParam})).data,getNextPageParam:p=>p.has_more?p.next_cursor:undefined});
  const totals=query.data?.pages[0]?.totals;
  useEffect(()=>{setSEO({title:'Můj projekt | MLŽIDLA®',description:'Vaše poptávky, nabídky a dokumentace.',canonicalPath:'/muj-projekt',robots:'noindex, nofollow, noarchive'});},[]);
  return <div className="min-h-screen bg-background pb-20 pt-28 text-foreground"><div className="mx-auto max-w-7xl space-y-7 px-4 sm:px-8">
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="min-w-0"><p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck size={17}/>Soukromá klientská sekce</p><h1 className="text-3xl sm:text-4xl">Můj projekt</h1><p className="mt-3 break-words text-sm text-muted-foreground">{user?.full_name || 'Vítejte'} · {user?.email}</p></div><div className="flex flex-wrap gap-3"><Link to="/poptavka" className="portal-primary">Nová poptávka</Link><button onClick={()=>base44.auth.logout('/login')} className="btn-brand-text">Odhlásit se</button></div></header>
    <PortalOverview totals={totals} onSelect={setTab}/>
    <nav aria-label="Klientský portál" className="flex flex-wrap gap-2 border-b pb-4">{tabs.map(([key,label])=><button key={key} aria-current={tab===key?'page':undefined} onClick={()=>setTab(key)} className={`rounded-lg px-4 py-3 text-sm font-medium ${tab===key?'bg-primary text-primary-foreground':'bg-card text-muted-foreground hover:bg-muted'}`}>{label}</button>)}</nav>
    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>Zobrazujeme pouze údaje přiřazené k vašemu e-mailu.</span><button aria-label="Obnovit přehled" disabled={query.isFetching} onClick={()=>query.refetch()} className="inline-flex items-center gap-2 p-2"><RefreshCw size={14}/>Obnovit</button></div>
    {query.isError&&<div role="alert" className="rounded-lg border border-destructive p-5 text-destructive">Přehled se nepodařilo načíst. <button onClick={()=>query.refetch()} className="underline">Zkusit znovu</button></div>}
    {tab==='assistant'?<PortalAssistant/>:tab==='inquiries'?<PortalInquiries userId={user?.id} totals={totals}/>:<section className="space-y-4"><h2 className="text-2xl">{tab==='documents'?'Dokumentace k objednaným systémům':tab==='overview'?'Vaše projekty':'Nabídky a objednávky'}</h2>{query.isPending&&<p role="status">Načítám váš přehled…</p>}{query.data?.pages[0]?.items.length===0&&<div className="rounded-lg border border-dashed bg-card p-8"><h3 className="text-lg">{tab==='documents'?'Zatím nemáte objednaný systém':'Zatím zde nemáte žádnou nabídku'}</h3><p className="mt-3 text-sm text-muted-foreground">{tab==='documents'?'Po potvrzení nabídky zde najdete přiřazené technické podklady.':'Poptávky najdete v historii. Jakmile připravíme nabídku, zobrazí se zde; nový účet můžete používat i bez projektu.'}</p></div>}{query.data?.pages.flatMap(p=>p.items).map(p=><PortalProjectCard key={p.id} project={p} userId={user?.id} documents={tab==='documents'}/>)}{query.hasNextPage&&<button className="portal-secondary" disabled={query.isFetchingNextPage} onClick={()=>query.fetchNextPage()}>Načíst další projekty</button>}</section>}
  </div></div>;
}
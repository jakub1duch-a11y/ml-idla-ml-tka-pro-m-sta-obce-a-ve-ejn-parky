import React, { useEffect, useMemo, useState } from 'react';
import { Mail, RefreshCw, Save, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TOPICS = [
  {value: 'news_products', label: 'Nové produkty a realizace'},
  {value: 'studies', label: 'Projektové studie a technické podklady'},
  {value: 'offers', label: 'Obchodní novinky a nabídky'},
];
const TEMPLATES = [
  {id:'cities',title:'Mlžítka pro města a veřejný prostor',topic:'studies',
   subject:'MLŽIDLA.cz | Mlžítka pro veřejná prostranství',preheader:'Nerezová mlžítka a mlžné sochy pro parky a náměstí',
   body:'Dobrý den,\n\npřipravili jsme přehled možností využití nerezových mlžítek a mlžných soch na náměstích, v parcích a odpočinkových zónách.\n\nPro konkrétní prostor doporučíme vhodnou geometrii, kotvení, připojení vody a způsob ovládání. Technické podklady i cenu sestavy vždy upřesníme podle podmínek projektu.\n\nPřehled produktů: https://mlzidla.cz/mestske-mlzitka\n\nS pozdravem\nMLŽIDLA.cz | HolmTec\n\nToto je pracovní koncept. Před odesláním doplňte ověřené přílohy a odhlašovací odkaz.'},
  {id:'schools',title:'Mlžítka pro školky a školy',topic:'studies',
   subject:'MLŽIDLA.cz | Mlžítka pro školní venkovní prostory',preheader:'Varianty pro dvory, zahrady a školní areály',
   body:'Dobrý den,\n\nmlžítka mohou doplnit školní zahrady a venkovní odpočinkové prostory. Připravíme návrh konkrétního modelu a jeho umístění s ohledem na provoz, přístupnost, kotvení a údržbu.\n\nMlžítka nejsou automaticky certifikovaným herním prvkem. Posouzení instalace musí odpovídat účelu místa a projektovým podkladům.\n\nS pozdravem\nMLŽIDLA.cz | HolmTec\n\nToto je pracovní koncept. Před odesláním ověřte technická tvrzení a odhlašovací odkaz.'},
  {id:'maintenance',title:'Údržba, trysky a zazimování',topic:'news_products',
   subject:'MLŽIDLA.cz | Péče o mlžítka a sezónní provoz',preheader:'Servis trysek, filtrace a příprava na zimu',
   body:'Dobrý den,\n\npřipravili jsme přehled péče o venkovní mlžítka: pravidelná vizuální kontrola, filtrace, čištění trysek a zazimování. Konkrétní postup se řídí dodaným typem systému a jeho technickou dokumentací.\n\nV případě potřeby prověříme nastavení řízení SUPLA, stav trysek a vhodný servisní postup.\n\nS pozdravem\nMLŽIDLA.cz | HolmTec\n\nToto je pracovní koncept. Před odesláním doplňte skutečný servisní návod a odhlašovací odkaz.'},
];
const EMPTY = {title:'',subject:'',preheader:'',body_text:'',topic:'news_products',notes:'',status:'draft'};
const norm = (v) => String(v || '').trim().toLowerCase();

export default function AdminNewsletterCampaigns(){
  const [leads,setLeads]=useState([]);
  const [campaigns,setCampaigns]=useState([]);
  const [form,setForm]=useState(EMPTY);
  const [busy,setBusy]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const load=async()=>{
    setBusy(true);setError('');
    try{
      const [subscribers,drafts]=await Promise.all([
        base44.entities.NewsletterLead.list('-created_date',500),
        base44.entities.NewsletterCampaign.list('-created_date',100),
      ]);
      setLeads(subscribers || []);setCampaigns(drafts || []);
    }catch{setError('Nepodařilo se načíst kampaně a preference odběratelů.');}
    finally{setBusy(false);}
  };
  useEffect(()=>{load();},[]);
  const active=useMemo(()=>new Set(leads.filter(x=>
    x.marketing_consent===true && x.status==='active' &&
    x.consent_at && !x.consent_revoked_at && x.verified_account===true
  ).map(x=>norm(x.email)).filter(Boolean)).size,[leads]);
  const eligible=useMemo(()=>new Set(leads.filter(x=>
    x.marketing_consent===true && x.status==='active' &&
    x.consent_at && !x.consent_revoked_at && x.verified_account===true &&
    Array.isArray(x.topics) && x.topics.includes(form.topic)
  ).map(x=>norm(x.email)).filter(Boolean)).size,[leads,form.topic]);
  const save=async()=>{
    if(!form.title.trim() || !form.subject.trim() || !form.body_text.trim()) {
      setError('Doplňte název, předmět a text konceptu.');return;
    }
    setSaving(true);setError('');setNotice('');
    try{
      const me=await base44.auth.me();
      if(me?.role!=='admin')throw new Error('forbidden');
      await base44.entities.NewsletterCampaign.create({
        title:form.title.trim().slice(0,160),
        subject:form.subject.trim().slice(0,180),
        preheader:form.preheader.trim().slice(0,200),
        body_text:form.body_text.trim().slice(0,12000),
        topic:form.topic,notes:form.notes.trim().slice(0,1000),
        status:'draft',created_by_email:me.email||''
      });
      setNotice('Koncept uložen. Nikomu nebyl odeslán.');
      setForm(EMPTY);await load();
    }catch{setError('Koncept se nepodařilo uložit. Zkontrolujte oprávnění administrátora.');}
    finally{setSaving(false);}
  };
  const useTemplate=(t)=>{setForm({title:t.title,subject:t.subject,preheader:t.preheader,body_text:t.body,topic:t.topic,notes:'',status:'draft'});setError('');setNotice('');};
  const field='mt-1 w-full min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ea5]';
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="newsletter-admin-title">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#008ea5]">E-mail marketing / administrace</p>
        <h2 id="newsletter-admin-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a]"><Mail size={21}/> Newslettery a pracovní koncepty</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Odběratelé jsou odděleni od obchodních kontaktů. Vytváření konceptů neposílá žádný e-mail a nespouští kampaň.</p>
      </div>
      <button type="button" disabled={busy} onClick={load} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-[#102b3a] hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} className={busy?'animate-spin':''}/> Obnovit</button>
    </div>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {[{l:'Doložený aktivní souhlas',v:active},{l:'Odběratelé pro téma',v:eligible},{l:'Koncepty kampaní',v:campaigns.length}].map(s=><div key={s.l} className="rounded-xl border border-slate-200 bg-[#f7fbfc] p-4"><div className="text-xs text-slate-500">{s.l}</div><div className="mt-1 text-2xl font-semibold text-[#102b3a]">{busy?'…':s.v}</div></div>)}
    </div>
    <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle size={16} className="mt-0.5 shrink-0"/> Do newsletterů nepřebírat automaticky kontakty z poptávek ani obchodní tabulky. Záznam musí obsahovat samostatný platný marketingový souhlas; před případnou rozesílkou je nutná opětovná kontrola odhlášení.</p>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div><h3 className="text-sm font-bold text-[#102b3a]">Nový koncept</h3><p className="mt-1 text-xs text-slate-500">Vyberte šablonu, upravte text a uložte jako koncept bez rozeslání.</p></div>
        <div className="flex flex-wrap gap-2">{TEMPLATES.map(t=><button key={t.id} type="button" onClick={()=>useTemplate(t)} className="min-h-11 rounded-lg border border-[#008ea5]/30 bg-[#f0fbfc] px-3 text-xs font-semibold text-[#007b92] hover:bg-[#e1f4f7]">{t.title}</button>)}</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-700">Interní název<input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} maxLength={160} className={field}/></label>
          <label className="text-xs font-semibold text-slate-700">Téma pro souhlas<select value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} className={field}>{TOPICS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
        </div>
        <label className="block text-xs font-semibold text-slate-700">Předmět<input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} maxLength={180} className={field}/></label>
        <label className="block text-xs font-semibold text-slate-700">Preheader<input value={form.preheader} onChange={e=>setForm(f=>({...f,preheader:e.target.value}))} maxLength={200} className={field}/></label>
        <label className="block text-xs font-semibold text-slate-700">Text konceptu<textarea value={form.body_text} onChange={e=>setForm(f=>({...f,body_text:e.target.value}))} rows={11} maxLength={12000} className={field+' resize-y'}/></label>
        <label className="block text-xs font-semibold text-slate-700">Interní poznámky<textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} maxLength={1000} className={field+' resize-y'}/></label>
        <button type="button" onClick={save} disabled={saving||busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102b3a] px-5 text-sm font-semibold text-white hover:bg-[#19475b] disabled:opacity-50"><Save size={17}/> {saving?'Ukládání…':'Uložit koncept'}</button>
      </div>
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#102b3a]"><FileText size={16}/> Uložené koncepty</h3>
        <div className="mt-3 space-y-2">{campaigns.length===0&&<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Zatím žádný uložený koncept.</p>}
          {campaigns.map(c=><article key={c.id} className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] uppercase tracking-wide text-[#008ea5]">{TOPICS.find(x=>x.value===c.topic)?.label||c.topic} · {c.status||'draft'}</p><h4 className="mt-1 text-sm font-semibold text-[#102b3a]">{c.title}</h4><p className="mt-1 text-xs text-slate-500">{c.subject}</p><button type="button" onClick={()=>setForm({title:c.title||'',subject:c.subject||'',preheader:c.preheader||'',body_text:c.body_text||'',topic:c.topic||'news_products',notes:c.notes||'',status:'draft'})} className="mt-3 min-h-11 text-xs font-semibold text-[#008ea5] hover:underline">Použít jako nový koncept</button></article>)}
        </div>
      </div>
    </div>
    <p className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500"><ShieldCheck size={16}/> Pouze administrace. V této sekci není žádné tlačítko ani API pro automatické rozesílání.</p>
  </section>;
}

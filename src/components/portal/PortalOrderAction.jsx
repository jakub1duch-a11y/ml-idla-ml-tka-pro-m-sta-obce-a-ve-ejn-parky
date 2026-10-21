import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
export default function PortalOrderAction({ project }) {
  const cache=useQueryClient();
  const [open,setOpen]=useState(false), [accepted,setAccepted]=useState(false), [busy,setBusy]=useState(false), [error,setError]=useState(''), [done,setDone]=useState(false);
  const expired=project.valid_until && new Date(project.valid_until).getTime()<Date.now();
  async function order(event) {
    event.preventDefault(); if(!accepted||busy) return;
    setBusy(true); setError('');
    try {
      const session=await base44.functions.invoke('loginPortalWithBase44Session',{mode:'session_only'});
      const {data}=await base44.functions.invoke('approveProjectOrder',{project_id:project.id,session_token:session.data.session_token,accept_terms:true,acceptance_name:project.client_name,acceptance_user_agent:navigator.userAgent});
      if(!data.ok || !data.project?.approved_at) throw new Error('not_confirmed');
      setDone(true);
      if(window.gtag) window.gtag('event','conversion',{send_to:'AW-18399688870/xbC2CKygyeQcEKbx08VE',value:Number(data.project.total_price||0),currency:'CZK',transaction_id:data.project.id});
      await cache.invalidateQueries({queryKey:['registered-portal']});
    } catch(e) { setError(e?.response?.data?.error==='offer_expired'?'Platnost nabídky skončila. Požádejte tým o aktualizaci.':'Objednání se nepodařilo potvrdit. Obnovte přehled a ověřte stav nabídky před dalším pokusem.'); }
    finally {setBusy(false);}
  }
  if(done) return <p role="status" className="mt-4 rounded-lg bg-muted p-4 font-semibold">Objednávka byla potvrzena. Další postup najdete u svého projektu.</p>;
  if(!['sent','viewed','extension_requested'].includes(project.status)) return null;
  if(expired) return <p className="mt-4 text-sm text-muted-foreground">Platnost nabídky skončila. O aktualizaci požádejte v detailu.</p>;
  return <div className="mt-4">{!open?<button className="portal-primary" onClick={()=>setOpen(true)}>Objednat z nabídky</button>:<form onSubmit={order} className="space-y-4 rounded-lg border bg-muted p-4"><p className="text-sm">Před objednáním si přečtěte cenu, specifikaci a podmínky nabídky.</p><label className="flex gap-3 text-sm"><input type="checkbox" required checked={accepted} onChange={e=>setAccepted(e.target.checked)} disabled={busy} className="mt-1"/><span>Souhlasím s cenovou nabídkou a <Link to="/obchodni-podminky" target="_blank" className="underline">obchodními podmínkami</Link>. Potvrzením vytvářím závaznou objednávku.</span></label><div className="flex flex-wrap gap-3"><button disabled={!accepted||busy} className="portal-primary">{busy?'Potvrzuji…':'Závazně objednat'}</button><button type="button" disabled={busy} onClick={()=>setOpen(false)} className="btn-brand-text">Zrušit</button></div></form>}{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</div>;
}
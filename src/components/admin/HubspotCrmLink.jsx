import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Search, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MESSAGE = {
  hubspot_not_connected: 'HubSpot není v aplikaci autorizovaný.',
  hubspot_access_denied: 'Chybí oprávnění pro čtení kontaktů HubSpot.',
  hubspot_rate_limited: 'HubSpot omezuje počet požadavků.',
  hubspot_api_unavailable: 'HubSpot API momentálně neodpovídá.',
  hubspot_unavailable: 'Nepodařilo se ověřit HubSpot.',
};

export default function HubspotCrmLink() {
  const [health, setHealth] = useState(null);
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await base44.functions.invoke('hubspotCrmBridge', {action:'status'});
      const data = response?.data || response;
      if (!data?.ok) throw new Error(data?.error || 'hubspot_unavailable');
      setHealth(data);
    } catch (e) {
      setHealth(null);
      const code = e?.response?.data?.error || e?.message || 'hubspot_unavailable';
      setError(MESSAGE[code] || code);
    } finally {setLoading(false);}
  }, []);

  useEffect(() => {refresh();}, [refresh]);

  const match = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setMatching(true);setError('');setResult(null);
    try {
      const response = await base44.functions.invoke('hubspotCrmBridge', {action:'match_contact', email:email.trim()});
      const data = response?.data || response;
      if (!data?.ok) throw new Error(data?.error || 'hubspot_unavailable');
      setResult(data);
    } catch(e){
      const code = e?.response?.data?.error || e?.message || 'hubspot_unavailable';
      setError(MESSAGE[code] || code);
    } finally {setMatching(false);}
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="hubspot-bridge-title">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-cyan-700 font-semibold">MLŽIDLA.cz · CRM CONNECTOR</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900" id="hubspot-bridge-title">HubSpot ↔ Obchodní centrum</h3>
          <p className="text-sm text-slate-600 mt-1">Ověření propojení a shod kontaktů. Bez automatického přepisu záznamů.</p>
        </div>
        <button onClick={refresh} disabled={loading} type="button" className="flex items-center gap-2 text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-700 disabled:opacity-50">
          <RefreshCw size={13} className={loading?'animate-spin':''} /> Obnovit kontrolu
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {health?.read_verified
          ? <span className="inline-flex gap-2 items-center text-emerald-700"><CheckCircle2 size={16}/> HubSpot API: čtení ověřeno</span>
          : <span className="text-amber-700">{loading?'Ověřuji připojení…':'Čtení z HubSpotu neověřeno'}</span>}
      </div>
      <p className="mt-3 text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
        <AlertTriangle size={14} className="inline mr-1"/> Synchronizace a zápisy jsou vypnuté, dokud nebude potvrzen správný HubSpot portál a vlastnictví firemních kontaktů. Zde lze pouze vyhledávat a porovnávat.
      </p>
      <form onSubmit={match} className="mt-4 flex flex-col sm:flex-row gap-2">
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail kontaktu pro ověření shody"
          aria-label="E-mail kontaktu v HubSpotu" className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900" />
        <button disabled={matching||!health?.read_verified} className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white text-sm px-4 py-2 disabled:opacity-50">
          <Search size={15}/> {matching?'Hledám…':'Ověřit v HubSpotu'}
        </button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      {result && <div className="mt-4 text-sm text-slate-700" aria-live="polite">
        <p className="font-semibold">Výsledek pro {result.queried_email}: {result.total} shod</p>
        {(result.matches || []).map(m => <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3" key={m.id}>
          <p className="font-medium">{m.name || 'Bez jména'} · {m.company || 'Bez společnosti'}</p>
          <p className="mt-1 text-xs text-slate-600">{m.email} · HubSpot ID: {m.id}</p>
        </div>)}
        {!result.matches?.length && <p className="mt-2 text-xs text-slate-500">Žádný odpovídající kontakt nebyl nalezen; záznam jsem nevytvářel.</p>}
      </div>}
      <a href="https://app.hubspot.com/" target="_blank" rel="noopener noreferrer" className="inline-flex mt-4 items-center gap-1.5 text-sm font-medium text-cyan-700">Otevřít HubSpot <ExternalLink size={14}/></a>
    </section>
  );
}
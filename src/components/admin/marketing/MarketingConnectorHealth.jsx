import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, PlugZap, RefreshCw, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MarketingConnectorHealth() {
  const [state, setState] = useState({ loading: true, connectors: [], error: '' });

  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await base44.functions.invoke('getMarketingConnectorHealth', {});
      setState({ loading: false, connectors: response?.data?.connectors || [], error: '' });
    } catch (error) {
      setState({ loading: false, connectors: [], error: error?.response?.data?.error || 'Stav konektorů se nepodařilo načíst.' });
    }
  };

  useEffect(() => { load(); }, []);

  const connected = state.connectors.filter((item) => item.connected).length;

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[.025] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan"><PlugZap size={14} /><p className="font-mono text-[10px] uppercase tracking-[.18em]">Konektory marketingu</p></div>
          <p className="mt-1 text-sm text-white">{state.loading ? 'Ověřuji dostupné služby…' : `${connected} z ${state.connectors.length} služeb je připraveno`}</p>
          <p className="mt-1 text-xs text-white/35">Publikace vyžaduje potvrzení. Gmail připravuje pouze koncepty.</p>
        </div>
        <button type="button" onClick={load} disabled={state.loading} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/55 hover:border-cyan/30 hover:text-cyan disabled:opacity-40">
          <RefreshCw size={12} className={state.loading ? 'animate-spin' : ''} /> Obnovit stav
        </button>
      </div>
      {state.error ? <p className="mt-3 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300"><AlertCircle size={13} /> {state.error}</p> : null}
      {!state.loading && state.connectors.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {state.connectors.map((item) => <div key={item.type} className="rounded-xl border border-white/8 bg-black/10 p-3">
          <div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-white/80">{item.label}</p>{item.connected ? <CheckCircle2 size={13} className="text-emerald-400" /> : <AlertCircle size={13} className="text-amber-300" />}</div>
          <p className="mt-1 text-[10px] leading-4 text-white/35">{item.role}</p>
        </div>)}
      </div> : null}
      <div className="mt-3 flex items-center gap-2 text-[10px] text-white/30"><ShieldCheck size={12} className="text-cyan" /> Neaktivní konektor neblokuje tvorbu konceptu a nikdy se nesimuluje jako úspěšné odeslání.</div>
    </section>
  );
}

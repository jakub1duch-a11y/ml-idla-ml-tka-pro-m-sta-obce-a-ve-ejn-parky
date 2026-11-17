import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Building2, Loader2, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const number = v => (Number(v) || 0).toLocaleString('cs-CZ');
const fmtDate = v => {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('cs-CZ');
};

export default function HubspotSalesOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await base44.functions.invoke('hubspotSalesOverview', {});
      if (result?.data?.ok !== true) throw new Error(result?.data?.error || 'CRM přehled není dostupný');
      setData(result.data);
    } catch (err) {
      setData(null);
      setError(err?.message || 'CRM přehled nelze načíst.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6" aria-labelledby="hubspot-sales-overview-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-cyan"><Building2 size={13} aria-hidden="true" /> Obchodní centrum</p>
          <h2 id="hubspot-sales-overview-title" className="mt-2 text-xl font-semibold text-white">HubSpot · MLŽIDLA.cz</h2>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-white/50">Živý stav obchodních případů z firemní pipeline. Návštěvnost webu a konverzní události měří GA4 samostatně.</p>
        </div>
        <div className="flex items-center gap-3">
          {data?.ok && <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-200"><ShieldCheck size={14} /> Pouze čtení</span>}
          <button type="button" onClick={load} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Obnovit CRM
          </button>
        </div>
      </div>

      {error && !data ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100" role="status">
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div><p className="font-semibold">HubSpot zatím není pro přehled ověřený.</p><p className="mt-1 text-xs opacity-80">Zkontrolujte firemní OAuth portál 149778217, oprávnění ke čtení obchodních případů a připojení Base44. Chyba: {error}</p></div>
        </div>
      ) : loading && !data ? (
        <p className="mt-5 text-sm text-white/60">Ověřuji pipeline a načítám obchodní případy…</p>
      ) : data?.ok && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {data.stages?.map(stage => (
              <div key={stage.id} className="rounded-lg border border-white/10 bg-[#102B3E] p-3">
                <p className="min-h-10 text-[11px] leading-5 text-white/65">{stage.label}</p>
                <p className="mt-1 text-xl font-semibold tabular-nums text-white">{number(stage.count)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-white">Poslední změněné obchodní případy</h3>
            <span className="text-[11px] text-white/40">{number(data.count)} případů v pipeline · kontrola {fmtDate(data.checked_at)}</span>
          </div>
          {data.recent_deals?.length ? (
            <ul className="divide-y divide-white/10">
              {data.recent_deals.map(deal => {
                const stage = data.stages?.find(s => s.id === deal.stage_id);
                return (
                  <li key={deal.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/90">{deal.name}</p>
                      <p className="mt-1 text-[11px] text-white/50">{stage?.label || 'Fáze k ověření'} · Aktualizováno {fmtDate(deal.updated_at)}</p>
                    </div>
                    <a href={deal.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-cyan hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
                      Otevřít v HubSpot <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : <p className="py-4 text-sm text-white/55">V této pipeline nyní nejsou žádné obchodní případy.</p>}
          <p className="mt-4 text-[11px] leading-5 text-white/45">Stav „Nabídka odeslána“ vyžaduje potvrzené odeslání, nikoliv Gmail koncept. Zobrazené počty jsou z CRM; nesčítají se s GA4 návštěvami.</p>
        </>
      )}
    </section>
  );
}

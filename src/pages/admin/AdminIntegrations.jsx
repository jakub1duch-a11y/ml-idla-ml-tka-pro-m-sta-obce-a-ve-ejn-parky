import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock3, Link2, Loader, RefreshCw,
  ShieldCheck, Sparkles, Unplug
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_META = {
  active: { label: 'aktivní', tone: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300', Icon: CheckCircle2 },
  connected: { label: 'připojeno', tone: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300', Icon: CheckCircle2 },
  bridge_ready: { label: 'bridge připraven', tone: 'border-cyan/25 bg-cyan/10 text-cyan', Icon: Link2 },
  external_bridge_ready: { label: 'externí bridge', tone: 'border-cyan/25 bg-cyan/10 text-cyan', Icon: Link2 },
  awaiting_oauth: { label: 'čeká na OAuth', tone: 'border-amber-400/25 bg-amber-400/10 text-amber-300', Icon: Clock3 },
  blocked_plan: { label: 'blokováno plánem', tone: 'border-amber-400/25 bg-amber-400/10 text-amber-300', Icon: AlertTriangle },
  blocked_requires_secret: { label: 'chybí bezpečný klíč', tone: 'border-rose-400/25 bg-rose-400/10 text-rose-300', Icon: AlertTriangle },
  unconfigured: { label: 'nenastaveno', tone: 'border-white/10 bg-white/5 text-white/40', Icon: Unplug },
};

const getMeta = (item) => {
  if (item.connected && !['awaiting_oauth', 'blocked_plan', 'blocked_requires_secret'].includes(item.status)) {
    return STATUS_META[item.status] || STATUS_META.active;
  }
  return STATUS_META[item.status] || STATUS_META.unconfigured;
};

function Stat({ label, value, tone = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[.025] px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">{label}</p>
      <p className={`mt-1 text-2xl font-light ${tone}`}>{value}</p>
    </div>
  );
}

function IntegrationCard({ item }) {
  const meta = getMeta(item);
  const Icon = meta.Icon;
  return (
    <article className="rounded-2xl border border-white/8 bg-black/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-white/85">{item.display_name}</h3>
          <p className="mt-1 truncate text-[10px] text-white/30">{item.account || item.integration_type}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] ${meta.tone}`}>
          <Icon size={11} /> {meta.label}
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-white/40">{item.purpose || 'Účel zatím není popsaný.'}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(item.capabilities || []).slice(0, 3).map((capability) => (
          <span key={capability} className="rounded-full border border-white/8 px-2 py-1 text-[9px] text-white/30">{capability}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-white/8 pt-3 text-[10px] text-white/30">
        <ShieldCheck size={12} className={item.requires_approval_for_write ? 'text-amber-300' : 'text-emerald-300'} />
        {item.requires_approval_for_write ? 'Externí zápis vyžaduje schválení' : 'Pouze čtení / analytika'}
      </div>
    </article>
  );
}

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    const [integrationResult, providerResult] = await Promise.allSettled([
      base44.entities.SuperAgentIntegration.list('sort_order', 100),
      base44.entities.AIProviderConfig.list('priority', 50),
    ]);
    if (integrationResult.status === 'fulfilled') setIntegrations(integrationResult.value || []);
    else setError('Nepodařilo se načíst registr konektorů.');
    if (providerResult.status === 'fulfilled') setProviders(providerResult.value || []);
    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => {
    const connected = integrations.filter((item) => item.connected && !String(item.status || '').startsWith('blocked')).length;
    const awaiting = integrations.filter((item) => item.status === 'awaiting_oauth').length;
    const protectedWrites = integrations.filter((item) => item.requires_approval_for_write).length;
    return { connected, awaiting, protectedWrites };
  }, [integrations]);

  if (loading) return <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-cyan/40" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan">Interní správa napojení</p>
          <h2 className="mt-1 text-2xl font-medium text-white">Integrace a AI vrstvy</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
            Centrální registr účtů, konektorů a bezpečnostních omezení pro CRM, dokumenty, analytiku, komunikaci a marketing.
          </p>
        </div>
        <button type="button" onClick={() => load(true)} disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white/60 transition hover:border-cyan/25 hover:text-cyan disabled:opacity-50">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Obnovit registr
        </button>
      </div>

      {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-300">{error}</div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Aktivní konektory" value={counts.connected} tone="text-emerald-300" />
        <Stat label="Čeká na OAuth" value={counts.awaiting} tone="text-amber-300" />
        <Stat label="Chráněné zápisy" value={counts.protectedWrites} tone="text-cyan" />
        <Stat label="AI / design vrstvy" value={providers.filter((item) => item.active !== false).length} tone="text-violet-300" />
      </div>

      <section className="rounded-3xl border border-amber-400/20 bg-amber-400/[.06] p-5">
        <div className="flex items-center gap-2 text-amber-300"><ShieldCheck size={16} /><p className="font-mono text-[10px] uppercase tracking-widest">Bezpečný provoz</p></div>
        <div className="mt-4 grid gap-3 text-xs leading-5 text-white/55 lg:grid-cols-3">
          <p>Gmail slouží pouze ke čtení relevantní komunikace a tvorbě konceptů. Odesílá vždy člověk přímo v Gmailu.</p>
          <p>Publikace na LinkedIn a Instagram, změny CRM, kalendáře a externích úkolů vyžadují ruční schválení.</p>
          <p>Ceny, technické parametry a geometrie produktů se nesmí domýšlet; používají se schválené zdroje a MASTER reference.</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-cyan"><Link2 size={15}/><h3 className="text-sm font-medium text-white/80">Provozní konektory</h3></div>
            <p className="mt-1 text-xs text-white/30">Stav interního registru SuperAgenta.</p>
          </div>
          <span className="font-mono text-[10px] text-white/30">{integrations.length} položek</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {integrations.map((item) => <IntegrationCard key={item.id || item.integration_type} item={item} />)}
        </div>
      </section>

      <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5">
        <div className="flex items-center gap-2 text-violet-300"><Sparkles size={15}/><h3 className="text-sm font-medium text-white/80">AI a designové vrstvy</h3></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {providers.map((provider) => {
            const meta = getMeta({ connected: provider.status === 'active', status: provider.status });
            return (
              <div key={provider.id || provider.provider_key} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-sm text-white/80">{provider.display_name}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/25">{provider.integration_mode}</p></div>
                  <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] ${meta.tone}`}>{meta.label}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-white/35">{provider.notes}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

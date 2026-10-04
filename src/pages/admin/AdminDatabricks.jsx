import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Loader, Play, RefreshCw, Save, Server } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const badgeClass = (tone) => ({
  green: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  red: 'border-red-400/30 bg-red-400/10 text-red-300',
  slate: 'border-white/10 bg-white/5 text-white/45',
}[tone] || 'border-white/10 bg-white/5 text-white/45');

function Badge({ tone = 'slate', children }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide ${badgeClass(tone)}`}>{children}</span>;
}

function Card({ title, icon: Icon, children }) {
  return <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
    <div className="mb-4 flex items-center gap-2"><Icon size={16} className="text-cyan"/><h2 className="text-sm font-medium text-white">{title}</h2></div>
    {children}
  </section>;
}

function formatDate(value) {
  if (!value) return '—';
  try { return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
  catch (_) { return value; }
}

export default function AdminDatabricks() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [runs, setRuns] = useState([]);
  const [host, setHost] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [configs, recentRuns, statusResponse] = await Promise.all([
        base44.entities.DatabricksConfig.filter({ key: 'primary' }, '-created_date', 1, 0),
        base44.entities.DatabricksSyncRun.filter({}, '-started_at', 12, 0),
        base44.functions.invoke('databricksStatus', {}),
      ]);
      const cfg = Array.isArray(configs) ? configs[0] : null;
      setConfig(cfg);
      setHost(cfg?.workspace_host || '');
      setRuns(Array.isArray(recentRuns) ? recentRuns : []);
      setStatus(statusResponse?.data || null);
    } catch (e) {
      setError(e?.message || 'Stav Databricks se nepodařilo načíst.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const saveHost = async () => {
    if (!config?.id) return;
    const cleanHost = String(host || '').trim().replace(/\/$/, '');
    if (!/^https:\/\/[a-z0-9.-]+(?:databricks\.com|azuredatabricks\.net|cloud\.databricks\.(?:us|mil))$/i.test(cleanHost)) {
      setError('Zadej úplnou Databricks Workspace URL, například https://dbc-xxxx.cloud.databricks.com.');
      return;
    }
    setBusy('save'); setError(''); setMessage('');
    try {
      await base44.entities.DatabricksConfig.update(config.id, {
        workspace_host: cleanHost,
        connection_status: 'awaiting_oauth',
        last_error: '',
      });
      setMessage('Workspace URL je uložená. Databricks konektor teď může dokončit OAuth autorizaci.');
      await load();
    } catch (e) { setError(e?.message || 'Workspace URL se nepodařilo uložit.'); }
    finally { setBusy(''); }
  };

  const bootstrap = async () => {
    setBusy('bootstrap'); setError(''); setMessage('');
    try {
      const response = await base44.functions.invoke('databricksBootstrap', {});
      if (response?.data?.error) throw new Error(response.data.error);
      setMessage(`Databricks je inicializovaný: katalog ${response?.data?.catalog || 'mlzidla'}, schémata raw / core / analytics / ai.`);
      await load();
    } catch (e) { setError(e?.message || 'Inicializace Databricks se nepodařila.'); }
    finally { setBusy(''); }
  };

  const sync = async () => {
    setBusy('sync'); setError(''); setMessage('');
    try {
      const response = await base44.functions.invoke('databricksSync', {});
      if (response?.data?.error) throw new Error(response.data.error);
      setMessage(`Synchronizace dokončena: ${response?.data?.records || 0} záznamů, stav ${response?.data?.status || 'success'}.`);
      await load();
    } catch (e) { setError(e?.message || 'Synchronizace do Databricks se nepodařila.'); }
    finally { setBusy(''); }
  };

  const ready = status?.connected && status?.bootstrapStatus === 'ready';
  const connectionTone = ready ? 'green' : status?.connected ? 'amber' : status?.configured ? 'amber' : 'slate';
  const statusLabel = ready ? 'Připraveno' : status?.connected ? 'Připojeno' : status?.configured ? 'Čeká na OAuth' : 'Nenastaveno';
  const entities = useMemo(() => config?.sync_entities || ['Product', 'ContactInquiry', 'Poptavka', 'Realizace', 'MarketingPost'], [config]);

  if (loading) return <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-cyan/50"/></div>;

  return <div className="space-y-6 p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/70">Data platform</p>
        <h1 className="mt-1 text-2xl font-light text-white">Databricks</h1>
        <p className="mt-1 max-w-2xl text-sm text-white/35">Centrální lakehouse pro produkty, poptávky, realizace, marketing a budoucí AI/RAG vrstvu.</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={connectionTone}>{ready ? <CheckCircle2 size={11}/> : <Server size={11}/>} {statusLabel}</Badge>
        <button onClick={load} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/50 transition hover:text-white" title="Obnovit stav"><RefreshCw size={15}/></button>
      </div>
    </div>

    {error && <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"><AlertTriangle size={17} className="mt-0.5 shrink-0"/><span>{error}</span></div>}
    {message && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>}

    <div className="grid gap-4 xl:grid-cols-2">
      <Card title="Připojení workspace" icon={Server}>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-white/35">Databricks Workspace URL</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={host} onChange={(e) => setHost(e.target.value)} placeholder="https://dbc-xxxx.cloud.databricks.com"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan/40"/>
          <button onClick={saveHost} disabled={busy === 'save'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-50">
            {busy === 'save' ? <Loader size={14} className="animate-spin"/> : <Save size={14}/>} Uložit
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/30">URL není tajná. Přístupový token zůstává v Base44 OAuth konektoru a nikdy se neukládá do frontendu ani databázové entity.</p>
      </Card>

      <Card title="Lakehouse struktura" icon={Database}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/4 p-3"><p className="text-white/30">Katalog</p><p className="mt-1 font-mono text-cyan">{status?.catalog || config?.catalog || 'mlzidla'}</p></div>
          <div className="rounded-xl bg-white/4 p-3"><p className="text-white/30">SQL warehouse</p><p className="mt-1 truncate font-mono text-white/70">{status?.warehouseName || status?.warehouseId || config?.warehouse_id || '—'}</p></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{['raw','core','analytics','ai'].map((name) => <Badge key={name} tone={ready ? 'green' : 'slate'}>{name}</Badge>)}</div>
        <button onClick={bootstrap} disabled={!status?.connected || busy === 'bootstrap'} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan/25 bg-cyan/10 px-4 py-2.5 text-sm text-cyan transition hover:bg-cyan/15 disabled:cursor-not-allowed disabled:opacity-40">
          {busy === 'bootstrap' ? <Loader size={14} className="animate-spin"/> : <Play size={14}/>} Inicializovat Databricks
        </button>
      </Card>
    </div>

    <Card title="Synchronizace Base44 → Databricks" icon={RefreshCw}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">{entities.map((name) => <Badge key={name} tone="slate">{name}</Badge>)}</div>
          <p className="mt-3 text-xs text-white/30">Synchronizace používá idempotentní MERGE/upsert. Záznamy v Databricks se při běžném syncu nemažou.</p>
        </div>
        <button onClick={sync} disabled={!ready || busy === 'sync'} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40">
          {busy === 'sync' ? <Loader size={14} className="animate-spin"/> : <RefreshCw size={14}/>} Synchronizovat nyní
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/4 p-3"><p className="text-xs text-white/30">Poslední sync</p><p className="mt-1 text-sm text-white/70">{formatDate(status?.lastSyncAt || config?.last_sync_at)}</p></div>
        <div className="rounded-xl bg-white/4 p-3"><p className="text-xs text-white/30">Bootstrap</p><p className="mt-1 text-sm text-white/70">{status?.bootstrapStatus || config?.bootstrap_status || 'not_started'}</p></div>
        <div className="rounded-xl bg-white/4 p-3"><p className="text-xs text-white/30">Sync</p><p className="mt-1 text-sm text-white/70">{config?.sync_enabled === false ? 'Vypnutý' : 'Zapnutý'}</p></div>
      </div>
    </Card>

    <Card title="Poslední běhy" icon={Database}>
      <div className="overflow-hidden rounded-xl border border-white/8">
        <div className="grid grid-cols-[110px_90px_1fr_90px] gap-3 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-white/30">
          <span>Typ</span><span>Stav</span><span>Spuštěno</span><span className="text-right">Záznamy</span>
        </div>
        <div className="divide-y divide-white/5">
          {runs.map((run) => <div key={run.id} className="grid grid-cols-[110px_90px_1fr_90px] gap-3 px-4 py-3 text-sm">
            <span className="text-white/55">{run.run_type}</span>
            <span className={run.status === 'success' ? 'text-emerald-300' : run.status === 'error' ? 'text-red-300' : 'text-amber-300'}>{run.status}</span>
            <span className="truncate text-white/35">{formatDate(run.started_at)}</span>
            <span className="text-right font-mono text-cyan">{Number(run.records_count || 0).toLocaleString('cs-CZ')}</span>
          </div>)}
          {!runs.length && <p className="px-4 py-5 text-sm text-white/25">Zatím nebyl spuštěn žádný Databricks běh.</p>}
        </div>
      </div>
    </Card>
  </div>;
}

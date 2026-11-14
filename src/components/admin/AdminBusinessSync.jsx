import React, { useCallback, useState } from 'react';
import { AlertTriangle, CheckCircle2, DatabaseZap, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE/edit?gid=526985334';
const SITES_URL = 'https://mlzidla-obchodni-centrum.topmodel8.chatgpt.site/';
const GITLAB_URL = 'https://gitlab.com/holmtec-s-r-o-group/Mlzidla.cz/-/pipeline_schedules';

function Metric({ label, value }) {
  return <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
    <dt className="text-xs text-slate-500">{label}</dt>
    <dd className="mt-1 text-xl font-semibold tabular-nums text-[#102b3a]">{value ?? '—'}</dd>
  </div>;
}

export default function AdminBusinessSync() {
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const refresh = useCallback(async (apply) => {
    if (apply && !confirmed) return;
    setBusy(true);
    setError('');
    try {
      const response = await base44.functions.invoke('reconcileBusinessRecords', { apply, limit: 50 });
      const data = response?.data;
      if (!data?.ok) throw new Error(data?.error || 'sync_failed');
      setResult(data);
      if (apply) setConfirmed(false);
    } catch (exc) {
      const code = exc?.response?.data?.error || exc?.message || 'sync_failed';
      setError(code === 'business_sync_unavailable'
        ? 'Synchronizace není dostupná. Zkontrolujte oprávnění Google Sheets v Base44.'
        : String(code).slice(0, 180));
    } finally {
      setBusy(false);
    }
  }, [confirmed]);

  const counts = result?.contacts;
  return (
    <section aria-labelledby="business-sync-heading" className="rounded-2xl border border-slate-200 bg-[#f5f8fa] p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#008ea5]">Data / kontrola synchronizace</p>
          <h2 id="business-sync-heading" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a]">
            <DatabaseZap className="text-[#008ea5]" size={22} aria-hidden="true" /> Base44 · Google Sheets · Sites
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Jedna evidence zákazníků a samostatné případy podle ID webové poptávky. Kontrola nejprve porovná zdroje, bez zápisu a bez rozesílání e-mailů.
          </p>
        </div>
        <button type="button" disabled={busy} onClick={() => refresh(false)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#102b3a] px-4 text-sm font-semibold text-white hover:bg-[#20485c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ea5] disabled:opacity-50">
          <RefreshCw size={16} className={busy ? 'animate-spin' : ''} /> Zkontrolovat data
        </button>
      </div>

      <nav aria-label="Propojené obchodní systémy" className="mt-5 flex flex-wrap gap-2">
        {[
          { label: 'Hlavní obchodní tabulka', url: SHEET_URL },
          { label: 'Obchodní centrum Sites', url: SITES_URL },
          { label: 'GitLab plánované úlohy', url: GITLAB_URL },
          { label: 'GitLab MR v integracích', url: '/admin?tab=integrations' },
        ].map(link => <a href={link.url} key={link.label} target={link.url.startsWith('http') ? '_blank' : undefined}
          rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#102b3a] hover:border-[#008ea5]">
          {link.label} <ExternalLink size={13} aria-hidden="true" />
        </a>)}
      </nav>

      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      {result && <>
        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Metric label="E-maily v tabulce" value={counts?.unique_emails} />
          <Metric label="Duplicitní adresy" value={counts?.duplicate_emails} />
          <Metric label="Shoda s CRM" value={counts?.matched_existing} />
          <Metric label="Nové jednoznačné kontakty" value={counts?.new_unambiguous} />
          <Metric label="Webové poptávky" value={result.inquiries?.total} />
          <Metric label="Příležitosti" value={result.opportunities} />
        </dl>
        {counts?.duplicate_emails > 0 && <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {counts.duplicate_emails} duplicitních adres bude vynecháno. Žádné existující kontakty ani stavy nebudou přepsány.
        </p>}
        {result.applied && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 size={16} /> Importováno {counts?.imported ?? 0} nových kontaktů. Zbývá {counts?.remaining_to_import ?? 0}.
        </p>}
        {!result.applied && <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#008ea5]" />
            <span>Potvrzuji import maximálně 50 nových jednoznačných kontaktů do Base44 CRM. Stávající záznamy, Google Sheets a Sites se nezmění.</span>
          </label>
          <button type="button" disabled={!confirmed || busy || !counts?.new_unambiguous} onClick={() => refresh(true)}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#008ea5] px-4 text-sm font-semibold text-white disabled:opacity-50">
            Importovat ověřené kontakty
          </button>
        </div>}
      </>}

      <p className="mt-5 flex gap-2 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
        <ShieldCheck size={16} className="shrink-0 text-[#008ea5]" />
        Zápis je omezen na nové kontakty; nezakládá obchodní nabídky bez kontroly ceny. Sites nyní slouží jako samostatný přehled, nikoliv obousměrně synchronizovaná databáze.
      </p>
    </section>
  );
}

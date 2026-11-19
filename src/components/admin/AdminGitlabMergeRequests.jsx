import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, GitPullRequest, RefreshCw, Search, ShieldCheck, AlertCircle, Clock3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SCOPES = [
  { value: 'created_by_me', label: 'Moje návrhy' },
  { value: 'assigned_to_me', label: 'Přiřazené mně' },
  { value: 'reviews_for_me', label: 'K revizi' },
];

const ERROR_MESSAGES = {
  gitlab_not_connected: 'GitLab zatím není autorizovaný. Dokončete připojení v Base44 → Integrace.',
  gitlab_auth_required: 'Oprávnění GitLab vypršelo nebo nestačí. Znovu potvrďte připojení.',
  gitlab_rate_limited: 'GitLab dočasně omezuje počet požadavků. Zkuste obnovení později.',
  gitlab_unavailable: 'GitLab právě neodpovídá. Zkuste to později.',
  unauthorized: 'Pro přehled je nutné přihlášení administrátora.',
  forbidden: 'Tento přehled je dostupný pouze administrátorům.',
};

const dateLabel = (value) => {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
    : 'Datum neznámé';
};

function SummaryCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4 sm:p-5">
      <p className="text-[10px] font-medium uppercase tracking-[.14em] text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/35">{hint}</p>}
    </div>
  );
}

export default function AdminGitlabMergeRequests() {
  const [scope, setScope] = useState('created_by_me');
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [state, setState] = useState({ loading: true, error: '', hasMore: false, fetchedAt: '' });

  const refresh = useCallback(async (requestedScope) => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const result = await base44.functions.invoke('getGitlabMergeRequests', { scope: requestedScope });
      const data = result?.data || {};
      if (!data.ok || !Array.isArray(data.items)) throw new Error(data.error || 'gitlab_api_failed');
      setItems(data.items);
      setState({ loading: false, error: '', hasMore: Boolean(data.has_more), fetchedAt: data.fetched_at || '' });
    } catch (error) {
      const code = error?.response?.data?.error || error?.message || 'gitlab_api_failed';
      setItems([]);
      setState({ loading: false, error: code, hasMore: false, fetchedAt: '' });
    }
  }, []);

  useEffect(() => { refresh(scope); }, [scope, refresh]);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('cs-CZ');
    return !needle ? items : items.filter((mr) =>
      [mr.title, mr.project, mr.source_branch, mr.target_branch, mr.author, ...(mr.labels || [])]
        .some((value) => String(value || '').toLocaleLowerCase('cs-CZ').includes(needle))
    );
  }, [items, query]);

  const summary = useMemo(() => ({
    total: items.length,
    drafts: items.filter((mr) => mr.draft).length,
    projects: new Set(items.map((mr) => mr.project_id).filter(Boolean)).size,
  }), [items]);

  return (
    <section id="gitlab-mrs" aria-labelledby="gitlab-mrs-title" className="rounded-3xl border border-white/10 bg-[#101c27] p-4 shadow-xl sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan">Vývoj · GitLab / Merge Requests</p>
          <h3 id="gitlab-mrs-title" className="mt-2 flex items-center gap-3 text-xl font-semibold text-white sm:text-2xl">
            <GitPullRequest className="shrink-0 text-cyan" size={24} aria-hidden="true" />
            Otevřené Merge Requesty
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            Přehled z připojeného účtu GitLab. Zobrazení je pouze pro čtení; slučování a změny kódu probíhají v GitLabu po schválení.
          </p>
        </div>
        <button type="button" onClick={() => refresh(scope)} disabled={state.loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.055] px-4 text-xs font-semibold text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan disabled:opacity-50">
          <RefreshCw size={15} className={state.loading ? 'animate-spin' : ''} aria-hidden="true" />
          Obnovit GitLab
        </button>
      </div>

      <div role="group" aria-label="Typ Merge Requestů" className="mt-6 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
        {SCOPES.map((item) => (
          <button key={item.value} type="button" onClick={() => setScope(item.value)} aria-pressed={scope === item.value}
            className={`min-h-11 rounded-lg px-1 py-2 text-[11px] font-semibold transition sm:px-3 sm:text-sm ${scope === item.value ? 'bg-cyan text-[#0b1a25]' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {state.error ? (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
          <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <div>
            <p className="font-semibold">Připojení GitLab není připravené</p>
            <p className="mt-1 leading-6 text-amber-100/80">{ERROR_MESSAGES[state.error] || 'Data se nepodařilo načíst. Ověřte připojení GitLab v Base44.'}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3" aria-live="polite">
            <SummaryCard label="Otevřené MR" value={state.loading ? '…' : summary.total} />
            <SummaryCard label="Rozpracované" value={state.loading ? '…' : summary.drafts} />
            <SummaryCard label="Projekty" value={state.loading ? '…' : summary.projects} />
          </div>

          <label className="mt-5 flex min-h-11 items-center gap-3 rounded-xl border border-white/15 bg-black/20 px-4 focus-within:border-cyan">
            <Search size={17} className="shrink-0 text-white/40" aria-hidden="true" />
            <span className="sr-only">Filtrovat Merge Requesty</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Hledat podle názvu, projektu nebo větve"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
          </label>

          <div className="mt-4 space-y-3">
            {!state.loading && visible.length === 0 && (
              <p className="rounded-xl border border-white/10 bg-white/[.025] px-5 py-10 text-center text-sm text-white/55">
                {query ? 'Žádný Merge Request neodpovídá filtru.' : 'V této skupině nemáte žádné otevřené Merge Requesty.'}
              </p>
            )}
            {visible.map((mr) => (
              <article key={mr.id} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 transition-colors hover:border-cyan/30 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-all font-mono text-[10px] uppercase tracking-wide text-cyan/80">{mr.project || 'GitLab projekt'} · !{mr.iid}</p>
                    <h4 className="mt-2 text-sm font-semibold leading-6 text-white sm:text-base">{mr.title}</h4>
                    <p className="mt-2 break-all font-mono text-[11px] text-white/45">{mr.source_branch} <span aria-hidden="true">→</span> {mr.target_branch}</p>
                  </div>
                  {mr.web_url && <a href={mr.web_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-cyan/40 px-4 text-xs font-semibold text-cyan transition hover:bg-cyan/10">
                    Otevřít v GitLabu <ArrowUpRight size={14} aria-hidden="true" />
                  </a>}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
                  {mr.draft && <span className="rounded-full border border-amber-400/30 px-2.5 py-1 text-amber-200">Draft</span>}
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={12} aria-hidden="true" /> {dateLabel(mr.updated_at)}</span>
                  {mr.author && <span>Autor: {mr.author}</span>}
                  {(mr.labels || []).map((label) => <span key={label} className="rounded-full bg-white/10 px-2.5 py-1">{label}</span>)}
                </div>
              </article>
            ))}
          </div>
          {state.hasMore && <p className="mt-4 text-xs text-amber-200/70">Zobrazuje se prvních 50 výsledků. Další MR otevřete přímo v GitLabu.</p>}
          {state.fetchedAt && <p className="mt-4 text-[11px] text-white/30">Poslední načtení: {dateLabel(state.fetchedAt)}</p>}
        </>
      )}
      <p className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/40">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-cyan" aria-hidden="true" />
        GitLab token je uložený pouze na backendu Base44. Zobrazení je určené administrátorům; žádné automatické sloučení ani odesílání notifikací.
      </p>
    </section>
  );
}

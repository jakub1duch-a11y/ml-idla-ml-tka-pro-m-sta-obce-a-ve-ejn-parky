import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Inbox, Loader2, MessageSquare, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BTN = 'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors';
const DATE = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const VIEWS = [
  { id: 'all', label: 'Všechna vlákna' },
  { id: 'unread', label: 'Nové odpovědi' },
  { id: 'inbound', label: 'Příchozí' },
  { id: 'outbound', label: 'Čekáme na reakci' },
  { id: 'drafts', label: 'Koncepty' },
];
const getStatus = (item) => {
  if (item.has_draft) return { label: 'Rozpracovaný koncept', cls: 'border-amber-300/25 bg-amber-300/10 text-amber-100' };
  if (item.unread && item.last_direction === 'incoming') return { label: 'Nová odpověď', cls: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200' };
  if (item.last_direction === 'incoming') return { label: 'Příchozí zpráva', cls: 'border-sky-300/25 bg-sky-300/10 text-sky-100' };
  return { label: 'Čekáme na reakci', cls: 'border-white/15 bg-white/[0.05] text-white/65' };
};
function mergeThreads(previous, next) {
  const rows = new Map(previous.map((item) => [item.id, item]));
  next.forEach((item) => rows.set(item.id, item));
  return [...rows.values()].sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
}

export default function GmailConversationsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState('');
  const [estimated, setEstimated] = useState(0);
  const [checkedAt, setCheckedAt] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const refresh = useCallback(async (pageToken = '') => {
    if (pageToken) setLoadingMore(true);
    else setLoading(true);
    if (!pageToken) setError('');
    try {
      const response = await base44.functions.invoke('getSalesGmailThreads', { page_token: pageToken });
      const data = response?.data || {};
      if (data.error || !data.connected) throw new Error(data.error || 'Gmail není dostupný.');
      if (String(data.mailbox).toLowerCase() !== 'meduna@holmtec.cz') throw new Error('Připojen nečekaný Gmail účet.');
      setRows((before) => pageToken ? mergeThreads(before, data.threads || []) : (data.threads || []));
      setNextPage(data.next_page_token || '');
      setEstimated(Number(data.result_size_estimate || 0));
      setCheckedAt(data.checked_at || '');
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Nelze načíst otevřené konverzace.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 90000);
    const whenVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', whenVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', whenVisible);
    };
  }, [refresh]);

  const visible = useMemo(() => rows.filter((row) => {
    if (filter === 'unread' && !(row.unread && row.last_direction === 'incoming')) return false;
    if (filter === 'inbound' && row.last_direction !== 'incoming') return false;
    if (filter === 'outbound' && row.last_direction !== 'outgoing') return false;
    if (filter === 'drafts' && !row.has_draft) return false;
    const needle = search.toLocaleLowerCase('cs-CZ').trim();
    return !needle || [row.contact, row.subject, row.snippet].join(' ').toLocaleLowerCase('cs-CZ').includes(needle);
  }), [rows, filter, search]);
  const unread = rows.filter((row) => row.unread && row.last_direction === 'incoming').length;
  const drafts = rows.filter((row) => row.has_draft).length;

  return <section aria-label="Otevřené e-mailové konverzace MLŽIDLA.cz" className="rounded-2xl border border-cyan/20 bg-[#102633] p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-cyan">GMAIL / MLŽIDLA.CZ</p>
        <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-white"><MessageSquare size={19} className="text-cyan"/> Otevřené e-mailové konverzace</h2>
        <p className="mt-1 text-xs text-white/55">Výhradně účet meduna@holmtec.cz · příchozí, odeslané odpovědi a koncepty · jedno vlákno na zákazníka.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 px-2.5 py-1 text-[11px] text-emerald-200"><ShieldCheck size={12}/> Administrátoři</span>
        <button type="button" onClick={() => refresh()} disabled={loading || loadingMore} className={BTN + ' border-white/15 text-white/75 disabled:opacity-40'}>
          {loading ? <Loader2 size={14} className="animate-spin"/> : <RefreshCw size={14}/>} Obnovit
        </button>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">Načteno: <strong className="text-white">{rows.length}</strong>{estimated ? ' · v Gmailu přibližně ' + estimated : ''}</span>
      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">Nové odpovědi: <strong className="text-emerald-300">{unread}</strong></span>
      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">Koncepty ve vláknech: <strong className="text-amber-200">{drafts}</strong></span>
    </div>
    {error && <div role="alert" className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
      {error} <span className="block mt-1 text-xs text-white/65">Nejde o prázdnou poštu. Připojení a oprávnění k jejímu čtení je nutné ověřit v Base44.</span>
    </div>}
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrovat e-mailové konverzace">
      {VIEWS.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)}
        className={BTN + (filter === item.id ? ' border-cyan/50 bg-cyan/15 text-cyan' : ' border-white/15 text-white/65 hover:bg-white/5')}>
        {item.label}
      </button>)}
    </div>
    <label className="relative mt-3 block">
      <Search size={16} className="absolute left-3 top-3.5 text-white/45"/>
      <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Hledat jméno, organizaci nebo předmět…" aria-label="Hledat konverzace"
        className="w-full rounded-xl border border-white/15 bg-[#0b1d27] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan/50"/>
    </label>
    {loading && rows.length === 0 && <p className="mt-5 flex items-center gap-2 text-sm text-white/60" role="status"><Loader2 size={16} className="animate-spin"/> Načítám vlákna z Gmailu…</p>}
    {!loading && !error && visible.length === 0 && <p className="mt-4 rounded-lg border border-white/10 p-4 text-sm text-white/55">
      {rows.length ? 'V načtených zprávách nic neodpovídá filtru. Zkuste načíst další vlákna.' : 'Žádná relevantní konverzace nebyla nalezena.'}
    </p>}
    <div className="mt-3 divide-y divide-white/10">
      {visible.map((row) => {
        const status = getStatus(row);
        return <article key={row.id} className="py-3.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={'rounded-full border px-2 py-0.5 text-[10px] font-semibold ' + status.cls}>{status.label}</span>
                {row.label_match && <span className="text-[10px] text-cyan/75">Štítek MLŽIDLA</span>}
                <span className="text-[10px] text-white/40">{row.message_count} zpráv</span>
              </div>
              <p className="mt-1.5 truncate text-sm font-semibold text-white">{row.subject}</p>
              <p className="mt-1 truncate text-xs text-white/65">{row.contact || 'Kontakt není uvedený'}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">{row.snippet}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="whitespace-nowrap text-[11px] text-white/45">{row.updated_at ? DATE.format(new Date(row.updated_at)) : '—'}</span>
              <a href={row.url} target="_blank" rel="noopener noreferrer" className={BTN + ' whitespace-nowrap border-cyan/30 text-cyan'}>
                Gmail <ExternalLink size={13}/>
              </a>
            </div>
          </div>
        </article>;
      })}
    </div>
    {nextPage && <button type="button" disabled={loadingMore || loading} onClick={() => refresh(nextPage)}
      className={BTN + ' mt-4 w-full border-white/15 text-white/75 disabled:opacity-40'}>
      {loadingMore ? <Loader2 size={14} className="animate-spin"/> : <Inbox size={14}/>} Načíst další konverzace
    </button>}
    <p className="mt-3 text-[11px] leading-5 text-white/40">
      Stav je odvozen z poslední zprávy v Gmailu, nikoliv z ručního uzavření obchodního případu.
      Zobrazuje se pouze souhrn; celý obsah a odpovědi zůstávají v Gmailu.
      {checkedAt && <> · Poslední načtení: {DATE.format(new Date(checkedAt))}</>}
    </p>
  </section>;
}

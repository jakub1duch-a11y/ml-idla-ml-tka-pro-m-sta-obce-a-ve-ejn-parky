import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, ExternalLink, RefreshCw, ShieldCheck, Table2, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE/edit?gid=1776486526#gid=1776486526';
const safeDate = (v) => {
  const d = new Date(v || '');
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('cs-CZ');
};

function Stat({ label, value, hint }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold tabular-nums text-[#102b3a]">{value ?? '—'}</p>
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>;
}

export default function AdminBusinessSyncPanel() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(async (apply = false) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await base44.functions.invoke('reconcileBusinessRecords', { apply, limit: 50 });
      const data = result?.data || {};
      if (!data.ok) throw new Error(data.error || 'sync_unavailable');
      setReport(data);
      if (apply) setNotice(`Importováno ${data.contacts.imported} nových kontaktů do Base44. Zdrojová tabulka a již existující kontakty zůstaly beze změny.`);
      setConfirm(false);
    } catch (err) {
      const code = err?.response?.data?.error || err?.message || '';
      setError(code === 'unexpected_sheet_columns'
        ? 'Struktura hlavní tabulky se změnila. Synchronizace byla bezpečně zastavena.'
        : code.includes('Nesprávný účet')
        ? 'Google Sheets je připojen pod jiným účtem než meduna@holmtec.cz. Ověřte připojení v Integracích.'
        : 'Přehled se nepodařilo načíst. Ověřte autorizaci Google Sheets účtu meduna@holmtec.cz.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const contacts = report?.contacts || {};
  const inquiries = report?.inquiries || {};
  const stats = useMemo(() => [
    { label: 'Hlavní evidence', value: contacts.unique_emails, hint: 'Jedinečné e-mailové adresy' },
    { label: 'Duplicitní e-maily', value: contacts.duplicate_emails, hint: 'Nezařazovat automaticky' },
    { label: 'Nové pro Base44', value: contacts.new_unambiguous, hint: 'Bez existujícího CRM záznamu' },
    { label: 'Webové poptávky', value: inquiries.total, hint: 'Samostatné obchodní případy' },
  ], [contacts.unique_emails, contacts.duplicate_emails, contacts.new_unambiguous, inquiries.total]);

  return <section aria-labelledby="business-sync-title" className="rounded-2xl border border-slate-200 bg-[#f7fbfc] p-4 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008ea5]">MLŽIDLA.cz / Zdrojová evidence</p>
        <h2 id="business-sync-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a] sm:text-2xl"><Database size={22} className="text-[#008ea5]"/> Propojení obchodních záznamů</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Google Sheets je zdrojem kontaktů; Base44 uchovává poptávky, stavy nabídek a související dokumenty. Opakující se e-maily neimportujeme dvakrát a existující stavy nepřepisujeme.
        </p>
      </div>
      <button type="button" onClick={() => load(false)} disabled={busy}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-[#102b3a] hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008ea5] disabled:opacity-50">
        <RefreshCw size={16} className={busy ? 'animate-spin' : ''}/> Zkontrolovat data
      </button>
    </div>

    {error && <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={18} className="shrink-0"/>{error}</div>}
    {notice && <div role="status" className="mt-5 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 size={18} className="shrink-0"/>{notice}</div>}

    <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
      {stats.map((s) => <Stat key={s.label} {...s} value={busy && !report ? '…' : s.value}/>)}
    </div>

    {report && <div className="mt-5 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-[#102b3a]"><Table2 size={16} className="text-[#008ea5]" /> Google Sheets</p>
        <p className="mt-2 text-sm text-slate-600">Příležitostí: <strong>{report.opportunities}</strong> · Cenových nabídek: <strong>{report.offers}</strong></p>
        <p className="mt-2 text-xs text-slate-500">Načtené řádky: {contacts.rows}. Neplatný či prázdný e-mail: {contacts.invalid_or_blank_email_rows}.</p>
        <a className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#007b92] hover:underline" href={SHEET_URL} target="_blank" rel="noopener noreferrer">
          Otevřít hlavní tabulku <ExternalLink size={14}/>
        </a>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-[#102b3a]"><Users size={16} className="text-[#008ea5]" /> Base44 a Sites</p>
        <p className="mt-2 text-sm text-slate-600">Base44 CRM: <strong>{contacts.base44_existing}</strong> načtených kontaktů. Shodných e-mailů s tabulkou: <strong>{contacts.matched_existing}</strong>.</p>
        <p className="mt-2 text-xs leading-5 text-amber-800">Sites: přímý import čeká na opravu datového schématu konektoru. Tento přehled neoznačuje Sites za synchronizovaný.</p>
      </div>
    </div>}

    {report && contacts.new_unambiguous > 0 && <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
        <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} disabled={busy} className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#008ea5]" />
        Importovat nejvýše 50 nových jednoznačných e-mailových kontaktů z hlavní evidence do CRM Base44. Nepřepisovat stávající kontakty, nerozesílat e-maily a neupravovat Google Sheets.
      </label>
      <button type="button" disabled={!confirm || busy} onClick={() => load(true)}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102b3a] px-5 text-sm font-semibold text-white hover:bg-[#1c485b] disabled:cursor-not-allowed disabled:opacity-40">
        <ShieldCheck size={16}/> Potvrdit import nových kontaktů
      </button>
    </div>}

    {report && <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-[#102b3a]">Poslední poptávky webu</p>
      <div className="mt-3 divide-y divide-slate-100">
        {(inquiries.latest || []).map((i) => <div key={i.id} className="grid gap-1 py-3 text-xs text-slate-600 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
          <p className="truncate font-semibold text-[#102b3a]">{i.name || i.email}</p>
          <p className="truncate">{i.product || 'Produkt neuveden'} · {i.offer_status || i.status}</p>
          <span className={i.in_sheet ? 'text-emerald-700' : 'text-amber-800'}>{i.in_sheet ? 'Kontakt v evidenci' : 'Chybí v kontaktech'}</span>
        </div>)}
      </div>
      <a href="/admin?tab=poptavky" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#007b92] hover:underline">Přejít na poptávky <ExternalLink size={14}/></a>
    </div>}

    <p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500">
      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#008ea5]"/> Synchronizace je chráněná administrátorským přihlášením. Import je pouze ruční, jednoznačný a idempotentní podle e-mailu. Žádné zákaznické nabídky se neposílají automaticky.
    </p>
  </section>;
}

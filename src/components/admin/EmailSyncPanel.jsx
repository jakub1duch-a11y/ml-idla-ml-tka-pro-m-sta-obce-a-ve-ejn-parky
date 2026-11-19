import React, { useState } from 'react';
import { RefreshCw, Mail, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function EmailSyncPanel({ onComplete }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const sync = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await base44.functions.invoke('syncGmailAndContacts', {});
      const data = response?.data || response || {};
      if (data.error) throw new Error(data.error);
      setResult(data);
      onComplete?.(data);
    } catch (e) {
      setError(e?.message || 'Synchronizace se nepodařila.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-cyan/20 bg-cyan/[.05] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-cyan">
            <RefreshCw size={13} /> Živá synchronizace
          </p>
          <h3 className="mt-1 text-base font-medium text-white/90">Gmail · kontakty · obchodní reakce</h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
            Načte kontakty ze sdíleného Mlžného disku a relevantní zprávy z Gmailu meduna@holmtec.cz.
            Odesílání e-mailů se tímto tlačítkem nespouští.
          </p>
        </div>
        <button type="button" onClick={sync} disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-xs font-bold text-ink transition hover:bg-white disabled:cursor-wait disabled:opacity-60">
          <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
          {busy ? 'Synchronizace probíhá…' : 'Synchronizovat nyní'}
        </button>
      </div>
      {result && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-black/15 p-3">
            <Users size={15} className="text-cyan" />
            <p className="mt-2 text-xl text-white">{result.contacts?.total || 0}</p>
            <p className="text-[10px] text-white/40">kontaktů ve zdroji</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/15 p-3">
            <Mail size={15} className="text-cyan" />
            <p className="mt-2 text-xl text-white">{result.gmail?.imported || 0}</p>
            <p className="text-[10px] text-white/40">nových zpráv</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/15 p-3">
            <CheckCircle2 size={15} className="text-emerald-300" />
            <p className="mt-2 text-xl text-white">{result.gmail?.scanned || 0}</p>
            <p className="text-[10px] text-white/40">zkontrolovaných zpráv</p>
          </div>
        </div>
      )}
      {error && <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-300"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{error}</div>}
    </section>
  );
}
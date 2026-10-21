import React, { useState } from 'react';
import { Send, Loader2, Shield, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SENDER = 'meduna@holmtec.cz';

export default function OfferSendDialog({ open, onClose, prepared, clientName, clientEmail, productName, validUntil, onSent }) {
  const quoteNumber = prepared?.quoteNumber || '';
  const first = (clientName || '').split(' ')[0] || 'vážený zákazníku';
  const [subject, setSubject] = useState(`Cenová nabídka${quoteNumber ? ` · ${quoteNumber}` : ''} — ${productName} | MLŽIDLA®`);
  const [message, setMessage] = useState(`Dobrý den ${first},\n\nděkujeme za vaši poptávku. Na základě vašeho zadání jsme připravili cenovou nabídku na ${productName}.\n\nV příloze najdete kompletní nabídku s vizualizacemi, technickým řešením a cenovou kalkulací. Vizualizace jsou ilustrační.\n\nNabídka je platná do ${validUntil}. Pokud budete chtít upravit umístění nebo rozsah, rádi návrh dopracujeme.`);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const send = async () => {
    if (!prepared?.projectOrder?.id) { setError('Nabídka není uložena — nejprve ji vytvořte.'); return; }
    setSending(true); setError(''); setSuccess('');
    try {
      const res = await base44.functions.invoke('sendClientOffer', {
        project_id: prepared.projectOrder.id, confirm_send: true, admin_override: true,
        custom_subject: subject, custom_message: message,
      });
      if (res.data?.ok) { setSuccess(`Nabídka odeslána na ${res.data.recipient}.`); await onSent?.(); }
      else setError(res.data?.error || 'Odeslání selhalo.');
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Chyba při odesílání.');
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold"><Send size={18} /> Odeslat nabídku klientovi</h3>
            <p className="text-xs text-slate-500">Odesílatel: <b>{SENDER}</b> · Příjemce: <b>{clientEmail}</b></p>
          </div>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>
        <div className="space-y-4 p-6">
          {error && <div className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"><AlertTriangle size={14} /> {error}</div>}
          {success && <div className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700"><CheckCircle2 size={14} /> {success}</div>}
          <label className="block text-xs font-semibold text-slate-500">Předmět
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900" />
          </label>
          <label className="block text-xs font-semibold text-slate-500">Doplňující text zprávy
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={10} className="mt-1 w-full rounded-xl border px-3 py-3 text-sm text-slate-900" />
            <span className="text-[10px] font-normal text-slate-400">Zpráva bude doplněna profesionální patičkou s logem MLŽIDLA.cz a kontaktem.</span>
          </label>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            {prepared?.quoteDriveUrl && <p className="flex items-center gap-2"><FileText size={12} /> PDF nabídka {quoteNumber}</p>}
            {(prepared?.visualizationUrls || []).map((u, i) => <p key={u} className="flex items-center gap-2"><FileText size={12} /> Vizualizace {i + 1}</p>)}
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"><Shield size={14} /> Nabídka se odešle až po kliknutí na „Odeslat“. Akce je nevratná.</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-full border px-5 py-3 text-sm font-bold">Zavřít</button>
            <button onClick={send} disabled={sending || !subject.trim() || !message.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#4f6b2e] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} {sending ? 'Odesílám…' : 'Odeslat nabídku'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
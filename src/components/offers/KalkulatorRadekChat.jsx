import React, { useState } from 'react';
import { Bot, Check, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    settings: {
      type: 'object',
      properties: {
        presentation_title: { type: 'string' },
        project_goal: { type: 'string' },
        solution_summary: { type: 'string' },
        benefits: { type: 'array', items: { type: 'string' } },
        next_step: { type: 'string' },
        price: { type: 'number' },
      },
    },
  },
  required: ['reply'],
};

export default function KalkulatorRadekChat({ inquiry, product, current, onApply }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Ahoj, jsem Radek. Napište, jaké nastavení nabídky mám navrhnout — texty, přínosy nebo cenu — a připravím je k vložení do editoru.' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const request = input.trim();
    if (!request || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [...m, { role: 'user', text: request }]);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Jsi „Kalkulátor Radek“ — asistent pro nastavení cenové nabídky MLŽIDLA.cz. Piš česky, stručně a profesionálně. Nevymýšlej technické parametry ani ceny, které nejsou v podkladech; cenu vrať pouze pokud ji uživatel zadá nebo lze odvodit z cenového kontextu, jinak ji vynech.
KLIENT: ${inquiry?.name || ''} · ${inquiry?.firma || inquiry?.company || ''}
POPTÁVKA: ${inquiry?.message || ''}
PRODUKT: ${product?.name || 'neurčen'}
AKTUÁLNÍ NASTAVENÍ EDITORU: ${JSON.stringify(current)}
ÚKOL: ${request}
Do "reply" napiš krátkou odpověď pro obchodníka. Do "settings" vrať pouze ta pole, která má smysl změnit.`,
      response_json_schema: SCHEMA,
    });
    setMessages((m) => [...m, { role: 'assistant', text: response.reply, settings: response.settings }]);
    setBusy(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-cyan-800"><Bot size={13} /> Kalkulátor Radek</p>
      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`rounded-lg px-3 py-2 text-xs leading-5 ${m.role === 'assistant' ? 'bg-slate-50 text-slate-700' : 'ml-6 bg-cyan-50 text-slate-800'}`}>
            <div className="whitespace-pre-line">{m.text}</div>
            {m.settings && Object.keys(m.settings).length > 0 && (
              <button type="button" onClick={() => onApply(m.settings)} className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#0e5b67] px-3 py-1 text-[10px] font-bold text-white">
                <Check size={11} /> Použít do editoru
              </button>
            )}
          </div>
        ))}
        {busy && <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500"><Loader2 size={13} className="animate-spin" /> Radek počítá…</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Např. navrhni 3 přínosy pro město a cenu 185 000 Kč" className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400" />
        <button type="button" onClick={send} disabled={busy || !input.trim()} className="rounded-xl bg-[#0e5b67] p-2.5 text-white disabled:opacity-40" aria-label="Odeslat Radkovi"><Send size={15} /></button>
      </div>
    </div>
  );
}
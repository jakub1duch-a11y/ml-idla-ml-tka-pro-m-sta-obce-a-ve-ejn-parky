import React, { useState } from 'react';
import { Bot, Loader2, Send, Sparkles, RefreshCw, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TONES = [
  { id: 'profesionalni', label: 'Profesionální' },
  { id: 'pratelsky', label: 'Přátelský' },
  { id: 'odborny', label: 'Odborný / technický' },
];

function buildPrompt(item, tone) {
  const toneDesc = {
    profesionalni: 'profesionální, zdvořilý a konkrétní',
    pratelsky: 'přátelský a lidský, ale stále profesionální',
    odborny: 'odborný a technicky přesný, pro architekty / starosty / projektanty',
  }[tone] || 'profesionální';

  return `Jsi obchodní asistent MLŽIDLA® by HolmTec s.r.o. — pomáháš odpovídat na poptávky klientů. 
Piš česky, tón: ${toneDesc}. Nevymlouvej ceny, termíny ani parametry, které nejsou v poptávce — místo toho je nabídníkuj schůzku nebo upřesnění. 
Odpověď je koncept, který člověk ještě zkontroluje a případně upraví před odesláním.

KONTEXT POPTÁVKY:
- Jméno: ${item.name || '—'}
- E-mail: ${item.email || '—'}
- Firma: ${item.company || 'neuvedeno'}
- Produkt zájmu: ${item.product || 'neuvedeno'}
- Zdroj: ${item.source}
- Zpráva klienta: ${item.message || '—'}

ÚKOL:
Napiš konkrétní odpověď na poptávku tohoto klienta. 
1) Krátce potvrď přijetí poptávky a děkuj.
2) Odkaz se na konkrétní produkt nebo situaci, kterou klient zmiňuje (pokud je známá).
3) Nabídni další krok — telefonát, upřesnění parametrů, návrh řešení nebo osobní schůzku.
4) Ukonči profesionálním pozdravem s podpisem MLŽIDLA® / HolmTec s.r.o.

Piš jen text e-mailu (bez předmětu), maximálně 180 slov.`;
}

export default function InquiryAiReply({ item }) {
  const [tone, setTone] = useState('profesionalni');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError('');
    setSent(false);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: buildPrompt(item, tone),
      });
      const text = typeof response === 'string' ? response : (response?.text || JSON.stringify(response));
      setDraft(text);
    } catch (e) {
      setError('AI odpověď se nepodařilo vygenerovat. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = () => {
    if (!item.email || !draft.trim()) return;
    const subject = `Re: Vaše poptávka — MLŽIDLA®`;
    const body = draft;
    const mailto = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <div className="rounded-xl border border-cyan/20 bg-cyan/[.04] p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan">
          <Bot size={13} /> AI asistent odpovědí
        </p>
        <div className="flex gap-1">
          {TONES.map((t) => (
            <button key={t.id} onClick={() => setTone(t.id)} disabled={loading}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all disabled:opacity-50 ${
                tone === t.id ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!draft && !loading && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-xs text-white/50 flex-1">
            AI navrhne konkrétní odpověď na dotaz klienta {item.name || ''} na základě jeho zprávy a zájmu.
            Koncept můžete upravit a odeslat e-mailem.
          </p>
          <button onClick={generate} disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan px-4 py-2 text-xs font-bold text-ink transition hover:bg-white disabled:opacity-50">
            <Sparkles size={13} /> Navrhnout odpověď
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-white/50 py-2">
          <Loader2 size={14} className="animate-spin text-cyan" /> AI připravuje odpověď…
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-300 mt-2">{error}</p>
      )}

      {draft && !loading && (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2.5 text-xs text-white/85 leading-relaxed outline-none focus:border-cyan/40 resize-y"
            placeholder="Upravte koncept odpovědi…"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={generate} disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white transition">
              <RefreshCw size={12} /> Znovu
            </button>
            <button onClick={sendEmail} disabled={!item.email || !draft.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan px-4 py-1.5 text-xs font-bold text-ink transition hover:bg-white disabled:opacity-40">
              <Send size={12} /> Odeslat e-mailem
            </button>
            {item.email ? (
              <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-mono text-white/50 hover:text-white transition">
                <Mail size={12} /> Otevřít mail
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-white/30">Klient bez e-mailu</span>
            )}
            {sent && <span className="self-center text-[10px] font-mono text-emerald-400">✓ Otevřen e-mailový klient</span>}
          </div>
        </div>
      )}
    </div>
  );
}
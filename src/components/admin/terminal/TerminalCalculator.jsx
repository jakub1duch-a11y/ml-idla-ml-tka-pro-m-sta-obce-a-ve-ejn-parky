import React, { useState } from 'react';
import { Calculator, Loader2, Mic } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useVoiceInput from '@/hooks/useVoiceInput';

const NOZZLE_LPH = 4.5;      // l/h na trysku při nízkém tlaku
const WATER_PRICE = 120;     // Kč/m³ vodné + stočné
const SEASON_DAYS = 90;

const fmt = (value) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value);

export default function TerminalCalculator() {
  const [nozzles, setNozzles] = useState(8);
  const [hours, setHours] = useState(6);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const { listening, supported, toggle } = useVoiceInput((text) => setQuestion(text));

  const litersPerDay = nozzles * NOZZLE_LPH * hours;
  const costPerDay = (litersPerDay / 1000) * WATER_PRICE;
  const seasonCost = costPerDay * SEASON_DAYS;

  const ask = async () => {
    const clean = question.trim();
    if (!clean || busy) return;
    setBusy(true);
    setAnswer('');
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Jsi AI kalkulátor mlžicích systémů MLŽIDLA.cz. Počítej pouze s dodanými vstupy, nevymýšlej ceny ani technické parametry. Odpověz česky, max 5 vět, s uvedeným výpočtem.

VSTUPY: ${nozzles} trysek, ${hours} h provozu denně, průtok ${NOZZLE_LPH} l/h na trysku, cena vody ${WATER_PRICE} Kč/m³, sezóna ${SEASON_DAYS} dní.
SPOČÍTANÉ HODNOTY: ${fmt(litersPerDay)} l/den, ${fmt(costPerDay)} Kč/den, ${fmt(seasonCost)} Kč za sezónu.

DOTAZ: ${clean}`,
    });
    setAnswer(typeof response === 'string' ? response : JSON.stringify(response));
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <p className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/40"><Calculator size={13} /> AI kalkulátor</p>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[10px] font-mono text-white/40">Počet trysek: {nozzles}</span>
          <input type="range" min="1" max="60" value={nozzles} onChange={(e) => setNozzles(Number(e.target.value))} className="mt-1 w-full accent-cyan" />
        </label>
        <label className="block">
          <span className="text-[10px] font-mono text-white/40">Provoz: {hours} h/den</span>
          <input type="range" min="1" max="16" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-1 w-full accent-cyan" />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[['l / den', fmt(litersPerDay)], ['Kč / den', fmt(costPerDay)], ['Kč / sezóna', fmt(seasonCost)]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2">
            <p className="text-[9px] font-mono uppercase text-white/40">{label}</p>
            <p className="text-cyan text-lg font-heading">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Zeptejte se na výpočet — např. kolik pro 3 mlžítka na náměstí?"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-cyan/40" />
        {supported && (
          <button type="button" onClick={toggle} aria-label="Hlasový výpočet"
            className={`rounded-xl border px-2.5 transition-all ${listening ? 'border-rose-400/50 bg-rose-400/15 text-rose-300' : 'border-white/10 text-white/40 hover:text-white'}`}>
            <Mic size={14} />
          </button>
        )}
        <button type="button" onClick={ask} disabled={busy || !question.trim()}
          className="rounded-xl bg-cyan px-3 text-[11px] font-bold text-ink disabled:opacity-40">
          {busy ? <Loader2 size={13} className="animate-spin" /> : 'Spočítat'}
        </button>
      </div>

      {answer && <p className="mt-3 whitespace-pre-line rounded-xl bg-white/5 px-3 py-2 text-xs leading-5 text-white/70">{answer}</p>}
    </div>
  );
}
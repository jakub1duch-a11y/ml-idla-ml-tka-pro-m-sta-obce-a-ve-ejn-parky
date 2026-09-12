import React, { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Mic, Send, Volume2, VolumeX } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useVoiceInput from '@/hooks/useVoiceInput';

export default function TerminalAdvisorChat({ context }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Jsem AI poradce terminálu. Zeptejte se na poptávky, priority dne nebo doporučení k projektu — můžete i mluvit.' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speechRef = useRef(null);
  const { listening, supported, toggle } = useVoiceInput((text, isFinal) => { setInput(text); if (isFinal) setTimeout(() => send(text), 150); });

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const speak = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/[*_#\`]/g, ''));
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang?.toLowerCase().startsWith('cs')) || voices.find((voice) => voice.lang?.toLowerCase().startsWith('sk')) || voices[0];
    utterance.lang = utterance.voice?.lang || 'cs-CZ';
    utterance.rate = 0.94;
    utterance.pitch = 0.82;
    utterance.volume = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const send = async (value = input) => {
    const request = String(value || '').trim();
    if (!request || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [...m, { role: 'user', text: request }]);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Jsi AI poradce interního terminálu MLŽIDLA.cz by HolmTec. Odpovídej česky, stručně a konkrétně. Nevymýšlej technické parametry, ceny ani termíny, které nejsou v kontextu.

AKTUÁLNÍ STAV:
${context}

DOTAZ: ${request}`,
    });
    setMessages((m) => [...m, { role: 'assistant', text: typeof response === 'string' ? response : JSON.stringify(response) }]);
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/40"><Bot size={13} /> AI poradce · hlasový režim</p>
        <button type="button" onClick={speaking ? stopSpeaking : () => speak(messages[messages.length - 1]?.text)} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/45 hover:border-cyan/30 hover:text-cyan" aria-label={speaking ? 'Zastavit hlas' : 'Přečíst poslední odpověď'}>
          {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />} {speaking ? 'Zastavit hlas' : 'Přečíst'}
        </button>
      </div>
      <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl px-3 py-2 text-xs leading-5 ${m.role === 'assistant' ? 'bg-white/5 text-white/70' : 'ml-6 bg-cyan/10 text-white'}`}>
            <div className="whitespace-pre-line">{m.text}</div>
          </div>
        ))}
        {busy && <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/40"><Loader2 size={12} className="animate-spin" /> Přemýšlím…</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={listening ? 'Posloucham…' : 'Napište nebo nadiktujte dotaz…'}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-cyan/40" />
        {supported && (
          <button type="button" onClick={toggle} aria-label="Hlasový dotaz"
            className={`rounded-xl border px-2.5 transition-all ${listening ? 'border-rose-400/50 bg-rose-400/15 text-rose-300' : 'border-white/10 text-white/40 hover:text-white'}`}>
            <Mic size={14} />
          </button>
        )}
        <button type="button" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Odeslat dotaz"
          className="rounded-xl bg-cyan px-2.5 text-ink disabled:opacity-40"><Send size={14} /></button>
      </div>
    </div>
  );
}
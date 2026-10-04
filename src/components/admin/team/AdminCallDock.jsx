import React, { useState } from 'react';
import { Video, X, Minus, Sparkles, Loader, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import VideoCall from './VideoCall';
import { respondAsAi } from '@/lib/teamAi';

// Globální dok videohovoru v administraci — dostupný na každé záložce.
export default function AdminCallDock({ user, contextLabel }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [ask, setAsk] = useState('');
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState(null);

  const askAi = async (e) => {
    e.preventDefault();
    const q = ask.trim();
    if (!q || thinking) return;
    setThinking(true);
    setAsk('');
    try {
      const reply = await respondAsAi('general', `@AI ${q}`, []);
      setAnswer(reply);
    } finally {
      setThinking(false);
    }
  };

  if (!user) return null;

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan/20">
        <Video size={16} /> <span className="hidden sm:inline">Videohovor týmu</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-5 right-5 z-50 w-[min(calc(100vw-2.5rem),380px)] overflow-hidden rounded-2xl border border-cyan/20 bg-[#0d1117] shadow-2xl ${minimized ? '' : 'max-h-[85vh] overflow-y-auto'}`}>
      <div className="flex items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
        <p className="min-w-0 truncate font-mono text-[10px] uppercase tracking-widest text-cyan">Hovor · {contextLabel}</p>
        <div className="flex items-center gap-1 text-white/40">
          <button onClick={() => setMinimized((v) => !v)} aria-label="Minimalizovat" className="rounded-md p-1.5 hover:bg-white/10 hover:text-white">{minimized ? <Video size={14} /> : <Minus size={14} />}</button>
          <button onClick={() => setOpen(false)} aria-label="Zavřít" className="rounded-md p-1.5 hover:bg-white/10 hover:text-white"><X size={14} /></button>
        </div>
      </div>
      {!minimized && (
        <div className="p-3">
          <VideoCall room="admin:team" user={user} onEnd={() => setOpen(false)} />
          <form onSubmit={askAi} className="flex items-end gap-2">
            <textarea value={ask} onChange={(e) => setAsk(e.target.value)} rows={2}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) askAi(e); }}
              placeholder="Zeptej se AI agenta během hovoru…"
              className="min-w-0 flex-1 resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-cyan/40 focus:outline-none" />
            <button type="submit" disabled={thinking || !ask.trim()} aria-label="Odeslat dotaz AI"
              className="rounded-xl bg-violet-500/80 p-2.5 text-white disabled:opacity-40">
              {thinking ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
          {(thinking || answer) && (
            <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-violet-400/25 bg-violet-400/10 p-3 text-xs text-white/80">
              <p className="mb-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-violet-200"><Sparkles size={10} /> AI agent</p>
              {thinking ? <p className="text-violet-200/70">Připravuji odpověď…</p> : answer?.image_url ? (
                <a href={answer.image_url} target="_blank" rel="noreferrer"><img src={answer.image_url} alt={answer.message} className="w-full rounded-lg" /></a>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none [&_li]:my-0.5 [&_p]:my-1.5 [&_strong]:text-white"><ReactMarkdown>{answer?.message || ''}</ReactMarkdown></div>
              )}
              <p className="mt-2 font-mono text-[10px] text-white/25">Uloženo do týmového chatu #Obecné</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
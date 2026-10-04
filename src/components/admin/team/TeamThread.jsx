import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import { isAiMention, respondAsAi, AI_AUTHOR } from '@/lib/teamAi';

export default function TeamThread({ channel, placeholder = 'Napiš zprávu týmu…', compact = false }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const bottomRef = useRef(null);
  const append = (m) => setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  useEffect(() => {
    setLoading(true);
    base44.entities.TeamMessage.filter({ channel }, 'created_date', 300).then((rows) => {
      setMessages(rows || []);
      setLoading(false);
    });
    const unsubscribe = base44.entities.TeamMessage.subscribe((event) => {
      if (event.data?.channel !== channel) return;
      setMessages((prev) => {
        if (event.type === 'delete') return prev.filter((m) => m.id !== event.id);
        if (prev.some((m) => m.id === event.data.id)) return prev.map((m) => (m.id === event.data.id ? event.data : m));
        return [...prev, event.data];
      });
    });
    return unsubscribe;
  }, [channel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, aiThinking]);

  const send = async () => {
    const message = text.trim();
    if (!message || !user) return;
    setSending(true);
    const created = await base44.entities.TeamMessage.create({
      channel,
      author_email: user.email,
      author_name: user.full_name || user.email,
      message,
    });
    append(created);
    setText('');
    setSending(false);
    if (isAiMention(message)) {
      setAiThinking(true);
      try {
        const reply = await respondAsAi(channel, message, [...messages, created]);
        append(reply);
      } finally {
        setAiThinking(false);
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`flex-1 space-y-2 overflow-auto pr-1 ${compact ? 'max-h-64' : ''}`}>
        {loading ? (
          <div className="flex justify-center py-6"><Loader size={16} className="animate-spin text-cyan/50" /></div>
        ) : messages.length === 0 ? (
          <p className="py-6 text-center text-xs text-white/25">Zatím žádné zprávy.</p>
        ) : messages.map((m) => {
          const mine = user && m.author_email === user.email;
          const isAi = m.author_email === AI_AUTHOR.author_email;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl border px-3 py-2 ${mine ? 'border-cyan/20 bg-cyan/10' : isAi ? 'border-violet-400/25 bg-violet-400/10' : 'border-white/8 bg-white/5'}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className={`flex items-center gap-1 text-[11px] font-medium ${isAi ? 'text-violet-200' : 'text-white/70'}`}>{isAi && <Sparkles size={10} />}{m.author_name || m.author_email}</p>
                  <span className="font-mono text-[9px] text-white/25">{new Date(m.created_date).toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {isAi ? (
                  <div className="prose prose-invert prose-sm mt-1 max-w-none text-sm leading-relaxed text-white/80 [&_li]:my-0.5 [&_p]:my-1.5 [&_strong]:text-white [&_ul]:my-1.5 [&_ol]:my-1.5"><ReactMarkdown>{m.message}</ReactMarkdown></div>
                ) : (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/80">{m.message}</p>
                )}
                {m.image_url && (
                  <a href={m.image_url} target="_blank" rel="noreferrer" className="mt-2 block overflow-hidden rounded-lg border border-white/10">
                    <img src={m.image_url} alt={m.message} className="max-h-72 w-full object-contain bg-black/30" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {aiThinking && (
          <div className="flex justify-start"><div className="inline-flex items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-400/10 px-3 py-2 text-xs text-violet-200"><Loader size={12} className="animate-spin" /> AI asistent připravuje odpověď…</div></div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} rows={compact ? 1 : 2} placeholder={placeholder}
          className="min-h-[44px] flex-1 resize-none rounded-lg border border-white/10 bg-black/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20" />
        <button onClick={send} disabled={sending || !text.trim()} aria-label="Odeslat" className="self-end rounded-lg bg-cyan p-3 text-slate-950 disabled:opacity-40">
          {sending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}
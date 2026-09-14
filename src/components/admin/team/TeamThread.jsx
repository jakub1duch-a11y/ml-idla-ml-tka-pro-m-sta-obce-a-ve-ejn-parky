import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TeamThread({ channel, placeholder = 'Napiš zprávu týmu…', compact = false }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

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
  }, [messages.length]);

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
    setMessages((prev) => (prev.some((m) => m.id === created.id) ? prev : [...prev, created]));
    setText('');
    setSending(false);
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
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl border px-3 py-2 ${mine ? 'border-cyan/20 bg-cyan/10' : 'border-white/8 bg-white/5'}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-medium text-white/70">{m.author_name || m.author_email}</p>
                  <span className="font-mono text-[9px] text-white/25">{new Date(m.created_date).toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/80">{m.message}</p>
              </div>
            </div>
          );
        })}
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
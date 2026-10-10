import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
export default function PortalAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function send(event) {
    event.preventDefault(); if (!input.trim() || busy) return;
    const next = [...messages, { role: 'user', text: input.trim() }];
    setBusy(true); setError('');
    try {
      const { data } = await base44.functions.invoke('mistingAdvisorChat', { messages: next, source_page: window.location.href });
      if (!data.reply) throw new Error('empty_reply');
      setMessages([...next, { role: 'assistant', text: data.reply }]); setInput('');
    } catch { setError('Asistent je nyní nedostupný. Zprávu můžete zkusit znovu nebo kontaktovat náš tým.'); }
    finally { setBusy(false); }
  }
  return <section className="rounded-lg border bg-card p-5 sm:p-8" aria-labelledby="assistant-title">
    <Bot className="mb-3 text-primary"/><h2 id="assistant-title" className="text-2xl">Asistent MLŽIDLA</h2>
    <p className="mt-2 text-sm text-muted-foreground">AI poradce pro výběr, instalaci a údržbu. Nemění objednávky ani nepotvrzuje termíny; konkrétní nabídku řešte s týmem v jejím detailu. Konverzace zůstává pouze v této otevřené stránce.</p>
    <div role="log" aria-live="polite" className="my-6 max-h-96 space-y-3 overflow-y-auto">
      {!messages.length && <p className="rounded-lg bg-muted p-4 text-sm">Dobrý den, s čím vám mohu pomoci?</p>}
      {messages.map((m,i) => <div key={i} className={`max-w-[95%] whitespace-pre-wrap break-words rounded-lg p-4 text-sm ${m.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted text-foreground'}`}><strong className="mb-1 block text-xs">{m.role === 'user' ? 'Vy' : 'AI asistent'}</strong>{m.text}</div>)}
      {busy && <p role="status" className="flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin"/>Připravuji odpověď…</p>}
    </div>
    <form onSubmit={send} className="space-y-3"><label htmlFor="portal-question" className="text-sm font-medium">Vaše zpráva</label><textarea id="portal-question" value={input} onChange={e=>setInput(e.target.value)} maxLength={1800} rows={3} required disabled={busy} className="w-full rounded-lg border bg-background p-3" placeholder="Jak připravit mlžítko na zimní období?"/><button className="portal-primary" disabled={busy || !input.trim()}><Send size={16}/>Odeslat asistentovi</button></form>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error} <Link to="/kontakt" className="underline">Kontaktovat tým</Link></p>}
  </section>;
}
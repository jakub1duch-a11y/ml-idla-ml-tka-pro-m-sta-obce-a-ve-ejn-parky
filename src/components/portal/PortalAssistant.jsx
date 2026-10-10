import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, Loader2, ShieldCheck, MessageSquare, X, ChevronDown, User, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const INITIAL = { role: 'assistant', text: 'Dobrý den, jsem váš osobní asistent MLŽIDLA®. Vidím vaše zakázky a pomohu s technickými dotazy — instalace, parametry, údržba, příprava provozu. Na co se chcete zeptat?' };

const STARTERS = [
  'Jaké jsou technické parametry mého mlžítka?',
  'Na co si dát pozor při přípravě přívodu vody?',
  'Jak probíhá instalace a kotvení?',
  'Jak často provádět údržbu před sezónou?',
];

export default function PortalAssistant({ projects = [], user }) {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const [messages, setMessages] = useState([INITIAL]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState(STARTERS);
  const [hasProjects, setHasProjects] = useState(null);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardProject, setForwardProject] = useState('');
  const [forwardMessage, setForwardMessage] = useState('');
  const [forwardCategory, setForwardCategory] = useState('technical');
  const [forwardBusy, setForwardBusy] = useState(false);
  const [forwardDone, setForwardDone] = useState(false);
  const [forwardError, setForwardError] = useState('');
  const logRef = useRef(null);

  const activeProjects = projects.filter(p => !['draft', 'pending_approval'].includes(p.status));

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, busy]);

  async function send(value) {
    const text = String(value ?? input).trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user', text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setError('');
    try {
      const { data } = await base44.functions.invoke('portalProjectChat', { messages: next });
      if (!data?.reply) throw new Error('empty_reply');
      setMessages([...next, { role: 'assistant', text: data.reply }]);
      setHasProjects(data.has_projects);
      if (Array.isArray(data.suggested_questions) && data.suggested_questions.length) setSuggestions(data.suggested_questions);
      else setSuggestions([]);
    } catch {
      setError('Asistent je nyní nedostupný. Zkuste to za chvíli znovu nebo předejte dotaz našemu týmu.');
    } finally {
      setBusy(false);
    }
  }

  async function forwardToTeam(event) {
    event.preventDefault();
    if (!forwardProject || !forwardMessage.trim() || forwardBusy) return;
    setForwardBusy(true);
    setForwardError('');
    try {
      const session = await base44.functions.invoke('loginPortalWithBase44Session', { mode: 'session_only' });
      const sessionToken = session?.data?.session_token;
      if (!sessionToken) throw new Error('no_session');
      const { data } = await base44.functions.invoke('sendOfferMessage', {
        project_id: forwardProject,
        session_token: sessionToken,
        message: forwardMessage.trim(),
        category: forwardCategory,
      });
      if (!data?.ok) throw new Error('send_failed');
      setForwardDone(true);
    } catch {
      setForwardError('Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.');
    } finally {
      setForwardBusy(false);
    }
  }

  function resetForward() {
    setForwardOpen(false);
    setForwardProject('');
    setForwardMessage('');
    setForwardCategory('technical');
    setForwardDone(false);
    setForwardError('');
  }

  return (
    <section aria-labelledby="assistant-title" className="rounded-lg border bg-card overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b bg-secondary px-5 py-4 text-secondary-foreground sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Bot size={22} /></span>
          <div>
            <h2 id="assistant-title" className="text-lg font-semibold">Asistent MLŽIDLA®</h2>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={12} /> AI podpora k vašim zakázkám · 24/7
            </p>
          </div>
        </div>
        {hasProjects === false && (
          <span className="hidden rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:inline">Zatím bez zakázky</span>
        )}
      </header>

      <div ref={logRef} role="log" aria-live="polite" className="max-h-[460px] min-h-[320px] space-y-3 overflow-y-auto bg-muted/30 p-4 sm:p-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/15 text-accent'}`}>
              {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </span>
            <div className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border text-foreground'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"><Bot size={15} /></span>
            <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Připravuji odpověď…
            </div>
          </div>
        )}
      </div>

      {!busy && suggestions.length > 0 && (
        <div className="border-t px-4 py-3 sm:px-6">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Navazující otázky</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((q, i) => (
              <button key={i} type="button" onClick={() => send(q)} className="rounded-full border bg-card px-3 py-1.5 text-left text-xs text-muted-foreground transition hover:border-accent hover:text-accent">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mx-4 mb-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive sm:mx-6">
          {error}
        </p>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t p-4 sm:p-6">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            maxLength={1800}
            rows={2}
            required
            disabled={busy}
            className="flex-1 resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:border-accent"
            placeholder="Napište technický dotaz ke své zakázce…"
          />
          <button type="submit" disabled={busy || !input.trim()} className="portal-primary self-end" aria-label="Odeslat zprávu">
            <Send size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Asistent odpovídá na základě vašich zakázek a ověřeného katalogu.</p>
          {activeProjects.length > 0 && (
            <button type="button" onClick={() => setForwardOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <MessageSquare size={13} /> Předat dotaz týmu
            </button>
          )}
        </div>
      </form>

      {forwardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetForward}>
          <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-xl sm:p-6" onClick={(e) => e.stopPropagation()}>
            {forwardDone ? (
              <div className="text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent"><ShieldCheck size={24} /></span>
                <h3 className="text-lg font-semibold">Dotaz předán týmu</h3>
                <p className="mt-2 text-sm text-muted-foreground">Ozveme se vám nejpozději do 24 hodin.</p>
                <button onClick={resetForward} className="portal-secondary mt-5">Zavřít</button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Předat dotaz týmu</h3>
                  <button type="button" onClick={resetForward} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted" aria-label="Zavřít"><X size={18} /></button>
                </div>
                <form onSubmit={forwardToTeam} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Projekt / zakázka</span>
                    <div className="relative">
                      <select value={forwardProject} onChange={(e) => setForwardProject(e.target.value)} required className="w-full appearance-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent">
                        <option value="">Vyberte zakázku…</option>
                        {activeProjects.map((p) => (
                          <option key={p.id} value={p.id}>{p.project_name || p.product_name || 'Bez názvu'}{p.quote_number ? ` · ${p.quote_number}` : ''}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Kategorie</span>
                    <div className="relative">
                      <select value={forwardCategory} onChange={(e) => setForwardCategory(e.target.value)} className="w-full appearance-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent">
                        <option value="technical">Technický dotaz</option>
                        <option value="question">Obecný dotaz k nabídce</option>
                        <option value="solution_change">Požadavek na úpravu řešení</option>
                        <option value="delivery">Dotaz k termínu / dodání</option>
                        <option value="other">Jiné</option>
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Vaše zpráva</span>
                    <textarea value={forwardMessage} onChange={(e) => setForwardMessage(e.target.value)} required maxLength={3000} rows={4} className="w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:border-accent" placeholder="Popište, co potřebujete řešit…" />
                  </label>
                  {forwardError && <p role="alert" className="text-sm text-destructive">{forwardError}</p>}
                  <button type="submit" disabled={!forwardProject || !forwardMessage.trim() || forwardBusy} className="portal-primary w-full">
                    {forwardBusy ? <><Loader2 size={15} className="animate-spin" /> Odesílám…</> : <><Mail size={15} /> Odeslat týmu</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
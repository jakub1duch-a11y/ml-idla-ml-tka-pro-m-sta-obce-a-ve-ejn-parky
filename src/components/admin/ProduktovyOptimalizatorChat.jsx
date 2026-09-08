import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Loader2, Send, Sparkles, RefreshCw, ChevronDown, CheckCircle2, AlertTriangle, XCircle, Package } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

const AGENT_NAME = 'produktovy_optimalizator';

function safeParse(value) {
  if (value && typeof value === 'object') return value;
  if (!value) return null;
  try { return JSON.parse(value); } catch (_) { return { raw: String(value) }; }
}

function toolStatusInfo(status) {
  if (['failed', 'error'].includes(status)) return { Icon: XCircle, tone: 'text-rose-400', label: 'Chyba' };
  if (['completed', 'success'].includes(status)) return { Icon: CheckCircle2, tone: 'text-emerald-400', label: 'Hotovo' };
  if (['running', 'in_progress'].includes(status)) return { Icon: Loader2, tone: 'text-cyan-300', label: 'Pracuje…', spin: true };
  return { Icon: Loader2, tone: 'text-slate-400', label: 'Čeká…', spin: true };
}

function prettyName(name) {
  return String(name || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const status = toolStatusInfo(toolCall.status);
  const projection = toolCall.display_projection || {};
  const hideDetails = projection.hide_details && projection.details_redacted;
  const label = projection.label || prettyName(toolCall.name);
  const activeLabel = projection.active_label || label;
  const errorLabel = projection.error_label || label;
  const shownLabel = ['failed', 'error'].includes(toolCall.status) ? errorLabel : (['completed', 'success'].includes(toolCall.status) ? label : activeLabel);
  const args = safeParse(toolCall.arguments_string);
  const results = safeParse(toolCall.results);
  const isFailed = ['failed', 'error'].includes(toolCall.status) || (results && /error|fail/i.test(JSON.stringify(results))) || (results && results.success === false);

  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-white/[.03] p-3 text-xs">
      <button type="button" onClick={() => !hideDetails && setExpanded(!expanded)} className="flex w-full items-center gap-2 text-left">
        <status.Icon size={13} className={`${status.tone} ${status.spin ? 'animate-spin' : ''}`} />
        <span className="font-mono text-[11px] text-white/70">{shownLabel}</span>
        {!hideDetails && <ChevronDown size={12} className={`ml-auto text-white/30 transition ${expanded ? 'rotate-180' : ''}`} />}
      </button>
      {expanded && !hideDetails && (
        <div className="mt-3 space-y-2">
          {args && (
            <div>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-white/30">Parametry</p>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-2 text-[10px] leading-relaxed text-white/60">{JSON.stringify(args, null, 2)}</pre>
            </div>
          )}
          {results !== null && (
            <div>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-white/30">Výsledek</p>
              <pre className={`overflow-x-auto rounded-lg p-2 text-[10px] leading-relaxed ${isFailed ? 'text-rose-300' : 'text-emerald-200/80'}`}>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] ${isUser ? 'rounded-2xl rounded-br-md bg-cyan-500/15 px-4 py-3 text-sm text-cyan-50' : 'rounded-2xl rounded-bl-md border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-white/85'}`}>
        {isUser ? (
          <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
        ) : (
          <>
            {message.content && <ReactMarkdown className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5">{message.content}</ReactMarkdown>}
            {Array.isArray(message.tool_calls) && message.tool_calls.map((toolCall, idx) => <FunctionDisplay key={idx} toolCall={toolCall} />)}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProduktovyOptimalizatorChat() {
  const [products, setProducts] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list('-created_date', 200)
      .then((list) => setProducts(list || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const selectedProduct = useMemo(() => products.find((p) => p.slug === selectedSlug), [products, selectedSlug]);

  const seedPrompt = useMemo(() => {
    if (!selectedProduct) return '';
    const slug = selectedProduct.slug;
    const name = selectedProduct.name;
    return `Načti produkt "${name}" (slug: ${slug}). Proveď kompletní optimalizaci: prodejní a SEO texty (short_description, description), technické parametry (jen pokud existují — nic nevymýšlej), benefity, FAQ pro AEO sekci, CTA a návrh souvisejících produktů. Neukládej automaticky — nejdřív mi ukaž návrh a počkej na mé potvrzení před uložením do Product.`;
  }, [selectedProduct]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const conversations = await base44.agents.listConversations({ agent_name: AGENT_NAME });
        const existing = (conversations || [])[0];
        const conversation = existing
          ? existing
          : await base44.agents.createConversation({ agent_name: AGENT_NAME, metadata: { name: 'Optimalizace produktu', description: 'Produktový optimalizátor — MLŽIDLA' } });
        if (!active) return;
        setConversationId(conversation.id);
        setMessages(Array.isArray(conversation.messages) ? conversation.messages : []);
      } catch (err) {
        if (active) setError(err?.message || 'Konverzaci se nepodařilo otevřít.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!conversationId) return undefined;
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
      setSending(false);
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const content = input.trim();
    if (!content || !conversationId || busy) return;
    setInput('');
    setSending(true);
    setError('');
    try {
      const conversation = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conversation, { role: 'user', content });
    } catch (err) {
      setError(err?.message || 'Zprávu se nepodařilo odeslat.');
      setSending(false);
    }
  };

  const optimizeSelected = async () => {
    if (!selectedProduct || !conversationId || busy) return;
    setSending(true);
    setError('');
    try {
      const conversation = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conversation, { role: 'user', content: seedPrompt });
    } catch (err) {
      setError(err?.message || 'Produkt se nepodařilo předat agentovi.');
      setSending(false);
    }
  };

  const reset = async () => {
    if (!confirm('Začít novou konverzaci? Stávající zůstane uložená v dashboardu.')) return;
    setLoading(true);
    setError('');
    try {
      const conversation = await base44.agents.createConversation({ agent_name: AGENT_NAME, metadata: { name: 'Optimalizace produktu', description: 'Produktový optimalizátor — MLŽIDLA' } });
      setConversationId(conversation.id);
      setMessages([]);
    } catch (err) {
      setError(err?.message || 'Novou konverzaci se nepodařilo vytvořit.');
    } finally {
      setLoading(false);
    }
  };

  const busy = sending || messages.some((m) => Array.isArray(m.tool_calls) && m.tool_calls.some((tc) => ['pending', 'running', 'in_progress'].includes(tc.status)));

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-xl font-heading font-medium">Produktový optimalizátor</h2>
          <p className="text-white/40 text-xs mt-1">AI agent (Claude Sonnet 5) pro kompletní optimalizaci produktových stránek — texty, SEO, parametry, benefity, FAQ</p>
        </div>
        <button type="button" onClick={reset} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-[11px] font-semibold text-white/60 transition hover:border-white/30 hover:text-white disabled:opacity-40">
          <RefreshCw size={12} /> Nová konverzace
        </button>
      </div>

      {/* Product selector */}
      <div className="mb-5 rounded-2xl border border-white/8 bg-white/3 p-4">
        <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2">
          <Package size={12} /> Vyber produkt k optimalizaci
        </label>
        <div className="flex gap-2 flex-wrap">
          {loadingProducts ? (
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Loader2 size={14} className="animate-spin" /> Načítám produkty…
            </div>
          ) : (
            <>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="flex-1 min-w-[240px] rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/50"
              >
                <option value="">— vyber produkt —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.slug} className="bg-slate-900">{p.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={optimizeSelected}
                disabled={!selectedProduct || loading || busy}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 text-slate-950 px-4 py-2.5 text-sm font-semibold transition hover:bg-cyan-300 disabled:opacity-40"
              >
                <Sparkles size={14} /> Optimalizovat
              </button>
            </>
          )}
        </div>
        {selectedProduct && (
          <p className="mt-2 text-[10px] text-white/30 font-mono truncate">
            slug: {selectedProduct.slug} · {selectedProduct.short_description ? 'má short_description' : 'bez short_description'}
          </p>
        )}
      </div>

      {/* Chat */}
      <div className="rounded-3xl border border-cyan-300/40 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-950 p-1">
        <div className="rounded-[1.3rem] border border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/30">
              <Bot size={20} />
            </div>
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300/80"><Sparkles size={12} /> Claude Sonnet 5</p>
              <h3 className="font-heading text-lg text-white">AI optimalizace produktu</h3>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[55vh] min-h-[280px] space-y-4 overflow-y-auto px-4 py-5 sm:px-7">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-white/40">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-center text-sm text-white/40 px-6">
                Vyber produkt nahoře a klikni „Optimalizovat", nebo napiš agentovi vlastní instrukci (např. „Načti produkt slug: bendy a navrhni lepší popis").
              </div>
            ) : (
              messages.map((message, idx) => <MessageBubble key={idx} message={message} />)
            )}
          </div>

          {error && <div className="mx-5 mb-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 sm:mx-7"><AlertTriangle size={12} className="mr-1.5 inline" />{error}</div>}

          <div className="border-t border-white/10 px-4 py-4 sm:px-7">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
                placeholder={busy ? 'Agent pracuje…' : 'Napiš zprávu agentovi (Enter = odeslat)'}
                className="max-h-40 min-h-[48px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-300/50"
              />
              <button type="button" onClick={send} disabled={busy || !input.trim()} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-white/35">Agent navrhne optimalizovaný obsah a počká na tvé potvrzení před uložením do databáze. Technické parametry nevymýšlí — chybějící označí k doplnění.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AdvisorMessages from '@/components/advisor/AdvisorMessages';
import useAdvisorConversation from '@/components/advisor/useAdvisorConversation';

export default function FloatingAdvisor() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, error, send } = useAdvisorConversation();
  useEffect(() => {
    const pages = new Set(JSON.parse(sessionStorage.getItem('advisorPages') || '[]')); pages.add(pathname); sessionStorage.setItem('advisorPages', JSON.stringify([...pages]));
    const products = new Set(JSON.parse(sessionStorage.getItem('advisorProducts') || '[]')); if (pathname.startsWith('/produkt/')) products.add(pathname); sessionStorage.setItem('advisorProducts', JSON.stringify([...products]));
    const shouldOpen = products.size >= 2 || pages.size > 3 || pathname.startsWith('/reference') || pathname === '/blog/ai-poradce-vyber-mlzitka';
    if (shouldOpen && !sessionStorage.getItem('advisorDismissed')) setOpen(true);
  }, [pathname]);
  const close = () => { setOpen(false); sessionStorage.setItem('advisorDismissed', '1'); };
  const submit = async () => { const text = input; if (!text.trim()) return; setInput(''); await send(text); };
  return <div className="fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3">
    {open && <section className="flex h-[min(560px,72vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"><header className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan text-slate-950"><Bot size={18} /></span><div><b className="block text-sm">AI poradce Mlzidla.cz</b><span className="text-xs text-white/50">Výběr produktu a řešení</span></div></div><button onClick={close} aria-label="Zavřít poradce" className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"><X size={17} /></button></header><AdvisorMessages messages={messages} loading={loading} error={error} /><div className="flex gap-2 border-t border-slate-200 p-3"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submit()} placeholder="Jaký prostor chcete ochladit?" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" /><button onClick={submit} disabled={loading || !input.trim()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white disabled:opacity-40"><Send size={15} /></button></div></section>}
    <button onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-xl"><Bot size={17} className="text-cyan" /> AI poradce</button>
  </div>;
}
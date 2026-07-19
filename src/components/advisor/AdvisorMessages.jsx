import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Droplets, Loader } from 'lucide-react';

export default function AdvisorMessages({ messages, loading, error }) {
  return <div className="flex-1 space-y-3 overflow-y-auto p-4">
    {!messages.length && <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600"><b className="block text-slate-950">S čím vám poradím?</b>Popište prostor, podklad a způsob využití. Doporučím vhodné mlžítko nebo zakázkové řešení.</div>}
    {messages.map((message, index) => <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>{message.role !== 'user' && <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-cyan"><Droplets size={13} /></span>}<div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{message.role === 'user' ? message.content : <ReactMarkdown className="prose prose-sm max-w-none">{message.content || ''}</ReactMarkdown>}</div></div>)}
    {loading && <div className="flex items-center gap-2 text-xs text-slate-400"><Loader size={14} className="animate-spin" /> Poradce připravuje odpověď…</div>}
    {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
  </div>;
}
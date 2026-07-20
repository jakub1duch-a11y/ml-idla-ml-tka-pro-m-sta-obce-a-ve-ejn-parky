import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Droplets, Loader } from 'lucide-react';

export default function AdvisorMessages({ messages, loading, error, onSendMessage }) {
  
  // Definice tří možností z vašeho zadání
  const rozcestnikMoznosti = [
    { text: 'Vybrat produkt', label: 'Chci pomoci vybrat produkt a prohlédnout si katalog.' },
    { text: 'Zažádat o cenovou nabídku', label: 'Chci zažádat o cenovou nabídku k produktu.' },
    { text: 'Poptat vlastní řešení a tvar mlžítka', label: 'Chci poptat vlastní řešení a tvar mlžítka.' }
  ];

  return <div className="flex-1 space-y-3 overflow-y-auto p-4">
    {/* Úvodní rozcestník - ukáže se, jen když je chat prázdný */}
    {!messages.length && (
      <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
        <b className="block text-slate-950 text-base mb-3 text-center">S čím vám mohu pomoci?</b>
        
        <div className="grid grid-cols-1 gap-2 mt-2">
          {rozcestnikMoznosti.map((moznost, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => onSendMessage && onSendMessage(moznost.label)}
              className="w-full text-left bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-700 font-medium transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              {moznost.text}
              <span className="block text-xs font-normal text-slate-400 mt-0.5">
                {idx === 0 && "Doporučím vhodné standardní modely"}
                {idx === 1 && "Zjištění přesné ceny a termínu dodání"}
                {idx === 2 && "Atypické rozměry a specifická řešení na míru"}
              </span>
            </button>
          ))}
        </div>
      </div>
    )}

    {messages.map((message, index) => <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>{message.role !== 'user' && <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-cyan"><Droplets size={13} /></span>}<div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>{message.role === 'user' ? message.content : <ReactMarkdown className="prose prose-sm max-w-none">{message.content || ''}</ReactMarkdown>}</div></div>)}
    {loading && <div className="flex items-center gap-2 text-xs text-slate-400"><Loader size={14} className="animate-spin" /> Poradce připravuje odpověď…</div>}
    {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
  </div>;
}

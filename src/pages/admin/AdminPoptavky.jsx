import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, Download, Sparkles, ChevronDown, ChevronUp, X, Plus, Trash2, Loader } from 'lucide-react';

const STATUS_LABELS = { new: 'Nová', contacted: 'Kontaktováno', in_progress: 'V řešení', closed: 'Uzavřeno' };
const STATUS_COLORS = { new: 'bg-cyan/10 text-cyan', contacted: 'bg-yellow-500/10 text-yellow-400', in_progress: 'bg-blue-500/10 text-blue-400', closed: 'bg-white/5 text-white/30' };

const PRODUCTS_LIST = ['OSTEV', 'MRAK', 'VOLAVKA', 'KIDS', 'GATE 60', 'AURA', 'LINEA EL70'];

export default function AdminPoptavky() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [quoteInquiry, setQuoteInquiry] = useState(null);
  const [quoteItems, setQuoteItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.ContactInquiry.list('-created_date').then(setInquiries).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await base44.entities.ContactInquiry.update(id, { status });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const openQuote = (inq) => {
    setQuoteInquiry(inq);
    setQuoteItems([{ name: '', qty: 1, price: 0 }]);
    setQuoteNotes('');
  };

  const generateQuoteWithAI = async () => {
    setAiGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi obchodník firmy HolmTec, která vyrábí mlžné sochy z nerezové oceli. 
Zákazník ${quoteInquiry.name} poptává: "${quoteInquiry.message}"
Navrhni položky cenové nabídky. Produkty HolmTec a jejich orientační ceny:
- OSTEV (strom): 85 000–150 000 Kč
- MRAK: 45 000–75 000 Kč  
- VOLAVKA: 25 000–40 000 Kč
- KIDS: 35 000–55 000 Kč
- GATE 60 (brána): 65 000–95 000 Kč
- AURA (kruh): 55 000–85 000 Kč
- LINEA EL70: 40 000–70 000 Kč
- Montáž a instalace: 8 000–25 000 Kč
- Čerpadlová jednotka 70 bar: 35 000–55 000 Kč
Vrať JSON s items (pole objektů: name, qty, price) a notes (poznámka k nabídce v češtině).`,
        response_json_schema: {
          type: 'object',
          properties: {
            items: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, qty: { type: 'number' }, price: { type: 'number' } } } },
            notes: { type: 'string' }
          }
        }
      });
      if (result.items) setQuoteItems(result.items);
      if (result.notes) setQuoteNotes(result.notes);
    } finally {
      setAiGenerating(false);
    }
  };

  const downloadQuote = async () => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke('generateQuotePDF', {
        inquiry: quoteInquiry,
        items: quoteItems.filter(i => i.name),
        notes: quoteNotes,
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nabidka-holmtec.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  const totalPrice = quoteItems.reduce((s, i) => s + (i.qty || 1) * (i.price || 0), 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">SPRÁVA</p>
        <h1 className="text-2xl font-light text-white">Poptávky</h1>
      </div>

      {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="space-y-3">
          {inquiries.length === 0 && <div className="text-center py-16 text-white/30 text-sm">Žádné poptávky</div>}
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-white font-medium">{inq.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLORS[inq.status]}`}>
                      {STATUS_LABELS[inq.status]}
                    </span>
                    <span className="text-xs text-white/30">
                      {new Date(inq.created_date).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{inq.email}</p>
                  <p className="text-xs text-white/30 truncate mt-1">{inq.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); openQuote(inq); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan text-xs hover:bg-cyan/20 transition-all">
                    <FileText size={12} /> Nabídka
                  </button>
                  {expanded === inq.id ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
                </div>
              </div>

              {expanded === inq.id && (
                <div className="border-t border-white/10 px-5 py-4 space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Zpráva</p>
                    <p className="text-sm text-white/70 leading-relaxed">{inq.message}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Změnit stav</p>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <button key={v} onClick={() => updateStatus(inq.id, v)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${inq.status === v ? STATUS_COLORS[v] + ' font-bold border border-current' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <a href={`mailto:${inq.email}?subject=Re: Poptávka mlžného systému HolmTec`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/60 text-xs rounded-full hover:bg-white/10 transition-all">
                    Odpovědět e-mailem →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quote modal */}
      {quoteInquiry && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4 pt-10">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-medium">Cenová nabídka — {quoteInquiry.name}</h2>
              <button onClick={() => setQuoteInquiry(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-white/30 mb-6">{quoteInquiry.email}</p>

            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase">Položky</p>
              <button onClick={generateQuoteWithAI} disabled={aiGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-full hover:bg-indigo-500/30 disabled:opacity-50 transition-all">
                {aiGenerating ? <><Loader size={11} className="animate-spin" /> Generuji AI...</> : <><Sparkles size={11} /> Navrhnout AI</>}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {quoteItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input list="products-list" value={item.name} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Produkt / služba"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
                  <datalist id="products-list">{PRODUCTS_LIST.map(p => <option key={p} value={p} />)}</datalist>
                  <input type="number" value={item.qty} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))}
                    className="w-14 px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center focus:border-cyan/40 focus:outline-none" min="1" />
                  <input type="number" value={item.price} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))}
                    placeholder="Kč" className="w-28 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none" />
                  <button onClick={() => setQuoteItems(prev => prev.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setQuoteItems(prev => [...prev, { name: '', qty: 1, price: 0 }])}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-cyan transition-colors">
                <Plus size={12} /> Přidat položku
              </button>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <p className="text-sm text-white/40">Celkem bez DPH</p>
              <p className="text-lg font-light text-cyan">{Number(totalPrice).toLocaleString('cs-CZ')} Kč</p>
            </div>

            <div className="mb-5">
              <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Poznámky</label>
              <textarea rows={3} value={quoteNotes} onChange={e => setQuoteNotes(e.target.value)} placeholder="Platnost nabídky, podmínky, poznámky..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={downloadQuote} disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-50 transition-all">
                {generating ? <><Loader size={14} className="animate-spin" /> Generuji PDF...</> : <><Download size={14} /> Stáhnout PDF</>}
              </button>
              <button onClick={() => setQuoteInquiry(null)} className="px-5 py-2.5 bg-white/5 text-white/60 text-sm rounded-full hover:bg-white/10">Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
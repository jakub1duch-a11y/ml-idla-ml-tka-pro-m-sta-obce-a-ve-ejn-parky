import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { FileText, Download, Sparkles, ChevronDown, ChevronUp, X, Plus, Trash2, Loader, Package, Tag, Layers } from 'lucide-react';

const STATUS_LABELS = { new: 'Nová', contacted: 'Kontaktováno', in_progress: 'V řešení', closed: 'Uzavřeno' };
const STATUS_COLORS = { new: 'bg-cyan/10 text-cyan', contacted: 'bg-yellow-500/10 text-yellow-400', in_progress: 'bg-blue-500/10 text-blue-400', closed: 'bg-white/5 text-white/30' };

const COLLAB_TYPES = [
  { value: 'product', label: 'Produkt', desc: 'Standardní nabídka produktu' },
  { value: 'cooperation', label: 'Projektová spolupráce', desc: 'Návrh, realizace, servis' },
  { value: 'documentation', label: 'Projektová dokumentace', desc: 'Výkresy, technické listy, certifikáty' },
  { value: '3d_model', label: '3D vizualizace & render', desc: 'Model produktu, rendery pro projekt' },
  { value: 'combined', label: 'Kombinace produktů', desc: 'Množstevní sleva při kombinaci' },
];

const VOLUME_DISCOUNTS = [
  { label: 'Bez slevy', value: 0 },
  { label: '5% (2–3 ks)', value: 5 },
  { label: '10% (4–6 ks)', value: 10 },
  { label: '15% (7+ ks)', value: 15 },
  { label: '20% (projekt 500k+)', value: 20 },
];

export default function AdminPoptavky() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [quoteInquiry, setQuoteInquiry] = useState(null);
  const [quoteItems, setQuoteItems] = useState([{ name: '', qty: 1, price: 0, spec: '' }]);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [collabType, setCollabType] = useState('product');
  const [volumeDiscount, setVolumeDiscount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    base44.entities.Product.list().then(setDbProducts);
  }, []);

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
    setCollabType('product');
    setVolumeDiscount(0);
    setQuoteNotes('');
    // Try to prefill from product_id or message keyword
    const matched = dbProducts.find(p =>
      (inq.product_id && p.id === inq.product_id) ||
      (inq.message && p.name && inq.message.toLowerCase().includes(p.name.toLowerCase()))
    );
    if (matched) {
      setQuoteItems([{
        name: matched.name,
        qty: 1,
        price: 0,
        spec: [matched.material, matched.pressure, matched.micron_size ? matched.micron_size + ' µm' : '', matched.coverage_area].filter(Boolean).join(' | ')
      }]);
    } else {
      setQuoteItems([{ name: '', qty: 1, price: 0, spec: '' }]);
    }
  };

  const addProductFromDb = (product) => {
    setQuoteItems(prev => [...prev, {
      name: product.name,
      qty: 1,
      price: 0,
      spec: [product.material, product.pressure, product.micron_size ? product.micron_size + ' µm' : '', product.coverage_area].filter(Boolean).join(' | ')
    }]);
  };

  const generateQuoteWithAI = async () => {
    setAiGenerating(true);
    const collab = COLLAB_TYPES.find(c => c.value === collabType);
    try {
      const productList = dbProducts.map(p => `${p.name}${p.material ? ' (' + p.material + ')' : ''}`).join(', ');
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi obchodník firmy HolmTec, která vyrábí mlžné sochy a instalace z nerezové oceli.
Zákazník ${quoteInquiry.name} poptává: "${quoteInquiry.message}"
Typ poptávky: ${collab?.label || 'produkt'}

Produkty v katalogu HolmTec: ${productList}

Orientační ceny produktů:
- Mlžné sochy (střední): 45 000–85 000 Kč
- Mlžné sochy (velké, OSTEV/strom): 85 000–150 000 Kč
- Mlžné brány/portály: 55 000–95 000 Kč
- Chladicí systémy (park/arena): 35 000–75 000 Kč
- Montáž a instalace: 8 000–25 000 Kč
- Čerpadlová jednotka 70 bar: 35 000–55 000 Kč
${collabType === 'cooperation' ? '- Projektová spolupráce (návrh, konzultace): 15 000–45 000 Kč' : ''}
${collabType === 'documentation' ? '- Projektová dokumentace + tech. listy: 8 000–20 000 Kč' : ''}
${collabType === '3d_model' ? '- 3D model produktu: 12 000–25 000 Kč\n- Vizualizace / rendery (sada): 8 000–18 000 Kč' : ''}
${collabType === 'combined' ? '- Množstevní sleva ${volumeDiscount}% automaticky aplikována' : ''}

Navrhni položky nabídky jako JSON: items (pole: name, qty, price, spec — spec je krátký technický popis položky) a notes (podmínky nabídky v češtině, max 2 věty).`,
        response_json_schema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  qty: { type: 'number' },
                  price: { type: 'number' },
                  spec: { type: 'string' }
                }
              }
            },
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

  const baseTotal = quoteItems.reduce((s, i) => s + (i.qty || 1) * (i.price || 0), 0);
  const discountAmt = Math.round(baseTotal * volumeDiscount / 100);
  const totalAfterDiscount = baseTotal - discountAmt;

  const downloadQuote = async () => {
    setGenerating(true);
    try {
      const collab = COLLAB_TYPES.find(c => c.value === collabType);
      const res = await base44.functions.invoke('generateQuotePDF', {
        inquiry: quoteInquiry,
        items: quoteItems.filter(i => i.name),
        notes: quoteNotes,
        collabType: collab?.label,
        volumeDiscount,
        discountAmt,
        totalAfterDiscount,
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

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">SPRÁVA</p>
          <h1 className="text-2xl font-light text-white">Poptávky</h1>
        </div>
        <div className="flex items-center gap-3">
          {exportResult && (
            <a href={exportResult.sheetUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              ✓ Otevřít Sheet →
            </a>
          )}
          <button onClick={async () => {
            setExporting(true); setExportResult(null);
            try { const res = await base44.functions.invoke('exportProjectAnalytics', {}); setExportResult(res.data); }
            finally { setExporting(false); }
          }} disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium rounded-full hover:bg-emerald-500/30 disabled:opacity-50 transition-all">
            {exporting ? <><Loader size={14} className="animate-spin" /> Exportuji...</> : <><Download size={14} /> Export do Sheets</>}
          </button>
        </div>
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
                    <span className="text-xs text-white/30">{new Date(inq.created_date).toLocaleDateString('cs-CZ')}</span>
                  </div>
                  <p className="text-xs text-white/40">{inq.email}</p>
                  <p className="text-xs text-white/30 truncate mt-1">{inq.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); openQuote(inq); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan text-xs hover:bg-cyan/20 transition-all">
                    <FileText size={12} /> Nabídka PDF
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

      {/* ── QUOTE MODAL ── */}
      {quoteInquiry && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 overflow-y-auto p-4 pt-8">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-white font-medium text-lg">Cenová nabídka PDF</h2>
              <button onClick={() => setQuoteInquiry(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-white/30 mb-6">{quoteInquiry.name} · {quoteInquiry.email}</p>

            {/* Typ spolupráce */}
            <div className="mb-5">
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-3 flex items-center gap-2">
                <Layers size={12} /> Typ nabídky / spolupráce
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLLAB_TYPES.map(c => (
                  <button key={c.value} onClick={() => setCollabType(c.value)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${collabType === c.value ? 'bg-cyan/10 border-cyan/40 text-cyan' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25'}`}>
                    <p className="font-medium mb-0.5">{c.label}</p>
                    <p className="text-[10px] opacity-60">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Množstevní sleva (jen pro combined) */}
            {collabType === 'combined' && (
              <div className="mb-5">
                <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2 flex items-center gap-2">
                  <Tag size={12} /> Množstevní sleva
                </p>
                <div className="flex gap-2 flex-wrap">
                  {VOLUME_DISCOUNTS.map(d => (
                    <button key={d.value} onClick={() => setVolumeDiscount(d.value)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${volumeDiscount === d.value ? 'bg-cyan/20 border-cyan/40 text-cyan' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Přidat produkt z DB */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-mono text-white/40 tracking-widest uppercase flex items-center gap-2">
                  <Package size={12} /> Položky nabídky
                </p>
                <div className="flex gap-2">
                  <div className="relative group">
                    <button className="text-xs text-white/40 hover:text-cyan transition-colors px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-cyan/30">
                      + Z katalogu
                    </button>
                    <div className="absolute right-0 top-8 z-10 w-64 bg-surface border border-white/15 rounded-xl overflow-hidden shadow-xl hidden group-hover:block">
                      {dbProducts.slice(0, 15).map(p => (
                        <button key={p.id} onClick={() => addProductFromDb(p)}
                          className="w-full text-left px-4 py-2.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0">
                          <p className="font-medium">{p.name}</p>
                          {p.material && <p className="text-white/30 text-[10px]">{p.material}</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={generateQuoteWithAI} disabled={aiGenerating}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-full hover:bg-indigo-500/30 disabled:opacity-50 transition-all">
                    {aiGenerating ? <><Loader size={11} className="animate-spin" /> AI...</> : <><Sparkles size={11} /> AI návrh</>}
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-white/25 uppercase px-1">
                  <span className="col-span-4">Název</span>
                  <span className="col-span-3">Spec / popis</span>
                  <span className="col-span-1 text-center">Ks</span>
                  <span className="col-span-3 text-right">Cena/ks (Kč)</span>
                  <span className="col-span-1" />
                </div>
                {quoteItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <input value={item.name} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      placeholder="Produkt / služba"
                      className="col-span-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan/40 focus:outline-none" />
                    <input value={item.spec || ''} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, spec: e.target.value } : x))}
                      placeholder="Technická specifikace"
                      className="col-span-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs focus:border-cyan/40 focus:outline-none" />
                    <input type="number" value={item.qty} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))}
                      className="col-span-1 px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs text-center focus:border-cyan/40 focus:outline-none" min="1" />
                    <input type="number" value={item.price} onChange={e => setQuoteItems(prev => prev.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))}
                      placeholder="0"
                      className="col-span-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs text-right focus:border-cyan/40 focus:outline-none" />
                    <button onClick={() => setQuoteItems(prev => prev.filter((_, j) => j !== i))} className="col-span-1 flex justify-center text-white/20 hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
                <button onClick={() => setQuoteItems(prev => [...prev, { name: '', qty: 1, price: 0, spec: '' }])}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-cyan transition-colors mt-1">
                  <Plus size={12} /> Přidat položku
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-black/30 rounded-xl p-4 mb-4 space-y-1.5">
              <div className="flex justify-between text-sm text-white/40">
                <span>Mezisoučet</span>
                <span>{baseTotal.toLocaleString('cs-CZ')} Kč</span>
              </div>
              {volumeDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Množstevní sleva {volumeDiscount}%</span>
                  <span>−{discountAmt.toLocaleString('cs-CZ')} Kč</span>
                </div>
              )}
              <div className="flex justify-between text-base font-medium text-white border-t border-white/10 pt-2">
                <span>Celkem bez DPH</span>
                <span className="text-cyan">{totalAfterDiscount.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between text-xs text-white/30">
                <span>DPH 21 %</span>
                <span>{Math.round(totalAfterDiscount * 0.21).toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Celkem s DPH</span>
                <span>{Math.round(totalAfterDiscount * 1.21).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            {/* Poznámky */}
            <div className="mb-5">
              <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Poznámky & podmínky</label>
              <textarea rows={3} value={quoteNotes} onChange={e => setQuoteNotes(e.target.value)}
                placeholder="Platnost nabídky, platební podmínky, termín dodání..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none resize-none" />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={downloadQuote} disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-50 transition-all">
                {generating ? <><Loader size={14} className="animate-spin" /> Generuji PDF...</> : <><Download size={14} /> Stáhnout PDF</>}
              </button>
              <a href={`mailto:${quoteInquiry.email}?subject=Cenová nabídka HolmTec&body=Dobrý den, zasíláme Vám cenovou nabídku dle Vaší poptávky.`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm rounded-full hover:bg-white/15 transition-all">
                Odeslat e-mailem →
              </a>
              <button onClick={() => setQuoteInquiry(null)} className="px-5 py-2.5 bg-white/5 text-white/60 text-sm rounded-full hover:bg-white/10">Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Shield, FileText, Printer, Download, Plus, Trash2, Edit3, Check, X, Package, Mail, Phone, Globe, MapPin } from 'lucide-react';

const STATUS_LABELS = {
  nova_poptavka: { label: 'NOVÁ POPTÁVKA', color: 'text-slate-600 bg-slate-100 border-slate-300' },
  koncept: { label: 'KONCEPT', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  k_overeni: { label: 'K OVĚŘENÍ', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  schvaleno: { label: 'SCHVÁLENO', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  odeslano: { label: 'ODESLÁNO', color: 'text-primary bg-primary/10 border-primary/30' },
};

const AISI316L_NOTE = 'Nerez AISI 316L (1.4404) — odolný vůči korozi, chlorované vodě a atmosférickým vlivům. Standard pro venkovní veřejné instalace.';

export default function OfferConceptPresentation({ concept, product, pricing, visualizationUrl, offerStatus, clientInfo, onOrder }) {
  const statusInfo = STATUS_LABELS[offerStatus] || STATUS_LABELS.nova_poptavka;
  const today = new Date().toLocaleDateString('cs-CZ');
  const validUntil = new Date(Date.now() + 30 * 86400000).toLocaleDateString('cs-CZ');

  const [editMode, setEditMode] = useState(true);
  const [data, setData] = useState({
    project_title: concept?.project_title || 'Návrh mlžného systému',
    subject: `Projektový návrh + cenová nabídka | ${clientInfo?.firma || clientInfo?.company || clientInfo?.name || ''} | MLŽIDLA®`,
    requirements_summary: concept?.requirements_summary || '',
    recommended_solution: concept?.recommended_solution || '',
    product_recommendation: concept?.product_recommendation || '',
    material_note: concept?.material_note || AISI316L_NOTE,
    technical_solution: concept?.technical_solution || '',
    smart_control: concept?.smart_control || '',
    scope_of_delivery: concept?.scope_of_delivery || [],
    installation_plan: concept?.installation_plan || '',
    schedule_plan: concept?.schedule_plan || '',
    service_plan: concept?.service_plan || '',
    rough_cost: concept?.rough_cost || {},
    benefits: concept?.benefits || [],
    confidence_note: concept?.confidence_note || '',
  });
  const [extraDocs, setExtraDocs] = useState([]);
  const [newDocTitle, setNewDocTitle] = useState('');

  useEffect(() => {
    if (concept) {
      setData((prev) => ({
        ...prev,
        project_title: concept.project_title || prev.project_title,
        requirements_summary: concept.requirements_summary || prev.requirements_summary,
        recommended_solution: concept.recommended_solution || prev.recommended_solution,
        product_recommendation: concept.product_recommendation || prev.product_recommendation,
        material_note: concept.material_note || prev.material_note,
        technical_solution: concept.technical_solution || prev.technical_solution,
        smart_control: concept.smart_control || prev.smart_control,
        scope_of_delivery: concept.scope_of_delivery || prev.scope_of_delivery,
        installation_plan: concept.installation_plan || prev.installation_plan,
        schedule_plan: concept.schedule_plan || prev.schedule_plan,
        service_plan: concept.service_plan || prev.service_plan,
        rough_cost: concept.rough_cost || prev.rough_cost,
        benefits: concept.benefits || prev.benefits,
        confidence_note: concept.confidence_note || prev.confidence_note,
      }));
    }
  }, [concept]);

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const updateCost = (field, value) => setData((prev) => ({ ...prev, rough_cost: { ...prev.rough_cost, [field]: value } }));
  const updateScopeItem = (index, value) => {
    setData((prev) => {
      const scope = [...prev.scope_of_delivery];
      scope[index] = value;
      return { ...prev, scope_of_delivery: scope };
    });
  };
  const addScopeItem = () => update('scope_of_delivery', [...data.scope_of_delivery, 'Nová položka rozsahu dodávky']);
  const removeScopeItem = (index) => update('scope_of_delivery', data.scope_of_delivery.filter((_, i) => i !== index));

  const updateBenefit = (index, value) => {
    setData((prev) => {
      const benefits = [...prev.benefits];
      benefits[index] = value;
      return { ...prev, benefits };
    });
  };
  const addBenefit = () => update('benefits', [...data.benefits, 'Nový přínos řešení']);
  const removeBenefit = (index) => update('benefits', data.benefits.filter((_, i) => i !== index));

  const addDocument = () => {
    if (!newDocTitle.trim()) return;
    setExtraDocs((prev) => [...prev, { id: crypto.randomUUID(), title: newDocTitle, content: '', type: 'custom' }]);
    setNewDocTitle('');
  };
  const removeDoc = (id) => setExtraDocs((prev) => prev.filter((doc) => doc.id !== id));
  const updateDoc = (id, field, value) => setExtraDocs((prev) => prev.map((doc) => doc.id === id ? { ...doc, [field]: value } : doc));

  return (
    <div className="mx-auto max-w-4xl bg-white print:shadow-none">
      {/* Safety gate banner */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 print:hidden">
        <Shield size={18} className="shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          <strong>Bezpečnostní brána:</strong> AI připravila koncept nabídky. Automatický proces nikdy neodesílá nabídku zákazníkovi.
          Stav: <span className={`ml-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-wrap gap-2 print:hidden">
        <button onClick={() => setEditMode(!editMode)} className={`inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold ${editMode ? 'border-primary bg-primary text-white' : 'border-border bg-card hover:bg-muted'}`}>
          {editMode ? <Check size={15} /> : <Edit3 size={15} />} {editMode ? 'Editace zapnuta' : 'Zapnout editaci'}
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
          <Printer size={15} /> Vytisknout
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
          <Download size={15} /> Uložit jako PDF
        </button>
      </div>

      {/* ── Email-style printable document ── */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Brand header — email style */}
        <div className="h-1.5 bg-cyan-400" />
        <header className="flex items-end justify-between gap-4 border-b border-slate-100 px-6 py-6 lg:px-10">
          <div>
            <div className="text-xl font-extrabold tracking-wide text-[#0d2d38]">MLŽIDLA® <span className="text-xs font-semibold text-slate-400">by HolmTec</span></div>
            <div className="mt-1 text-[10px] uppercase tracking-[.16em] text-cyan-700">Projektový návrh · cenová nabídka</div>
          </div>
          <div className="text-right text-[10px] uppercase tracking-[.12em] text-slate-400">Architektonické mlžení</div>
        </header>

        {/* Email subject */}
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 lg:px-10">
          <p className="text-[10px] uppercase tracking-[.14em] text-cyan-700">Předmět</p>
          {editMode ? (
            <input
              value={data.subject}
              onChange={(e) => update('subject', e.target.value)}
              className="mt-1 w-full border-b-2 border-cyan-200 bg-transparent text-sm font-semibold text-slate-900 outline-none focus:border-cyan-500"
            />
          ) : (
            <p className="mt-1 text-sm font-semibold text-slate-900">{data.subject}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
            <span><strong className="text-slate-700">Od:</strong> meduna@holmtec.cz</span>
            <span><strong className="text-slate-700">Komu:</strong> {clientInfo?.email || '—'}</span>
            <span><strong className="text-slate-700">Datum:</strong> {today}</span>
            <span><strong className="text-slate-700">Platnost do:</strong> {validUntil}</span>
          </div>
        </div>

        {/* Document body */}
        <div className="p-6 lg:p-10">
          {/* Client info */}
          <section className="mb-6">
            <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Klient</h2>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <EditableField label="Jméno" value={clientInfo?.jmeno || clientInfo?.name || '—'} readOnly />
              <EditableField label="Organizace" value={clientInfo?.firma || clientInfo?.company || '—'} readOnly />
              <EditableField label="Email" value={clientInfo?.email || '—'} readOnly />
              <EditableField label="Telefon" value={clientInfo?.telefon || clientInfo?.phone || '—'} readOnly />
            </div>
          </section>

          <EditableSection title="Shrnutí požadavku" value={data.requirements_summary} onChange={(v) => update('requirements_summary', v)} editMode={editMode} />

          <EditableSection title="Doporučené řešení" value={data.recommended_solution} onChange={(v) => update('recommended_solution', v)} editMode={editMode} />

          {/* AISI 316L — Vhodný produkt / konstrukční princip */}
          <section className="mt-6 rounded-lg border border-cyan-200 bg-cyan-50/40 p-5">
            <h2 className="flex items-center gap-2 font-mono text-[10px] tracking-[.16em] uppercase text-cyan-700">
              <Package size={14} /> Vhodný produkt / konstrukční princip
            </h2>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Produkt</p>
                {editMode ? (
                  <input value={product?.name || ''} readOnly placeholder="Název produktu" className="w-full border-b border-cyan-200 bg-transparent text-base font-bold text-primary outline-none focus:border-cyan-500" />
                ) : (
                  <p className="text-base font-bold text-primary">{product?.name || '—'}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Konstrukční princip</p>
                {editMode ? (
                  <textarea value={data.product_recommendation} onChange={(e) => update('product_recommendation', e.target.value)} rows={4} className="w-full border border-cyan-200 bg-white p-3 text-sm text-foreground outline-none focus:border-cyan-500" />
                ) : (
                  <p className="text-sm leading-relaxed text-foreground">{data.product_recommendation || '—'}</p>
                )}
              </div>
              <div className="rounded-md border border-cyan-300 bg-white p-3">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-700"><Shield size={12} /> Materiálový standard</p>
                {editMode ? (
                  <textarea value={data.material_note} onChange={(e) => update('material_note', e.target.value)} rows={2} className="mt-1 w-full text-sm text-foreground outline-none" />
                ) : (
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{data.material_note}</p>
                )}
              </div>
            </div>
          </section>

          <EditableSection title="Technické řešení" value={data.technical_solution} onChange={(v) => update('technical_solution', v)} editMode={editMode} />

          <EditableSection title="Smart / nízkotlaké řízení" value={data.smart_control} onChange={(v) => update('smart_control', v)} editMode={editMode} />

          {/* Scope of delivery — editable list */}
          <section className="mt-6">
            <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Rozsah dodávky</h2>
            <ul className="mt-2 space-y-2">
              {data.scope_of_delivery.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {editMode ? (
                    <>
                      <input value={item} onChange={(e) => updateScopeItem(i, e.target.value)} className="flex-1 border-b border-slate-200 bg-transparent text-sm outline-none focus:border-cyan-500" />
                      <button onClick={() => removeScopeItem(i)} className="text-slate-300 hover:text-destructive"><Trash2 size={14} /></button>
                    </>
                  ) : (
                    <span className="flex-1">{item}</span>
                  )}
                </li>
              ))}
            </ul>
            {editMode && (
              <button onClick={addScopeItem} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900"><Plus size={13} /> Přidat položku</button>
            )}
          </section>

          <EditableSection title="Instalace" value={data.installation_plan} onChange={(v) => update('installation_plan', v)} editMode={editMode} />

          {data.schedule_plan && (
            <EditableSection title="Naplánování" value={data.schedule_plan} onChange={(v) => update('schedule_plan', v)} editMode={editMode} />
          )}

          <EditableSection title="Servis" value={data.service_plan} onChange={(v) => update('service_plan', v)} editMode={editMode} />

          {/* Cost table — editable */}
          <section className="mt-6">
            <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Orientační kalkulace</h2>
            <div className="mt-2 overflow-hidden border border-border">
              <table className="w-full text-sm">
                <tbody>
                  <CostRowEditable label="Produkt / konstrukce" value={data.rough_cost?.product_range} onChange={(v) => updateCost('product_range', v)} editMode={editMode} />
                  <CostRowEditable label="Smart řízení + senzory" value={data.rough_cost?.smart_control_range} onChange={(v) => updateCost('smart_control_range', v)} editMode={editMode} />
                  <CostRowEditable label="Instalace" value={data.rough_cost?.installation_range} onChange={(v) => updateCost('installation_range', v)} editMode={editMode} />
                  <CostRowEditable label="Roční servis" value={data.rough_cost?.service_annual_range} onChange={(v) => updateCost('service_annual_range', v)} editMode={editMode} />
                  <tr className="border-t-2 border-primary bg-muted">
                    <td className="px-4 py-3 font-heading font-bold text-primary">Celkem (orientačně)</td>
                    <td className="px-4 py-3 text-right">
                      {editMode ? (
                        <input value={data.rough_cost?.total_range || ''} onChange={(e) => updateCost('total_range', e.target.value)} className="w-full border-b border-cyan-200 bg-transparent text-right font-heading font-bold text-primary outline-none focus:border-cyan-500" />
                      ) : (
                        <span className="font-heading font-bold text-primary">{data.rough_cost?.total_range || 'Dle projektové konfigurace'}</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Ceny jsou orientační, bez DPH. Finální cena bude upřesněna po technické kontrole a schválení rozsahu projektu.</p>
          </section>

          {visualizationUrl && (
            <section className="mt-6">
              <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Vizualizační náhled konkrétního místa</h2>
              <div className="mt-2 overflow-hidden border border-border">
                <img src={visualizationUrl} alt="Vizualizace" className="w-full" />
              </div>
              {data.confidence_note && <p className="mt-2 text-[10px] italic text-muted-foreground">{data.confidence_note}</p>}
            </section>
          )}

          {/* Benefits — editable list */}
          {data.benefits.length > 0 && (
            <section className="mt-6">
              <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Přínosy řešení</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {data.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {editMode ? (
                      <>
                        <input value={benefit} onChange={(e) => updateBenefit(i, e.target.value)} className="flex-1 border-b border-slate-200 bg-transparent text-sm outline-none focus:border-cyan-500" />
                        <button onClick={() => removeBenefit(i)} className="text-slate-300 hover:text-destructive"><Trash2 size={14} /></button>
                      </>
                    ) : (
                      <span className="flex-1">{benefit}</span>
                    )}
                  </li>
                ))}
              </ul>
              {editMode && (
                <button onClick={addBenefit} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900"><Plus size={13} /> Přidat přínos</button>
              )}
            </section>
          )}

          {/* Extra documents */}
          {extraDocs.length > 0 && (
            <section className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">Doplňující dokumenty</h2>
              <div className="mt-3 space-y-4">
                {extraDocs.map((doc) => (
                  <div key={doc.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      {editMode ? (
                        <input value={doc.title} onChange={(e) => updateDoc(doc.id, 'title', e.target.value)} className="flex-1 border-b border-cyan-200 bg-transparent text-sm font-bold text-foreground outline-none focus:border-cyan-500" />
                      ) : (
                        <p className="text-sm font-bold text-foreground">{doc.title}</p>
                      )}
                      {editMode && <button onClick={() => removeDoc(doc.id)} className="text-slate-300 hover:text-destructive"><Trash2 size={14} /></button>}
                    </div>
                    {editMode ? (
                      <textarea value={doc.content} onChange={(e) => updateDoc(doc.id, 'content', e.target.value)} rows={5} placeholder="Obsah dokumentu…" className="mt-2 w-full border border-slate-200 bg-white p-3 text-sm text-foreground outline-none focus:border-cyan-500" />
                    ) : (
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{doc.content || '—'}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Add document */}
          {editMode && (
            <div className="mt-4 flex gap-2">
              <input value={newDocTitle} onChange={(e) => setNewDocTitle(e.target.value)} placeholder="Název nového dokumentu (např. Servisní balíček, Technický list, Příloha)…" className="flex-1 border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500" onKeyDown={(e) => e.key === 'Enter' && addDocument()} />
              <button onClick={addDocument} disabled={!newDocTitle.trim()} className="inline-flex items-center gap-1 border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900 hover:bg-cyan-100 disabled:opacity-40"><Plus size={15} /> Přidat dokument</button>
            </div>
          )}

          {/* Order action */}
          <div className="mt-8 rounded-xl border border-cyan-200 bg-cyan-50/60 p-5">
            <p className="text-sm font-semibold text-slate-900">Další krok</p>
            <p className="mt-1 text-xs text-slate-600">Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace. Nabídka je platná do {validUntil}.</p>
            <div className="mt-4 flex flex-wrap gap-2 print:hidden">
              <button onClick={() => onOrder?.('order')} className="inline-flex items-center gap-2 rounded-full bg-[#0e5b67] px-6 py-3 text-sm font-bold text-white hover:bg-[#0b4b56]">
                <Check size={16} /> Objednat
              </button>
              <button onClick={() => onOrder?.('edit_order')} className="inline-flex items-center gap-2 rounded-full border border-[#0e5b67] bg-white px-6 py-3 text-sm font-bold text-[#0e5b67] hover:bg-cyan-50">
                <Edit3 size={16} /> Upravit a objednat
              </button>
            </div>
          </div>
        </div>

        {/* Brand identity footer — email style */}
        <footer className="border-t border-slate-200 bg-[#f2f5f4] px-6 py-6 lg:px-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[.14em] text-cyan-700">Projektový kontakt</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Ing. Radek Meduna</p>
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-2"><Phone size={11} /> +420 774 700 390</p>
                <p className="flex items-center gap-2"><Mail size={11} /> meduna@holmtec.cz · info@mlzidla.cz</p>
                <p className="flex items-center gap-2"><Globe size={11} /> www.mlzidla.cz</p>
                <p className="flex items-center gap-2"><MapPin size={11} /> HolmTec s.r.o. · IČO: 07980223 · DIČ: CZ07980223</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <p>Tento koncept připravil AI systém MLŽIDLA.</p>
              <p className="mt-1">Nabídka byla zkontrolována a schválena obchodníkem.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function EditableSection({ title, value, onChange, editMode }) {
  return (
    <section className="mt-6">
      <h2 className="font-mono text-[10px] tracking-[.16em] uppercase text-accent">{title}</h2>
      <div className="mt-2">
        {editMode ? (
          <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full border border-slate-200 bg-white p-3 text-sm leading-relaxed text-foreground outline-none focus:border-cyan-500" />
        ) : (
          <p className="text-sm leading-relaxed text-foreground">{value || '—'}</p>
        )}
      </div>
    </section>
  );
}

function EditableField({ label, value, readOnly }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function CostRowEditable({ label, value, onChange, editMode }) {
  return (
    <tr className="border-b border-border">
      <td className="px-4 py-2.5 text-foreground">{label}</td>
      <td className="px-4 py-2.5 text-right">
        {editMode ? (
          <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full border-b border-cyan-200 bg-transparent text-right font-semibold text-foreground outline-none focus:border-cyan-500" />
        ) : (
          <span className="font-semibold text-foreground">{value || '—'}</span>
        )}
      </td>
    </tr>
  );
}
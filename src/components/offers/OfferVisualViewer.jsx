import React, { useState, useMemo } from 'react';
import {
  Eye, Edit3, Send, FileText, Download, ChevronLeft, ChevronRight,
  Shield, CheckCircle2, Loader2, Mail, Phone, Globe, MapPin, Package,
  Sparkles, Clock, AlertTriangle,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const CONTACT_EMAIL = 'meduna@holmtec.cz';
const CONTACT_PHONE = '+420 774 700 390';
const SITE_URL = 'https://mlzidla.cz';

const money = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));

export default function OfferVisualViewer({ prepared, selected, selectedProduct, onRegenerate, onSend, busy }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    presentation_title: prepared?.clientContent?.presentation_title || `${selectedProduct?.name || ''} — návrh řešení`,
    project_goal: prepared?.clientContent?.project_goal || '',
    solution_summary: prepared?.clientContent?.solution_summary || '',
    benefits: Array.isArray(prepared?.clientContent?.benefits) ? prepared?.clientContent.benefits : [],
    next_step: prepared?.clientContent?.next_step || 'Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace.',
  });
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendSubject, setSendSubject] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  const quoteNumber = prepared?.quoteNumber || '';
  const validUntil = prepared?.validUntil ? new Date(prepared.validUntil).toLocaleDateString('cs-CZ') : '—';
  const clientName = selected?.name || selected?.jmeno || '—';
  const clientEmail = selected?.email || '—';
  const clientCompany = selected?.firma || selected?.company || '';
  const clientPhone = selected?.telefon || selected?.phone || '';
  const productName = selectedProduct?.name || prepared?.projectOrder?.product_name || 'mlžící systém';
  const totalPrice = Number(prepared?.quote?.final_total || prepared?.projectOrder?.total_price || 0);
  const visualizationUrls = prepared?.visualizationUrls || [];
  const today = new Date().toLocaleDateString('cs-CZ');

  const pages = useMemo(() => [
    { id: 'cover', label: 'Titulní strana' },
    { id: 'solution', label: 'Řešení a přínosy' },
    { id: 'pricing', label: 'Cenová kalkulace' },
    { id: 'visuals', label: 'Vizualizace' },
    { id: 'footer', label: 'Kontakt a další krok' },
  ], []);

  const update = (field) => (e) => setEditData((d) => ({ ...d, [field]: e.target.value }));
  const updateBenefit = (i, value) => setEditData((d) => { const next = [...(d.benefits || [])]; next[i] = value; return { ...d, benefits: next }; });
  const addBenefit = () => setEditData((d) => ({ ...d, benefits: [...(d.benefits || []), ''] }));
  const removeBenefit = (i) => setEditData((d) => ({ ...d, benefits: (d.benefits || []).filter((_, idx) => idx !== i) }));

  const handleRegenerate = () => {
    if (!onRegenerate) return;
    onRegenerate({
      clientContent: { ...editData, benefits: (editData.benefits || []).map((b) => String(b || '').trim()).filter(Boolean) },
    });
    setEditMode(false);
  };

  const openSendDialog = () => {
    const firstName = (clientName || '').split(' ')[0] || 'vážený zákazníku';
    setSendSubject(`Cenová nabídka${quoteNumber ? ` · ${quoteNumber}` : ''} — ${productName} | MLŽIDLA®`);
    setSendMessage(`Dobrý den ${firstName},\n\nděkujeme za vaši poptávku. Na základě vašeho zadání jsme připravili cenovou nabídku na ${productName}${clientCompany ? ` pro ${clientCompany}` : ''}.\n\nV příloze najdete kompletní PDF nabídku s vizualizacemi, technickým řešením a cenovou kalkulací. Vizualizace mají konceptní charakter a slouží k představě umístění produktu ve vašem prostoru.\n\nNabídka je platná do ${validUntil}. Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace.\n\nPokud budete chtít upravit umístění nebo rozsah, rádi návrh dopracujeme.\n\nS pozdravem,\n\nIng. Radek Meduna\nMLŽIDLA® / HolmTec\n${CONTACT_PHONE} · ${CONTACT_EMAIL}\n${SITE_URL}`);
    setSendError('');
    setSendSuccess('');
    setSendDialogOpen(true);
  };

  const handleSend = async () => {
    if (!prepared?.projectOrder?.id) { setSendError('Nabídka není uložena — nejprve ji vytvořte.'); return; }
    if (!sendSubject.trim() || !sendMessage.trim()) { setSendError('Vyplňte předmět a text zprávy.'); return; }
    setSending(true);
    setSendError('');
    setSendSuccess('');
    try {
      const response = await base44.functions.invoke('sendClientOffer', {
        project_id: prepared.projectOrder.id,
        confirm_send: true,
        admin_override: true,
        custom_subject: sendSubject,
        custom_message: sendMessage,
      });
      const data = response.data;
      if (data?.ok || data?.sent) {
        setSendSuccess(`Nabídka odeslána na ${data.recipient || clientEmail}. Schválil: ${data.approved_by || 'admin'}.`);
        if (onSend) await onSend();
      } else {
        setSendError(data?.error || 'Odeslání selhalo.');
      }
    } catch (err) {
      setSendError(err?.response?.data?.error || err?.message || 'Chyba při odesílání.');
    } finally {
      setSending(false);
    }
  };

  const downloadPdf = () => {
    if (!prepared?.quote?.pdf_base64) return;
    const bytes = Uint8Array.from(atob(prepared.quote.pdf_base64), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quoteNumber || 'nabidka'}-mlzidla.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, pages.length - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  // ── PAGE RENDERERS ──

  const renderCoverPage = () => (
    <div className="flex min-h-[600px] flex-col">
      {/* Header band */}
      <div className="bg-gradient-to-br from-[#0B5FFF] to-[#00A8E8] px-8 py-10 text-white">
        <div className="flex items-end justify-between gap-4">
          <img src={LOGO_URL} alt="MLŽIDLA.cz" className="w-44 max-w-[70%] brightness-0 invert" />
          <div className="text-right text-[11px] font-semibold uppercase tracking-[.12em] text-white/85">Chytré mlžení<br />by HolmTec</div>
        </div>
        <div className="mt-4 text-base font-semibold tracking-wide">Chladíme svět mlžením</div>
      </div>

      <div className="flex flex-1 flex-col px-8 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-600">Cenová nabídka · projektový návrh</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-[#0B2034]">
          {editMode ? (
            <input value={editData.presentation_title} onChange={update('presentation_title')} className="w-full border-b-2 border-cyan-200 bg-transparent text-2xl font-bold text-[#0B2034] outline-none focus:border-cyan-500" />
          ) : (
            editData.presentation_title
          )}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{clientCompany || clientName} · {today}</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Klient</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{clientName}</p>
            {clientCompany && <p className="text-xs text-slate-500">{clientCompany}</p>}
            <p className="mt-1 text-xs text-slate-500">{clientEmail}</p>
            {clientPhone && <p className="text-xs text-slate-500">{clientPhone}</p>}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nabídka</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{quoteNumber || '—'}</p>
            <p className="text-xs text-slate-500">Datum: {today}</p>
            <p className="text-xs text-slate-500">Platnost do: {validUntil}</p>
          </div>
        </div>

        {visualizationUrls[0] && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <img src={visualizationUrls[0]} alt="Hlavní vizualizace" className="aspect-[16/9] w-full object-cover" />
          </div>
        )}

        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">Produkt</p>
            <p className="mt-1 text-base font-bold text-[#0B2034]">{productName}</p>
            {totalPrice > 0 && (
              <p className="mt-2 text-lg font-bold text-[#0B5FFF]">{money(totalPrice)} Kč bez DPH</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSolutionPage = () => (
    <div className="flex min-h-[600px] flex-col px-8 py-10">
      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-600">Řešení a přínosy</p>
      <h2 className="mt-2 font-heading text-2xl font-bold text-[#0B2034]">Navržené řešení</h2>

      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Shrnutí zadání / projektový cíl</p>
        {editMode ? (
          <textarea value={editData.project_goal} onChange={update('project_goal')} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-cyan-500" />
        ) : (
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">{editData.project_goal || '—'}</p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Koncept řešení</p>
        {editMode ? (
          <textarea value={editData.solution_summary} onChange={update('solution_summary')} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-cyan-500" />
        ) : (
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">{editData.solution_summary || '—'}</p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Přínosy řešení</p>
        <ul className="mt-2 space-y-2">
          {(editData.benefits || []).filter(Boolean).map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
              {editMode ? (
                <div className="flex flex-1 items-center gap-2">
                  <input value={benefit} onChange={(e) => updateBenefit(i, e.target.value)} className="flex-1 border-b border-slate-200 bg-transparent text-sm outline-none focus:border-cyan-500" />
                  <button onClick={() => removeBenefit(i)} className="text-slate-300 hover:text-rose-500"><span className="text-xs">×</span></button>
                </div>
              ) : (
                <span>{benefit}</span>
              )}
            </li>
          ))}
        </ul>
        {editMode && (
          <button onClick={addBenefit} className="mt-2 text-xs font-semibold text-cyan-700 hover:text-cyan-900">+ Přidat přínos</button>
        )}
      </div>

      {selectedProduct?.material && (
        <div className="mt-6 rounded-lg border border-cyan-200 bg-cyan-50/40 p-4">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-700"><Shield size={12} /> Materiálový standard</p>
          <p className="mt-1 text-sm text-slate-700">{selectedProduct.material}</p>
        </div>
      )}
    </div>
  );

  const renderPricingPage = () => {
    const lineItems = prepared?.projectOrder?.line_items || prepared?.variantPricing || [];
    const vatRate = 0.21;
    const vat = Math.round(totalPrice * vatRate);
    const totalIncVat = totalPrice + vat;

    return (
      <div className="flex min-h-[600px] flex-col px-8 py-10">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-600">Cenová kalkulace</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-[#0B2034]">Položkový rozpis</h2>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Položka</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">Množství</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cena / ks</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">Celkem</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length > 0 ? lineItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{item.label || item.name || '—'}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{item.quantity || 1} {item.unit || 'ks'}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{money(item.unit_price || item.unit_price_ex_vat || 0)} Kč</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{money(item.total || item.total_price || (Number(item.unit_price || 0) * Number(item.quantity || 1)))} Kč</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-3 text-slate-700">{productName}</td>
                  <td className="px-4 py-3 text-right text-slate-600">1 ks</td>
                  <td className="px-4 py-3 text-right text-slate-600">{money(totalPrice)} Kč</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{money(totalPrice)} Kč</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-cyan-300 bg-cyan-50/40">
                <td colSpan={3} className="px-4 py-3 text-right font-semibold text-slate-700">Celkem bez DPH</td>
                <td className="px-4 py-3 text-right font-bold text-[#0B2034]">{money(totalPrice)} Kč</td>
              </tr>
              <tr className="bg-slate-50">
                <td colSpan={3} className="px-4 py-2 text-right text-xs text-slate-500">DPH 21 %</td>
                <td className="px-4 py-2 text-right text-sm text-slate-600">{money(vat)} Kč</td>
              </tr>
              <tr className="bg-[#0B2034] text-white">
                <td colSpan={3} className="px-4 py-3 text-right font-bold">Celkem s DPH</td>
                <td className="px-4 py-3 text-right font-bold text-lg">{money(totalIncVat)} Kč</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="flex items-center gap-2 text-xs text-amber-800">
            <Clock size={14} className="shrink-0" />
            <span><strong>Platnost nabídky:</strong> {validUntil}. Po tomto termínu si vyhrazujeme právo na úpravu cen materiálů.</span>
          </p>
        </div>

        <p className="mt-4 text-xs text-slate-500">Ceny jsou uvedeny bez DPH. Finální cena bude upřesněna po technické kontrole a schválení rozsahu projektu.</p>
      </div>
    );
  };

  const renderVisualsPage = () => (
    <div className="flex min-h-[600px] flex-col px-8 py-10">
      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-600">Vizualizace projektu</p>
      <h2 className="mt-2 font-heading text-2xl font-bold text-[#0B2034]">Ultrarealistické vizualizace</h2>
      <p className="mt-2 text-sm text-slate-500">Vizualizace zachovávají přesný produktový vzhled — tvar, rozměry a konstrukci podle katalogu. Slouží jako koncept umístění produktu ve vašem prostoru.</p>

      {visualizationUrls.length > 0 ? (
        <div className="mt-6 space-y-4">
          {visualizationUrls.slice(0, 4).map((url, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src={url} alt={`Vizualizace ${i + 1}`} className="aspect-[16/9] w-full object-cover" />
              <div className="border-t border-slate-100 px-4 py-2">
                <p className="text-xs font-semibold text-slate-700">Vizualizace {i + 1} — koncept umístění produktu</p>
                <p className="text-[10px] text-slate-400">Vizualizace má konceptní charakter; finální provedení může mírně lišit podle technických podmínek lokality.</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <AlertTriangle size={28} className="text-amber-400" />
          <p className="mt-3 text-sm text-slate-500">Vizualizace zatím nebyly vygenerovány.</p>
          <p className="text-xs text-slate-400">Vytvořte nabídku znovu pro automatické vygenerování vizualizací.</p>
        </div>
      )}
    </div>
  );

  const renderFooterPage = () => (
    <div className="flex min-h-[600px] flex-col px-8 py-10">
      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-600">Další krok a kontakt</p>
      <h2 className="mt-2 font-heading text-2xl font-bold text-[#0B2034]">Postup spolupráce</h2>

      <div className="mt-6 space-y-3">
        {[
          { num: '1', title: 'Nabídka', desc: 'Připravili jsme cenovou nabídku s vizualizacemi.' },
          { num: '2', title: 'Potvrzení', desc: 'Potvrďte zájem v sekci Můj projekt nebo e-mailem.' },
          { num: '3', title: 'Výrobní záloha 50 %', desc: 'Po potvrzení vystavíme daňový doklad na 50 % výrobní zálohy.' },
          { num: '4', title: 'Výroba', desc: 'Zahájíme výrobu vašeho řešení na míru (typicky 2–4 týdny).' },
          { num: '5', title: 'Dodání / instalace', desc: 'Doručíme a případně nainstalujeme řešení na vašem místě.' },
        ].map((step) => (
          <div key={step.num} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B5FFF] to-[#00A8E8] text-sm font-bold text-white">{step.num}</div>
            <div>
              <p className="text-sm font-bold text-slate-900">{step.title}</p>
              <p className="text-xs text-slate-500">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Další krok</p>
        {editMode ? (
          <textarea value={editData.next_step} onChange={update('next_step')} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-cyan-500" />
        ) : (
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">{editData.next_step}</p>
        )}
      </div>

      <div className="mt-auto border-t-2 border-cyan-400 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-cyan-700">Projektový kontakt</p>
        <p className="mt-1 text-lg font-bold text-slate-900">Ing. Radek Meduna</p>
        <div className="mt-2 space-y-1 text-xs text-slate-500">
          <p className="flex items-center gap-2"><Phone size={11} /> {CONTACT_PHONE}</p>
          <p className="flex items-center gap-2"><Mail size={11} /> {CONTACT_EMAIL} · info@mlzidla.cz</p>
          <p className="flex items-center gap-2"><Globe size={11} /> www.mlzidla.cz</p>
          <p className="flex items-center gap-2"><MapPin size={11} /> HolmTec s.r.o. · IČO: 07980223 · DIČ: CZ07980223</p>
        </div>
      </div>
    </div>
  );

  const pageRenderers = [renderCoverPage, renderSolutionPage, renderPricingPage, renderVisualsPage, renderFooterPage];

  return (
    <div className="mt-6 rounded-2xl border border-cyan-300 bg-white p-5 sm:p-6">
      {/* Safety gate banner */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <Shield size={16} className="shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          <strong>Bezpečnostní brána:</strong> Nabídka je připravena jako koncept. Automaticky se nikdy neodesílá — k odeslání dochází až po vašem ručním schválení.
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-800">Vizuální nabídka · {pages.length} stránek</span>
        <span className="ml-auto rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-bold text-cyan-800">{quoteNumber || '—'}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${editMode ? 'bg-[#0e5b67] text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          {editMode ? <CheckCircle2 size={14} /> : <Edit3 size={14} />}
          {editMode ? 'Uložit úpravy' : 'Upravit nabídku'}
        </button>
        {editMode && (
          <button
            onClick={handleRegenerate}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-4 py-2.5 text-xs font-bold text-cyan-900 hover:bg-cyan-100 disabled:opacity-50"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {busy ? 'Přegeneruji…' : 'Přegenerovat PDF'}
          </button>
        )}
        <button
          onClick={downloadPdf}
          disabled={!prepared?.quote?.pdf_base64}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download size={14} /> Stáhnout PDF
        </button>
        {prepared?.quoteDriveUrl && (
          <a href={prepared.quoteDriveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
            <FileText size={14} /> PDF na Mlžném disku
          </a>
        )}
        <button
          onClick={openSendDialog}
          className="inline-flex items-center gap-2 rounded-full bg-[#0B5FFF] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0a4ee0]"
        >
          <Send size={14} /> Odeslat klientovi
        </button>
      </div>

      {/* Page navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prevPage} disabled={currentPage === 0} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30">
          <ChevronLeft size={14} /> Předchozí
        </button>
        <div className="flex gap-1">
          {pages.map((page, i) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(i)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${i === currentPage ? 'bg-[#0e5b67] text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={nextPage} disabled={currentPage === pages.length - 1} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30">
          Další <ChevronRight size={14} />
        </button>
      </div>
      <p className="mb-4 text-center text-xs font-semibold text-slate-600">{pages[currentPage]?.label} (strana {currentPage + 1} / {pages.length})</p>

      {/* Page content — A4-like preview */}
      <div className="mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ maxWidth: '800px', minHeight: '600px' }}>
        {pageRenderers[currentPage]()}
      </div>

      {/* Send dialog */}
      {sendDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Send size={18} className="text-[#0B5FFF]" /> Odeslat nabídku klientovi</h3>
                <button onClick={() => setSendDialogOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <p className="mt-1 text-xs text-slate-500">Odesílatel: <strong>{CONTACT_EMAIL}</strong> · Příjemce: <strong>{clientEmail}</strong></p>
            </div>

            <div className="space-y-4 p-6">
              {sendError && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {sendError}
                </div>
              )}
              {sendSuccess && (
                <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> {sendSuccess}
                </div>
              )}

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Předmět</label>
                <input value={sendSubject} onChange={(e) => setSendSubject(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Doplňující text zprávy</label>
                <textarea value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} rows={12} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400" />
                <p className="mt-1 text-[10px] text-slate-400">Text bude doplněn profesionální patičkou s logem MLŽIDLA.cz a kontaktními údaji.</p>
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">Přílohy</p>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  {prepared?.quoteDriveUrl && <p className="flex items-center gap-2"><FileText size={12} /> PDF nabídka ({quoteNumber})</p>}
                  {prepared?.presentation?.presentation_pdf_url && <p className="flex items-center gap-2"><FileText size={12} /> PDF prezentace</p>}
                  {visualizationUrls.map((url, i) => <p key={i} className="flex items-center gap-2"><FileText size={12} /> Vizualizace {i + 1}</p>)}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Shield size={14} className="mt-0.5 shrink-0" />
                <span><strong>Bezpečnostní brána:</strong> Kliknutím na „Odeslat" potvrzujete ruční odeslání nabídky klientovi z adresy {CONTACT_EMAIL}. Tato akce je nevratná.</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSendDialogOpen(false)} className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Zrušit</button>
                <button onClick={handleSend} disabled={sending || !sendSubject.trim() || !sendMessage.trim()} className="flex-1 rounded-full bg-[#0B5FFF] px-5 py-3 text-sm font-bold text-white hover:bg-[#0a4ee0] disabled:opacity-50">
                  {sending ? <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Odesílám…</span> : <span className="flex items-center gap-2"><Send size={15} /> Odeslat nabídku</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
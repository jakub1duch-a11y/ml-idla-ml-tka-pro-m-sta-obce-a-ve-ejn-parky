import React, { useEffect, useMemo, useState } from 'react';
import { Download, Printer, Sparkles, FileText, X, Mail, Phone, Building2, MapPin, MessageSquare, ExternalLink, FolderOpen, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const date = value => {
  if (!value) return 'Neuvedeno';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' });
};
const validUrl = value => typeof value === 'string' && /^https:\/\/\S+$/i.test(value);
const fields = [
  ['Místo instalace', 'installation_location'], ['Typ projektu', 'project_scope'],
  ['Typ zakázky', 'request_type'], ['Počet kusů', 'quantity'],
  ['Fotografie', 'photo_count'], ['Vizualizace', 'requested_visualization'],
  ['Rozsah instalace', 'installation_option'], ['Cenit instalaci', 'needs_installation_quote'],
  ['Povrch', 'surface_type'], ['Přípojka vody', 'water_connection_state'],
  ['Délka výkopu (m)', 'trench_length_m'], ['Služba', 'service_type'],
];
const valueText = v => v === true ? 'Ano' : v === false ? 'Ne' : v === null || v === undefined || v === '' ? null : String(v);
const button = 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50';
const printCss = '@media print { body * { visibility: hidden !important; } #inquiry-print-area, #inquiry-print-area * { visibility: visible !important; } #inquiry-print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 190mm !important; max-width: none !important; margin: 0 !important; box-shadow: none !important; border: 0 !important; } @page { size: A4; margin: 10mm; } }';

export default function InquiryDetailPanel({ item, onClose, orders = [], activities = [], onPrepareOffer, onGenerateOfferPdf, preparingOffer = false, generatingOfferPdf = false, error = '' }) {
  const [pdfBusy, setPdfBusy] = useState(false);
  useEffect(() => {
    if (!item) return undefined;
    const escape = e => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [item, onClose]);

  const relatedActivities = useMemo(() => {
    if (!item) return [];
    const email = String(item.email || '').toLowerCase().trim();
    return activities.filter(a => (a.related_inquiry_id && a.related_inquiry_id === item.id) || (email && String(a.contact_email || '').toLowerCase().trim() === email))
      .sort((a,b) => new Date(b.completed_at || b.created_date || b.due_date || 0) - new Date(a.completed_at || a.created_date || a.due_date || 0));
  }, [activities, item]);

  if (!item) return null;
  const raw = item.raw || {};
  const extra = fields.map(([label, key]) => ({ label, value: valueText(raw[key]) })).filter(x => x.value !== null);
  const canPrepare = item.entity === 'Poptavka' || item.entity === 'ContactInquiry';
  const latest = orders[0];
  const attachments = [
    ...[raw.photo_url, raw.capture_url, raw.attachment_url, raw.document_url].filter(validUrl),
    ...(Array.isArray(raw.photo_urls) ? raw.photo_urls.filter(validUrl) : []),
    ...(Array.isArray(raw.attachments) ? raw.attachments.map(x => typeof x === 'string' ? x : x?.url).filter(validUrl) : []),
  ].filter((x,i,a) => a.indexOf(x) === i);
  const name = item.name || 'Neznámý klient';

  const downloadPdf = async () => {
    const sheet = document.getElementById('inquiry-print-area');
    if (!sheet || pdfBusy) return;
    setPdfBusy(true);
    try {
      const canvas = await html2canvas(sheet, { scale: 1.7, useCORS: true, backgroundColor: '#ffffff', logging: false });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const img = canvas.toDataURL('image/png');
      const imgHeight = canvas.height * 190 / canvas.width;
      let left = imgHeight, y = 10;
      pdf.addImage(img, 'PNG', 10, y, 190, imgHeight);
      left -= 277;
      while (left > 0) { y = 10 - (imgHeight - left); pdf.addPage(); pdf.addImage(img, 'PNG', 10, y, 190, imgHeight); left -= 277; }
      const fileName = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,55);
      pdf.save('MLZIDLA-poptavka-' + fileName + '.pdf');
    } catch(e) {
      console.error('PDF export',e);
      window.alert('PDF se nepodařilo vytvořit. Použijte Tisk a volbu Uložit jako PDF.');
    } finally { setPdfBusy(false); }
  };

  return (
    <div id="inquiry-detail-overlay" role="dialog" aria-modal="true" aria-label={'Detail poptávky – ' + name} className="fixed inset-0 z-[180] overflow-y-auto bg-[#061827]/95 print:bg-white print:overflow-visible">
      <style>{printCss}</style>
      <div className="mx-auto max-w-[1400px] p-3 sm:p-6 print:p-0">
        <header className="mb-5 flex items-start justify-between gap-4 print:hidden">
          <div><p className="text-xs font-mono uppercase tracking-widest text-cyan-300">MLŽIDLA.cz / Obchod / Poptávky</p><h2 className="mt-2 text-2xl font-semibold text-white">{name}</h2><p className="text-sm text-white/50">{item.source} · {date(item.created_date)} · {item.status || 'Nová'}</p></div>
          <button onClick={onClose} aria-label="Zavřít detail" className="rounded-xl border border-white/15 p-3 text-white hover:bg-white/10"><X size={19}/></button>
        </header>
        <div className="grid gap-5 lg:grid-cols-[310px_minmax(0,1fr)] print:block">
          <aside className="space-y-4 print:hidden">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-sm font-semibold text-white">Kontaktní údaje</h3>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex gap-2"><Building2 size={16} className="shrink-0 text-cyan-300"/>{item.company || 'Organizace neuvedena'}</div>
                {item.email && <a className="flex items-center gap-2 break-all text-cyan-200 hover:underline" href={'mailto:'+item.email}><Mail size={16} className="shrink-0"/>{item.email}</a>}
                {item.phone && <a className="flex items-center gap-2 hover:underline" href={'tel:'+item.phone}><Phone size={16}/>{item.phone}</a>}
                {raw.installation_location && <div className="flex gap-2"><MapPin size={16}/>{raw.installation_location}</div>}
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">Dokumenty a workflow</h3>
              <div className="grid gap-2">
                <button onClick={downloadPdf} disabled={pdfBusy} className={button}><Download size={16}/>{pdfBusy ? 'Export PDF…' : 'Stáhnout poptávku PDF'}</button>
                <button onClick={() => window.print()} className={button}><Printer size={16}/>Tisk A4</button>
                {canPrepare && <button onClick={() => onPrepareOffer?.(item)} disabled={preparingOffer} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-3 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-50"><Sparkles size={17}/>{preparingOffer ? 'Připravuji koncept…' : 'Připravit nabídku'}</button>}
                {canPrepare && <button onClick={() => onGenerateOfferPdf?.(item)} disabled={generatingOfferPdf} className={button}><FileText size={16}/>{generatingOfferPdf ? 'Generuji PDF…' : 'PDF konceptu nabídky'}</button>}
                {validUrl(latest?.quote_pdf_url) && <a href={latest.quote_pdf_url} target="_blank" rel="noreferrer" className={button}><ExternalLink size={16}/>Aktuální cenová nabídka</a>}
                {validUrl(latest?.drive_case_folder_url) && <a href={latest.drive_case_folder_url} target="_blank" rel="noreferrer" className={button}><FolderOpen size={16}/>Složka na Google Disku</a>}
              </div>
              <p className="mt-3 text-xs text-white/45">Nabídka se připraví pouze jako koncept. Žádný e-mail se neposílá automaticky.</p>
              {error && <p role="alert" className="mt-2 rounded bg-red-400/10 p-2 text-xs text-red-200">{error}</p>}
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><Clock size={15}/>Historie v CRM</h3>
              {relatedActivities.length === 0 ? <p className="text-xs leading-5 text-white/50">Zatím bez propojených aktivit. Zprávy z Gmailu se objeví až po synchronizaci do CRM.</p> : relatedActivities.slice(0,15).map((a,i) =>
                <div key={a.id || i} className="mt-3 border-l-2 border-cyan-300/40 pl-3 text-xs"><strong className="text-white/85">{a.subject || a.type || 'Aktivita'}</strong><p className="text-white/35">{date(a.completed_at || a.created_date || a.due_date)}</p><p className="mt-1 whitespace-pre-wrap text-white/55">{a.description}</p></div>)}
            </section>
          </aside>
          <section className="min-w-0">
            <article id="inquiry-print-area" className="mx-auto w-full max-w-[850px] bg-white p-5 text-slate-900 shadow-xl sm:p-10 print:p-0" style={{overflowWrap:'anywhere'}}>
              <div className="flex items-start justify-between gap-6 border-b-2 border-[#0b3147] pb-5">
                <div><p className="text-xs font-bold uppercase tracking-widest text-[#0b7898]">MLŽIDLA.cz</p><h1 className="mt-2 text-2xl font-bold text-[#0b3147]">Karta zákaznické poptávky</h1><p className="mt-1 text-xs text-slate-500">Interní obchodní dokument · nikoli cenová nabídka</p></div>
                <div className="text-right text-xs text-slate-500"><p>ID: {item.id}</p><p>Vytvořeno: {date(item.created_date)}</p><p>Zdroj: {item.source}</p></div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4"><h2 className="mb-3 text-xs font-bold uppercase text-slate-500">Zákazník / kontakty</h2><p className="text-lg font-semibold">{name}</p>{item.company && <p className="text-sm">{item.company}</p>}{item.email && <p className="mt-1 text-sm">{item.email}</p>}{item.phone && <p className="text-sm">{item.phone}</p>}</div>
                <div className="rounded-lg bg-slate-50 p-4"><h2 className="mb-3 text-xs font-bold uppercase text-slate-500">Projekt</h2><p className="font-semibold">{item.product || 'Produkt nezvolen'}</p><p className="mt-1 text-sm">Stav: {item.status || 'Nová'}</p><p className="text-sm">Fáze nabídky: {item.offer_status || 'nova_poptavka'}</p>{raw.installation_location && <p className="text-sm">Místo: {raw.installation_location}</p>}</div>
              </div>
              <div className="mt-6"><h2 className="mb-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase text-[#0b3147]"><MessageSquare size={14} className="mr-1 inline"/>Originální zpráva zákazníka</h2><div className="whitespace-pre-wrap break-words rounded-md bg-slate-50 p-4 text-sm leading-6">{item.message || 'Zpráva není k dispozici.'}</div></div>
              {raw.description && raw.description !== item.message && <div className="mt-4"><h2 className="text-xs font-bold uppercase text-[#0b3147]">Doplňující popis</h2><p className="mt-1 whitespace-pre-wrap text-sm">{raw.description}</p></div>}
              {extra.length > 0 && <div className="mt-6"><h2 className="mb-3 border-b border-slate-200 pb-2 text-xs font-bold uppercase text-[#0b3147]">Technické a projektové údaje</h2><div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">{extra.map(row => <div key={row.label} className="flex justify-between gap-2 border-b border-slate-100 py-1 text-xs"><span className="text-slate-500">{row.label}</span><strong className="text-right">{row.value}</strong></div>)}</div></div>}
              {attachments.length > 0 && <div className="mt-6"><h2 className="mb-2 text-xs font-bold uppercase text-[#0b3147]">Přílohy / podklady</h2>{attachments.map((url,i) => <p key={url} className="break-all py-1 text-xs text-sky-700">{i+1}. {url}</p>)}</div>}
              <div className="mt-6"><h2 className="mb-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase text-[#0b3147]">Související nabídky ({orders.length})</h2>
                {orders.length === 0 ? <p className="text-sm text-slate-500">Zatím nevytvořena nabídka.</p> : orders.map((o,i) => <div key={o.id || i} className="flex justify-between gap-3 border-b border-slate-100 py-2 text-xs"><div><strong>{o.quote_number || o.project_name || 'Koncept nabídky'}</strong><p className="text-slate-500">{o.product_name || ''}</p></div><div className="text-right"><p>{o.status || 'draft'}</p><p className="text-slate-500">{date(o.issued_at || o.created_date)}</p></div></div>)}
              </div>
              <div className="mt-6"><h2 className="mb-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase text-[#0b3147]">Historie komunikace / aktivit ({relatedActivities.length})</h2>
                {relatedActivities.length === 0 ? <p className="text-sm text-slate-500">Bez zaznamenané aktivity v CRM. Nejde o kompletní výpis Gmailu.</p> : relatedActivities.map((a,i) => <div key={a.id || i} className="border-b border-slate-100 py-2 text-xs"><div className="flex justify-between gap-2"><strong>{a.subject || a.type || 'Aktivita'}</strong><span className="text-slate-500">{date(a.completed_at || a.created_date || a.due_date)}</span></div><p className="mt-1 whitespace-pre-wrap text-slate-600">{a.description}</p></div>)}
              </div>
              <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500"><span>MLŽIDLA.cz / HolmTec · meduna@holmtec.cz</span><span>Generováno z administrace poptávek</span></div>
            </article>
            <p className="mt-3 text-center text-xs text-white/40 print:hidden">Náhled pro tisk a PDF. Dokument se neodesílá zákazníkovi.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

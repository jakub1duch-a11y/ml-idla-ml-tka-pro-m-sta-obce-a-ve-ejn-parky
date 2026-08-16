import React, { useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, FileText, Send, Sparkles, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { withSignature } from '@/components/offers/messageSignature';

const money = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));
const errorMessage = (error) => error?.response?.data?.error || error?.message || 'Akci se nepodařilo dokončit.';
const BCC = ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'];
const AUDIENCES = [
  { value: 'city_public', label: 'Města / obce / náměstí / parky' },
  { value: 'residential', label: 'Rezidenční zahrady / terasy' },
  { value: 'wellness_hospitality', label: 'Wellness / hotel / gastro / resort' },
  { value: 'architecture_design', label: 'Architekt / developer / krajinář' },
  { value: 'custom', label: 'Zakázkový projekt / atypické řešení' },
];
const FOLLOW_UP_TEMPLATES = [
  { value: 'inquiry_reminder', label: 'Připomenout poptávku' },
  { value: 'offer_reminder', label: 'Připomenout cenovou nabídku' },
  { value: 'action_discount', label: 'Akční zvýhodnění · 30 dní' },
];
const FOLLOW_UP_OFFER_STATUSES = ['sent', 'viewed', 'extension_requested', 'approved', 'expired'];

export default function InquiryManager({ inquiries, products, mediaFiles, onSent }) {
  const [selectedId, setSelectedId] = useState(inquiries[0]?.key || '');
  const [productId, setProductId] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [installation, setInstallation] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [audienceVariant, setAudienceVariant] = useState('city_public');
  const [senderEmail, setSenderEmail] = useState('meduna@holmtec.cz');
  const [approvedToSend, setApprovedToSend] = useState(false);
  const [prepared, setPrepared] = useState(null);
  const [followUpType, setFollowUpType] = useState('');
  const [followUpDiscount, setFollowUpDiscount] = useState(5);
  const [latestOffer, setLatestOffer] = useState(null);
  const [followUpApproved, setFollowUpApproved] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const selected = useMemo(() => inquiries.find((item) => item.key === selectedId), [inquiries, selectedId]);
  const total = Number(basePrice || 0) + Number(installation || 0);
  const finalTotal = Math.round(total * (1 - Number(discount || 0) / 100));
  const selectedProduct = products.find((item) => item.id === productId);

  const resetPrepared = () => { setPrepared(null); setApprovedToSend(false); };
  const chooseProduct = (id) => { const product = products.find((item) => item.id === id); setProductId(id); setBasePrice(product?.price_from || 0); resetPrepared(); };

  const generateText = async () => {
    if (!selected) return;
    const email = selected.email?.trim().toLowerCase();
    const history = inquiries.filter((item) => item.key !== selected.key && item.email?.trim().toLowerCase() === email).reverse()
      .map((item) => `${new Date(item.created_date).toLocaleDateString('cs-CZ')}: ${item.message}`).join('\n') || 'Žádná předchozí komunikace není k dispozici.';
    const audience = AUDIENCES.find((item) => item.value === audienceVariant)?.label || 'Zakázkový projekt';
    setError(''); setBusy('text');
    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt: `Napiš profesionální personalizovanou obchodní odpověď v češtině na aktuální poptávku značky MLŽIDLA.cz by HolmTec. Cílová skupina: ${audience}. Tón musí být důvěryhodný, odborný, klidný a přesvědčivý, nikoli agresivně prodejní. Zaměř se na konkrétní přínosy pro daný typ zákazníka, kvalitu řešení, českou výrobu, servis a možnost vizualizace před realizací. Neuváděj vymyšlené technické parametry. Přirozeně vyzvi k otevření přiložené profesionální nabídky a prezentace. Vrať pouze text odpovědi bez předmětu a bez podpisu.\n\nZákazník: ${selected.name}\nAktuální poptávka: ${selected.message}\nVybraný produkt: ${selectedProduct?.name || selected.product || 'neurčeno'}\nCena projektu: ${money(finalTotal)} Kč bez DPH\n\nHistorie komunikace:\n${history}` });
      setSubject(`Nabídka řešení MLŽIDLA.cz – ${selected.firma || selected.company || selected.name}`);
      setMessage(response);
      resetPrepared();
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  const uploadFiles = async (event) => {
    setError('');
    try {
      const files = Array.from(event.target.files || []);
      const uploaded = await Promise.all(files.map(async (file) => { const result = await base44.integrations.Core.UploadFile({ file }); return { file_name: file.name, file_url: result.file_url }; }));
      setAttachments((current) => [...current, ...uploaded]);
    } catch (requestError) { setError(errorMessage(requestError)); }
  };

  const prepareOffer = async () => {
    if (!selected || !selectedProduct) { setError('Nejdříve vyberte produkt pro nabídku.'); return; }
    setError(''); setBusy('prepare'); setApprovedToSend(false);
    try {
      const issuedAt = new Date();
      const validUntil = new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      const quoteNumber = prepared?.quoteNumber || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
      const arUrl = selectedProduct.slug === 'mlzitko-bendy'
        ? 'https://mlzidla.cz/ar/bendy-single'
        : selectedProduct.slug === 'mlzna-brana-gate'
          ? 'https://mlzidla.cz/ar/gate'
          : `https://mlzidla.cz/produkt/${selectedProduct.slug}`;

      const quoteResponse = await base44.functions.invoke('generateProductDatasheet', {
        product: selectedProduct,
        document_type: 'offer',
        inquiry: { name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '' },
        quote: { final_total: finalTotal, base_price: Number(basePrice), installation: Number(installation), discount_percent: Number(discount) },
        quote_number: quoteNumber,
        valid_until: validUntil.toISOString(),
        portal_url: 'https://mlzidla.cz/muj-projekt',
        ar_url: arUrl,
        audience_variant: audienceVariant,
      });
      const quote = quoteResponse.data;

      let quoteDriveUrl = '';
      try {
        const savedQuote = await base44.functions.invoke('saveQuoteToDriveAuto', { pdf_base64: quote?.pdf_base64, filename: quote?.filename, quoteNumber, inquiryEmail: selected.email, inquiryName: selected.firma || selected.company || selected.name, issued_at: issuedAt.toISOString() });
        quoteDriveUrl = savedQuote.data?.drive_url || '';
      } catch (driveError) { console.warn('Quote Drive archive unavailable', driveError); }

      let presentation = null;
      try {
        const presentationResponse = await base44.functions.invoke('generateOfferPresentation', {
          inquiry: { name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', message: selected.message },
          product: selectedProduct,
          quote: { quote_number: quoteNumber, final_total: finalTotal, issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString() },
          ar_url: arUrl,
          audience_variant: audienceVariant,
        });
        presentation = presentationResponse.data;
      } catch (presentationError) { console.warn('Offer presentation unavailable', presentationError); }

      let notebookSourceUrl = '';
      try {
        const sourcePackResponse = await base44.functions.invoke('generateOfferSourcePack', {
          inquiry: { name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', message: selected.message },
          product: selectedProduct,
          quote: { quote_number: quoteNumber, final_total: finalTotal, base_price: Number(basePrice), installation: Number(installation), discount_percent: Number(discount), issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString() },
          presentation_url: presentation?.presentation_url || '', quote_pdf_url: quoteDriveUrl, ar_url: arUrl, audience_variant: audienceVariant,
        });
        notebookSourceUrl = sourcePackResponse.data?.source_url || '';
      } catch (sourcePackError) { console.warn('NotebookLM source pack unavailable', sourcePackError); }

      const orderData = {
        inquiry_id: selected.id, inquiry_type: selected.type,
        project_name: `${selectedProduct.name} — ${selected.firma || selected.company || selected.name}`,
        client_name: selected.name, client_email: selected.email, client_phone: selected.telefon || selected.phone || '', client_company: selected.firma || selected.company || '',
        description: String(selected.message || '').slice(0, 2000), product_id: selectedProduct.id, product_slug: selectedProduct.slug, product_name: selectedProduct.name,
        quote_number: quoteNumber, quote_pdf_url: quoteDriveUrl, presentation_url: presentation?.presentation_url || '', presentation_pdf_url: presentation?.presentation_pdf_url || '', notebook_source_url: notebookSourceUrl,
        drive_case_folder_id: presentation?.drive_case_folder_id || '', drive_case_folder_url: presentation?.drive_case_folder_url || '',
        presentation_variant: audienceVariant, issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString(), ar_url: arUrl, smart_control_included: true,
        status: 'draft', total_price: finalTotal, sender_email: senderEmail, bcc_recipients: BCC,
        supplier_name: 'HolmTec s.r.o. — MLŽIDLA.cz', supplier_contact_name: 'Ing. Radek Meduna', supplier_email: senderEmail, supplier_phone: '+420 774 700 390',
        shared_token: prepared?.projectOrder?.shared_token || crypto.randomUUID(),
      };
      let projectOrder = prepared?.projectOrder?.id
        ? await base44.entities.ProjectOrder.update(prepared.projectOrder.id, orderData)
        : await base44.entities.ProjectOrder.create(orderData);

      let inquiryArchive = null;
      try {
        const archiveResponse = await base44.functions.invoke('archiveInquiryPdf', {
          inquiry: { ...selected, name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', message: selected.message },
          quote_number: quoteNumber,
          issued_at: issuedAt.toISOString(),
          project_order_id: projectOrder.id,
        });
        inquiryArchive = archiveResponse.data;
        projectOrder = { ...projectOrder, inquiry_pdf_url: inquiryArchive?.inquiry_pdf_url || '', drive_case_folder_id: inquiryArchive?.drive_case_folder_id || projectOrder.drive_case_folder_id, drive_case_folder_url: inquiryArchive?.drive_case_folder_url || projectOrder.drive_case_folder_url };
      } catch (archiveError) { console.warn('Inquiry PDF archive unavailable', archiveError); }

      setPrepared({ projectOrder, quote, quoteDriveUrl, presentation, notebookSourceUrl, inquiryArchive, quoteNumber, validUntil, arUrl });
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  const sendReply = async () => {
    if (!selected || !prepared || !approvedToSend || !subject || !message) return;
    setError(''); setBusy('send');
    try {
      const validityLine = `Cenová nabídka ${prepared.quoteNumber} je platná do ${prepared.validUntil.toLocaleDateString('cs-CZ')}.`;
      const portalLine = 'Interaktivní nabídku, prezentaci a elektronické potvrzení objednávky najdete v portálu: https://mlzidla.cz/muj-projekt';
      const signedMessage = withSignature([message.trim(), validityLine, portalLine].filter(Boolean).join('\n\n'));
      await base44.functions.invoke('sendInquiryReply', {
        inquiry_type: selected.type, inquiry_id: selected.id, subject, message: signedMessage, sender_email: senderEmail,
        quote_pdf_base64: prepared.quote?.pdf_base64, quote_filename: prepared.quote?.filename,
        presentation_pdf_base64: prepared.presentation?.presentation_pdf_base64, presentation_filename: prepared.presentation?.presentation_filename,
        presentation_url: prepared.presentation?.presentation_url || '', quote_pdf_url: prepared.quoteDriveUrl || '', portal_url: 'https://mlzidla.cz/muj-projekt',
        valid_until: prepared.validUntil.toISOString(), quote_number: prepared.quoteNumber, attachments,
      });
      if (prepared.projectOrder?.id) await base44.entities.ProjectOrder.update(prepared.projectOrder.id, { status: 'sent', sender_email: senderEmail, bcc_recipients: BCC });
      onSent(); setMessage(''); setSubject(''); setAttachments([]); setPrepared(null); setApprovedToSend(false);
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  if (!selected) return <section className="border-t border-border py-14"><p className="text-muted-foreground">Zatím nejsou k dispozici žádné poptávky.</p></section>;

  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[.78fr_1.22fr] lg:px-10">
        <aside>
          <p className="font-mono text-[10px] tracking-[.16em] uppercase text-secondary">Poptávky</p>
          <h2 className="mt-2 font-heading text-3xl text-foreground">Tvorba nabídky</h2>
          <div className="mt-5 space-y-2">{inquiries.map((item) => <button key={item.key} onClick={() => { setSelectedId(item.key); setError(''); setPrepared(null); setApprovedToSend(false); }} className={`w-full border p-4 text-left ${item.key === selectedId ? 'border-secondary bg-secondary/10' : 'border-border'}`}><strong className="block text-sm text-foreground">{item.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{item.email}</span></button>)}</div>
        </aside>

        <div className="border border-border p-5 lg:p-7">
          <p className="text-sm font-semibold text-foreground">{selected.name} · {selected.email}</p>
          <p className="mt-2 text-sm text-muted-foreground">{selected.message}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">Typ prezentace<select value={audienceVariant} onChange={(e) => { setAudienceVariant(e.target.value); resetPrepared(); }} className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm">{AUDIENCES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="text-xs text-muted-foreground">Odesílat z<select value={senderEmail} onChange={(e) => { setSenderEmail(e.target.value); resetPrepared(); }} className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="meduna@holmtec.cz">meduna@holmtec.cz</option><option value="info@mlzidla.cz">info@mlzidla.cz</option></select></label>
            <select value={productId} onChange={(event) => chooseProduct(event.target.value)} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">Vybrat produkt pro nabídku</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
            <input type="number" value={basePrice} onChange={(event) => { setBasePrice(event.target.value); resetPrepared(); }} placeholder="Cena produktu bez DPH" className="border border-border bg-background px-3 py-2.5 text-sm"/>
            <label className="text-xs text-muted-foreground">Cena instalace bez DPH<input type="number" value={installation} onChange={(event) => { setInstallation(event.target.value); resetPrepared(); }} placeholder="Např. 25 000 Kč" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label>
            <label className="text-xs text-muted-foreground">Sleva z celkové nabídky<input type="number" min="0" max="100" value={discount} onChange={(event) => { setDiscount(event.target.value); resetPrepared(); }} placeholder="Např. 10 %" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label>
          </div>
          <p className="mt-3 text-sm font-bold text-secondary">Cena projektu po slevě: {money(finalTotal)} Kč bez DPH</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Skrytá kopie bude vždy odeslána na: {BCC.join(', ')}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={generateText} disabled={busy === 'text'} className="inline-flex items-center gap-2 border border-secondary px-4 py-2.5 text-sm font-bold text-secondary"><Sparkles size={15}/>{busy === 'text' ? 'Připravuji…' : 'Navrhnout text'}</button>
            <button onClick={prepareOffer} disabled={busy === 'prepare' || !selectedProduct} className="inline-flex items-center gap-2 bg-[#0b4860] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><FileText size={15}/>{busy === 'prepare' ? 'Generuji nabídku…' : prepared ? 'Přegenerovat nabídku' : 'Připravit PDF + prezentaci'}</button>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2.5 text-sm font-bold text-foreground"><Upload size={15}/>Přidat vlastní soubor<input type="file" multiple className="hidden" onChange={uploadFiles}/></label>
          </div>

          {mediaFiles.map((file) => <button key={file.id} onClick={() => setAttachments((current) => current.some((item) => item.file_url === file.file_url) ? current.filter((item) => item.file_url !== file.file_url) : [...current, file])} className={`mr-2 mt-2 inline-flex items-center gap-2 border px-3 py-2 text-xs ${attachments.some((item) => item.file_url === file.file_url) ? 'border-secondary text-secondary' : 'border-border text-muted-foreground'}`}><FileText size={13}/>{file.file_name}</button>)}

          {prepared && (
            <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-mono uppercase tracking-widest text-cyan-800">Náhled před odesláním</p><p className="mt-1 text-sm font-semibold text-slate-950">{prepared.quoteNumber} · platnost do {prepared.validUntil.toLocaleDateString('cs-CZ')}</p></div><CheckCircle2 size={20} className="text-cyan-700"/></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {prepared.quoteDriveUrl && <a href={prepared.quoteDriveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>PDF nabídka <ExternalLink size={12}/></a>}
                {prepared.presentation?.presentation_url && <a href={prepared.presentation.presentation_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Google prezentace <ExternalLink size={12}/></a>}
                {prepared.presentation?.presentation_pdf_url && <a href={prepared.presentation.presentation_pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>PDF prezentace <ExternalLink size={12}/></a>}
                {prepared.notebookSourceUrl && <a href={prepared.notebookSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Podklady / Notebook <ExternalLink size={12}/></a>}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">Zákazník dostane PDF nabídku a PDF prezentaci jako přílohu. V e-mailu bude zároveň interaktivní tlačítko pro objednání, žádost o prodloužení platnosti a zadání přibližného termínu objednání.</p>
            </div>
          )}

          <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Předmět zprávy" className="mt-6 w-full border border-border bg-background px-3 py-2.5 text-sm"/>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Napište odpověď nebo si ji nechte navrhnout." rows="9" className="mt-3 w-full border border-border bg-background px-3 py-3 text-sm"/>

          {prepared && <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700"><input type="checkbox" checked={approvedToSend} onChange={(e) => setApprovedToSend(e.target.checked)} className="mt-0.5 h-4 w-4"/><span><strong>Schvaluji tuto verzi nabídky k odeslání.</strong><br/><span className="text-xs text-slate-500">Bez tohoto potvrzení systém nabídku zákazníkovi neodešle.</span></span></label>}

          {error && <p role="alert" className="mt-3 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <button onClick={sendReply} disabled={busy === 'send' || !prepared || !approvedToSend || !subject || !message} className="mt-4 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Send size={15}/>{busy === 'send' ? 'Odesílám…' : 'Schválit a odeslat nabídku'}</button>
        </div>
      </div>
    </section>
  );
}

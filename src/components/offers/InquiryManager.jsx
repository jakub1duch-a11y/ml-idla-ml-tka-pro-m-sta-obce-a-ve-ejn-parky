import React, { useMemo, useState } from 'react';
import { FileText, Send, Sparkles, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { withSignature } from '@/components/offers/messageSignature';

const money = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));
const errorMessage = (error) => error?.response?.data?.error || error?.message || 'Akci se nepodařilo dokončit.';

export default function InquiryManager({ inquiries, products, mediaFiles, onSent }) {
  const [selectedId, setSelectedId] = useState(inquiries[0]?.key || '');
  const [productId, setProductId] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [installation, setInstallation] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const selected = useMemo(() => inquiries.find((item) => item.key === selectedId), [inquiries, selectedId]);
  const total = Number(basePrice || 0) + Number(installation || 0);
  const finalTotal = Math.round(total * (1 - Number(discount || 0) / 100));

  const chooseProduct = (id) => { const product = products.find((item) => item.id === id); setProductId(id); setBasePrice(product?.price_from || 0); };
  const generateText = async () => {
    if (!selected) return;
    const email = selected.email?.trim().toLowerCase();
    const history = inquiries.filter((item) => item.key !== selected.key && item.email?.trim().toLowerCase() === email).reverse()
      .map((item) => `${new Date(item.created_date).toLocaleDateString('cs-CZ')}: ${item.message}`).join('\n') || 'Žádná předchozí komunikace není k dispozici.';
    setError(''); setBusy('text');
    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt: `Napiš personalizovanou odpověď v češtině na aktuální poptávku pro značku MLŽIDLA®. Tón: věcný, klidný, odborný a vstřícný; zdůrazňuje precizní českou výrobu, individuální návrh a praktický komfort. Nezveličuj, nepoužívej marketingové klišé ani vymyšlené technické parametry. Oslov zákazníka jménem a přirozeně navazuj na historii komunikace. Nabídni krátkou konzultaci nebo další krok. Vrať pouze text odpovědi bez předmětu a bez podpisu.\n\nZákazník: ${selected.name}\nAktuální poptávka: ${selected.message}\nVybraný produkt: ${products.find((item) => item.id === productId)?.name || selected.product || 'neurčeno'}\nCena projektu po úpravě: ${money(finalTotal)} Kč bez DPH\n\nHistorie komunikace:\n${history}` });
      setSubject(`Re: vaše poptávka – MLŽIDLA®`); setMessage(withSignature(response));
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
  const sendReply = async () => {
    if (!selected || !subject || !message) return;
    setError(''); setBusy('send');
    try {
      const product = products.find((item) => item.id === productId);
      let quote = null;
      if (product) {
        const response = await base44.functions.invoke('generateProductDatasheet', { product, document_type: 'offer', quote: { final_total: finalTotal, base_price: Number(basePrice), installation: Number(installation), discount_percent: Number(discount) } });
        quote = response.data;
      }
      const signedMessage = withSignature(message);
      setMessage(signedMessage);
      await base44.functions.invoke('sendInquiryReply', { inquiry_type: selected.type, inquiry_id: selected.id, subject, message: signedMessage, quote_pdf_base64: quote?.pdf_base64, quote_filename: quote?.filename, attachments });
      onSent(); setMessage(''); setSubject(''); setAttachments([]);
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  if (!selected) return <section className="border-t border-border py-14"><p className="text-muted-foreground">Zatím nejsou k dispozici žádné poptávky.</p></section>;
  return <section className="border-t border-border bg-card"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[.8fr_1.2fr] lg:px-10"><aside><p className="font-mono text-[10px] tracking-[.16em] uppercase text-secondary">Poptávky</p><h2 className="mt-2 font-heading text-3xl text-foreground">Odpověď klientovi</h2><div className="mt-5 space-y-2">{inquiries.map((item) => <button key={item.key} onClick={() => { setSelectedId(item.key); setError(''); }} className={`w-full border p-4 text-left ${item.key === selectedId ? 'border-secondary bg-secondary/10' : 'border-border'}`}><strong className="block text-sm text-foreground">{item.name}</strong><span className="mt-1 block text-xs text-muted-foreground">{item.email}</span></button>)}</div></aside><div className="border border-border p-5 lg:p-7"><p className="text-sm font-semibold text-foreground">{selected.name} · {selected.email}</p><p className="mt-2 text-sm text-muted-foreground">{selected.message}</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><select value={productId} onChange={(event) => chooseProduct(event.target.value)} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">Vybrat produkt pro nabídku</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><input type="number" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} placeholder="Cena produktu bez DPH" className="border border-border bg-background px-3 py-2.5 text-sm"/><label className="text-xs text-muted-foreground">Cena instalace bez DPH<input type="number" value={installation} onChange={(event) => setInstallation(event.target.value)} placeholder="Např. 25 000 Kč" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label><label className="text-xs text-muted-foreground">Sleva z celkové nabídky<input type="number" min="0" max="100" value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="Např. 10 %" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label></div><p className="mt-3 text-sm font-bold text-secondary">Cena projektu po slevě: {money(finalTotal)} Kč bez DPH</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={generateText} disabled={busy === 'text'} className="inline-flex items-center gap-2 border border-secondary px-4 py-2.5 text-sm font-bold text-secondary"><Sparkles size={15}/>{busy === 'text' ? 'Připravuji…' : 'Navrhnout text'}</button><label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2.5 text-sm font-bold text-foreground"><Upload size={15}/>Přidat vlastní soubor<input type="file" multiple className="hidden" onChange={uploadFiles}/></label>{mediaFiles.map((file) => <button key={file.id} onClick={() => setAttachments((current) => current.some((item) => item.file_url === file.file_url) ? current.filter((item) => item.file_url !== file.file_url) : [...current, file])} className={`inline-flex items-center gap-2 border px-3 py-2 text-xs ${attachments.some((item) => item.file_url === file.file_url) ? 'border-secondary text-secondary' : 'border-border text-muted-foreground'}`}><FileText size={13}/>{file.file_name}</button>)}</div><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Předmět zprávy" className="mt-6 w-full border border-border bg-background px-3 py-2.5 text-sm"/><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Napište odpověď nebo si ji nechte navrhnout." rows="9" className="mt-3 w-full border border-border bg-background px-3 py-3 text-sm"/>{error && <p role="alert" className="mt-3 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}<button onClick={sendReply} disabled={busy === 'send' || !subject || !message} className="mt-4 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60"><Send size={15}/>{busy === 'send' ? 'Odesílám…' : 'Odeslat odpověď s nabídkou'}</button></div></div></section>;
}
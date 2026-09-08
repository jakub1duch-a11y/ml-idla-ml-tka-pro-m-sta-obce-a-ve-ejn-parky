import React, { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader, Paperclip, Trash2, UploadCloud } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackContactFormSubmit } from '@/lib/ga4';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 12 * 1024 * 1024;

export default function ProductContactForm({ productName, product }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', gdpr: false });
  const [files, setFiles] = useState([]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const addFiles = (event) => {
    const incoming = Array.from(event.target.files || []);
    const valid = incoming.filter((file) => (file.type.startsWith('image/') || file.type === 'application/pdf') && file.size <= MAX_FILE_SIZE);
    setFiles((current) => [...current, ...valid].slice(0, MAX_FILES));
    if (valid.length !== incoming.length) setError('Přijímáme fotografie nebo PDF do 12 MB za soubor.');
    event.target.value = '';
  };

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const result = await base44.integrations.Core.UploadFile({ file });
        return { name: file.name, url: result.file_url };
      }));

      const created = await base44.entities.Poptavka.create({
        jmeno: form.name,
        email: form.email,
        telefon: form.phone,
        produkt: productName,
        zprava: form.message || `Mám zájem o návrh a cenovou nabídku pro ${productName}.`,
        request_type: 'standard',
        service_type: 'product_quote',
        status: 'nova',
        offer_status: 'nova_poptavka',
        attachment_names: uploaded.map((item) => item.name),
        attachment_urls: uploaded.map((item) => item.url),
        photo_count: uploaded.filter((item) => /\.(avif|gif|heic|jpeg|jpg|png|webp)$/i.test(item.name)).length,
        requested_visualization: uploaded.some((item) => /\.(avif|gif|heic|jpeg|jpg|png|webp)$/i.test(item.name))
      });

      trackContactFormSubmit('produkt_zjednodusena', productName, created?.id || '');
      setSent(true);
    } catch (submitError) {
      console.error('Product inquiry failed', submitError);
      setError('Poptávku se nepodařilo uložit. Zkuste to znovu nebo zavolejte na +420 774 700 390.');
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div className="rounded-[22px] border border-emerald-200 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50"><CheckCircle2 size={22} className="text-emerald-600" /></div>
      <p className="font-semibold text-slate-950">Děkujeme, poptávku máme.</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">Ozveme se a technické podklady doplníme společně až podle vašeho projektu.</p>
    </div>
  );

  return (
    <form id="produkt-poptavka" onSubmit={submit} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,.06)] sm:p-6">
      <div className="mb-5">
        <p className="font-mono text-[9px] uppercase tracking-[.18em] text-cyan-700">Nezávazná poptávka</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-950">Chci návrh a cenovou nabídku</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">Stačí kontakt. Rozměry, instalaci a smart řízení s vámi dořešíme následně.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[11px] font-semibold text-slate-600">Jméno *<input required value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-cyan-500" placeholder="Jméno a příjmení" /></label>
        <label className="text-[11px] font-semibold text-slate-600">E-mail *<input required type="email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-cyan-500" placeholder="jmeno@firma.cz" /></label>
        <label className="text-[11px] font-semibold text-slate-600 sm:col-span-2">Telefon<input value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-cyan-500" placeholder="+420 000 000 000" /></label>
        <label className="text-[11px] font-semibold text-slate-600 sm:col-span-2">Krátce o projektu<textarea rows={3} value={form.message} onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-cyan-500" placeholder="Např. náměstí, park, zahrada, počet prvků nebo termín…" /></label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 hover:bg-white"><UploadCloud size={14}/> Přidat foto místa</button>
        <span className="text-[10px] text-slate-400">volitelné · až {MAX_FILES} soubory</span>
        <input ref={fileInputRef} type="file" accept="image/*,.pdf,application/pdf" multiple onChange={addFiles} className="sr-only" />
      </div>

      {files.length > 0 && <div className="mt-3 space-y-2">{files.map((file, index) => <div key={file.name + file.lastModified} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><Paperclip size={13} className="text-cyan-700"/><span className="min-w-0 flex-1 truncate text-xs text-slate-600">{file.name}</span><button type="button" onClick={() => setFiles((current) => current.filter((_, i) => i !== index))} aria-label={`Odebrat ${file.name}`} className="text-slate-400 hover:text-rose-600"><Trash2 size={13}/></button></div>)}</div>}

      <label className="mt-4 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-500"><input required type="checkbox" checked={form.gdpr} onChange={(e) => setForm((v) => ({ ...v, gdpr: e.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-slate-300"/><span>Souhlasím se zpracováním údajů pro vyřízení poptávky.</span></label>
      {error && <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}

      <button type="submit" disabled={sending} className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#86d7f4] px-5 text-sm font-bold text-[#073747] transition hover:bg-[#6ccbed] disabled:opacity-60">
        {sending ? <><Loader size={16} className="animate-spin"/> Odesílám…</> : <>Odeslat poptávku <ArrowRight size={15}/></>}
      </button>
    </form>
  );
}

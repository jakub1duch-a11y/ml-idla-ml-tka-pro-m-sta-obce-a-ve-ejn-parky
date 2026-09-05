import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, FileImage, Loader, MapPin, Paperclip, Trash2, UploadCloud, Wrench } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackContactFormSubmit } from '@/lib/ga4';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 12 * 1024 * 1024;

const SMART_VARIANTS = [
  { value: 'none', label: 'Bez smart řízení' },
  { value: 'v1', label: 'Varianta 1 – Manuální Wi-Fi' },
  { value: 'v2', label: 'Varianta 2 – Smart senzory' },
  { value: 'v3', label: 'Varianta 3 – Plná automatizace' },
  { value: 'all', label: 'Všechny možnosti' }
];

const INSTALLATION_OPTIONS = [
  {
    value: 'full_excavation',
    code: 'A',
    title: 'Kompletní instalace včetně výkopu',
    description: 'Zajistíme trasu vody, výkop, kotvení, montáž, zprovoznění i obnovu povrchu.',
    water: 'requires_route'
  },
  {
    value: 'prepared_water',
    code: 'B',
    title: 'Bez výkopu · připravený přívod vody',
    description: 'Nejvýhodnější varianta, pokud je voda připravená přímo v místě mlžítka.',
    water: 'ready_at_location',
    recommended: true
  },
  {
    value: 'temporary_manhole',
    code: 'C',
    title: 'Dočasně u víka kanalizace',
    description: 'Sezónní nebo pilotní instalace s přívodem vody vedeným bezpečně v kanále.',
    water: 'in_manhole'
  }
];

const SURFACES = [
  { value: 'unknown', label: 'Zatím nevím' },
  { value: 'paving', label: 'Dlažba' },
  { value: 'asphalt', label: 'Asfalt' },
  { value: 'concrete', label: 'Beton' },
  { value: 'grass', label: 'Trávník / zemina' },
  { value: 'gravel', label: 'Mlat / štěrk' },
  { value: 'other', label: 'Jiný povrch' }
];

export default function ProductContactForm({ productName, product }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    quantity: 1,
    message: '',
    accessNotes: '',
    smartVariant: 'none',
    installationType: 'prepared_water',
    surfaceType: 'unknown',
    trenchLength: '',
    visualization: true,
    gdpr: false
  });
  const [files, setFiles] = useState([]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const selectInstallation = (event) => {
      if (!event.detail?.value) return;
      setForm((current) => ({ ...current, installationType: event.detail.value }));
    };
    window.addEventListener('mlzidla:installation-select', selectInstallation);
    return () => window.removeEventListener('mlzidla:installation-select', selectInstallation);
  }, []);

  const selectedInstallation = INSTALLATION_OPTIONS.find((option) => option.value === form.installationType) || INSTALLATION_OPTIONS[1];

  const addFiles = (event) => {
    const incoming = Array.from(event.target.files || []);
    const valid = incoming.filter((file) => (file.type.startsWith('image/') || file.type === 'application/pdf') && file.size <= MAX_FILE_SIZE);
    if (valid.length !== incoming.length) {
      setError('Přijímáme fotografie nebo PDF do 12 MB za soubor.');
    } else {
      setError('');
    }
    setFiles((current) => [...current, ...valid].slice(0, MAX_FILES));
    event.target.value = '';
  };

  const removeFile = (index) => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const result = await base44.integrations.Core.UploadFile({ file });
        return { name: file.name, url: result.file_url };
      }));

      const smartLabel = SMART_VARIANTS.find((variant) => variant.value === form.smartVariant)?.label || SMART_VARIANTS[0].label;
      const detailLines = [
        'Produkt: ' + productName,
        'Počet kusů: ' + form.quantity,
        'Místo instalace: ' + form.location,
        'Rozsah instalace: ' + selectedInstallation.code + ' · ' + selectedInstallation.title,
        'Povrch: ' + (SURFACES.find((surface) => surface.value === form.surfaceType)?.label || 'neuvedeno'),
        form.installationType === 'full_excavation' && form.trenchLength ? 'Předpokládaná délka výkopu: ' + form.trenchLength + ' m' : '',
        'Smart řízení: ' + smartLabel,
        'Požadavek na vizualizaci: ' + (form.visualization ? 'ano' : 'ne'),
        form.accessNotes ? 'Přístup / technické poznámky: ' + form.accessNotes : '',
        form.message ? 'Doplňující zpráva: ' + form.message : ''
      ].filter(Boolean);

      const created = await base44.entities.Poptavka.create({
        jmeno: form.name,
        email: form.email,
        telefon: form.phone,
        firma: form.company,
        produkt: productName,
        zprava: detailLines.join('\n'),
        request_type: 'standard',
        service_type: 'product_installation_quote',
        status: 'nova',
        offer_status: 'nova_poptavka',
        attachment_names: uploaded.map((item) => item.name),
        attachment_urls: uploaded.map((item) => item.url),
        installation_location: form.location,
        installation_option: form.installationType,
        needs_installation_quote: true,
        photo_count: uploaded.filter((item) => /\.(avif|gif|heic|jpeg|jpg|png|webp)$/i.test(item.name)).length,
        quantity: Number(form.quantity) || 1,
        requested_visualization: form.visualization,
        surface_type: form.surfaceType,
        trench_length_m: form.trenchLength ? Number(form.trenchLength) : 0,
        water_connection_state: selectedInstallation.water
      });

      trackContactFormSubmit('produkt_instalace', productName, created?.id || '');
      setSent(true);
    } catch (submitError) {
      console.error('Product inquiry failed', submitError);
      setError('Poptávku se nepodařilo uložit. Zkuste to prosím znovu nebo zavolejte na +420 774 700 390.');
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div className="rounded-3xl border border-emerald-300/40 bg-white p-8 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100">
        <CheckCircle2 className="text-emerald-600" size={23} />
      </div>
      <p className="text-lg font-semibold text-slate-900">Podklady jsme přijali.</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">Technik zkontroluje fotografie, přívod vody a rozsah instalace. Ozveme se zpravidla do 24 hodin.</p>
    </div>
  );

  return (
    <form id="produkt-poptavka" onSubmit={submit} className="space-y-6 rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-700">Cena produktu + instalace</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-slate-950">Upřesněte místo. My připravíme správný rozsah.</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">Fotografie prostoru a informace o přívodu vody výrazně zpřesní vizualizaci i kalkulaci instalace.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-[#0b4860] bg-[#eef8fb] px-4 text-sm font-bold text-[#0b4860] transition-all hover:bg-[#dff3f8]">
          <FileImage size={18} /> Přidat vlastní fotografii prostoru
        </button>
        <a href={'/ai-vizualizace?produkt=' + encodeURIComponent(productName) + '&slug=' + encodeURIComponent(product?.slug || '')} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#0b4860] px-4 text-center text-sm font-bold text-white transition-all hover:bg-[#08394c]">
          <UploadCloud size={18} /> Interaktivní vizualizace produktu
        </a>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,.pdf,application/pdf" multiple onChange={addFiles} className="sr-only" />

      {files.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">Přílohy pro návrh a kalkulaci</p>
            <span className="font-mono text-[10px] text-slate-400">{files.length} / {MAX_FILES}</span>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={file.name + file.lastModified} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <Paperclip size={14} className="shrink-0 text-cyan-700" />
                <span className="min-w-0 flex-1 truncate text-xs text-slate-700">{file.name}</span>
                <button type="button" onClick={() => removeFile(index)} aria-label={'Odebrat ' + file.name} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          {files.length < MAX_FILES && <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 text-xs font-semibold text-cyan-800 hover:text-cyan-950">+ Přidat další soubor</button>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Jméno a příjmení *
          <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none transition-colors focus:border-[#0b4860]" placeholder="Pavla Minková" />
        </label>
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">E-mail *
          <input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none transition-colors focus:border-[#0b4860]" placeholder="jmeno@firma.cz" />
        </label>
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Firma / organizace
          <input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none transition-colors focus:border-[#0b4860]" placeholder="Město, obec nebo firma" />
        </label>
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Telefon
          <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none transition-colors focus:border-[#0b4860]" placeholder="+420 000 000 000" />
        </label>
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400 sm:col-span-2">Místo instalace *
          <span className="relative mt-2 block">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input required value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm normal-case tracking-normal text-slate-900 outline-none transition-colors focus:border-[#0b4860]" placeholder="Město, ulice nebo název areálu" />
          </span>
        </label>
      </div>

      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><Wrench size={17} className="text-cyan-700" /> Co máme zahrnout do ceny instalace?</legend>
        <div className="grid gap-3">
          {INSTALLATION_OPTIONS.map((option) => {
            const active = form.installationType === option.value;
            return (
              <label key={option.value} className={'relative cursor-pointer rounded-2xl border-2 p-4 transition-all ' + (active ? 'border-[#0b4860] bg-[#eef8fb] shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300')}>
                <input type="radio" name="installationType" value={option.value} checked={active} onChange={() => setForm((current) => ({ ...current, installationType: option.value }))} className="sr-only" />
                <div className="flex items-start gap-3">
                  <span className={'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ' + (active ? 'bg-[#0b4860] text-white' : 'bg-slate-100 text-slate-500')}>{option.code}</span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">{option.title}{option.recommended && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] uppercase tracking-wider text-emerald-700">nejméně stavebních prací</span>}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">{option.description}</span>
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Povrch
          <select value={form.surfaceType} onChange={(event) => setForm((current) => ({ ...current, surfaceType: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-[#0b4860]">
            {SURFACES.map((surface) => <option key={surface.value} value={surface.value}>{surface.label}</option>)}
          </select>
        </label>
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Počet kusů
          <input required min="1" max="50" type="number" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-[#0b4860]" />
        </label>
        {form.installationType === 'full_excavation' && (
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400 sm:col-span-2">Odhad délky výkopu v metrech
            <input min="0" step="0.5" type="number" value={form.trenchLength} onChange={(event) => setForm((current) => ({ ...current, trenchLength: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-[#0b4860]" placeholder="Např. 8" />
          </label>
        )}
      </div>

      <label className="block text-xs font-mono uppercase tracking-widest text-slate-400">Přístup na místo a technické poznámky
        <textarea value={form.accessNotes} onChange={(event) => setForm((current) => ({ ...current, accessNotes: event.target.value }))} rows={3} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-[#0b4860]" placeholder="Šířka příjezdu, omezení provozu, vzdálenost vody, možnost uzavření prostoru..." />
      </label>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={form.visualization} onChange={(event) => setForm((current) => ({ ...current, visualization: event.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0b4860] focus:ring-[#0b4860]" />
          <span><strong>Vytvořit vizualizaci ve vašem prostoru.</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Použijeme dodané fotografie pouze jako podklad k návrhu a přesně zachováme geometrii vybraného produktu.</span></span>
        </label>
      </div>

      <label className="block text-xs font-mono uppercase tracking-widest text-slate-400">Doplňující zpráva
        <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} rows={3} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-slate-900 outline-none focus:border-[#0b4860]" placeholder="Termín, požadovaná výška, provozní režim nebo další informace..." />
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-500">
        <input required type="checkbox" checked={form.gdpr} onChange={(event) => setForm((current) => ({ ...current, gdpr: event.target.checked }))} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0b4860] focus:ring-[#0b4860]" />
        <span>Souhlasím se zpracováním uvedených údajů za účelem vyřízení poptávky a přípravy cenové nabídky.</span>
      </label>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <button type="submit" disabled={sending} className="btn-metallic-mist flex w-full items-center justify-center gap-2 rounded-full bg-primary py-5 text-sm font-bold normal-case text-white transition-all disabled:opacity-60">
        {sending ? <><Loader size={18} className="animate-spin" /> Nahrávám podklady…</> : <>Požádat o cenu včetně instalace <ArrowRight size={18} /></>}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-slate-400">Cena výrobku a cena instalace budou v nabídce uvedeny odděleně. Bez ověřených podkladů nevytváříme odhad výkopových prací.</p>
    </form>
  );
}

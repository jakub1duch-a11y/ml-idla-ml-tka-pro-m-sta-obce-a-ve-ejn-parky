import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileUp, Loader, Paperclip, UploadCloud, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackInquirySubmitted } from '@/lib/ga4';

const SPACE_TYPES = [
  { value: 'mesto_obec', label: 'Město / obec / náměstí' },
  { value: 'park_hriste', label: 'Park / hřiště' },
  { value: 'skola_skolka', label: 'Škola / školka' },
  { value: 'zoo_areal', label: 'ZOO / koupaliště / areál' },
  { value: 'zahrada_terasa', label: 'Zahrada / terasa' },
  { value: 'hotel_restaurace', label: 'Hotel / restaurace / gastro' },
  { value: 'event', label: 'Event / pronájem' },
  { value: 'jine', label: 'Jiné / atypický tvar' },
];

const MAX_FILES = 8;
const ACCEPTED = 'image/*,.pdf,application/pdf,.dwg,.dxf,.step,.stp,.skp,.doc,.docx,.zip';

const baseInputCls = 'w-full rounded-2xl border border-slate-200/80 bg-white/82 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100/70';

function fileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function QuickInquiryForm() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    jmeno: '',
    kontakt: '',
    prostor: '',
    lokalita: '',
    zprava: '',
    custom_shape: '',
    gdpr: false,
  });
  const [sending, setSending] = useState(false);

  const addFiles = (list) => {
    const incoming = Array.from(list || []);
    if (!incoming.length) return;
    setFiles((current) => {
      const merged = [...current, ...incoming];
      const unique = [];
      const seen = new Set();
      for (const file of merged) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(file);
        }
      }
      return unique.slice(0, MAX_FILES);
    });
  };

  const removeFile = (index) => setFiles((current) => current.filter((_, i) => i !== index));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jmeno || !form.kontakt || !form.prostor || !form.zprava || !form.gdpr) return;
    setSending(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const result = await base44.integrations.Core.UploadFile({ file });
        if (result?.file_url) uploaded.push({ name: file.name, url: result.file_url, type: file.type || 'application/octet-stream' });
      }

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.kontakt.trim());
      const zprava = [
        form.zprava,
        form.lokalita ? `Lokalita instalace: ${form.lokalita}` : '',
        form.custom_shape ? `Požadovaný tvar / mřížka / atypické řešení: ${form.custom_shape}` : '',
        uploaded.length ? `Přílohy:\n${uploaded.map((item) => `- ${item.name}: ${item.url}`).join('\n')}` : '',
      ].filter(Boolean).join('\n\n');

      const payload = {
        jmeno: form.jmeno,
        zprava,
        produkt: form.prostor,
        service_type: 'homepage_video_form',
        status: 'nova',
        request_type: form.custom_shape ? 'custom_design' : 'standard',
        requested_visualization: uploaded.length > 0 || Boolean(form.custom_shape),
        custom_shape: form.custom_shape,
        installation_location: form.lokalita,
        attachment_names: uploaded.map((item) => item.name),
        attachment_urls: uploaded.map((item) => item.url),
        photo_count: uploaded.filter((item) => item.type.startsWith('image/')).length,
      };
      if (isEmail) payload.email = form.kontakt.trim();
      else payload.telefon = form.kontakt.trim();
      if (!isEmail) payload.email = '';

      const created = await base44.entities.Poptavka.create(payload);
      trackInquirySubmitted('homepage_video_form', form.prostor, created?.id || '');
      navigate('/dekujeme?zdroj=homepage-video-form');
    } catch (err) {
      console.warn('Quick inquiry failed', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="poptavka" className="relative isolate overflow-hidden bg-[#061517] py-16 text-white sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-20">
        <video
          className="h-full w-full object-cover object-center opacity-70"
          src="/media/optimized/feff82d99_Aura-mlzitko-video-01.webm"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,16,18,.94)_0%,rgba(3,16,18,.72)_42%,rgba(3,16,18,.36)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_28%,rgba(158,234,240,.23),transparent_34%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,.16),transparent_32%)]" />
      <div className="pointer-events-none absolute -left-24 top-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-cyan-100/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:gap-16 lg:px-8 lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono tracking-[.22em] uppercase text-cyan-200/80 mb-4 text-[11px] font-semibold">Poptávka s podklady</p>
          <h2 className="font-heading text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[.88] tracking-[-.065em]">
            Navrhněme místo, kde se bude dobře dýchat.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/72">
            Pošlete nám prostor, fotografie, výkres nebo vlastní skicu. Z podkladů připravíme doporučení produktu, rozmístění, řízení a další postup.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-xl">
            {[
              ['5–10 °C', 'pocitové ochlazení podle podmínek'],
              ['Smart', 'řízení podle teploty a času'],
              ['INOX', 'nerezová konstrukce pro exteriér'],
              ['Vizualizace', 'návrh ve vašem prostoru'],
            ].map(([value, label]) => (
              <div key={value} className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/12">
                <b className="block font-heading text-xl text-cyan-100">{value}</b>
                <span className="mt-1 block text-[11px] leading-4 text-white/55">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          onSubmit={submit}
          className="rounded-[2rem] border border-white/45 bg-white/92 p-5 text-slate-950 shadow-[0_32px_110px_rgba(0,0,0,.34)] backdrop-blur-2xl sm:p-7 lg:p-8"
        >
          <div className="flex items-start gap-4 border-b border-slate-200 pb-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#062f35] text-cyan-100">
              <FileUp size={20} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#0b7280]">rychlý návrh</p>
              <h3 className="mt-1 font-heading text-2xl font-semibold tracking-tight">Pošlete prostor k posouzení.</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Formulář přijímá i přílohy pro vizualizaci nebo atypický tvar.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-bold text-slate-600">Jméno a příjmení *<input required placeholder="Jan Novák" value={form.jmeno} onChange={(e) => setForm({ ...form, jmeno: e.target.value })} className={baseInputCls} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-600">E-mail nebo telefon *<input required placeholder="jan@firma.cz / +420…" value={form.kontakt} onChange={(e) => setForm({ ...form, kontakt: e.target.value })} className={baseInputCls} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">Typ prostoru *<select required value={form.prostor} onChange={(e) => setForm({ ...form, prostor: e.target.value })} className={baseInputCls}><option value="">Vyberte typ prostoru</option>{SPACE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
            <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">Lokalita instalace<input placeholder="Město, obec, areál nebo adresa" value={form.lokalita} onChange={(e) => setForm({ ...form, lokalita: e.target.value })} className={baseInputCls} /></label>
            <label className="grid gap-2 text-xs font-bold text-slate-600 sm:col-span-2">Co potřebujete ochladit? *<textarea required rows={4} placeholder="Popište prostor, přibližné rozměry, počet návštěvníků, provoz nebo představu o mlžení…" value={form.zprava} onChange={(e) => setForm({ ...form, zprava: e.target.value })} className={`${baseInputCls} resize-none`} /></label>
          </div>

          <section className="mt-5 rounded-3xl border border-cyan-200 bg-[#f1fbfc] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0b7280]">podklady k projektu</p>
                <h4 className="mt-1 font-heading text-lg font-semibold text-slate-950">Přidejte instalační prostor, výkres nebo tvar mřížky.</h4>
              </div>
              <span className="rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">volitelné</span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
              <label
                onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                className={`flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${dragging ? 'border-cyan-500 bg-white' : 'border-cyan-200 bg-white/65 hover:border-cyan-400 hover:bg-white'}`}
              >
                <UploadCloud size={28} className="text-[#0b7280]" />
                <strong className="mt-3 text-sm text-slate-950">Vybrat nebo přetáhnout soubory</strong>
                <span className="mt-1 text-xs leading-5 text-slate-500">Fotografie, PDF, DWG/DXF, STEP/STP, SKP, ZIP</span>
                <input ref={inputRef} type="file" multiple accept={ACCEPTED} className="hidden" onChange={(e) => addFiles(e.target.files)} />
              </label>

              <div className="rounded-2xl border border-cyan-100 bg-white/70 p-4">
                <p className="text-xs font-bold text-slate-700">Vhodné podklady</p>
                <ul className="mt-2 grid gap-1.5 text-[11px] leading-5 text-slate-500 sm:grid-cols-2 lg:grid-cols-1">
                  <li>• fotografie instalačního prostoru</li>
                  <li>• situační výkres / půdorys</li>
                  <li>• podklady pro vizualizaci</li>
                  <li>• požadovaný tvar mřížky</li>
                  <li>• inspirace nebo skica</li>
                  <li>• technická dokumentace</li>
                </ul>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 grid gap-2">
                {files.map((file, index) => (
                  <div key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-100 bg-white px-3 py-2 text-xs text-slate-600">
                    <span className="flex min-w-0 items-center gap-2"><Paperclip size={13} className="shrink-0 text-[#0b7280]" /><span className="truncate">{file.name}</span></span>
                    <span className="flex shrink-0 items-center gap-3 text-[10px] text-slate-400">{fileSize(file.size)}<button type="button" onClick={() => removeFile(index)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Odebrat soubor"><X size={12} /></button></span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <label className="mt-4 grid gap-2 text-xs font-bold text-slate-600">Požadovaný tvar / mřížka / individuální řešení<textarea rows={2} placeholder="Např. kruh Ø 4 m, vlnovka podél promenády, nepravidelná mřížka podle dlažby, vlastní tvar v příloze…" value={form.custom_shape} onChange={(e) => setForm({ ...form, custom_shape: e.target.value })} className={`${baseInputCls} resize-none`} /></label>

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-6 text-slate-500">
            <input type="checkbox" required checked={form.gdpr} onChange={(e) => setForm({ ...form, gdpr: e.target.checked })} className="mt-1 h-4 w-4 rounded border-slate-300" />
            <span>Souhlasím se zpracováním osobních údajů pro účely vyřízení poptávky dle <a href="/gdpr" className="font-semibold text-[#0b7280] hover:underline">zásad ochrany osobních údajů</a>.</span>
          </label>

          <button
            type="submit"
            disabled={sending}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#062f35] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-950/10 transition hover:-translate-y-0.5 hover:bg-[#0b4860] disabled:opacity-60"
          >
            {sending ? <Loader size={17} className="animate-spin" /> : <ArrowRight size={17} />}
            {sending ? 'Odesílám podklady…' : 'Odeslat podklady a získat návrh'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

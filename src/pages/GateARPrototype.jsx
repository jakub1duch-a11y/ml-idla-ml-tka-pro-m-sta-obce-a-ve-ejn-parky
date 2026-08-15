import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Check, Construction, Droplets, Gauge, Loader2, QrCode, Ruler, ScanLine, ShieldCheck, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PRODUCT = {
  id: '6a44c4c21c908c5616376be1',
  slug: 'mlzna-brana-gate',
  name: 'BRÁNA GATE',
  arVersion: 'GATE-AR-BASE-v1',
  image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/4c13d4866_1000004418.png',
};
const DIAMETERS = [60, 76];
const VARIANTS = ['U', 'V'];

const track = (eventName, properties = {}) => {
  try { base44.analytics.track({ eventName, properties }); } catch (_) {}
};

export default function GateARPrototype() {
  const navigate = useNavigate();
  const [diameter, setDiameter] = useState(76);
  const [variant, setVariant] = useState('U');
  const [note, setNote] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [captureName, setCaptureName] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    track('gate_ar_project_view', { product: PRODUCT.slug, model: PRODUCT.arVersion });
  }, []);

  const uploadCapture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy('upload');
    setError('');
    try {
      const uploaded = await base44.integrations.Core.UploadFile({ file });
      setCaptureUrl(uploaded.file_url || '');
      setCaptureName(file.name || 'Fotografie prostoru');
      setSavedKey('');
      track('gate_capture_uploaded', { product: PRODUCT.slug, file_type: file.type || 'image' });
    } catch (err) {
      console.error(err);
      setError('Fotografii se nepodařilo uložit. Zkuste to prosím znovu.');
    } finally {
      setBusy('');
    }
  };

  const createSession = async () => {
    setBusy('save');
    setError('');
    try {
      const sessionKey = `GATE-${Date.now().toString(36).toUpperCase()}`;
      await base44.entities.ARSession.create({
        session_key: sessionKey,
        product_id: PRODUCT.id,
        product_slug: PRODUCT.slug,
        product_name: PRODUCT.name,
        profile_diameter_mm: diameter,
        wall_thickness_mm: 3,
        ar_reference_version: PRODUCT.arVersion,
        capture_url: captureUrl,
        note: [`Varianta: ${variant}`, note.trim()].filter(Boolean).join(' · '),
        source: 'gate_ar',
        status: captureUrl ? 'captured' : 'draft',
      });
      setSavedKey(sessionKey);
      track('gate_session_saved', { product: PRODUCT.slug, variant, profile_diameter_mm: diameter, has_capture: !!captureUrl });
      return sessionKey;
    } catch (err) {
      console.error(err);
      setError('Projekt GATE se nepodařilo uložit. Zkuste to prosím znovu.');
      return '';
    } finally {
      setBusy('');
    }
  };

  const inquiry = async () => {
    const key = savedKey || await createSession();
    if (!key) return;
    const message = [
      `GATE projekt ${key}`,
      `Produkt: ${PRODUCT.name}`,
      `Varianta: ${variant}`,
      `Profil: Ø${diameter} mm`,
      'Tloušťka stěny: 3 mm',
      'Výška produktu: 2,2–2,7 m dle varianty / projektu',
      note.trim() ? `Poznámka: ${note.trim()}` : '',
      captureUrl ? 'Fotografie prostoru je uložena u AR session.' : '',
    ].filter(Boolean).join('\n');
    track('gate_inquiry_click', { product: PRODUCT.slug, session_key: key, variant, profile_diameter_mm: diameter, has_capture: !!captureUrl });
    navigate(`/poptavka?produkt=${encodeURIComponent(PRODUCT.name)}&ar_session=${encodeURIComponent(key)}&zprava=${encodeURIComponent(message)}`);
  };

  return (
    <main className="min-h-screen bg-[#f4f7f8] pt-24 pb-16 text-slate-900">
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/produkt/mlzna-brana-gate" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft size={16}/> Zpět na BRÁNU GATE
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            <Construction size={14}/> GATE AR Base v1 · příprava geometrie
          </span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.08fr_.92fr] lg:items-start">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,.06)]">
            <div className="relative flex min-h-[520px] items-center justify-center bg-gradient-to-b from-white to-[#eef3f5] p-6 sm:p-10">
              <img src={PRODUCT.image} alt="BRÁNA GATE — produktový náhled" className="max-h-[620px] w-full object-contain"/>
              <div className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#0b4860] backdrop-blur">Referenční produkt</div>
            </div>
            <div className="grid gap-3 border-t border-slate-200 px-5 py-5 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2 text-xs text-slate-500"><Ruler size={14}/> výška 2,2–2,7 m</span>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={14}/> AISI 316L · stěna 3 mm</span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700"><Construction size={14}/> rozpon čeká na validaci</span>
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-400">BRÁNA GATE · AR / foto projekt</p>
              <h1 className="mt-3 font-heading text-4xl font-light tracking-tight text-[#0b4860]">Další produkt pro AR.</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">GATE už má připravený QR vstup, obchodní konfiguraci a foto-vizualizaci. Živé 3D AR v měřítku 1:1 zapneme až po potvrzení skutečného rozponu a geometrie variant U / V.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Gauge size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Tlak</span><strong className="mt-1 block text-sm">3 Bar</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Droplets size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Spotřeba</span><strong className="mt-1 block text-sm">12 L/min</strong></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Konfigurace GATE</p>
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-700">Varianta konstrukce</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {VARIANTS.map((value) => <button key={value} type="button" onClick={() => { setVariant(value); setSavedKey(''); }} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${variant === value ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>GATE {value}</button>)}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-700">Průměr profilu</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {DIAMETERS.map((value) => <button key={value} type="button" onClick={() => { setDiameter(value); setSavedKey(''); }} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${diameter === value ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>Ø{value} mm</button>)}
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Potvrzená stěna profilu: 3 mm. Přesný rozpon, rádius a poloha trysek zůstanou do výrobní validace projektové.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <img src="/qr/brana-gate-ar.svg" alt="QR kód pro BRÁNA GATE" className="h-28 w-28 rounded-xl border border-slate-200 bg-white p-2"/>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4860]"><QrCode size={14}/> QR GATE</span>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">QR vede na tuto mobilní stránku. Po validaci geometrie se stejná adresa přepne na živé 1:1 AR bez nutnosti měnit tištěné QR.</p>
                </div>
              </div>
            </div>

            <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(PRODUCT.name)}&slug=${encodeURIComponent(PRODUCT.slug)}`} className="flex items-center justify-center gap-2 rounded-full bg-[#0b4860] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#08394c]">
              <ScanLine size={16}/> Vyfotit místo a vložit GATE <ArrowRight size={15}/>
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Poznámka k projektu</label>
              <textarea value={note} onChange={(e) => { setNote(e.target.value); setSavedKey(''); }} rows={3} placeholder="Např. hlavní průchod náměstím, vstup na koupaliště…" className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0b4860]"/>
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-[#0b4860]/40 hover:bg-white">
                {busy === 'upload' ? <Loader2 size={16} className="animate-spin"/> : captureUrl ? <Check size={16} className="text-emerald-600"/> : <Upload size={16}/>} {captureUrl ? 'Fotografie přidána' : 'Vyfotit / přidat fotografii'}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={uploadCapture}/>
              </label>
              {captureName && <p className="mt-2 truncate text-[11px] text-slate-400">{captureName}</p>}
            </div>

            {savedKey && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900"><strong>GATE projekt uložen.</strong><span className="mt-1 block font-mono">{savedKey}</span></div>}
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">{error}</div>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={createSession} disabled={busy === 'save'} className="flex-1 rounded-full border border-[#0b4860]/20 bg-white px-5 py-3.5 text-sm font-bold text-[#0b4860] hover:bg-slate-50 disabled:opacity-60">{busy === 'save' ? 'Ukládám…' : 'Uložit projekt'}</button>
              <button type="button" onClick={inquiry} disabled={busy === 'save'} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0b4860] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#08394c] disabled:opacity-60"><Camera size={16}/> Poptat GATE</button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

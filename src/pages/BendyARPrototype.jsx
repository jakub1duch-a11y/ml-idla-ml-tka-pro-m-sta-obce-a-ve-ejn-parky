import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@google/model-viewer';
import { ArrowLeft, Box, Camera, Check, Cuboid, Loader2, Move3D, Ruler, ScanLine, Smartphone, TriangleAlert, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MODEL_URL = '/ar/bendy-single/bendy-single-ar-base-v1.glb';
const PRODUCT = {
  id: '6a4278bb879c73a6842a9a88',
  slug: 'mlzitko-bendy',
  name: 'BENDY SINGLE®',
  nominalHeightMm: 1800,
  arVersion: 'BENDY-SINGLE-AR-BASE-v1',
};
const DIAMETERS = [50, 60.2, 70];
const THICKNESSES = [2, 2.5, 3];
const trackAR = (eventName, properties = {}) => {
  try { base44.analytics.track({ eventName, properties }); } catch (_) {}
};

export default function BendyARPrototype() {
  const modelRef = useRef(null);
  const trackedArRef = useRef(new Set());
  const navigate = useNavigate();
  const [modelStatus, setModelStatus] = useState('loading');
  const [arStatus, setArStatus] = useState('idle');
  const [diameter, setDiameter] = useState(60.2);
  const [thickness, setThickness] = useState(2);
  const [note, setNote] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [captureName, setCaptureName] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    trackAR('ar_product_view', { product: PRODUCT.slug, model: PRODUCT.arVersion });
    const viewer = modelRef.current;
    if (!viewer) return;

    const onLoad = () => setModelStatus('ready');
    const onError = () => setModelStatus('error');
    const onArStatus = (event) => {
      const status = event.detail?.status || 'idle';
      setArStatus(status);
      if ((status === 'session-started' || status === 'object-placed') && !trackedArRef.current.has(status)) {
        trackedArRef.current.add(status);
        trackAR(status === 'session-started' ? 'ar_launch' : 'ar_object_placed', { product: PRODUCT.slug, model: PRODUCT.arVersion });
      }
    };

    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);
    viewer.addEventListener('ar-status', onArStatus);
    if (viewer.loaded) setModelStatus('ready');

    return () => {
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
      viewer.removeEventListener('ar-status', onArStatus);
    };
  }, []);

  const uploadCapture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy('upload');
    setError('');
    try {
      const uploaded = await base44.integrations.Core.UploadFile({ file });
      setCaptureUrl(uploaded.file_url || '');
      setCaptureName(file.name || 'Fotografie návrhu');
      setSavedKey('');
      trackAR('ar_capture_uploaded', { product: PRODUCT.slug, file_type: file.type || 'image' });
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
      const sessionKey = `BENDY-${Date.now().toString(36).toUpperCase()}`;
      await base44.entities.ARSession.create({
        session_key: sessionKey,
        product_id: PRODUCT.id,
        product_slug: PRODUCT.slug,
        product_name: PRODUCT.name,
        profile_diameter_mm: diameter,
        wall_thickness_mm: thickness,
        nominal_height_mm: PRODUCT.nominalHeightMm,
        ar_reference_version: PRODUCT.arVersion,
        capture_url: captureUrl,
        note: note.trim(),
        source: 'bendy_ar',
        status: captureUrl ? 'captured' : 'draft',
      });
      setSavedKey(sessionKey);
      trackAR('ar_session_saved', { product: PRODUCT.slug, profile_diameter_mm: diameter, wall_thickness_mm: thickness, has_capture: !!captureUrl });
      return sessionKey;
    } catch (err) {
      console.error(err);
      setError('Konfiguraci se nepodařilo uložit. Zkuste to prosím znovu.');
      return '';
    } finally {
      setBusy('');
    }
  };

  const inquiry = async () => {
    const key = savedKey || await createSession();
    if (!key) return;
    const message = [
      `AR konfigurace ${key}`,
      `Produkt: ${PRODUCT.name}`,
      `Profil: Ø${String(diameter).replace('.', ',')} mm`,
      `Tloušťka stěny: ${String(thickness).replace('.', ',')} mm`,
      `Referenční výška: cca ${PRODUCT.nominalHeightMm} mm`,
      note.trim() ? `Poznámka: ${note.trim()}` : '',
      captureUrl ? 'Fotografie návrhu je uložena v AR session.' : '',
    ].filter(Boolean).join('\n');
    trackAR('ar_inquiry_click', { product: PRODUCT.slug, session_key: key, profile_diameter_mm: diameter, wall_thickness_mm: thickness, has_capture: !!captureUrl });
    navigate(`/poptavka?produkt=${encodeURIComponent(PRODUCT.name)}&ar_session=${encodeURIComponent(key)}&zprava=${encodeURIComponent(message)}`);
  };

  return (
    <main className="min-h-screen bg-[#f4f7f8] pt-24 pb-16 text-slate-900">
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/produkt/mlzitko-bendy" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft size={16}/> Zpět na BENDY SINGLE®
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            <TriangleAlert size={14}/> AR Base v1 · prototyp
          </span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,.06)]">
            <div className="relative h-[62vh] min-h-[500px] max-h-[760px] w-full bg-gradient-to-b from-white to-[#eef3f5]">
              <model-viewer
                ref={modelRef}
                src={MODEL_URL}
                alt="BENDY SINGLE® — prototypní 3D model mlžítka"
                camera-controls=""
                touch-action="pan-y"
                auto-rotate=""
                rotation-per-second="12deg"
                shadow-intensity="1.1"
                shadow-softness=".8"
                exposure="1.05"
                environment-image="neutral"
                ar=""
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="fixed"
                ar-placement="floor"
                xr-environment=""
                interaction-prompt="auto"
                style={{ width: '100%', height: '100%', '--poster-color': 'transparent' }}
              >
                <button
                  slot="ar-button"
                  type="button"
                  className="absolute bottom-5 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#0b4860] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_36px_rgba(11,72,96,.30)] transition-transform hover:-translate-x-1/2 hover:scale-[1.02]"
                >
                  <Smartphone size={16}/> Zobrazit BENDY v AR
                </button>
                <div slot="progress-bar" className="absolute left-5 right-5 top-5 h-1 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-1/2 animate-pulse bg-[#0b4860]" />
                </div>
              </model-viewer>

              {modelStatus === 'loading' && <div className="pointer-events-none absolute inset-x-0 top-5 z-10 text-center text-xs font-semibold text-slate-400">Načítám 3D model…</div>}
              {modelStatus === 'error' && <div className="absolute inset-0 z-30 flex items-center justify-center bg-white px-8 text-center text-sm font-medium text-red-700">3D model se nepodařilo načíst.</div>}
              {(arStatus === 'session-started' || arStatus === 'object-placed') && (
                <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2 rounded-full bg-slate-950/80 px-4 py-2 text-center text-xs font-semibold text-white backdrop-blur">
                  {arStatus === 'object-placed' ? 'BENDY je umístěné v měřítku 1:1' : 'Pohybujte telefonem a najděte rovnou plochu'}
                </div>
              )}
            </div>

            <div className="grid gap-3 border-t border-slate-200 px-4 py-4 sm:grid-cols-3 sm:px-5">
              <span className="inline-flex items-center gap-2 text-xs text-slate-500"><Move3D size={14}/> Tažením otáčejte a přibližujte</span>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500"><ScanLine size={14}/> AR hledá vodorovnou plochu</span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b4860]"><Ruler size={14}/> AR měřítko je uzamčené 1 : 1</span>
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-400">BENDY SINGLE® · 3D + AR kontrola</p>
              <h1 className="mt-3 font-heading text-4xl font-light tracking-tight text-[#0b4860]">Umístěte. Uložte. Poptávejte.</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">Model si prohlédněte ve 3D nebo ho vložte do prostoru přes AR. Potom uložte variantu, fotografii místa a poznámku. Poptávka už konfiguraci přenese automaticky.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Ruler size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Výška</span><strong className="mt-1 block text-sm">≈ 1 800 mm</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Cuboid size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Model</span><strong className="mt-1 block text-sm">GLB · Base v1</strong></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Konfigurace</p>
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-700">Průměr profilu</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {DIAMETERS.map((value) => <button key={value} type="button" onClick={() => { setDiameter(value); setSavedKey(''); }} className={`rounded-xl border px-2 py-2.5 text-xs font-bold ${diameter === value ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>Ø{String(value).replace('.', ',')}</button>)}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-700">Tloušťka stěny</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {THICKNESSES.map((value) => <button key={value} type="button" onClick={() => { setThickness(value); setSavedKey(''); }} className={`rounded-xl border px-2 py-2.5 text-xs font-bold ${thickness === value ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>{String(value).replace('.', ',')} mm</button>)}
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">3D geometrie zatím zůstává referenční Ø60,2 mm. Volba varianty se nyní ukládá pro obchodní konfiguraci a budoucí parametrické modely.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Poznámka k umístění</label>
              <textarea value={note} onChange={(e) => { setNote(e.target.value); setSavedKey(''); }} rows={3} placeholder="Např. vedle lavičky, u vstupu na hřiště, 2 m od chodníku…" className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0b4860]"/>
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-[#0b4860]/40 hover:bg-white">
                {busy === 'upload' ? <Loader2 size={16} className="animate-spin"/> : captureUrl ? <Check size={16} className="text-emerald-600"/> : <Upload size={16}/>} {captureUrl ? 'Fotografie přidána' : 'Vyfotit / přidat fotografii'}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={uploadCapture}/>
              </label>
              {captureName && <p className="mt-2 truncate text-[11px] text-slate-400">{captureName}</p>}
            </div>

            {savedKey && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900"><strong>Konfigurace uložena.</strong><span className="mt-1 block font-mono">{savedKey}</span></div>}
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">{error}</div>}

            <div className="flex flex-col gap-3">
              <button type="button" onClick={createSession} disabled={busy === 'save'} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0b4860]/20 bg-white px-5 py-3.5 text-sm font-bold text-[#0b4860] hover:bg-slate-50 disabled:opacity-60">{busy === 'save' ? <Loader2 size={16} className="animate-spin"/> : <Box size={16}/>} Uložit konfiguraci</button>
              <button type="button" onClick={inquiry} disabled={busy === 'save'} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b4860] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#08394c] disabled:opacity-60"><Camera size={16}/> Poptat tuto konfiguraci</button>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">Před označením „AR ready“ ještě ověříme přesnou střednici / rádius, horní přesah, kotvení a skutečné pozice trysek podle výrobního podkladu.</div>
          </aside>
        </div>
      </section>
    </main>
  );
}

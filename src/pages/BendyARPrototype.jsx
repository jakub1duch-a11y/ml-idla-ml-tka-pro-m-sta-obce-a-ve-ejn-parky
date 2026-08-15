import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';
import { ArrowLeft, Box, Camera, Cuboid, Move3D, Ruler, ScanLine, Smartphone, TriangleAlert } from 'lucide-react';

const MODEL_URL = '/ar/bendy-single/bendy-single-ar-base-v1.glb';

export default function BendyARPrototype() {
  const modelRef = useRef(null);
  const [modelStatus, setModelStatus] = useState('loading');
  const [arStatus, setArStatus] = useState('idle');

  useEffect(() => {
    const viewer = modelRef.current;
    if (!viewer) return;

    const onLoad = () => setModelStatus('ready');
    const onError = () => setModelStatus('error');
    const onArStatus = (event) => setArStatus(event.detail?.status || 'idle');

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

        <div className="grid gap-7 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
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

              {modelStatus === 'loading' && (
                <div className="pointer-events-none absolute inset-x-0 top-5 z-10 text-center text-xs font-semibold text-slate-400">Načítám 3D model…</div>
              )}
              {modelStatus === 'error' && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white px-8 text-center text-sm font-medium text-red-700">3D model se nepodařilo načíst.</div>
              )}

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
              <h1 className="mt-3 font-heading text-4xl font-light tracking-tight text-[#0b4860]">První živý AR základ.</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">Model můžete nejdřív prohlédnout ve 3D. Na podporovaném telefonu použijte „Zobrazit BENDY v AR“ a položte prototyp do prostoru v měřítku 1:1. Geometrie je zatím validační, ne výrobní digitální dvojník.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Ruler size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Profil</span><strong className="mt-1 block text-sm">Ø60,2 mm</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Box size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Výška</span><strong className="mt-1 block text-sm">≈ 1 800 mm</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><ScanLine size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Měřítko</span><strong className="mt-1 block text-sm">1 : 1 · fixed</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Cuboid size={17} className="text-[#0b4860]"/><span className="mt-3 block text-[10px] font-mono uppercase tracking-wider text-slate-400">Model</span><strong className="mt-1 block text-sm">GLB · Base v1</strong></div>
            </div>

            <div className="rounded-2xl border border-[#0b4860]/15 bg-[#0b4860]/[.04] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#0b4860]">AR kompatibilita</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">Priorita je WebXR, následně Android Scene Viewer a iOS Quick Look. Pro iPhone se v prototypu může USDZ vytvořit automaticky z GLB; produkční verzi později nahradíme kontrolovaným USDZ exportem.</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
              Před označením „AR ready“ ověříme přesnou střednici / rádius, horní přesah, kotvení, tloušťku referenčního profilu a skutečné pozice trysek podle výrobního podkladu.
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/ai-vizualizace?produkt=BENDY%20SINGLE%C2%AE&slug=mlzitko-bendy" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b4860] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#08394c]"><Camera size={16}/> Vyfotit místo a vizualizovat</Link>
              <Link to="/poptavka?produkt=BENDY%20SINGLE%C2%AE" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50">Poptat BENDY SINGLE®</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

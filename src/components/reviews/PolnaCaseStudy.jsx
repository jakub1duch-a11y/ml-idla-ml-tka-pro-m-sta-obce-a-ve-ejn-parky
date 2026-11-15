import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X, ExternalLink, PenTool, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const DRIVE_VIDEO = 'https://drive.google.com/file/d/1l6li-NrQUQgFTW0S5s44a3A8FZMymnyV/view';
const DRIVE_PREVIEW = 'https://drive.google.com/file/d/1l6li-NrQUQgFTW0S5s44a3A8FZMymnyV/preview';

export default function PolnaCaseStudy() {
  const [videoOpen, setVideoOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="polna-case-study" className="relative isolate overflow-hidden rounded-[1.75rem] border border-[#C9DDE9] bg-[#071E31] text-white shadow-[0_25px_70px_rgba(5,28,44,.14)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_26%,rgba(32,153,201,.17),transparent_52%)]" />
      <div className="relative p-5 sm:p-8 lg:p-12">
        <motion.div initial={reducedMotion ? false : {opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}}
          className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-[770px]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#7CDAFA]">Reference / městská zakázka / 2026</p>
            <h2 id="polna-case-study" className="mt-3 font-heading text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-[1.08] tracking-tight">Polná. Od prvního návrhu po mlžítko MRKEV.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">Pro město Polná jsme navrhli a vyrobili nerezové mlžítko MRKEV, jehož tvar vychází z místní tradice spojené s mrkví. Od prvních návrhů a technického rozkresu jsme přešli k výrobě konstrukce a instalaci ve veřejném prostoru. Výsledkem je výrazný městský prvek, který v letních dnech vytváří jemnou vodní mlhu a současně odkazuje na identitu místa.</p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85">Skutečná realizace</span>
        </motion.div>

        <div className="mt-8 grid gap-3 lg:grid-cols-[.83fr_1.17fr]">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#E7EEF3] sm:aspect-[16/11] lg:aspect-[4/3]">
            <img src="/media/optimized/2dcd39f66_MRKEV_rozkres1.webp" alt="Návrhový technický rozkres mlžítka MRKEV pro město Polná" loading="lazy" className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.035]" />
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-[#071E31]/90 px-3 py-2 text-xs font-bold text-white"><PenTool size={14}/> 01 / Návrh a geometrie</div>
          </div>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#E7EEF3] sm:aspect-[16/11] lg:aspect-[4/3]">
            <img src="/media/optimized/6a220ebf9_Reference-mstoPolna03.webp" alt="Dokončené nerezové mlžítko MRKEV v Polné" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-[#071E31]/90 px-3 py-2 text-xs font-bold text-white"><CheckCircle2 size={14}/> 02 / Výroba a instalace</div>
          </div>
        </div>

        <div className="mt-7 grid gap-6 border-t border-white/15 pt-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#7CDAFA]">Videoreportáž i-vysočina.cz</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">Reportáž <em>MRKEV PŘINÁŠÍ OSVĚŽENÍ DO CENTRA POLNÉ</em> představuje zakázkovou realizaci mlžítka MRKEV pro město Polná. Podívejte se na hotovou nerezovou konstrukci v prostředí, pro které vznikla, a na její využití pro letní osvěžení veřejného prostoru.</p>
            <p className="mt-3 text-xs leading-6 text-white/70"><strong className="font-semibold text-white">Zdroj a autor videoreportáže:</strong> <a href="https://www.i-vysocina.cz/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8CE4FA] underline underline-offset-4 hover:text-white">i-vysočina.cz <ExternalLink size={12} className="inline" aria-hidden="true" /></a> · archivní kopie na sdíleném Mlžném disku HolmTec. Video se spustí po kliknutí; dostupnost přehrávání závisí na přístupových právech souboru.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setVideoOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1AB9E8] px-5 py-3 text-sm font-bold text-[#042438] transition hover:bg-[#77DCF6]">
              <Play size={17} fill="currentColor" aria-hidden="true"/> Přehrát reportáž
            </button>
            <Link to="/reference/mesto-polna-mlzitko-mrkev" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Detail realizace <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </div>

      {videoOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020E19]/95 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label="Reportáž MRKEV — Polná" onKeyDown={(e)=>{if(e.key==='Escape')setVideoOpen(false);}}>
          <div className="w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white">MRKEV přináší osvěžení do centra Polné</p>
              <button autoFocus type="button" onClick={() => setVideoOpen(false)} aria-label="Zavřít reportáž" className="grid h-11 w-11 place-items-center rounded-full border border-white/35 text-white hover:bg-white/10"><X size={20}/></button>
            </div>
            <iframe title="Videoreportáž MRKEV — i-vysočina.cz" src={DRIVE_PREVIEW + '?autoplay=1'} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-2xl border border-white/15 bg-black"/>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/75"><span>Zdroj reportáže: <a href="https://www.i-vysocina.cz/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8CE4FA] underline underline-offset-4">i-vysočina.cz</a></span><a href={DRIVE_VIDEO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-white">Otevřít archivní video na Google Disku <ExternalLink size={13}/></a></div>
          </div>
        </div>
      )}
    </section>
  );
}

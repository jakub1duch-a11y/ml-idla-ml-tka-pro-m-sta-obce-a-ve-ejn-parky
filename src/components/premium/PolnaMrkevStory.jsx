import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, MapPin, Pause, Play, Volume2, VolumeX } from 'lucide-react';

/** Česká televizní reportáž z reálné instalace, optimalizovaná 720p verze. */
export const POLNA_REPORT_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/6ca807ca4_MLZIDLA_Polna_MRKEV_reportaz_720p_web.mp4';
const REPORT_ORIGINAL = 'https://drive.google.com/file/d/1l6li-NrQUQgFTW0S5s44a3A8FZMymnyV/view';
const LOCATION_URL = 'https://www.google.com/maps/search/?api=1&query=Mlzitko%20mrkev%20Polna&query_place_id=ChIJQ0UtBgAPDUcRsoknvKmh4T8';
const PHOTOGRAPHY_IN_USE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/099945d1d_MltkoMRKEV-mestopolna.jpg';

function ReportVideo({ poster }) {
  const container = useRef(null);
  const video = useRef(null);
  const visible = useInView(container, { amount: 0.18 });
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [explicitlyStarted, setExplicitlyStarted] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [saveData] = useState(() => typeof navigator !== 'undefined' && !!navigator.connection?.saveData);
  const canAutoplay = !reduceMotion && !saveData;

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (visible) setReady(true);
  }, [visible]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (!visible || !tabVisible || paused || (!canAutoplay && !explicitlyStarted)) {
      el.pause();
      return;
    }
    // Most browsers require background autoplay to start muted.
    el.play().catch(() => setPaused(true));
  }, [visible, tabVisible, paused, canAutoplay, explicitlyStarted, ready]);

  const playPause = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      setExplicitlyStarted(true);
      setPaused(false);
      el.play().catch(() => setPaused(true));
    } else {
      el.pause();
      setPaused(true);
    }
  };
  const toggleSound = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <div ref={container} className="relative isolate aspect-video w-full overflow-hidden rounded-[18px] bg-[#092f3d] shadow-[0_25px_65px_rgba(6,31,43,.15)]">
      <img src={poster} alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      {!failed && (
        <video
          ref={video}
          src={ready ? POLNA_REPORT_VIDEO : undefined}
          muted
          playsInline
          preload="metadata"
          poster={poster}
          controls={false}
          onError={() => setFailed(true)}
          aria-label="Televizní reportáž MRKEV přináší osvěžení do centra Polné, i-vysočina.cz"
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#031f2d]/90 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#031f2d]/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[.13em] text-white backdrop-blur-sm">
        Reportáž / i-vysočina.cz
      </span>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-white">
        <p className="max-w-[230px] text-xs leading-5 text-white/80 sm:text-sm">
          MRKEV přináší osvěžení do centra Polné
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playPause}
            disabled={failed}
            aria-label={paused || (!canAutoplay && !explicitlyStarted) ? 'Přehrát reportáž' : 'Pozastavit reportáž'}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-black/50 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white hover:text-[#062d3b] disabled:opacity-50"
          >
            {paused || (!canAutoplay && !explicitlyStarted) ? <Play size={17} /> : <Pause size={17} />}
            <span className="hidden sm:inline">Přehrát / pauza</span>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            disabled={failed}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-black/50 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white hover:text-[#062d3b] disabled:opacity-50"
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span className="hidden sm:inline">{muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}</span>
          </button>
        </div>
      </div>
      {failed && <div className="absolute inset-0 grid place-items-center bg-[#031f2d]/85 p-6 text-center text-sm text-white">
        Video nelze načíst. <a className="underline" href={REPORT_ORIGINAL} target="_blank" rel="noopener noreferrer">Otevřít původní reportáž</a>
      </div>}
    </div>
  );
}

export default function PolnaMrkevStory({ project }) {
  const heroPhoto = project.image_url || PHOTOGRAPHY_IN_USE;
  return (
    <section id="polna-mrkev-realizace" aria-labelledby="polna-mrkev-heading" className="border-y border-[#d9e8ed] bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: .75 }}
          className="grid items-center gap-9 lg:grid-cols-[.85fr_1.15fr] lg:gap-14"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[.19em] text-teal-700">
              Hotová realizace / Polná / 2026
            </p>
            <h2 id="polna-mrkev-heading" className="mt-4 font-heading text-3xl leading-[1.1] tracking-tight text-[#062d3b] sm:text-5xl">
              Mlžítko MRKEV na míru pro město Polná.
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              V historickém centru Polné vzniklo nerezové mlžítko ve tvaru mrkve.
              Motiv vychází z místní tradice mrkvanců a mění ji ve funkční vodní prvek,
              který vytváří jemnou vodní mlhu a osvěžení v letních dnech.
              Originální mlžná socha byla navržena a vyrobena společností HolmTec pro konkrétní městský prostor.
            </p>
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#cee4eb] bg-[#f3f9fa] p-5 text-sm leading-6 text-[#204b5b]">
              <MapPin size={20} className="mt-0.5 shrink-0 text-teal-700" />
              <div>
                <p className="font-semibold text-[#062d3b]">Přesné místo: Husovo náměstí, Polná</p>
                <p>588 13 Polná · Kraj Vysočina · Česká republika</p>
                <a href={LOCATION_URL} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-10 items-center gap-2 font-semibold text-teal-800 underline underline-offset-4">
                  Zobrazit mlžítko na mapě <ExternalLink size={15} />
                </a>
              </div>
            </div>
            <Link to="/poptavka?produkt=mrkev&reference=polna" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#062d3b] px-6 text-sm font-semibold text-white transition hover:bg-teal-700">
              Poptat podobné mlžítko na míru <ArrowRight size={17} />
            </Link>
          </div>
          <figure className="min-w-0 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 shadow-[0_20px_60px_rgba(6,31,43,.07)]">
            <img
              src={heroPhoto}
              loading="lazy"
              decoding="async"
              alt="Skutečně realizované nerezové mlžítko MRKEV vytváří jemnou mlhu na Husově náměstí v Polné, v pozadí historické městské domy"
              className="block aspect-[16/10] w-full object-cover"
            />
            <figcaption className="px-5 py-4 text-xs leading-6 text-slate-600 sm:text-sm">
              Mlžná socha MRKEV na Husově náměstí v Polné. Fotografie zachycuje realizaci v provozu v historickém centru města.
            </figcaption>
          </figure>
        </motion.div>

        <div className="mt-12 grid items-center gap-8 border-t border-slate-200 pt-10 lg:mt-16 lg:grid-cols-[1.25fr_.75fr] lg:gap-14 lg:pt-14">
          <ReportVideo poster={heroPhoto} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.19em] text-teal-700">Videoreportáž / skutečný provoz</p>
            <h3 className="mt-3 font-heading text-2xl leading-tight text-[#062d3b] sm:text-4xl">
              Jak MRKEV ochlazuje centrum Polné.
            </h3>
            <p className="mt-5 leading-7 text-slate-600">
              Reportáž i-vysočina.cz ukazuje detail nerezové konstrukce, mlžicí trysky,
              vodní mlhu a skutečné umístění mlžítka na náměstí.
              Video se při zobrazení automaticky spouští bez zvuku; zvuk lze zapnout tlačítkem.
            </p>
            <a href={REPORT_ORIGINAL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-800 underline underline-offset-4">
              Přehrát původní reportáž v 1080p <ExternalLink size={15} />
            </a>
            <p className="mt-3 text-xs leading-5 text-slate-500">Zdroj reportáže: i-vysočina.cz. Webová verze je optimalizovaná pro rychlé načítání.</p>
          </div>
        </div>

        <div className="mt-9 grid gap-6 sm:grid-cols-[.75fr_1.25fr] sm:items-center sm:gap-10">
          <img
            src={PHOTOGRAPHY_IN_USE}
            loading="lazy"
            alt="Děti u mlžítka MRKEV na Husově náměstí v Polné během letního dne"
            className="aspect-[4/5] w-full max-w-[450px] rounded-[18px] object-cover"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.19em] text-teal-700">Detail realizace</p>
            <h3 className="mt-3 font-heading text-2xl text-[#062d3b] sm:text-3xl">Místní motiv, skutečná instalace.</h3>
            <p className="mt-4 leading-7 text-slate-600">
              Fotografie ukazuje měřítko mlžné sochy v prostoru náměstí a její využití za teplého dne.
              Zakázkový tvar a broušené nerezové provedení doplňují charakter veřejného prostranství.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Mlžítko není herní prvek a nesplňuje ČSN EN 1176; konstrukce není určená k lezení.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

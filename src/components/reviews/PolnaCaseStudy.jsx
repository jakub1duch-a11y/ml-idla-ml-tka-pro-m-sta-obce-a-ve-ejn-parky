import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, X, ExternalLink, ArrowUpRight,
  DraftingCompass, MapPin, Film, ClipboardPenLine
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// Verified imagery: technical MRKEV drawing + a real frame from the
// i-vysočina.cz report, not an AI-generated interpretation of the product.
const DESKTOP_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5d7626e0c_MLZIDLA_Polna_MRKEV_skica_realizace_16x9.webp';
const MOBILE_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/369495833_MLZIDLA_Polna_MRKEV_skica_realizace_mobile.webp';
const DRIVE_VIDEO = 'https://drive.google.com/file/d/1l6li-NrQUQgFTW0S5s44a3A8FZMymnyV/view';
const DRIVE_PREVIEW = 'https://drive.google.com/file/d/1l6li-NrQUQgFTW0S5s44a3A8FZMymnyV/preview';
const CASE_STUDY_URL = '/reference/mesto-polna-mlzitko-mrkev';
const ENQUIRY_URL = '/poptavka?reference=polna&produkt=mrkev';

function VideoDialog({ onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const focusable = Array.from(document.querySelectorAll('[data-polna-dialog] button, [data-polna-dialog] a'))
          .filter((element) => !element.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div role="presentation" className="fixed inset-0 z-[500] flex items-center justify-center bg-[#03111F]/95 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div data-polna-dialog role="dialog" aria-modal="true" aria-labelledby="polna-video-title"
        className="w-full max-w-5xl rounded-[1.4rem] border border-white/20 bg-[#071C2E] p-3 shadow-2xl sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-[#76D9F6]">Reportáž · i-vysočina.cz</p>
            <h3 id="polna-video-title" className="mt-1 text-sm font-bold text-white sm:text-base">
              MRKEV přináší osvěžení do centra Polné
            </h3>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Zavřít videoreportáž"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64D8F7]">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <iframe
          title="MRKEV přináší osvěžení do centra Polné — i-vysočina.cz"
          src={DRIVE_PREVIEW + '?autoplay=1'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full rounded-xl border border-white/15 bg-black"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <span>Zdroj reportáže: <a href="https://i-vysocina.cz/" target="_blank" rel="noopener noreferrer"
            className="font-semibold text-[#8CE4FA] underline underline-offset-4">i-vysočina.cz</a></span>
          <a href={DRIVE_VIDEO} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 underline underline-offset-4 transition hover:text-white">
            Otevřít video na Google Disku <ExternalLink size={13} aria-hidden="true"/>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function PolnaCaseStudy() {
  const [videoOpen, setVideoOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const reveal = reducedMotion ? {} : {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: .65, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section id="reference-polna" aria-labelledby="polna-case-study"
      className="relative isolate min-w-0 overflow-hidden rounded-[1.5rem] border border-[#B9D8E6] bg-[#061F33] text-white shadow-[0_24px_70px_rgba(6,34,51,.12)] sm:rounded-[2rem]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_12%,rgba(49,174,211,.15),transparent_55%)]"/>
      <div className="relative">
        <div className="grid gap-4 px-5 pb-6 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(245px,.7fr)] lg:items-end lg:gap-10 lg:px-12 lg:pb-9 lg:pt-12">
          <motion.div {...reveal} className="min-w-0">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#7EE2F8]">
              <MapPin size={14} aria-hidden="true"/> Česká výroba · Město Polná · 2026
            </p>
            <h2 id="polna-case-study" className="mt-4 max-w-3xl font-heading text-[clamp(1.85rem,4.1vw,3.6rem)] font-bold leading-[1.09] tracking-[-.035em] text-white">
              Od prvního návrhu k hotovému mlžítku MRKEV.
            </h2>
            <p className="mt-5 max-w-[690px] text-sm leading-7 text-[#D1E2EB] sm:text-base">
              Pro město Polná jsme připravili zakázkovou nerezovou mlžnou sochu MRKEV.
              Tvar vychází z místní identity a kombinuje přesné ohýbání nerezových trubek
              s jemným mlžením pro veřejný prostor. Podívejte se na původní výkres
              a skutečnou realizaci zachycenou v reportáži.
            </p>
          </motion.div>
          <motion.div {...reveal} className="flex flex-wrap gap-2 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.06] px-3.5 py-2.5 text-xs font-semibold text-white/85">
              <DraftingCompass size={15} className="text-[#6FDBF6]" aria-hidden="true"/> Technický výkres
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.06] px-3.5 py-2.5 text-xs font-semibold text-white/85">
              <Film size={15} className="text-[#6FDBF6]" aria-hidden="true"/> Skutečná reportáž
            </span>
          </motion.div>
        </div>

        <motion.figure {...reveal} className="relative mx-3 overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#EDF6FA] sm:mx-6 sm:rounded-[1.5rem] lg:mx-10">
          <picture>
            <source media="(max-width: 639px)" srcSet={MOBILE_IMAGE} type="image/webp"/>
            <img src={DESKTOP_IMAGE} alt="Polná, mlžítko MRKEV: vlevo původní technický výkres, vpravo skutečný záběr instalace z reportáže i-vysočina.cz"
              loading="lazy" decoding="async"
              width="1648" height="928"
              className="block h-auto w-full object-contain"
              style={{ aspectRatio: 'auto' }}/>
          </picture>
          <figcaption className="sr-only">
            Porovnání původního výrobního výkresu MRKEV a skutečné instalace v Polné. Záběr ze zpravodajské reportáže i-vysočina.cz.
          </figcaption>
        </motion.figure>

        <div className="grid gap-5 px-5 pb-8 pt-7 sm:px-8 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:px-12 lg:pt-9">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#80DDF4]">Videoreportáž z realizace</p>
            <h3 className="mt-2 font-heading text-lg font-semibold text-white sm:text-xl">
              MRKEV přináší osvěžení do centra Polné
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#BFD4DF]">
              Jak vypadá zakázkové mlžítko po instalaci? Reportáž ukazuje skutečný výrobek v prostředí města.
              Zdroj: <a href="https://i-vysocina.cz/" target="_blank" rel="noopener noreferrer"
                className="font-semibold text-[#91E1F7] underline underline-offset-4 hover:text-white">i-vysočina.cz</a>.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:max-w-[500px] lg:justify-end">
            <button type="button" onClick={() => setVideoOpen(true)}
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#10B8E9] px-5 py-3 text-sm font-bold text-[#04273A] transition-colors hover:bg-[#78DEF7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Play size={17} fill="currentColor" aria-hidden="true"/> Přehrát reportáž
            </button>
            <Link to={CASE_STUDY_URL}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/[.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15">
              Detail realizace <ArrowUpRight size={16} aria-hidden="true"/>
            </Link>
            <Link to={ENQUIRY_URL}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/[.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15">
              Navrhnout pro váš prostor <ClipboardPenLine size={16} aria-hidden="true"/>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/15 px-5 py-4 text-xs text-white/60 sm:px-8 lg:px-12">
          <p>Návrh a výroba: <span className="font-semibold text-white/85">HolmTec s.r.o. / MLŽIDLA.cz</span></p>
          <Link to={CASE_STUDY_URL} className="inline-flex items-center gap-1.5 font-semibold text-[#8CDFEC] hover:text-white">
            Další fotografie a informace <ArrowRight size={13} aria-hidden="true"/>
          </Link>
        </div>
      </div>
      {videoOpen && <VideoDialog onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

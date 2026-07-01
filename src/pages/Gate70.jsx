import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight, Maximize2, Wifi, Thermometer, Zap, Lightbulb, Smartphone, Radio } from 'lucide-react';
import { setSEO } from '@/lib/seo';

// ─── Asset URLs ───────────────────────────────────────────────────────────────
const HERO_U = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png';
const HERO_V = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png';

const VARIANTS = [
{
  id: 'U',
  label: 'GATE70-U',
  tag: 'Rovná — pravoúhlý tvar',
  headline: ['Čistá', 'geometrie.'],
  desc: 'Varianta -U nabízí přísně pravoúhlý tvar bez příchylnosti ke konturám krajiny. Ideální pro moderní architekturu, administrativní centra a náměstí s vysokými estetickými nároky.',
  image: HERO_U,
  images: [
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/405edf0a8_L-Mltko_GATE_60V.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e8e65d772_L-Mltko_GATE_60U.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/aa26eeb6a_Mltko_GATE_70U.png']

},
{
  id: 'V',
  label: 'GATE70-V',
  tag: 'Lomený oblouk — organický tvar',
  headline: ['Měkký', 'oblouk.'],
  desc: 'Varianta -V disponuje jemně lomeným obloukem nahoře, který přirozeně kopíruje pohyb lidského těla procházejícího bránou. Harmonicky splyne s parky, promenádami i historickými prostory.',
  image: HERO_V,
  images: [
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f47023cbe_MlnbrnaGATE70V.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60dab9091_mlnbrnaGATE70V2.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e6fb189c0_MlznabranaGate76.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4333988f4_MlnbrnaGATE76V.png']

}];


const ALL_GALLERY = [
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f47023cbe_MlnbrnaGATE70V.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60dab9091_mlnbrnaGATE70V2.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e6fb189c0_MlznabranaGate76.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4333988f4_MlnbrnaGATE76V.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a2d77392e_Mlnbranyaportaly.jpg',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7a9bd010a_mlnbrnyaportaly-mlzidla.jpg',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/405edf0a8_L-Mltko_GATE_60V.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/22b4e3038_L-Mltko_GATE_60_3R.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e8e65d772_L-Mltko_GATE_60U.png',
'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/aa26eeb6a_Mltko_GATE_70U.png'];


const VIDEOS = [
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/aa11e932c_mlnbrnaGATE70.mp4', caption: 'GATE70 — mlhový efekt v parku' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/a4733f633_detailnamlhumlznebrany.MOV', caption: 'Detail mlhy — trysky v akci' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/37a6da879_mlzeni-mlznbrany-vakci.MOV', caption: 'Brána v provozu' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/352fd3ef1_mlnbrnaGATE74-vakci.MOV', caption: 'GATE74 realizace' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4b66409ed_mlnbrnaGATE74-vakci1.MOV', caption: 'GATE74 — úhel pohledu' }];


const TECH_ROWS = [
{ label: 'Materiál', value: 'Nerezová ocel AISI 316L (1.4301)' },
{ label: 'Trubky', value: 'TR76×3 mm, svařované' },
{ label: 'Trysky', value: '5 ks AISI 316L, 10–50 μm' },
{ label: 'Spotřeba vody', value: '60–120 l/h' },
{ label: 'Tlak mlžení', value: '50–70 bar' },
{ label: 'Šířka × Výška', value: '2 m × 2,2 m *(upravitelné)' },
{ label: 'Kotvení', value: 'Skrytá patka, chemické kotvy M10–M16 do betonu' },
{ label: 'Povrch', value: 'Broušený / kartáčovaný' },
{ label: 'Napájení', value: "12V / Wi-Fi Smart \u0159\xEDzen\xED" },
{ label: 'Dodací lhůta', value: '1–5 týdnů dle výroby' },
{ label: 'Záruka', value: "1 ROK na konstrukci" },
{ label: 'Cena od', value: '48 450 Kč bez DPH*' }];


const SMART_FEATURES = [
{ icon: Wifi, title: 'Wi-Fi Smart ovládání', desc: 'Nastavte harmonogram, intenzitu mlžení a časovač přes mobilní app bez nutnosti přístupu k elektrice na místě.' },
{ icon: Thermometer, title: 'Teplotní senzor', desc: 'Automatické spuštění při překročení nastavené teploty (např. 28 °C). Mlžení se samo vypne při poklesu.' },
{ icon: Radio, title: 'PIR — senzor pohybu', desc: 'Brána aktivuje mlžení jen tehdy, když v dosahu detekuje osobu. Šetří až 40 % vody.' },
{ icon: Smartphone, title: 'Mobile App', desc: 'Ovládání, statistiky spotřeby a přehled chyb přímo v telefonu (iOS / Android).' },
{ icon: Lightbulb, title: 'Integrované osvětlení', desc: 'Volitelné LED podsvícení mlhové clony — efektní večerní provoz a ambientní atmosféra.' },
{ icon: Zap, title: 'Manuální tlačítko', desc: 'Dotykové nebo mechanické tlačítko přímo na sloupu brány pro okamžité spuštění / zastavení.' }];


const INSTALACE = [
{ img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a2d77392e_Mlnbranyaportaly.jpg', title: "Testov\xE1n\xED ml\u017En\xE9 br\xE1ny GATE70", location: "- Testov\xE1n\xED" },
{ img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7a9bd010a_mlnbrnyaportaly-mlzidla.jpg', title: "HolmTec s.r.o.", location: "- testov\xE1n\xED" },
{ img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png', title: "Ml\u017En\xE1 br\xE1na v rekrea\u010Dn\xEDm are\xE1lu", location: "Ml\u017En\xE1 br\xE1na pro Rekrea\u010Dn\xED camp" }];


// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, idx: initIdx, onClose }) {
  const [idx, setIdx] = useState(initIdx);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/96 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[85vh] object-contain rounded-xl" />
        {images.length > 1 &&
        <>
            <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/30 mt-4 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        }
      </div>
    </div>);

}

export default function Gate70() {
  const [activeVariant, setActiveVariant] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const variant = VARIANTS[activeVariant];

  useEffect(() => {
    setSEO({
      title: 'Mlžná brána GATE70 — -U rovná a -V lomený oblouk',
      description: 'Designová mlžná brána GATE70 z nerezové oceli AISI 316L ve dvou variantách. Ochlazení až −9 °C, Wi-Fi Smart řízení, pro náměstí, parky a vjezdy. HolmTec.',
      keywords: 'mlžná brána GATE70, mlžná brána nerez, mlžítko brána, mlhoviště brána, GATE70-U, GATE70-V, HolmTec mlžná brána, ochlazení veřejného prostoru',
      image: HERO_U,
      canonicalPath: '/gate70',
      type: 'product'
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink">

      {/* ══════════════════════════════════════════════════════
                          1. HERO — dvě varianty s přepínačem
                       ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={variant.image}
          className="absolute inset-0 w-full h-full object-cover">
          
          <source src={VIDEOS[0].url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

        {/* Back */}
        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/kolekce" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            ← Zpět na kolekci
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-cyan mb-3">HolmTec · Mlžné brány</p>
            <h1 style={{ fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.9, fontSize: 'clamp(4rem, 12vw, 9rem)' }}
            className="text-white uppercase mb-6">GATE70</h1>

            {/* Variant switcher */}
            <div className="flex gap-3 mb-6">
              {VARIANTS.map((v, i) =>
              <button key={v.id} onClick={() => setActiveVariant(i)}
              className={`px-5 py-2 rounded-full text-sm font-mono tracking-widest uppercase border transition-all ${activeVariant === i ? 'bg-cyan text-ink border-cyan' : 'border-white/25 text-white/60 hover:border-white/50 hover:text-white'}`}>
                  {v.label}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.p key={variant.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-white/50 text-xs font-mono tracking-widest uppercase mb-4">{variant.tag}
              </motion.p>
            </AnimatePresence>

            <p className="text-white/60 text-base lg:text-lg max-w-xl mb-8 leading-relaxed font-light">
              Designová mlžná brána z nerezové oceli AISI 316L. Pět trysek vytváří jemnou mlhovou clonu, která ochladí procházející o až 9 °C — bez kapek na zemi, bez hluku, s plně integrovaným Wi-Fi Smart řízením.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mb-10">
              {[
              { val: '−9 °C', label: 'Ochlazení' },
              { val: '5 trysek', label: 'AISI 316L' },
              { val: '70 bar', label: 'Tlak' },
              { val: '2×2,2 m', label: 'Základní rozměr' }].
              map((s) =>
              <div key={s.label}>
                  <p style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.04em', lineHeight: 1 }} className="text-white">{s.val}</p>
                  <p className="text-[10px] font-mono text-white/35 tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              )}
            </div>

            <Link to="/poptavka"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              Poptat GATE70 <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/20">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          2. DVĚ VARIANTY — porovnání vedle sebe
                       ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Dvě tvarové varianty</p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 1.0 }} className="text-white">
            Vyberte svůj <span className="italic">GATE70.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {VARIANTS.map((v, i) =>
          <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 group cursor-pointer"
          onClick={() => setLightbox({ images: v.images, idx: 0 })}>
              <img src={v.image} alt={v.label} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-cyan/20 border border-cyan/40 text-cyan text-xs font-mono tracking-widest uppercase rounded-full">{v.label}</span>
                </div>
                <p className="text-[11px] font-mono text-white/50 tracking-widest uppercase mb-2">{v.tag}</p>
                <h3 style={{ fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.04em' }} className="text-white">
                  {v.headline[0]} <span className="italic">{v.headline[1]}</span>
                </h3>
                <p className="text-white/55 text-sm mt-3 leading-relaxed font-light">{v.desc}</p>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                <Maximize2 size={14} />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          3. LANDING INFO — o bráně
                       ══════════════════════════════════════════════════════ */}
      <section className="bg-surface border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setLightbox({ images: ALL_GALLERY, idx: 0 })}>
                <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/aa26eeb6a_Mltko_GATE_70U.png"
                alt="GATE70 v parku" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all" />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Maximize2 size={13} className="text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Brána, která osvěžuje</p>
              <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }} className="text-white mb-8">
                Minimalistická.<br /><span className="italic">Funkční. Krásná.</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed font-light mb-6">
                GATE70 je víc než mlžné zařízení — je to architektonický prvek, který definuje vstup do prostoru. Svým minimalistickým designem eliminuje zbytečné vizuální prvky a s lehkostí se začleňuje do jakéhokoliv veřejného či přírodního prostředí.
              </p>
              <p className="text-white/60 text-base leading-relaxed font-light mb-8">
                Pět mlžných trysek z nerezové oceli AISI 316L vytváří jemnou mlhovou clonu, jejíž kapičky 10–50 μm se okamžitě odpařují ve vzduchu. Žádné louže. Žádné mokré povrchy. Pouze příjemné ochlazení až o 9 °C v okruhu průchodu.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                'Rozměry upravitelné dle projektové dokumentace',
                'Kotvení skrytou patkou pod úrovní terénu',
                'Není herní prvek — designový architektonický prvek',
                'Cena od 48 450 Kč bez DPH, dodání 1–5 týdnů'].
                map((item) =>
                <li key={item} className="flex items-start gap-3 text-sm text-white/60 font-light">
                    <span className="w-1 h-1 rounded-full bg-cyan shrink-0 mt-2" />{item}
                  </li>
                )}
              </ul>
              <Link to="/poptavka"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
                Nezávazná poptávka <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          4. TECHNICKÉ SPECIFIKACE
                       ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Technické parametry</p>
            <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }} className="text-white mb-10">
              Preciznost<br /><span className="italic">v každém detailu.</span>
            </h2>
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
              {TECH_ROWS.map((row, i) =>
              <div key={row.label} className={`flex items-center justify-between gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-card_bg' : 'bg-surface'}`}>
                  <span className="text-xs font-mono text-white/35 tracking-widest uppercase shrink-0">{row.label}</span>
                  <span className="text-sm text-white font-medium text-right">{row.value}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-white/20 font-mono leading-relaxed mb-5">* Cena v základním rozměru, bez instalace, dopravného a balného. Rozměry lze měnit dle požadavků architekta nebo zadavatele.</p>
            <a href="mailto:obchod1@holmtec.cz?subject=Technický list GATE70"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-cyan/40 text-cyan text-xs font-mono tracking-widest uppercase rounded-full hover:bg-cyan/10 transition-all">
              ↓ Vyžádat PDF technický list
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
            <div
              className="rounded-2xl overflow-hidden cursor-pointer group relative aspect-[4/3]"
              onClick={() => setLightbox({ images: ALL_GALLERY, idx: 9 })}>
              <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/405edf0a8_L-Mltko_GATE_60V.png"
              alt="GATE60 detail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all" />
            </div>
            <div
              className="rounded-2xl overflow-hidden cursor-pointer group relative aspect-[4/3]"
              onClick={() => setLightbox({ images: ALL_GALLERY, idx: 10 })}>
              <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/22b4e3038_L-Mltko_GATE_60_3R.png"
              alt="GATE60 trojice" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          5. SMART ŘÍZENÍ
                       ══════════════════════════════════════════════════════ */}
      <section className="bg-surface border-y border-white/8 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Wi-Fi Smart systém</p>
              <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }} className="text-white">
                Inteligentní<br /><span className="italic">brána.</span>
              </h2>
            </div>
            <p className="text-white/50 leading-relaxed font-light">
              GATE70 je vybavena plně integrovaným Wi-Fi Smart systémem. Ovládání, senzory, osvětlení a časovače — vše v jednom zařízení.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SMART_FEATURES.map((f, i) =>
            <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="p-6 rounded-2xl bg-card_bg border border-white/10 hover:border-cyan/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-cyan" />
                </div>
                <h3 style={{ fontWeight: 600, letterSpacing: '-0.02em' }} className="text-white text-base mb-2">{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          6. FOTOGALERIE + DETAIL FOTO
                       ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Fotogalerie</p>
          <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }} className="text-white">
            GATE70<br /><span className="italic">v detailu.</span>
          </h2>
        </motion.div>

        {/* Horizontal carousel — 2 rows, scroll-snap */}
        <div className="overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {ALL_GALLERY.map((src, i) =>
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
            className="relative w-52 sm:w-60 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group snap-start"
            onClick={() => setLightbox({ images: ALL_GALLERY, idx: i })}>
                <img src={src} alt={`GATE70 detail ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {Array.from({ length: Math.ceil(ALL_GALLERY.length / 2) }).map((_, i) =>
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-6 bg-white/60' : 'w-1.5 bg-white/15'}`} />
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          7. VIDEA V AKCI
                       ══════════════════════════════════════════════════════ */}
      <section className="bg-surface border-y border-white/8 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Videa</p>
            <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }} className="text-white">
              GATE70<br /><span className="italic">v akci.</span>
            </h2>
          </motion.div>

          {/* Featured video */}
          










          

          {/* Secondary videos grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIDEOS.slice(1).map((v, i) =>
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="rounded-xl overflow-hidden border border-white/10 bg-card_bg">
                <video src={v.url} controls playsInline className="w-full aspect-video bg-black" />
                <div className="px-4 py-3">
                  <p className="text-xs font-mono text-white/35 tracking-widest uppercase leading-snug">{v.caption}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          8. REALIZACE
                       ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Realizace</p>
          <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }} className="text-white">
            GATE70<br /><span className="italic">v reálném světě.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {INSTALACE.map((item, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[4/3]"
          onClick={() => setLightbox({ images: INSTALACE.map((x) => x.img), idx: i })}>
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block px-2.5 py-1 mb-3 rounded bg-black/50 backdrop-blur-sm text-[10px] font-mono text-white/80 tracking-widest uppercase">{item.location}</span>
                <p style={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }} className="text-white text-2xl">{item.title}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
                          9. CTA — Poptávka
                       ══════════════════════════════════════════════════════ */}
      <section className="bg-surface border-t border-white/8 py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Zakázková výroba</p>
              <h2 style={{ lineHeight: 1.0, fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }} className="text-white mb-4">
                Váš prostor si zaslouží<br /><span className="italic">vlastní GATE70.</span>
              </h2>
              <p className="text-white/40 text-sm font-light mb-8">Konzultace zdarma · 3D vizualizace do 48 h · Odpovídáme do 24 h</p>

              <div className="space-y-2 mb-8">
                {[
                { label: 'GATE70-U', sub: 'Rovná, pravoúhlý tvar' },
                { label: 'GATE70-V', sub: 'Lomený organický oblouk' }].
                map((v) =>
                <div key={v.label} className="flex items-center gap-4 px-5 py-4 rounded-xl bg-card_bg border border-white/10">
                    <span className="px-3 py-1 bg-cyan/15 border border-cyan/30 text-cyan text-xs font-mono rounded-full">{v.label}</span>
                    <span className="text-white/50 text-sm font-light">{v.sub}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm font-mono text-white/40">
                <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-cyan transition-colors">📞 +420 774 700 390</a>
                <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 hover:text-cyan transition-colors">✉ obchod1@holmtec.cz</a>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <Gate70ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {lightbox && <Lightbox images={lightbox.images} idx={lightbox.idx} onClose={() => setLightbox(null)} />}
    </div>);

}

function Gate70ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', variant: 'GATE70-U', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const { base44: b44 } = await import('@/api/base44Client');
    await b44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      message: `[${form.variant}] ${form.message || 'Zájem o produkt GATE70'}`,
      description: form.phone ? `Tel: ${form.phone}` : ''
    }).catch(() => {});
    setSent(true);
    setSending(false);
  };

  if (sent) return (
    <div className="text-center py-10">
      <div className="w-12 h-12 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center mx-auto mb-4">
        <span className="text-cyan text-xl">✓</span>
      </div>
      <p className="text-white font-light text-lg">Poptávka odeslána.</p>
      <p className="text-white/40 text-sm mt-1">Odpovídáme do 24 h.</p>
    </div>);


  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Jméno *</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors"
          placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors"
          placeholder="jan@firma.cz" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Telefon</label>
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors"
          placeholder="+420 000 000 000" />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Varianta</label>
          <select value={form.variant} onChange={(e) => setForm((f) => ({ ...f, variant: e.target.value }))}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan/50 transition-colors">
            <option value="GATE70-U">GATE70-U (rovná)</option>
            <option value="GATE70-V">GATE70-V (lomený oblouk)</option>
            <option value="Obě varianty">Obě varianty — nerozhodnutý</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Projekt / zpráva</label>
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4}
        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
        placeholder="Kde plánujete instalaci, přibližné rozměry, počet kusů..." />
      </div>
      <button type="submit" disabled={sending}
      className="w-full py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 disabled:opacity-60 flex items-center justify-center gap-2">
        {sending ? <span className="w-4 h-4 border border-ink border-t-transparent rounded-full animate-spin" /> : <>Odeslat poptávku na GATE70 <ArrowRight size={16} /></>}
      </button>
    </form>);

}
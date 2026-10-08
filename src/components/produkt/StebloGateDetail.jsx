import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play, Droplets, ShieldCheck, MapPin } from 'lucide-react';
import { STEBLO_GATE_PHOTOS } from '@/lib/gateMedia';
import useMotionPlayback from '@/components/motion/useMotionPlayback';
import MotionHeading from '@/components/motion/MotionHeading';
import ProductMotionShowcase from '@/components/motion/ProductMotionShowcase';
import AnchoringInstallationSection from '@/components/installation/AnchoringInstallationSection';
import '@/styles/content-motion.css';

export default function StebloGateDetail({ product }) {
  const { ref, playing, reduced, paused, setPaused } = useMotionPlayback();
  const photos = { ...product, image_url: STEBLO_GATE_PHOTOS[0], gallery_urls: STEBLO_GATE_PHOTOS };
  const quote = `/poptavka?produkt=${encodeURIComponent('STÉBLO GATE®')}`;
  return <main className="steblo-detail"><header className="steblo-hero"><div className="steblo-shell"><Link className="steblo-back" to="/mlzne-brany">← Mlžné brány a portály</Link><p className="space-eyebrow">Dvě stébla · Jeden průchod mlhou</p><h1>STÉBLO GATE®</h1><p className="steblo-intro">Přírodou inspirovaný tvar. Jemné osvěžení pro parky, promenády a místa, kde se lidé potkávají.</p><nav aria-label="Přehled produktu"><a href="#steblo-vzhled">Vzhled produktu</a><a href="#steblo-detaily">Detail a napojení</a><Link to={quote}>Poptat řešení <ArrowRight size={16} aria-hidden="true" /></Link></nav></div><figure ref={ref} id="steblo-vzhled" className="steblo-hero-image"><picture key={playing ? 'gif' : 'poster'}>{playing && <><source type="image/webp" media="(max-width: 639px)" srcSet="/media/motion/steblo-gate-mobile.webp" /><source type="image/webp" srcSet="/media/motion/steblo-gate-desktop.webp" /></>}<source media="(max-width: 639px)" srcSet={`/media/motion/steblo-gate-mobile${playing ? '.gif' : '-poster.webp'}`} /><img src={playing ? '/media/motion/steblo-gate-desktop.gif' : STEBLO_GATE_PHOTOS[0]} alt="STÉBLO GATE — dvojice stejných nerezových stébel proti sobě s jemnou mlhou mezi nimi" width="1536" height="1024" decoding="async" fetchPriority="high" /></picture><figcaption>Tři vlastní náhledy produktu. Průchozí prostor a rozmístění navrhujeme podle místa.</figcaption>{!reduced && <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{paused ? 'Přehrát náhledy' : 'Zastavit náhledy'}</button>}</figure></header>
    <ProductMotionShowcase product={photos} />
    <section id="steblo-detaily" className="steblo-shell steblo-information"><p className="space-eyebrow">Tvar a technika spolu</p><MotionHeading>Dvě stejná mlžítka. Lehká průchozí sestava.</MotionHeading><div className="steblo-facts">{[{ icon: ShieldCheck, title: 'Nerezová konstrukce', text: 'Sestavu tvoří dvě identická mlžítka STÉBLO umístěná proti sobě.' }, { icon: MapPin, title: 'Průchod podle místa', text: 'Rozestup prvků a umístění navrhneme podle pohybu lidí a potřeb prostoru.' }, { icon: Droplets, title: 'Napojení a provoz', text: 'Přívod vody, kotvení, konfiguraci trysek a volitelné řízení upřesníme v návrhu.' }].map(({ icon: Icon, title, text }) => <article key={title}><Icon size={24} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div><p className="space-caption">Náhledy jsou ilustrační. Konkrétní rozměry, výbavu a způsob instalace potvrdíme pro váš projekt.</p></section>
    <AnchoringInstallationSection />
    <section className="steblo-cta"><div className="steblo-shell"><div><MotionHeading>Ukažte nám svůj prostor.</MotionHeading><p>Stačí fotografie místa a informace o přívodu vody. Připravíme návrh umístění a nabídku STÉBLO GATE®.</p></div><Link to={quote}>Poptat STÉBLO GATE® <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
  </main>;
}

import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Smartphone, Clock3, Hand, Wifi } from 'lucide-react';
import './smartGardenSection.css';

const MODES = [
  { key: 'app', icon: Smartphone, label: 'Z telefonu', sub: 'Ovládání odkudkoliv', title: 'Zahrada na dosah. I když jste jinde.', text: 'Připojenou sestavu SUPLA můžete zapnout nebo vypnout z aplikace. Vzdálené ovládání vyžaduje kompatibilní řadič a připojení k internetu.', badge: 'Aplikace / vzdálený přístup' },
  { key: 'plan', icon: Clock3, label: 'Podle plánu', sub: 'Rytmus vašeho dne', title: 'Mlha ve správnou chvíli.', text: 'Časové plány a intervaly mlžení přizpůsobíme vašemu provozu. Řízení podle teploty lze doplnit s odpovídajícím senzorem a konfigurací.', badge: 'Čas / volitelná automatizace' },
  { key: 'local', icon: Hand, label: 'Na místě', sub: 'Jednoduché spuštění', title: 'Stačí být na místě.', text: 'Sestavu lze doplnit místním tlačítkem pro pohodlné spuštění. Provedení a umístění ovládání navrhneme podle instalace.', badge: 'Tlačítko / místní ovládání' },
];

export default function SmartGardenSection({ product = null, eyebrow = 'Chytrá zahrada / SUPLA', moreHref = '/smart-ovladani', moreLabel = 'Jak funguje chytré ovládání' }) {
  const [selected, setSelected] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const reduced = useReducedMotion();
  const uid = useId();
  const mode = MODES[selected];
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    const pauseHidden = () => { if (document.hidden) video.pause(); };
    observer.observe(video);
    document.addEventListener('visibilitychange', pauseHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', pauseHidden);
    };
  }, []);
  return (
    <section className="smart-garden" data-mode={mode.key} aria-labelledby={`${uid}-heading`}>
      <div className="smart-garden__sketch" aria-hidden="true" />
      <div className="smart-garden__inner">
        <div className="smart-garden__layout">
          <div className="smart-garden__copy">
            <p className="smart-garden__eyebrow">{eyebrow}</p>
            <h2 id={`${uid}-heading`}>Ovládejte mlhu.<br /><span>Z telefonu.</span></h2>
            <p className="smart-garden__intro">Víc pohodlí venku. Méně starostí s obsluhou. Chytré řízení přizpůsobí mlžení rytmu vaší zahrady, terasy nebo areálu.</p>
            <Link className="smart-garden__cta" to={`/poptavka?produkt=${encodeURIComponent(product?.slug || 'smart-rizeni')}`}>Navrhnout chytré řízení <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <motion.figure initial={false} whileInView={reduced ? undefined : { y: [16, 0] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65 }} className="smart-garden__visual">
            <div className="smart-garden__visual-label"><Wifi size={14} aria-hidden="true" /> SUPLA / SMART ŘÍZENÍ</div>
            <div className="smart-garden__stage">
              <div className="smart-garden__orbit" aria-hidden="true" />
              <div className="smart-garden__focus smart-garden__focus--phone" aria-hidden="true" />
              <div className="smart-garden__focus smart-garden__focus--hardware" aria-hidden="true" />
              <svg className="smart-garden__connection" viewBox="0 0 600 500" fill="none" aria-hidden="true"><path d="M162 262h86q20 0 20-20v-36q0-20 20-20h95" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8"/><circle cx="162" cy="262" r="4" fill="currentColor"/><circle cx="383" cy="186" r="4" fill="currentColor"/></svg>
              {imageFailed ? <img className="smart-garden__combined" src="/media/smart-control-cutout-2026.webp" alt="Ilustrační sestava telefonu a chytrého řízení mlžení" width="1200" height="1200" loading="lazy" /> : <>
                <img className="smart-garden__cutout smart-garden__cutout--hardware" src="/media/smart-hardware-cutout.webp" alt="Ilustrační řadič s ventilem, přídavnými moduly a místním tlačítkem" width="1000" height="1000" loading="lazy" decoding="async" onError={() => setImageFailed(true)} />
                <img className="smart-garden__cutout smart-garden__cutout--phone" src="/media/smart-phone-cutout.webp" alt="Mobilní aplikace pro ovládání mlžení — ilustrační obrazovka" width="600" height="900" loading="lazy" decoding="async" onError={() => setImageFailed(true)} />
              </>}
              <span className="smart-garden__callout smart-garden__callout--phone" aria-hidden="true">01 / APLIKACE</span>
              <span className="smart-garden__callout smart-garden__callout--hardware" aria-hidden="true">02 / ŘÍZENÍ MLŽENÍ</span>
            </div>
            <figcaption>Ilustrační sestava · výbava podle projektu</figcaption>
          </motion.figure>
        </div>
        <div className="smart-garden__controls" role="group" aria-label="Prozkoumat možnosti chytrého řízení">
          {MODES.map(({ key, icon: Icon, label, sub }, index) => <button key={key} type="button" aria-pressed={selected === index} aria-controls={`${uid}-detail`} onClick={() => setSelected(index)} className="smart-garden__control"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span><strong>{label}</strong><small>{sub}</small></span><span className="smart-garden__number" aria-hidden="true">0{index + 1}</span></button>)}
        </div>
        <figure className="smart-garden__film">
          <video ref={videoRef} controls playsInline preload="none" poster="/media/smart-promo-poster.webp" aria-label="Animovaná prezentace chytrého řízení mlžení">
            <source src="/media/smart-promo-2026.mp4" type="video/mp4" />
            <a href="/media/smart-promo-2026.mp4">Přehrát video chytrého řízení</a>
          </video>
          <figcaption>Chytré řízení a servisní přístup · ilustrační vizualizace</figcaption>
        </figure>
        <div id={`${uid}-detail`} className="smart-garden__detail" aria-live="polite" aria-atomic="true">
          <div><p className="smart-garden__detail-label">{mode.badge}</p><h3>{mode.title}</h3></div>
          <p>{mode.text}</p>
        </div>
        {moreHref.startsWith('#') ? <a href={moreHref} className="smart-garden__more">{moreLabel} <ArrowUpRight size={16} aria-hidden="true" /></a> : <Link to={moreHref} className="smart-garden__more">{moreLabel} <ArrowUpRight size={16} aria-hidden="true" /></Link>}
      </div>
    </section>
  );
}

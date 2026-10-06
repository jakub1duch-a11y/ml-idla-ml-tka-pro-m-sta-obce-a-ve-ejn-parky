import React, { useId, useState } from 'react';
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
  return (
    <section className="smart-garden" aria-labelledby={`${uid}-heading`}>
      <img className="smart-garden__sketch" src="/media/smart-control-sketch.svg" alt="" aria-hidden="true" loading="lazy" />
      <div className="smart-garden__inner">
        <div className="smart-garden__layout">
          <div className="smart-garden__copy">
            <p className="smart-garden__eyebrow">{eyebrow}</p>
            <h2 id={`${uid}-heading`}>Ovládejte mlhu.<br /><span>Z telefonu.</span></h2>
            <p className="smart-garden__intro">Víc pohodlí venku. Méně starostí s obsluhou. Chytré řízení přizpůsobí mlžení rytmu vaší zahrady, terasy nebo areálu.</p>
            <Link className="smart-garden__cta" to={`/poptavka?produkt=${encodeURIComponent(product?.slug || 'smart-rizeni')}`}>Navrhnout chytré řízení <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
          <motion.figure initial={false} whileInView={reduced ? undefined : { y: [16, 0] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65 }} className="smart-garden__visual">
            <div className="smart-garden__orbit" aria-hidden="true" />
            <div className="smart-garden__visual-label"><Wifi size={14} aria-hidden="true" /> SUPLA / SMART ŘÍZENÍ</div>
            {imageFailed ? <div className="smart-garden__fallback"><Smartphone size={72} strokeWidth={1} aria-hidden="true" /><span>Chytré řízení mlžení</span></div> : <img src="/media/smart-control-cutout-2026.webp" alt="Ilustrační sestava chytrého ovládání: telefon, řadič s ventilem, moduly a místní tlačítko" width="1200" height="1200" loading="lazy" decoding="async" onError={() => setImageFailed(true)} />}
            <figcaption>Ilustrační sestava · výbava podle projektu</figcaption>
          </motion.figure>
        </div>
        <div className="smart-garden__controls" role="group" aria-label="Prozkoumat možnosti chytrého řízení">
          {MODES.map(({ key, icon: Icon, label, sub }, index) => <button key={key} type="button" aria-pressed={selected === index} aria-controls={`${uid}-detail`} onClick={() => setSelected(index)} className="smart-garden__control"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span><strong>{label}</strong><small>{sub}</small></span><span className="smart-garden__number" aria-hidden="true">0{index + 1}</span></button>)}
        </div>
        <div id={`${uid}-detail`} className="smart-garden__detail" aria-live="polite" aria-atomic="true">
          <div><p className="smart-garden__detail-label">{mode.badge}</p><h3>{mode.title}</h3></div>
          <p>{mode.text}</p>
        </div>
        {moreHref.startsWith('#') ? <a href={moreHref} className="smart-garden__more">{moreLabel} <ArrowUpRight size={16} aria-hidden="true" /></a> : <Link to={moreHref} className="smart-garden__more">{moreLabel} <ArrowUpRight size={16} aria-hidden="true" /></Link>}
      </div>
    </section>
  );
}

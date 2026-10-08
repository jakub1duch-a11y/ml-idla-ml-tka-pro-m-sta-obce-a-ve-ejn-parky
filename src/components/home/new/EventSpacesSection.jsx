import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MotionHeading from '@/components/motion/MotionHeading';
import { EVENT_SPACE_CARDS, quoteForSpace } from '@/lib/spacePresentation';
import '@/styles/content-motion.css';

export default function EventSpacesSection() {
  const reduced = useReducedMotion();
  return <section className="premium-section space-showcase" aria-labelledby="eventy-title"><div className="premium-shell">
    <div className="space-section-heading"><div><p className="space-eyebrow">Sportoviště · eventy · parky</p><MotionHeading id="eventy-title">Osvěžení tam, kde se léto opravdu žije.</MotionHeading></div><p>Každý prostor má jiné potřeby. Prohlédněte si využití mlžení a pošlete nám místo pro vlastní návrh.</p></div>
    <div className="space-event-grid">{EVENT_SPACE_CARDS.map((item, index) => <motion.article key={item.title} className="space-event-card" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.06 }}>
      <div className="space-event-image"><img src={item.image} alt={item.alt} loading="lazy" decoding="async" width="960" height="720" /><span>{item.label}</span></div><div className="space-event-copy"><h3>{item.title}</h3><p>{item.text}</p><Link className="space-quote-link" to={quoteForSpace(item.title)}>Poptat podobné řešení <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </motion.article>)}</div><p className="space-caption">Ukázky využití mlžení. Umístění, napojení a bezpečný provoz navrhujeme podle konkrétního prostoru.</p>
  </div></section>;
}

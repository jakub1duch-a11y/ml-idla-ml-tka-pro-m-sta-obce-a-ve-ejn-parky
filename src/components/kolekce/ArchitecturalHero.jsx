import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import './architecturalHero.css';

const FALLBACK = '/media/catalog-architecture-2026.webp';

/** Shared catalog/collection composition: live copy, editorial image and architectural frame. */
export default function ArchitecturalHero({ eyebrow, title, accent, description, image = FALLBACK, imageAlt, caption, target = 'catalog', facts = ['Nerezový design', 'Návrh podle prostoru', 'Česká výroba'], catalog = false }) {
  const reduced = useReducedMotion();
  return (
    <section className={`architecture-hero ${catalog ? 'architecture-hero--catalog' : ''}`} aria-label={eyebrow}>
      <div className="architecture-hero__layout">
        <div className="architecture-hero__copy">
          <p className="architecture-hero__eyebrow">MLŽIDLA® <span aria-hidden="true">/</span> {eyebrow}</p>
          <h1>{title}{accent && <span>{' '}{accent}</span>}</h1>
          <p className="architecture-hero__description">{description}</p>
          <div className="architecture-hero__actions">
            <a href={`#${target}`} className="architecture-hero__primary">{catalog ? 'Prohlédnout katalog' : 'Prohlédnout produkty'} <ArrowDown size={17} aria-hidden="true" /></a>
            <Link to="/poptavka" className="architecture-hero__secondary">Navrhnout řešení <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className="architecture-hero__figure">
          <motion.img key={image} src={image} alt={imageAlt || ''} width="1600" height="1000" loading="eager" fetchPriority="high"
            initial={false} animate={{ scale: 1 }} whileHover={reduced ? undefined : { scale: 1.025 }} transition={{ duration: .7 }}
            onError={(event) => { if (!event.currentTarget.src.endsWith(FALLBACK)) event.currentTarget.src = FALLBACK; }} />
          <div className="architecture-hero__frame" aria-hidden="true"><span>MLŽIDLA / DESIGN & PROSTOR</span><i /><b>+</b></div>
          <figcaption>{caption}</figcaption>
        </figure>
      </div>
      <motion.div initial={false} whileInView={reduced ? undefined : { y: [10, 0] }} viewport={{ once: true }} transition={{ duration: .6 }} className="architecture-hero__rail" aria-label="Přístup k návrhu">
        {facts.map((fact, index) => <div key={fact}><span aria-hidden="true">0{index + 1}</span>{fact}</div>)}
      </motion.div>
    </section>
  );
}

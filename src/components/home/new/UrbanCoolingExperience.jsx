import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, ShieldCheck, Timer, Thermometer } from 'lucide-react';

const places = [
  ['Náměstí & centra','Ochlazení pobytových míst v aktivním centru města.','/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp'],
  ['Parky & promenády','Jemná mlha jako součást zeleně a veřejného prostoru.','/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp'],
  ['Sportoviště & hřiště','Interaktivní osvěžení pro aktivní místa a letní provoz.','/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp'],
  ['Nádraží & uzly','Komfort v místech čekání a vysokého pohybu lidí.','/media/optimized/5401e0933_dac8b98065c5472b16bc1910348915a1.webp']
];

const facts = [
  ['Materiál','Nerez AISI 316L'],
  ['Princip','Nízkotlaké mlžení bez čerpadla'],
  ['Řízení','Automatizace / SUPLA'],
  ['Použití','Veřejný a městský prostor']
];

const reveal = {
  initial:{opacity:0,y:26},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,amount:.18},
  transition:{duration:.62,ease:[.22,1,.36,1]}
};

export default function UrbanCoolingExperience(){
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] });
  const mediaY = useTransform(scrollYProgress,[0,1],[0,90]);
  const mediaScale = useTransform(scrollYProgress,[0,1],[1,1.045]);

  return <div className="ucx">
    <section ref={heroRef} className="ucx-hero">
      <div className="ucx-mist ucx-mist-a"/><div className="ucx-mist ucx-mist-b"/>
      <motion.div {...reveal} className="ucx-copy">
        <span className="ucx-kicker">MLŽIDLA® by HolmTec · městské ochlazování</span>
        <h1>Chytré chlazení <em>prostoru.</em></h1>
        <p>Česká nerezová mlžítka pro náměstí, parky, hřiště a další veřejná místa. Architektura, voda a automatizace v jednom čistém systému.</p>
        <div className="ucx-actions">
          <a href="/ai-vizualizace" className="ucx-button">Ukázat můj prostor <ArrowRight size={17}/></a>
          <a href="#ucx-prostor">Prozkoumat řešení</a>
        </div>
      </motion.div>

      <motion.figure className="ucx-hero-media" style={{y:mediaY,scale:mediaScale}}>
        <img src="/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp" alt="MLŽIDLA v městském parku" fetchPriority="high" decoding="async"/>
        <span className="ucx-hero-glass">Městské ochlazování · nerez · vodní mlha</span>
      </motion.figure>
    </section>

    <section id="ucx-prostor" className="ucx-places">
      <motion.div {...reveal} className="ucx-heading">
        <span className="ucx-kicker">Kde MLŽIDLA dávají smysl</span>
        <h2>Ochlazení tam, kde se město <em>skutečně používá.</em></h2>
        <p>Řešení navrhujeme pro konkrétní prostor, pohyb lidí a provoz města.</p>
      </motion.div>
      <div className="ucx-grid">
        {places.map((p,i)=><motion.a
          {...reveal}
          whileHover={{y:-6}}
          transition={{duration:.28,ease:[.22,1,.36,1]}}
          href="/mestske-mlzitka"
          className="ucx-place"
          key={p[0]}>
          <img src={p[2]} alt={p[0]} loading="lazy" decoding="async"/>
          <span className="ucx-place-shade"/>
          <small>0{i+1}</small>
          <div className="ucx-place-copy">
            <h3>{p[0]}</h3>
            <p>{p[1]}</p>
            <b>Prozkoumat <ArrowRight size={15}/></b>
          </div>
        </motion.a>)}
      </div>
    </section>

    <section className="ucx-smart">
      <motion.div {...reveal} className="ucx-smart-copy">
        <span className="ucx-kicker">Automatizace · SUPLA</span>
        <h2>Voda jen tehdy, když dává smysl.</h2>
        <p>Automatizace podle času, teploty nebo provozního režimu. Vzdálené ovládání, monitoring a přehled o systému v jedné vrstvě.</p>
        <a href="/smart-ovladani" className="ucx-button ucx-button-light">Automatizace <ArrowRight size={17}/></a>
      </motion.div>
      <motion.div {...reveal} className="ucx-dashboard">
        <header><span>MLŽIDLA / ZÓNA 01</span><b>AKTIVNÍ</b></header>
        <div className="ucx-bigmetric"><Thermometer/><div><small>TEPLOTA</small><strong>27°</strong></div></div>
        <div className="ucx-metrics">
          <div><Gauge/><span><small>PRŮTOK</small><strong>LIVE</strong></span></div>
          <div><Timer/><span><small>REŽIM</small><strong>AUTO</strong></span></div>
        </div>
        <div className="ucx-bars"><i/><i/><i/><i/><i/></div>
        <footer><Droplets/> Automatické scénáře · vzdálená správa</footer>
      </motion.div>
    </section>

    <section className="ucx-tech">
      <motion.div {...reveal} className="ucx-heading">
        <span className="ucx-kicker">Technické informace</span>
        <h2>Čistá architektura. <em>Jasná technika.</em></h2>
        <p>Technické informace mají vlastní přehlednou vrstvu pro projektanty, města a realizační týmy.</p>
      </motion.div>
      <div className="ucx-facts">{facts.map(f=><motion.div {...reveal} key={f[0]}><small>{f[0]}</small><strong>{f[1]}</strong></motion.div>)}</div>
      <motion.a {...reveal} className="ucx-doc" href="/ke-stazeni">
        <ShieldCheck/><span><small>PRO PROJEKT A REALIZACI</small><strong>Technické listy a podklady</strong></span><b>Otevřít dokumentaci <ArrowRight size={16}/></b>
      </motion.a>
    </section>

    <section className="ucx-final">
      <div className="ucx-mist ucx-mist-c"/>
      <motion.div {...reveal}>
        <span className="ucx-kicker">Vizualizátor v prostoru</span>
        <h2>Ukažte nám prostor. <em>Ukážeme vám MLŽIDLA v něm.</em></h2>
        <p>Nahrajte fotografii místa a pokračujte k vizualizačnímu náhledu produktu a návrhu řešení.</p>
        <a href="/ai-vizualizace" className="ucx-button">Vytvořit vizualizaci <ArrowRight size={17}/></a>
      </motion.div>
    </section>
  </div>;
}
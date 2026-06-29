import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Mail, Phone, Shield, Zap, Award } from 'lucide-react';

export default function ONas() {
  return (
    <div className="min-h-screen bg-ink pt-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">O NÁS</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-6">
            HolmTec — výrobce mlžných soch a chladicích systémů
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="prose prose-invert max-w-none">

          <p className="text-white/70 text-lg leading-relaxed mb-6">
            HolmTec s.r.o. je česká společnost se sídlem v Trutnově, specializující se na návrh, výrobu a instalaci mlžných soch, mlhových portálů a venkovních chladicích systémů. Naše produkty kombinují estetiku průmyslového designu s pokročilou technologií vysokotlakého mlžení — výsledkem jsou instalace, které chladí, fascinují a stávají se dominantou každého prostoru.
          </p>

          <p className="text-white/70 text-lg leading-relaxed mb-6">
            Zaměřujeme se na architekty, krajinné designéry, správce měst a obce, organizátory eventů i soukromé investory. Naše mlžné sochy najdete na městských náměstích, v hotelových vstupních prostorách, na festivalech i v soukromých zahradách po celé České republice a Slovensku. Za více než 120 realizacemi stojí tým zkušených konstruktérů, designérů a instalatérů, kteří každý projekt berou jako jedinečnou výzvu.
          </p>

          <p className="text-white/70 text-lg leading-relaxed mb-6">
            Veškeré konstrukce vyrábíme z potravinářské nerezové oceli AISI 304 a 316L — bez chemie, bez biocidů, s pětiletou zárukou na konstrukci. Naše systémy pracují s tlakem 70 bar a rozptylují mikrokapičky o velikosti 5–10 μm, které se okamžitě odpaří a ochlazují okolní vzduch až o 9 °C. Každý projekt řešíme na míru: od prvního skici přes 3D vizualizaci až po montáž a servisní smlouvu.
          </p>

          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Věříme, že venkovní prostory mohou být nejen funkční, ale i působivé. Spojte se s námi a proměňte svůj prostor v místo, kde se lidé rádi zdržují — i v letních vedrech.
          </p>
        </motion.div>

        {/* Hodnoty */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Shield, title: 'Certifikované materiály', desc: 'Nerez AISI 304/316L, vhodné pro veřejné prostory a dětská hřiště.' },
            { icon: Award, title: '120+ realizací', desc: 'Více než dekáda zkušeností s projekty v ČR a SR.' },
            { icon: Zap, title: 'Montáž za 1 den', desc: 'Rychlá instalace, minimální zásah do provozu místa.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-card_bg border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-cyan" />
              </div>
              <h3 className="text-white font-normal mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Kontakt */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-8 rounded-2xl bg-cyan/5 border border-cyan/20">
          <h2 className="font-heading font-light text-2xl text-white mb-4">Kde nás najdete</h2>
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <MapPin size={15} className="text-cyan shrink-0" /> Trutnov, Česká republika
            </div>
            <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-3 text-white/60 text-sm hover:text-cyan transition-colors">
              <Mail size={15} className="text-cyan shrink-0" /> obchod1@holmtec.cz
            </a>
            <a href="tel:+420774700390" className="flex items-center gap-3 text-white/60 text-sm hover:text-cyan transition-colors">
              <Phone size={15} className="text-cyan shrink-0" /> +420 774 700 390
            </a>
          </div>
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            Nezávazná poptávka <ArrowRight size={15} />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SmartHero() {
  return (
    <div className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block px-4 py-1.5 bg-cyan/10 border border-cyan/25 text-cyan text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            Smart aplikace & automatizace
          </span>
          <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-5">
            Smart ovládání <span className="italic font-light text-cyan">pro vaše mlžítka.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-lg">
            Ovládejte mlžení odkudkoliv z mobilu. Napojte senzory teploty, vlhkosti a pohybu — systém sám rozhodne, kdy má mlžení smysl.
          </p>
          <Link to="/kontakt?produkt=Smart%20ovl%C3%A1d%C3%A1n%C3%AD"
            className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">
            Vyzkoušet chytré ovládání <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5c4b99749_Smartmlzitka-ovladanizmobilu.jpg"
            alt="Ovládání mlžítka z mobilní aplikace" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </div>);

}
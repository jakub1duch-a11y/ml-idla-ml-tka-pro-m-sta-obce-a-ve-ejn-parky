import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

export default function SustainabilityHero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-primary text-white lg:min-h-[660px]">
      <img
        src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ccf06b29a_mlzidla-mlzitka-pro-mesta-obce.webp"
        alt="Městské mlžítko ve veřejném prostoru"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/96 via-[#041c28]/76 to-[#041c28]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/55 via-transparent to-[#041c28]/15" />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-24 lg:min-h-[660px] lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="max-w-4xl">
          <div className="flex items-center gap-2 text-cyan-300"><Leaf size={17}/><p className="font-mono text-[11px] uppercase tracking-[.2em]">Udržitelnost · voda · městské klima</p></div>
          <h1 className="mt-4 font-heading text-4xl leading-[1.03] tracking-[-.03em] sm:text-5xl lg:text-7xl">Udržitelné ochlazení pro veřejný prostor.</h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">Mlžení využívá princip odpařování vody přímo v místě, kde lidé tráví čas. Správně navržený systém spojuje tepelný komfort, řízenou spotřebu vody, dlouhou životnost nerezových prvků a jednoduchou správu bez potřeby klimatizovat otevřený prostor.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/mestske-mlzitka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Městská mlžítka <ArrowRight size={16}/></Link>
            <Link to="/vyhody" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white">Výhody a benefity</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
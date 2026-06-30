import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fd73ecaac_generated_image.png';

export default function MlzisteHero() {
  const scrollToConfig = () => {
    document.getElementById('konfigurace')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[88vh] min-h-[560px] overflow-hidden">
      <img src={HERO_IMAGE} alt="Mlžiště pro rodiny na zahradě" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-16 lg:pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-cyan mb-4">Mlžiště &amp; mlžné zóny na míru</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-5 max-w-3xl" style={{ letterSpacing: '-0.03em' }}>
            Vytvořte si vlastní vodní oázu: mlžiště na zakázku pro dokonalé ochlazení
          </h1>
          <p className="text-white/60 text-lg max-w-xl mb-9 leading-relaxed font-light">
            Zkombinujte různé mlžicí moduly a vytvořte ideální mlhovací hřiště pro vaši zahradu. Jedinečný zážitek pro děti i dospělé, přizpůsobený přesně vašim potřebám.
          </p>
          <button onClick={scrollToConfig}
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
            Vytvořit vlastní poptávku <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
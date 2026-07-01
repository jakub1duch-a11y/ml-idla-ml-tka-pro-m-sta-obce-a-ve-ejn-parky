import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
{
  tag: 'Města a obce',
  title: 'Mlžné sochy pro veřejný prostor',
  desc: 'Zakázkové mlžítko MRKEV zdobí náměstí města Polná — spojuje lokální identitu s příjemným ochlazením pro chodce v horkých letních dnech.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/596fefdec_MlnsochaMRKEV-mstoPoln.jpg',
  path: '/kategorie/mesta-obce'
},
{
  tag: 'Parky a hřiště',
  title: 'Bezpečné mlžení pro dětská hřiště',
  desc: 'Interaktivní mlžné prvky pro parky a mateřské školy. Potravinářská nerez, bez chemie — jen radost a osvěžení pro nejmenší.',
  image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
  path: '/kategorie/parky-hriste'
},
{
  tag: 'Eventy & festivaly',
  title: 'Mlžení pro festivaly a venkovní akce',
  desc: 'Y-ARMIST a mobilní mlžné rámy chladí davy návštěvníků na festivalech a sportovních areálech — vysoký výkon, snadná instalace.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png',
  path: '/kategorie/eventy'
},
{
  tag: 'Komerční prostory',
  title: 'Elegantní mlžítka pro exkluzivní interiéry',
  desc: 'Mlžítko AURA v nerezovém provedení doplňuje prostory hotelů, restaurací i domovů pro seniory — tichý, funkční a designový prvek.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3ffb5387e_mlzitkoprodomovsenioru-2.jpeg',
  path: '/kategorie/komercni'
},
{
  tag: 'Koupaliště & aquaparky',
  title: 'Mlžné brány pro rekreační areály',
  desc: 'Designová mlžná brána GATE70 z nerezi AISI 316L ochlazuje vstupy koupališť a aquaparků až o −9 °C bez kapek na zemi.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png',
  path: '/kategorie/koupaliste'
},
{
  tag: 'Pro architekty',
  title: 'Zakázkový design a CAD podklady',
  desc: 'Od skici po realizaci — mlžné sochy na míru s kompletní technickou dokumentací pro architektonické a urbanistické studie.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2dcd39f66_MRKEV_rozkres1.png',
  path: '/kategorie/architekti'
}];


export default function CategorySlider() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx) => setCurrent(idx), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % categories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const cat = categories[current];

  return (
    <section className="relative h-[70vh] min-h-[520px] flex flex-col overflow-hidden bg-ink">

      <AnimatePresence initial={false}>
        <motion.div
          key={current + '-bg'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0">
          
          <img
            src={cat.image}
            alt={cat.title}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-6 lg:px-8 pt-6">
        {categories.map((c, i) =>
        <button
          key={c.tag}
          onClick={() => goTo(i)}
          className="relative h-0.5 flex-1 bg-white/15 overflow-hidden rounded-full">
          
            {i === current &&
          <motion.div
            key={current + '-bar'}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: 'linear' }}
            className="absolute inset-0 bg-white origin-left rounded-full" />

          }
            {i < current && <div className="absolute inset-0 bg-white/40 rounded-full" />}
          </button>
        )}
      </div>

      <div className="relative flex flex-col justify-end w-full max-w-7xl lg:px-8 mx-auto px-6 z-5 pb-14 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-xl">
            
            <span className="inline-block px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sm font-medium text-white/90 mb-5">
              {cat.tag}
            </span>

            <h2 className="text-white leading-[1.1] tracking-tight mb-4 [font-family:'Albert_Sans',_sans-serif] font-light text-xl lg:text-xl">
              {cat.title}
            </h2>
            <p className="text-white/85 text-base leading-relaxed mb-7 max-w-lg font-normal">
              {cat.desc}
            </p>

            <Link to={cat.path}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-slate-900 text-sm font-bold rounded-2xl shadow-lg hover:bg-white/90 transition-all">
              Zobrazit řešení <ArrowRight size={14} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>);

}
import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Building2, Trees, TrainFront, Trophy, Hotel, Sparkles, HeartPulse, MapPinned, House, UtensilsCrossed, Waves, Leaf } from 'lucide-react';

const CITY_ITEMS = [
  { icon: Building2, title: 'Náměstí & centrum města', text: 'Lokální ochlazovací body pro pěší zóny, tržiště a frekventovaná pobytová místa.', image: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp' },
  { icon: Trees, title: 'Parky & promenády', text: 'Mlžné ostrovy a liniové prvky u laviček, pěších tras, nábřeží a městské zeleně.', image: '/media/optimized/eb7e87313_mlzidla-mlzitkaproparkyamesta03.webp' },
  { icon: TrainFront, title: 'Nádraží & dopravní uzly', text: 'Ochlazení čekacích a přednádražních prostorů v místech s vysokou koncentrací lidí.' },
  { icon: Trophy, title: 'Sportoviště', text: 'Ochlazovací zóny pro sportovce, diváky a doprovod u tribun, hřišť a běžeckých tras.' },
  { icon: Hotel, title: 'Hotely & resorty', text: 'Venkovní vstupy, nádvoří, terasy a zahrady jako příjemnější součást hospitality prostoru.' },
  { icon: Sparkles, title: 'Lázně & wellness', text: 'Jemná mlha pro promenády, odpočinkové zahrady a klidové zóny s důrazem na architekturu.' },
  { icon: HeartPulse, title: 'Domovy seniorů', text: 'Klidné lokální ochlazení pobytových zahrad, teras a pěších tras v horkých dnech.' },
  { icon: MapPinned, title: 'Veřejné instituce', text: 'Vstupy, dvory, školní zahrady a další veřejné plochy s pravidelným pohybem lidí.' },
];

const GARDEN_ITEMS = [
  { icon: House, title: 'Soukromé zahrady', text: 'Elegantní ochlazení integrované do zeleně, terasy nebo pobytové části zahrady.', image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp' },
  { icon: UtensilsCrossed, title: 'Gastro & hotelové terasy', text: 'Příjemnější venkovní posezení pro restaurace, kavárny a hotely v horkých dnech.' },
  { icon: Hotel, title: 'Hotely & resorty', text: 'Zahrady, bazénové zóny, vstupy a odpočinkové části s prémiovým architektonickým detailem.' },
  { icon: Sparkles, title: 'Lázně & wellness', text: 'Mlžná atmosféra pro klidové zahrady, venkovní wellness a relaxační zóny.' },
  { icon: HeartPulse, title: 'Domovy seniorů', text: 'Ochlazení míst k sezení a pomalých pěších tras s důrazem na klidný pobyt venku.' },
  { icon: Trees, title: 'Parkové zahrady', text: 'Ochlazení laviček, cestiček a relaxačních míst v rezidenčních a institucionálních areálech.' },
  { icon: Waves, title: 'Bazény & koupací zóny', text: 'Jemná mlha kolem lehátek a odpočinkových ploch mimo vodní hladinu.' },
  { icon: Leaf, title: 'Rezidenční areály', text: 'Společné venkovní zóny bytových projektů, vil a prémiových rezidencí.' },
];

export default function UseCaseExperience({ variant = 'city' }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const items = variant === 'garden' ? GARDEN_ITEMS : CITY_ITEMS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [36, -36]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-2, 2]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-slate-200 bg-white py-20 sm:py-24">
      <motion.div style={{ y, rotate }} className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-24, 32]) }} className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-teal-100/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#0B6B7A]">Kde MLŽIDLA dávají smysl</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-[-.035em] text-slate-950 sm:text-5xl">
              {variant === 'garden' ? 'Ochlazení pro místa, kde chcete zůstat déle.' : 'Ochlazení tam, kde se město skutečně používá.'}
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {variant === 'garden'
                ? 'Od soukromé zahrady přes hotelovou terasu až po lázeňský nebo seniorský areál. Jemná mlha vytváří příjemnější mikroklima bez toho, aby přebila architekturu prostoru.'
                : 'Náměstí, parky, sportoviště, nádraží, promenády, hotely, lázně i domovy seniorů. Navrhujeme ochlazovací body podle pohybu lidí, stínu, větru a skutečného provozu.'}
            </p>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mt-5 text-xl font-semibold tracking-[-.02em] text-[#0B6B7A] sm:text-2xl"
            >
              Ochlazujeme vzduch kolem vás. Dýchejte lépe.
            </motion.p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: (index % 4) * 0.06 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-shadow hover:shadow-[0_20px_50px_rgba(15,23,42,.10)]"
            >
              {item.image && (
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <img src={item.image} alt="" className="h-full w-full scale-105 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-slate-950/15" />
                </div>
              )}
              <div className="relative z-10 flex h-full flex-col">
                <motion.div whileHover={reduceMotion ? undefined : { rotate: -5, scale: 1.05 }} className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-white text-[#0B6B7A] shadow-sm group-hover:border-white/20 group-hover:bg-white/15 group-hover:text-white">
                  <item.icon size={21} strokeWidth={1.6} />
                </motion.div>
                <h3 className="mt-auto pt-10 font-heading text-xl font-semibold tracking-[-.02em] text-slate-950 group-hover:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 group-hover:text-white/80">{item.text}</p>
                <div className="mt-5 h-px w-8 bg-cyan-500 transition-all duration-300 group-hover:w-20 group-hover:bg-cyan-300" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

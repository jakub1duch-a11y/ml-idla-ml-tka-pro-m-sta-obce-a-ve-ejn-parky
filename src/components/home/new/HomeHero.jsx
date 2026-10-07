import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import { VIDEO_ASSETS } from '@/lib/newMedia';
import { ArrowRight, Wind, Droplets, Gauge, ShieldCheck } from 'lucide-react';

const benefits = [
{ icon: Wind, text: 'Cíleně osvěžuje pobytovou zónu' },
{ icon: Droplets, text: 'Jemná mlha pro příjemnější pobyt' },
{ icon: Gauge, text: 'Úsporný provoz a chytré řízení' },
{ icon: ShieldCheck, text: 'Odolná nerezová konstrukce' }];


const tiles = [
{
  title: 'LINEA CE',
  text: 'Nerezová linie s charakteristickým ohybem',
  image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp',
  link: '/produkt/linea-solo'
},
{
  title: 'MRAK',
  text: 'Hravé osvěžení pro děti a hřiště',
  image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
  link: '/produkt/mlzitko-mrak'
},
{
  title: 'MLŽNÁ BRÁNA',
  text: 'Průchozí vodní mlha pro náměstí',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bec7f86a9_generated_image.png',
  link: '/mlzne-brany'
},
{
  title: 'BENDY',
  text: 'Organická linie pro pobytové zóny',
  image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg',
  link: '/produkt/mlzitko-bendy'
}];


export default function HomeHero() {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '8%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.045]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-5%']);

  return (
    <MotionConfig reducedMotion="user">
    <section ref={heroRef} className="hero-motion-surface ref-editorial-surface relative overflow-hidden bg-[#07131D] text-white" aria-label="MLŽIDLA.CZ hero">
      <div className="relative min-h-[82svh] overflow-hidden">
        <HeroAtmosphere />
        <motion.div
            className="absolute inset-0 h-[108%] w-full"
            style={{ y: mediaY, scale: mediaScale }}
            data-home-parallax="7"
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
          {reduced ?
            <img
              src={VIDEO_ASSETS.heroCityPromo.poster}
              alt="Mlžítka ve veřejném prostoru s jemnou vodní mlhou"
              fetchPriority="high"
              className="h-full w-full object-cover object-[58%_center] sm:object-center" /> :

            <video
              src={VIDEO_ASSETS.heroCityPromo.src}
              poster={VIDEO_ASSETS.heroCityPromo.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="h-full w-full object-cover object-[58%_center] sm:object-center" />
            }
        </motion.div>
          
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(38,198,233,.20),transparent_34%),linear-gradient(90deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.48)_42%,rgba(0,0,0,.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#07131D] to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[82svh] max-w-[1540px] items-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_420px] lg:px-12 xl:px-20">
          <motion.div className="max-w-3xl" style={{ y: copyY }} data-home-reveal initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-mono font-bold uppercase tracking-[.22em] text-[#26C6E9] text-base">MLŽENÍ, KTERÉ DÁVÁ SMYSL</p>
            <h1 className="mt-5 max-w-[11ch] font-semibold leading-[.94] tracking-[-.055em] text-white [font-family:'Manrope',_'Inter',_sans-serif] text-[clamp(2.85rem,13vw,4.6rem)] sm:mt-6 sm:max-w-[10ch] sm:text-6xl lg:text-7xl text-left">
              Ochlazení, které patří do prostoru.
            </h1>
            <p className="mt-7 max-w-2xl leading-8 text-slate-200 text-lg sm:text-lg">
              Designová mlžítka pro náměstí, parky, sportoviště i zahrady. Nerezová konstrukce, nízkotlaké řešení a chytré řízení podle skutečné konfigurace projektu.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/katalog-mlzitek" className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#18B7E6] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white shadow-[0_22px_60px_rgba(24,183,230,.28)] transition hover:-translate-y-0.5 hover:bg-[#1098C8]">
                Zobrazit produkty <ArrowRight size={17} />
              </Link>
              <a href="#home-product-gallery" className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/22 bg-white/[.08] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white backdrop-blur-md transition hover:bg-white/14">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/28"><ArrowRight size={15} /></span>
                Prohlédnout galerii
              </a>
            </div>
          </motion.div>

          <motion.aside data-home-pointer="10" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="ref-cursor-glow hidden rounded-[2rem] border border-white/12 p-5 backdrop-blur-xl lg:block bg-[#000000]/[0.18]" aria-label="Hlavní přínosy mlžítek">
            <div className="space-y-4">
              {benefits.map(({ icon: Icon, text }) =>
                <div key={text} className="grid items-center gap-4 border border-white/10 bg-white/[.06] p-4 grid-cols-[54px_1fr] rounded-3xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#26C6E9]/55 text-[hsl(var(--background))] bg-[hsl(var(--background))]">
                    <Icon size={20} className="text-[hsl(var(--foreground))]" />
                  </div>
                  <p className="leading-6 text-slate-200 text-xl [font-family:'Manrope',_'Inter',_sans-serif] font-light">{text}</p>
                </div>
                )}
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="ref-float-rail"><span>MLŽIDLA / 01</span><i /></div>
      <div className="relative z-20 mx-auto max-w-[1540px] px-4 pb-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {tiles.map((tile, index) =>
            <motion.div key={tile.title} className="min-w-[82vw] snap-center sm:min-w-0" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} whileTap={{ scale: 0.985 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.46, delay: index * 0.05 }}>
              <Link to={tile.link} className="ref-product-card group block h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B2034] shadow-[0_22px_70px_rgba(7,19,29,.26)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]">
                <div className="ref-card-media aspect-[16/11] overflow-hidden bg-[#10283A]"><img src={tile.image} alt={`${tile.title} — produkt MLŽIDLA.CZ`} className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.045]" loading="lazy" decoding="async" /></div>
                <div className="border-t border-white/10 p-5">
                  <div className="mb-3 flex items-center justify-between"><span className="ref-card-index font-mono text-[10px] font-bold text-[#26C6E9]">{String(index + 1).padStart(2, "0")}</span><span className="text-[10px] font-bold uppercase tracking-[.18em] text-white/55">Produkt</span></div>
                  <h2 className="font-heading text-2xl font-bold tracking-[-.04em] text-white">{tile.title}</h2>
                  <p className="mt-1 min-h-[40px] text-sm font-semibold leading-5 text-slate-200">{tile.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] opacity-90 transition group-hover:translate-x-1">
                    Detail produktu <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
            )}
        </div>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-white/40 sm:hidden">Přejeďte pro další produkty</p>
      </div>
    </section>
    </MotionConfig>);

}
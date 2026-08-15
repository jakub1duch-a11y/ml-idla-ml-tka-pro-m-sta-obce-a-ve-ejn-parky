import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, Wifi, ThermometerSnowflake, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
{
  tag: 'ČESKÁ VÝROBA · 20 LET PRŮMYSLOVÉ ZKUŠENOSTI',
  title: 'Nerezová mlžítka a mlžné brány bez vysokotlakého čerpadla',
  titleMobile: 'Mlžítka bez vysokotlakého čerpadla',
  desc: 'Nízkotlaká mlha přímo z běžného vodovodního řadu. Navrhujeme a vyrábíme nerezové mlžící systémy pro náměstí, parky, promenády, gastro, wellness i rezidenční prostory — bez samostatného vysokotlakého čerpadla.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/518c8c2a3_mlzitka-pro-mesta.jpg',
  imageAlt: 'Nerezová designová mlžítka pro města a obce',
  cta1: { label: 'Prohlédnout česká mlžítka', to: '/mlzidla-mlzitka' },
  cta2: { label: 'Vyžádat cenovou nabídku', to: '/poptavka' }
}];



const BENEFITS = [
{ icon: ThermometerSnowflake, label: 'Chlazení až −10 °C' },
{ icon: Gauge, label: 'Nízký tlak 2–7 BAR' },
{ icon: Wifi, label: 'Chytré ovládání WiFi' },
{ icon: Droplets, label: 'Nízká spotřeba vody' }];


export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section className="relative overflow-hidden bg-primary lg:h-screen lg:min-h-[640px] lg:bg-background">
      {/* Image + overlay block. Fixed height on mobile so the photo stays visible; full-bleed with text overlay on desktop. */}
      <div className="relative -mb-px h-[58vh] min-h-[380px] max-h-[450px] bg-primary lg:absolute lg:inset-0 lg:mb-0 lg:h-full lg:max-h-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image} src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e3b9629f2_mlzidla-vizual__5_.webp"
            alt={slide.imageAlt}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: [1.03, 1.08, 1.03], x: [0, -10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1 }, scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 22, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute inset-0 w-full h-full object-cover sm:object-center object-[50%_center]" />
        </AnimatePresence>

        {/* Mobile: layered vignette - subtle top wash + clear middle so the photo breathes + smooth ramp into the bottom text zone */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
            'linear-gradient(180deg, hsl(var(--primary) / 0.30) 0%, hsl(var(--primary) / 0) 24%, hsl(var(--primary) / 0) 52%, hsl(var(--primary) / 0.5) 76%, hsl(var(--primary) / 0.93) 100%)'
          }} />

        {/* Mobile: soft side vignette for a more finished, premium framing */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
            'linear-gradient(90deg, hsl(var(--primary) / 0.22) 0%, hsl(var(--primary) / 0) 18%, hsl(var(--primary) / 0) 82%, hsl(var(--primary) / 0.22) 100%)'
          }} />

        {/* Desktop: full overlay for the complete text block */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t via-primary/15 from-primary/65 to-primary/55" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/55 to-primary/10" />

        {/* Mobile: short tag + title directly on the image */}
        <div className="absolute inset-x-0 bottom-0 lg:hidden px-5 py-5">
          <p className="mb-2 font-mono font-semibold uppercase tracking-[0.18em] text-white/85 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)] text-xs">{slide.tag}</p>
          <h1 className="font-heading font-semibold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] text-4xl">
            {slide.titleMobile || slide.title}
          </h1>
        </div>

        {/* Desktop: full text block over the image */}
        <div className="hidden lg:flex absolute inset-0 items-center">
          <div className="mx-auto w-full max-w-7xl py-24 px-20">
            <div className="max-w-5xl">
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
                  <p className="mb-4 font-mono font-semibold uppercase tracking-[0.3em] text-white/85 text-xs [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">{slide.tag}</p>
                  <h1 className="mb-5 max-w-4xl font-heading font-semibold leading-[1.04] tracking-tight text-white text-7xl [text-shadow:0_2px_16px_rgba(0,0,0,0.35)]">
                    {slide.title}
                  </h1>
                  <p className="text-measure mb-8 text-lg font-medium leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">{slide.desc}</p>

                  <div className="mb-10 flex flex-wrap gap-3">
                    <Link to={slide.cta1.to} className="min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-center text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl btn-metallic-mist inline-flex">
                      {slide.cta1.label} <ArrowRight size={16} />
                    </Link>
                    <Link to={slide.cta2.to} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-primary/20 px-7 py-4 text-center text-sm font-semibold text-white transition-all hover:bg-white/10">
                      {slide.cta2.label}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-4 gap-3">
                {BENEFITS.map((b, i) =>
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="flex min-h-14 items-center gap-2">
                    <b.icon size={20} className="text-white/90 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]" />
                    <span className="text-white/85 font-medium leading-tight text-sm text-right [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">{b.label}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls (desktop only, same as before) */}
        {SLIDES.length > 1 && <div className="hidden lg:flex absolute bottom-8 right-8 z-20 items-center gap-3">
          <button onClick={prev} aria-label="Předchozí snímek" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} aria-label="Další snímek" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>}

        {SLIDES.length > 1 && <div className="hidden lg:flex absolute bottom-8 left-8 z-20 items-center gap-2">
          {SLIDES.map((s, i) => <span key={s.title} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />)}
        </div>}
      </div>

      {/* Mobile: description, CTAs and benefits live below the image on a solid background — fully readable, image stays uncluttered */}
      <div className="relative z-10 -mt-px bg-primary px-5 pb-10 pt-6 lg:hidden">
        <p className="mb-6 font-medium leading-relaxed text-white/90 text-sm">{slide.desc}</p>

        <div className="mb-6 grid grid-cols-1 gap-3">
          <Link to={slide.cta1.to} className="min-h-12 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-center text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 btn-metallic-mist">
            {slide.cta1.label} <ArrowRight size={16} />
          </Link>
          <Link to={slide.cta2.to} className="min-h-12 inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-primary/20 px-6 py-3.5 text-center text-sm font-semibold text-white">
            {slide.cta2.label}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map((b) =>
          <div key={b.label} className="flex min-h-14 items-center gap-2">
              <b.icon size={20} className="text-white/90 shrink-0" />
              <span className="text-white/85 font-medium leading-tight text-xs">{b.label}</span>
            </div>
          )}
        </div>

        {SLIDES.length > 1 && <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((s, i) => <span key={s.title} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />)}
        </div>}
      </div>
    </section>);

}
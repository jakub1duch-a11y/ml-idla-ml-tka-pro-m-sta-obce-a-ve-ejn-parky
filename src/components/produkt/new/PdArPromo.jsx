import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, Camera, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: Camera, title: 'Vyfoťte prostor', text: 'Terasu, náměstí nebo zahradu tak, jak dnes vypadá.' },
  { icon: ScanLine, title: 'Vložíme produkt', text: 'Do fotografie umístíme skutečnou geometrii výrobku.' },
  { icon: Sparkles, title: 'Uvidíte výsledek', text: 'Vizualizace s mlhou v reálném měřítku vašeho místa.' },
];

// Pozadí = prázdný prostor BEZ mlžítka. Na displeji mobilu je TEN SAMÝ prostor, ale už s mlžítkem.
const EMPTY_SPACE = '/media/optimized/ae1d9572f_generated_image.webp';
const AR_SPACE_WITH_PRODUCT = '/media/optimized/253a5b826_generated_image.webp';
// Mobil: jedna fotorealistická fotografie — ruka s mobilem v prázdném prostoru, produkt pouze na displeji.
const AR_MOBILE_PHOTO = '/media/optimized/1239b5eb3_generated_image.webp';

export default function PdArPromo({ product }) {
  const screenPhoto = AR_SPACE_WITH_PRODUCT;
  const scenePhoto = EMPTY_SPACE;

  return (
    <div className="relative overflow-hidden border border-white/10 bg-[#0A1628]">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative p-7 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 border border-[#22D3EE]/40 bg-[#22D3EE]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-[#22D3EE]">
            <Sparkles size={12} /> Služba zdarma k poptávce
          </span>
          <h3 className="mt-5 font-heading text-3xl font-semibold leading-[1.05] tracking-[-.03em] text-white sm:text-4xl">
            Uvidíte {product.name} u sebe.<br /><span className="text-[#22D3EE]">Ještě než ho vyrobíme.</span>
          </h3>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
            Stačí fotografie z mobilu. Do vašeho prostoru vložíme skutečnou geometrii produktu — bez úprav tvaru — a uvidíte, jak mlha vypadá právě u vás.
          </p>

          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-white/15 pt-4"
              >
                <div className="flex items-center justify-between">
                  <Icon size={18} strokeWidth={1.6} className="text-[#22D3EE]" />
                  <span className="font-mono text-[10px] tracking-[.14em] text-white/40">0{i + 1}</span>
                </div>
                <p className="mt-3 font-heading text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/60">{text}</p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
              className="group inline-flex min-h-[48px] items-center gap-2 bg-[#22D3EE] px-6 font-heading text-sm font-bold text-[#0A1628] transition hover:-translate-y-0.5"
            >
              <ScanLine size={16} /> Vyzkoušet v mém prostoru
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-[48px] items-center gap-2 border border-white/25 px-6 text-sm font-semibold text-white transition hover:border-[#22D3EE] hover:text-[#22D3EE]">
              Navrhnout konfiguraci
            </Link>
          </div>
        </div>

        {/* Mobil: fotorealistický AR záběr (ruka s mobilem) */}
        <div className="relative overflow-hidden lg:hidden">
          <img src={AR_MOBILE_PHOTO} alt={`${product.name} – AR náhled v reálném prostoru na mobilu`} loading="lazy" className="block h-auto w-full object-cover" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(10,22,40,.85)_0%,rgba(10,22,40,0)_100%)]" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 border border-[#22D3EE]/50 bg-[#0A1628]/70 px-2.5 py-1 font-mono text-[10px] tracking-[.14em] text-[#22D3EE] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" /> AR NÁHLED
          </span>
          <p className="absolute inset-x-0 bottom-0 bg-[#0A1628]/80 px-4 py-2.5 font-mono text-[10px] tracking-[.12em] text-[#22D3EE] backdrop-blur-sm">
            NA DISPLEJI: VÁŠ PROSTOR S PRODUKTEM
          </p>
        </div>

        {/* Desktop: reálná fotografie prostoru + mobil se skutečnou fotografií produktu */}
        <div className="relative hidden min-h-[360px] overflow-hidden lg:block lg:min-h-full">
          <img src={scenePhoto} alt="Prázdný prostor před instalací" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0A1628]/45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,22,40,.9)_0%,rgba(10,22,40,.35)_45%,rgba(10,22,40,.1)_100%)]" />

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 h-[70%] max-h-[380px] w-[46%] max-w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[26px] border-[3px] border-[#0A1628] bg-[#0A1628] p-1.5 shadow-[0_30px_70px_rgba(0,0,0,.55)]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#0A1628]">
              {screenPhoto && (
                <img src={screenPhoto} alt={`${product.name} – náhled produktu na mobilu`} loading="lazy" className="h-full w-full object-cover" />
              )}
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-[#22D3EE] px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[.1em] text-[#0A1628]">AR</span>
              <div className="absolute inset-3 border border-[#22D3EE]/70" />
              <div className="absolute inset-x-0 bottom-0 bg-[#0A1628]/80 px-2 py-1.5 backdrop-blur-sm">
                <p className="font-mono text-[8px] tracking-[.12em] text-[#22D3EE]">UMÍSTĚNO VE VAŠEM PROSTORU</p>
              </div>
            </div>
            <span className="absolute left-1/2 top-2.5 h-1 w-8 -translate-x-1/2 rounded-full bg-white/20" />
          </motion.div>

          <motion.span
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-5 top-5 inline-flex items-center gap-1.5 border border-[#22D3EE]/50 bg-[#0A1628]/70 px-2.5 py-1 font-mono text-[10px] tracking-[.14em] text-[#22D3EE] backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" /> AR NÁHLED
          </motion.span>
        </div>
      </div>
    </div>
  );
}
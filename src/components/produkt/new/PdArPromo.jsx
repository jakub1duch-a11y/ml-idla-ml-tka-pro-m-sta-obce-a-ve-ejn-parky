import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, Camera, Sparkles, ArrowRight } from 'lucide-react';

const AR_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ba542cee6_generated_image.png';

const STEPS = [
  { icon: Camera, title: 'Vyfoťte prostor', text: 'Terasu, náměstí nebo zahradu tak, jak dnes vypadá.' },
  { icon: ScanLine, title: 'Umístíme mlžítko', text: 'Do fotografie vložíme přesnou geometrii vybraného produktu.' },
  { icon: Sparkles, title: 'Uvidíte výsledek', text: 'Dostanete vizualizaci s mlhou v reálném měřítku vašeho místa.' },
];

export default function PdArPromo({ product }) {
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
            Stačí fotografie z mobilu. Do vašeho prostoru vložíme skutečnou geometrii produktu a uvidíte, jak mlha vypadá právě u vás — na dlažbě, v trávě nebo pod pergolou.
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

        <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
          <motion.img
            src={AR_IMAGE}
            alt="Ruka s mobilem zobrazuje mlžítko umístěné do reálného prostoru"
            loading="lazy"
            initial={{ scale: 1.08, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,22,40,.85)_0%,rgba(10,22,40,.25)_38%,rgba(10,22,40,0)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,22,40,1)_0%,rgba(10,22,40,.35)_28%,rgba(10,22,40,0)_65%)]" />
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
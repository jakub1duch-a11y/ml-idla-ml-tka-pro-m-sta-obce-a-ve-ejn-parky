import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, FileText, Ruler, Droplets, Gauge, Zap, ShieldCheck, MapPin, Sun, CloudFog, BadgeCheck, ScanLine, Box } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';
import ProductGalleryPanel from './ProductGalleryPanel';
import ProductHeroMist from './ProductHeroMist';
import ProductSignatureSystem from './ProductSignatureSystem';
import ProductARQR from './ProductARQR';

export default function ProductHero({ product, categoryName, allMedia, onOpenLightbox, onShowTechnical }) {
  const [mrakSize, setMrakSize] = useState('0,8 m');
  const isMrak = product.slug === 'mlzitko-mrak';
  const mrakSizes = [
    { value: '0,8 m', label: '0,8 m', note: 'kompaktní varianta' },
    { value: '1,8 m', label: '1,8 m', note: 'výrazná varianta' },
    { value: 'na míru 0,8–1,8 m', label: 'Na míru', note: 'výška 0,8–1,8 m' },
  ];

  const quickSpecs = [
  product.coverage_area && { icon: Ruler, label: 'Výška / dosah', value: product.coverage_area },
  product.micron_size && { icon: CloudFog, label: 'Mlžné trysky', value: product.micron_size },
  product.water_consumption && { icon: Droplets, label: 'Spotřeba vody', value: product.water_consumption },
  product.pressure && { icon: Gauge, label: 'Tlak vody', value: product.pressure },
  product.power_supply && { icon: Zap, label: 'Napájení / řízení', value: product.power_supply },
  product.material && { icon: BadgeCheck, label: 'Materiál', value: product.material }].
  filter(Boolean).slice(0, 6);

  return (
    <div className="relative overflow-hidden">
      <ProductHeroMist />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-10">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-slate-700 transition-colors">Domů</Link>
        <ChevronRight size={12} />
        <Link to="/mlzidla-mlzitka" className="hover:text-slate-700 transition-colors">Produkty</Link>
        {categoryName &&
          <>
            <ChevronRight size={12} />
            <span>{categoryName}</span>
          </>
          }
        <ChevronRight size={12} />
        <span className="text-slate-700 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.16fr_.84fr] gap-8 lg:gap-10 xl:gap-12 items-start">
        <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <ProductGalleryPanel mediaItems={allMedia} productName={product.name} onOpenLightbox={onOpenLightbox} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {categoryName && <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">{categoryName}</p>}
          <h1 className="tracking-tight leading-[1.04] mb-5 text-[#0b4860] [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-4xl lg:text-[2.65rem]">
            {product.name}
          </h1>
          {product.short_description &&
            <p className="text-slate-700 text-lg font-medium leading-[1.75] mb-6">{product.short_description}</p>
            }

          {isMrak && (
            <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,.04)] sm:p-5">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Varianta velikosti</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Vyberte výšku mlžítka MRAK</h2>
                </div>
                <span className="text-xs text-slate-400">Zakázková výroba</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {mrakSizes.map((size) => {
                  const active = mrakSize === size.value;
                  return (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => setMrakSize(size.value)}
                      aria-pressed={active}
                      className={`rounded-xl border px-3 py-3 text-left transition-all ${active ? 'border-[#0b4860] bg-[#0b4860]/[.06] shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <span className={`block text-sm font-bold ${active ? 'text-[#0b4860]' : 'text-slate-900'}`}>{size.label}</span>
                      <span className="mt-1 block text-[10px] leading-4 text-slate-500">{size.note}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">Výšku a přesné provedení potvrdíme podle místa instalace. Konstrukce je vyráběna zakázkově v uvedeném rozsahu.</p>
            </div>
          )}

          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: 'Bez vysokotlakého čerpadla', desc: 'Nízkotlaká mlha přímo z běžného vodovodního řadu — bez samostatné vysokotlaké technologie.' },
              { icon: Sun, title: 'Příjemné ochlazení', desc: 'Jemná vodní mlha pomáhá lokálně ochladit prostor během horkých letních dnů.' },
              { icon: CloudFog, title: 'Jemná mlha, ne déšť', desc: 'Správně zvolené trysky vytvářejí jemné mikrokapky pro komfortní osvěžení bez zbytečného smáčení okolí.' },
              { icon: MapPin, title: 'Česká výroba HolmTec', desc: 'Nerezovou konstrukci vyrábíme a dokončujeme v ČR s důrazem na detail, servis a dlouhou životnost.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0b4860]/25 hover:shadow-[0_14px_34px_rgba(15,23,42,.07)]">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b4860]/[.06] text-[#0b4860]">
                    <Icon size={19} strokeWidth={1.65} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-sm font-semibold leading-snug text-slate-900">{title}</strong>
                    <span className="mt-1.5 block text-xs leading-relaxed text-slate-500">{desc}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {quickSpecs.length > 0 &&
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {quickSpecs.map((s) =>
              <div key={s.label} className="flex min-h-[86px] items-start gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,.04)]">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <s.icon size={14} className="text-slate-500" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wide">{s.label}</span>
                    <span className="block text-sm font-semibold leading-snug text-slate-900 line-clamp-2">{s.value}</span>
                  </span>
                </div>
              )}
            </div>
            }

          <ProductSignatureSystem product={product} />

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
                to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0b4860] px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#08394c] hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(11,72,96,.18)]">
              Vizualizovat ve vašem prostoru <ScanLine size={16} />
            </Link>
            {(product.slug === 'mlzitko-bendy' || product.slug === 'mlzna-brana-gate') && (
              <Link
                  to={product.slug === 'mlzitko-bendy' ? '/ar/bendy-single' : '/ar/gate'}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0b4860]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#0b4860] transition-colors hover:bg-slate-50">
                {product.slug === 'mlzitko-bendy' ? '3D / AR náhled' : 'GATE AR projekt'} <Box size={16} />
              </Link>
            )}
            <Link
                to={`/kontakt?produkt=${encodeURIComponent(isMrak ? `${product.name} · ${mrakSize}` : product.name)}`}
                onClick={() => trackQuickInquiryClick(product.name, 'produkt_hero')}
                className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                
              Rychlá poptávka <ArrowRight size={16} />
            </Link>
            <button
                type="button"
                onClick={onShowTechnical}
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 text-sm font-bold px-6 py-3.5 rounded-full hover:bg-slate-50 transition-colors">
                
              Technické parametry <FileText size={14} />
            </button>
          </div>

          <ProductARQR product={product} />
        </motion.div>
      </div>
      </div>
    </div>);

}
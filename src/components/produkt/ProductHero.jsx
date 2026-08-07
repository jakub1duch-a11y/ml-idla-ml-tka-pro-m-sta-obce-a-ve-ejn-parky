import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, FileText, Thermometer, Droplets, Gauge, Zap } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';
import ProductGalleryPanel from './ProductGalleryPanel';
import ProductHeroMist from './ProductHeroMist';

export default function ProductHero({ product, categoryName, allImages, onOpenLightbox, onShowTechnical }) {
  const quickSpecs = [
  product.coverage_area && { icon: Thermometer, label: 'Ochlazení', value: product.coverage_area },
  product.water_consumption && { icon: Droplets, label: 'Spotřeba vody', value: product.water_consumption },
  product.pressure && { icon: Gauge, label: 'Tlak vody', value: product.pressure },
  product.power_supply && { icon: Zap, label: 'Napájení', value: product.power_supply }].
  filter(Boolean);

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

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <ProductGalleryPanel images={allImages} productName={product.name} onOpenLightbox={onOpenLightbox} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {categoryName && <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">{categoryName}</p>}
          <h1 className="tracking-tight leading-[1.08] mb-5 text-[#0b4860] [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-4xl lg:text-4xl">
            {product.name}
          </h1>
          {product.short_description &&
            <p className="text-slate-700 text-lg font-medium leading-[1.75] mb-7">{product.short_description}</p>
            }

          {quickSpecs.length > 0 &&
            <div className="grid grid-cols-2 gap-3 mb-8">
              {quickSpecs.map((s) =>
              <div key={s.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <s.icon size={14} className="text-slate-500" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wide">{s.label}</span>
                    <span className="block text-sm font-semibold text-slate-900 truncate">{s.value}</span>
                  </span>
                </div>
              )}
            </div>
            }

          <div className="flex flex-wrap gap-3">
            <Link
                to={`/kontakt?produkt=${encodeURIComponent(product.name)}`}
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
        </motion.div>
      </div>
      </div>
    </div>);

}
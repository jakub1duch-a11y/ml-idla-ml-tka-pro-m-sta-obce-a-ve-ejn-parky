import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, FileText, ScanLine, Box } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';
import ProductGalleryPanel from './ProductGalleryPanel';
import ProductHeroMist from './ProductHeroMist';
import ProductSignatureSystem from './ProductSignatureSystem';
import ProductARQR from './ProductARQR';

export default function ProductHero({ product, categoryName, allMedia, variantImages = [], onOpenLightbox, onShowTechnical }) {
  const location = useLocation();
  const isMrak = product.slug === 'mlzitko-mrak';
  const query = new URLSearchParams(location.search);
  const mrakShape = query.get('variant') || 'obrys';
  const mrakHeight = query.get('height') || '2500';
  const mrakScale = query.get('size') || 'standard';
  const mrakShapeLabels = { obrys: 'OBRYS', flow: 'FLOW', organik: 'ORGANIK' };
  const mrakSizeLabels = { kompakt: 'KOMPAKT', standard: 'STANDARD', rozsireny: 'ROZŠÍŘENÝ' };
  const mrakSelection = isMrak
    ? `${product.name} · ${mrakShapeLabels[mrakShape] || mrakShape.toUpperCase()} · ${mrakHeight} mm · ${mrakSizeLabels[mrakScale] || mrakScale}`
    : product.name;

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

          <ProductSignatureSystem product={product} showSignatures={false} />

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
                to={`/kontakt?produkt=${encodeURIComponent(mrakSelection)}`}
                onClick={() => trackQuickInquiryClick(product.name, 'produkt_hero')}
                className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
              Žádost o cenu <ArrowRight size={16} />
            </Link>
            <Link
                to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#0b4860]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#0b4860] transition-colors hover:bg-slate-50">
              Vizualizovat ve vašem prostoru <ScanLine size={16} />
            </Link>
            {(product.slug === 'mlzitko-bendy' || product.slug === 'mlzna-brana-gate') && (
              <Link
                  to={product.slug === 'mlzitko-bendy' ? '/ar/bendy-single' : '/ar/gate'}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0b4860]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#0b4860] transition-colors hover:bg-slate-50">
                {product.slug === 'mlzitko-bendy' ? '3D / AR náhled' : 'GATE AR projekt'} <Box size={16} />
              </Link>
            )}
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
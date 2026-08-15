import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Thermometer, Smartphone, ArrowRight } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';

const POINTS = [
{ icon: Wifi, label: 'Wi-Fi / Bluetooth ovládání' },
{ icon: Thermometer, label: 'Senzory teploty a vlhkosti' },
{ icon: Smartphone, label: 'Ovládání z mobilní aplikace' }];


export default function SmartSystemPreview() {
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Náš Smart systém</p>
          <h2 className="font-heading font-medium text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">Chytré řízení mlzidla.cz</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            Vlastní systém pro ovládání mlžítek — od jednoduchého ovládání z mobilu až po plnou automatizaci podle počasí, senzorů a smart home ekosystému.
          </p>
          <ul className="space-y-3 mb-8">
            {POINTS.map((p) =>
            <li key={p.label} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <p.icon size={15} className="text-slate-900" />
                </span>
                {p.label}
              </li>
            )}
          </ul>
          <div className="flex flex-wrap gap-4">
            <Link to="/chytra-mlzidla"
              onClick={() => trackQuickInquiryClick('Chytré řízení mlzidla.cz', 'katalog_smart_preview')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all">
              Zobrazit varianty <ArrowRight size={16} />
            </Link>
            <Link to="/smart-ovladani" className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:border-slate-300 transition-all">
              O aplikaci
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-slate-200">
          <img src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp"
            alt="Smart aplikace pro řízení mlžítek" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>);

}
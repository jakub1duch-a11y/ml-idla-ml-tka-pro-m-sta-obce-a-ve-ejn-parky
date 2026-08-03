import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';

const BENEFITS = [
'Ovládání a plánování mlžení z mobilní aplikace (iOS, Android)',
'Automatický start při teplotě nad nastavený limit',
'Integrace s Apple HomeKit, Google Home a Amazon Alexa',
'Historie provozu a přehled spotřeby vody v aplikaci'];


export default function SmartControlPromo() {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <img src="https://images.unsplash.com/photo-1558002038-1055907df827?w=900&q=80" alt="Smart App řízení mlžítek"
            className="w-full rounded-3xl object-cover aspect-[4/3] border border-slate-200" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="inline-block px-4 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            Smart App řízení
          </span>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
            Vaše mlžítko, <span className="italic text-slate-400">chytřejší než kdy dřív.</span>
          </h2>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Doplňte kterékoliv naše mlžítko o Smart modul a řiďte celý systém z mobilu — automaticky podle počasí, nebo ručně podle vaší nálady.
          </p>
          <ul className="space-y-3 mb-8">
            {BENEFITS.map((b) =>
            <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                <CheckCircle2 size={16} className="text-slate-900 shrink-0 mt-0.5" /> {b}
              </li>
            )}
          </ul>
          <Link to="/kontakt?produkt=Smart%20App%20řízení"
            onClick={() => trackQuickInquiryClick('Smart App řízení', 'smart_control_promo')}
            className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
            Poptat Smart App řízení <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>);

}
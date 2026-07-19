import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Lightbulb } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';

const VARIANTS = [
{
  tag: 'Varianta A',
  name: 'Spouštění 0–24 V',
  desc: 'Elektrické spouštění mlžení podle zvoleného ventilu, tlačítka nebo časovače.',
  features: ['Rozsah 0–24 V dle zvoleného spouštění', 'Tlačítko nebo časový spínač', 'Volba řešení podle místa instalace']
},
{
  tag: 'Varianta B',
  name: 'Manuální uzavření bez napětí',
  desc: 'Jednoduché ruční otevření a zavření přívodu vody bez elektrického napájení.',
  highlighted: true,
  features: ['Bez přívodu elektrické energie', 'Přímé mechanické ovládání ventilu', 'Jednoduchý sezónní provoz']
},
{
  tag: 'Varianta C',
  name: 'Chytré řízení od 3 V',
  desc: 'Automatizace podle teploty, času, vlhkosti nebo pohybu v prostoru.',
  features: ['Napájení chytrého řízení od 3 V', 'Mobilní aplikace a harmonogram', 'Volitelné teplotní a pohybové senzory']
}];


export default function ControlVariants() {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Chytré řízení mlžítek</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Vyberte si úroveň automatizace.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {VARIANTS.map((v, i) =>
          <motion.div key={v.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`flex flex-col p-7 rounded-3xl border transition-all hover:shadow-xl ${v.highlighted ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <p className={`text-xs font-mono tracking-widest uppercase mb-3 ${v.highlighted ? 'text-cyan' : 'text-slate-400'}`}>{v.tag}</p>
              <h3 className={`text-xl font-heading font-medium mb-2 ${v.highlighted ? 'text-white' : 'text-slate-900'}`}>{v.name}</h3>
              <p className={`text-sm mb-5 leading-relaxed ${v.highlighted ? 'text-white/60' : 'text-slate-500'}`}>{v.desc}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {v.features.map((f) =>
              <li key={f} className={`flex items-start gap-2 text-sm ${v.highlighted ? 'text-white/80' : 'text-slate-600'}`}>
                    <Check size={15} className={`shrink-0 mt-0.5 ${v.highlighted ? 'text-cyan' : 'text-slate-900'}`} /> {f}
                  </li>
              )}
              </ul>
              <Link to={`/kontakt?produkt=${encodeURIComponent(v.name)}`}
                onClick={() => trackQuickInquiryClick(v.name, 'control_variants_card')}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-full transition-colors ${v.highlighted ? 'bg-cyan text-slate-900 hover:bg-cyan/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                Poptat variantu <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <Lightbulb size={16} className="text-slate-900" />
            </div>
            <p className="text-sm text-slate-600">Kterýkoliv systém lze doplnit o <span className="font-medium text-slate-900">chytré LED osvětlení</span> mlžítka, ovládané ze stejné aplikace.</p>
          </div>
          <Link to="/kontakt?produkt=Chytr%C3%A9%20řízení%20mlzidla.cz"
            onClick={() => trackQuickInquiryClick('Chytré řízení mlzidla.cz', 'control_variants')}
            className="btn-metallic-mist px-6 py-3 text-sm font-bold whitespace-nowrap">
            Poptat variantu <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>);

}
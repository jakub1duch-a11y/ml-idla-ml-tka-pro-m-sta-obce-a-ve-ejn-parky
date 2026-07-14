import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Wrench, Clock, Sparkles, ArrowRight } from 'lucide-react';

const OFFER = [
{ icon: Wifi, value: 'wifi_smart_app', label: 'Wi-Fi Smart APP', desc: 'Ovládání a plánování mlžení z mobilní aplikace, senzory teploty a vlhkosti.' },
{ icon: Wrench, value: 'manualni_ventil', label: 'Manuální ventil', desc: 'Zapínání a vypínání přímo na ventilu, bez elektroniky.' },
{ icon: Clock, value: 'casovy_spinac', label: 'Časový spínač', desc: 'Automatické spínání dle nastaveného denního plánu.' },
{ icon: Sparkles, value: 'doporucit', label: 'Doporučit vhodné ovládání', desc: 'Necháte výběr na nás — do nabídky navrhneme optimální řízení dle vašeho projektu.' }];


export default function SmartControlOffer() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Nabídka Smart řízení</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Vyberte typ ovládání pro vaše mlžítko.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {OFFER.map((o, i) =>
          <motion.div key={o.value} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col">
              <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                <o.icon size={18} className="text-cyan" />
              </div>
              <h3 className="text-slate-900 font-medium mb-1.5">{o.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{o.desc}</p>
              <Link to={`/poptavka?produkt=${encodeURIComponent('Smart ovládání')}&ovladani=${o.value}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:gap-2.5 transition-all">
                Poptat <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
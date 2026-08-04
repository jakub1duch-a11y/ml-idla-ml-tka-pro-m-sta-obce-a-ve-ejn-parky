import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Thermometer, MonitorCheck } from 'lucide-react';

const TOGGLES = [
{ icon: Wifi, title: 'Konektivita', text: 'Plné ovládání přes Wi-Fi nebo Bluetooth.' },
{ icon: Thermometer, title: 'Automatizace', text: 'Spínání na základě reálné teploty okolí (teplotní čidlo) nebo časového programu.' },
{ icon: MonitorCheck, title: 'Efektivita', text: 'Vzdálený monitoring zajišťuje, že systém běží jen tehdy, kdy to dává smysl.' }];


export default function SmartManagementSection() {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 border-t border-slate-100 bg-slate-50">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-3xl lg:text-4xl text-slate-900 tracking-tight mb-10 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">
        Smart správa pro moderní města.
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="rounded-2xl overflow-hidden border border-slate-200">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/16ca9d71c_9RFLppbaXYD67osYj_pkoR.png"

          alt="Smart správa mlžení přes mobilní aplikaci"
          className="w-full h-full object-cover aspect-[4/3]" />
          
        </motion.div>

        <div className="flex flex-col gap-4">
          {TOGGLES.map((t, i) =>
          <motion.div key={t.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <t.icon size={18} className="text-slate-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-slate-900 font-medium text-xl">{t.title}</h3>
                  <span className="w-8 h-4.5 rounded-full bg-emerald-400 relative shrink-0">
                    <span className="absolute right-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white" />
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] text-sm">{t.text}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}
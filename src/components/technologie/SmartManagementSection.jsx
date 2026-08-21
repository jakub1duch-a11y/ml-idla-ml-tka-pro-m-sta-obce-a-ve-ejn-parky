import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Thermometer, MonitorCheck } from 'lucide-react';

const TOGGLES = [
{ icon: Wifi, title: 'Konektivita', text: 'Volitelné Wi-Fi nebo jiné vzdálené ovládání podle zvolené řídicí sestavy.' },
{ icon: Thermometer, title: 'Automatizace', text: 'Časový program a volitelné teplotní podmínky mohou omezit provoz na situace, kdy je mlžení skutečně účelné.' },
{ icon: MonitorCheck, title: 'Více zón a dohled', text: 'U větších projektů lze řízení rozdělit do samostatných zón a doplnit vzdálený dohled podle požadavků provozovatele.' }];


export default function SmartManagementSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 border-t border-slate-100 bg-slate-50">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="mb-10 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">
        Chytré řízení podle rozsahu projektu.
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="rounded-2xl overflow-hidden border border-slate-200">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/d9bb9188f_ec8c866ef_copilot_image_1784351460863.webp"

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
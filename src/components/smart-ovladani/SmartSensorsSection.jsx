import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SENSORS = [
'Teplotní senzor — spustí mlžení po dosažení nastavené teploty',
'Senzor vlhkosti — hlídá optimální mikroklima okolí',
'PIR senzor pohybu — mlžení jen tehdy, když je někdo v prostoru',
'Integrace předpovědi počasí — systém neběží zbytečně za deště nebo větru',
'Manuální tlačítko jako spolehlivá záloha'];


export default function SmartSensorsSection() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-slate-200 order-2 lg:order-1">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/585985745_smartaplikacepromlzutka-nova.png"
            alt="Aplikace pro chytré mlžítko se senzory" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Senzory · ventily · automatizace</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-6">
            Systém reaguje na reálné podmínky.
          </h2>
          <p className="mb-6 text-sm leading-7 text-slate-500">Podle projektu propojujeme řídicí logiku se senzorikou a ovládáním jednotlivých vodních zón. U variant s PEVEKO / SUPLA vždy vycházíme z konkrétního technického návrhu a kompatibility použitých komponent.</p>
          <ul className="space-y-3">
            {SENSORS.map((s) =>
            <li key={s} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                <Check size={16} className="text-slate-900 shrink-0 mt-0.5" /> {s}
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    </section>);

}
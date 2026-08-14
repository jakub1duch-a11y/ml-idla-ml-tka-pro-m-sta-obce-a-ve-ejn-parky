import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SENSORS = [
'Teplotní senzor — spustí mlžení po dosažení nastavené teploty',
'Volitelný senzor vlhkosti — může vstupovat do automatizační logiky',
'Volitelný PIR senzor — může podmínit provoz přítomností osob v prostoru',
'Volitelná integrace počasí — podle konfigurace lze provoz blokovat při nevhodných podmínkách',
'Manuální tlačítko jako spolehlivá záloha'];


export default function SmartSensorsSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm order-2 lg:order-1">
          <div className="relative h-[430px] sm:h-[480px] lg:h-[520px]"><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/585985745_smartaplikacepromlzutka-nova.png"
            alt="Aplikace pro chytré mlžítko se senzory" className="absolute inset-0 w-full h-full object-contain bg-white p-2 sm:p-4" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" /><div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2"><div className="rounded-xl border border-white/20 bg-slate-950/70 p-2.5 text-white backdrop-blur sm:p-3"><p className="font-mono text-[8px] tracking-wider text-white/50 sm:text-[9px] sm:tracking-widest">TEPLOTA</p><p className="mt-1 text-xs font-semibold sm:text-sm">28,6 °C</p></div><div className="rounded-xl border border-white/20 bg-slate-950/70 p-2.5 text-white backdrop-blur sm:p-3"><p className="font-mono text-[8px] tracking-wider text-white/50 sm:text-[9px] sm:tracking-widest">REŽIM</p><p className="mt-1 text-xs font-semibold sm:text-sm">AUTO</p></div><div className="rounded-xl border border-white/20 bg-slate-950/70 p-2.5 text-white backdrop-blur sm:p-3"><p className="font-mono text-[8px] tracking-wider text-white/50 sm:text-[9px] sm:tracking-widest">ZÓNA</p><p className="mt-1 text-xs font-semibold sm:text-sm">AKTIVNÍ</p></div></div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Senzory · ventily · automatizace</p>
          <h2 className="font-heading font-light text-3xl leading-tight lg:text-4xl text-slate-900 tracking-tight mb-4">
            Systém reaguje na skutečné provozní podmínky.
          </h2>
          <p className="mb-6 text-sm leading-7 text-slate-500">Podle projektu propojujeme řídicí logiku se senzorikou a ovládáním jednotlivých vodních zón. U variant s PEVEKO / SUPLA vždy vycházíme z konkrétního technického návrhu a kompatibility použitých komponent.</p><div className="mb-6 flex flex-wrap gap-2"><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600">SUPLA · vzdálené řízení dle konfigurace</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600">PEVEKO · ventilová část dle projektu</span></div>
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
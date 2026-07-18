import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Thermometer, PersonStanding, Smartphone, Lightbulb, ToggleLeft, ArrowRight } from 'lucide-react';

const CONTROL_ICONS = [
{ icon: Wifi, label: 'Wi-Fi Smart ovládání' },
{ icon: Thermometer, label: 'Teplotní senzor' },
{ icon: PersonStanding, label: 'PIR — senzor pohybu' },
{ icon: Smartphone, label: 'Mobile App' },
{ icon: Lightbulb, label: 'Integrované osvětlení' },
{ icon: ToggleLeft, label: 'Manuální tlačítko' }];


export default function HeroFeatureGrid() {
  return (
    <div className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b68df5d31_Gemini_Generated_Image_5gclad5gclad5gcl.png"
          alt=""
          className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/85 to-slate-900" />
      </div>

      {/* trendy ambient glow blobs */}
      <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ opacity: [0.2, 0.1, 0.2] }} transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-40 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan/10 border border-cyan/25 text-cyan text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            SMART APP ovládání — Wi-Fi / Bluetooth
          </span>
          <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-5">
            Chytré <span className="italic font-light text-cyan">řízení mlžítek.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-lg">
            Náš vlastní SMART APP systém řízení mlžítek — reaguje na počasí, vlhkost i pohyb, ovládá se z mobilu a instaluje se během chvilky na kterékoliv naše mlžítko.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link to="/kontakt?produkt=Chytr%C3%A9%20řízení%20mlzidla.cz"
              className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
              Poptat chytré řízení <ArrowRight size={16} />
            </Link>
            <Link to="/kontakt?produkt=senzory"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-full hover:bg-white/15 transition-all">
              Poptat senzory <ArrowRight size={15} />
            </Link>
            <Link to="/kontakt?produkt=chytr%C3%A9%20dopl%C5%88ky%20(moduly)"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-full hover:bg-white/15 transition-all">
              Poptat chytré doplňky <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          {CONTROL_ICONS.map((f, i) =>
          <motion.div key={f.label}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-cyan/30 transition-all">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3 + i * 0.3, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-cyan/15 border border-cyan/25 flex items-center justify-center mb-3">
                <f.icon size={16} className="text-cyan" />
              </motion.div>
              <p className="text-sm text-white font-medium leading-tight">{f.label}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>);

}
import React from "react";
import { motion } from "framer-motion";
import { HumidifyIcon, DustIcon, ShieldIcon, FrostIcon, SparkleIcon, CheckGlowIcon } from "./MistIcons";

const APPLICATIONS = [
  { icon: HumidifyIcon, num: "01", title: "Zvlhčení vzduchu", desc: "Ideální pro suché prostředí, skleníky a průmyslové provozy s citlivými procesy." },
  { icon: DustIcon, num: "02", title: "Odprašování", desc: "Mikrokapky vážou prach ve vzduchu — snížení prašnosti až o 85 %." },
  { icon: ShieldIcon, num: "03", title: "Odpuzování hmyzu", desc: "Vlhká clona snižuje výskyt komárů a much v okolí zahrádek a teras." },
  { icon: FrostIcon, num: "04", title: "Protimrazová ochrana", desc: "V zemědělství chrání citlivé květy před jarními mrazíky." },
  { icon: SparkleIcon, num: "05", title: "Efektní vzhled", desc: "Atmosférický oblak jako architektonický prvek — pro festivaly a event catering." },
];

const ADVANTAGES = [
  "Ochlazuje vzduch, snižuje teplotu až o 5–10 °C bez použití ventilátorů",
  "Váže prach a zlepšuje kvalitu vzduchu a prostředí (např. v halách, dílnách, na stavbách)",
  "Zvyšuje komfort uživatelů, nízká spotřeba vody",
  "Bezúdržbový provoz, dlouhá životnost komponent, snadná údržba a demontáž",
  "Snadná demontáž a přesun – vhodné i jako mobilní zařízení",
  "Variabilita tvaru i rozměrů – přizpůsobení danému prostoru (stojanové, rámové, nástěnné řešení)",
  "Vhodné pro vnitřní i venkovní použití",
];

const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png";

export default function PremiumOasisSection() {
  return (
    <section className="relative bg-[#F8F9FA] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900 tracking-tight mb-5">Vzduch se právě proměnil v chladivou oázu</h2>
            <p className="font-sans text-lg text-slate-500 leading-relaxed">Ochlazení až o 10 °C. Adiabatické chlazení odparem — bez klimatizace a bez elektrické spotřeby.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative">
            <img src={DEVICE_IMG} alt="Mlžidlo v provozu" className="w-full rounded-2xl shadow-xl" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-24">
          {APPLICATIONS.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <Icon />
                <p className="font-mono text-xs text-slate-400 tracking-widest mt-4 mb-1">{app.num}</p>
                <h3 className="font-serif text-lg text-slate-900 mb-2">{app.title}</h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">{app.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 bg-white rounded-3xl border border-slate-200 p-8 lg:p-12">
          {ADVANTAGES.map((text, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="flex items-start gap-3">
              <CheckGlowIcon />
              <p className="font-sans text-sm md:text-base text-slate-600 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
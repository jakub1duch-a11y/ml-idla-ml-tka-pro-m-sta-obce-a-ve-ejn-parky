import React from "react";
import { motion } from "framer-motion";
import { HumidifyIcon, DustIcon, ShieldIcon, FrostIcon, SparkleIcon, CheckGlowIcon } from "@/components/home/premium/MistIcons";

const APPLICATIONS = [
{ icon: HumidifyIcon, num: "01", title: "Zvlhčení vzduchu", desc: "Ideální pro suché prostředí, skleníky a průmyslové provozy." },
{ icon: DustIcon, num: "02", title: "Odprašování", desc: "Mikrokapky vážou prach ve vzduchu — snížení prašnosti až o 85 %." },
{ icon: ShieldIcon, num: "03", title: "Odpuzování hmyzu", desc: "Vlhká clona snižuje výskyt komárů a much v okolí zahrádek a teras." },
{ icon: FrostIcon, num: "04", title: "Protimrazová ochrana", desc: "V zemědělství chrání citlivé květy před jarními mrazíky." },
{ icon: SparkleIcon, num: "05", title: "Efektní vzhled", desc: "Atmosférický oblak jako architektonický prvek pro eventy." }];

const ADVANTAGES = [
"Ochlazuje vzduch až o 5–10 °C bez použití ventilátorů",
"Váže prach a zlepšuje kvalitu vzduchu v halách i dílnách",
"Zvyšuje komfort uživatelů, nízká spotřeba vody",
"Bezúdržbový provoz, dlouhá životnost komponent",
"Snadná demontáž a přesun — vhodné i jako mobilní zařízení",
"Variabilita tvaru i rozměrů dle daného prostoru",
"Vhodné pro vnitřní i venkovní použití"];

const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png";

export default function BoldOasis() {
  return (
    <section className="relative bg-black py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-black tracking-[0.25em] uppercase text-red-600 mb-3">Adiabatické chlazení</p>
            <h2 className="text-4xl md:text-5xl text-white uppercase font-heading font-black tracking-tight mb-5">Vzduch se právě proměnil v chladivou oázu</h2>
            <p className="font-body text-lg text-white/60 leading-relaxed text-measure">Ochlazení až o 10 °C. Bez klimatizace a bez elektrické spotřeby.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative border-2 border-white/20">
            <img src={DEVICE_IMG} alt="Mlžidlo v provozu" className="w-full" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-0 border-t border-l border-white/15 mb-20">
          {APPLICATIONS.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 border-r border-b border-white/15">
                <Icon />
                <p className="font-body text-xs text-red-500 font-black tracking-widest mt-4 mb-1">{app.num}</p>
                <h3 className="font-heading font-black uppercase text-base text-white mb-2">{app.title}</h3>
                <p className="font-body text-sm leading-relaxed text-white/50">{app.desc}</p>
              </motion.div>);
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 border-2 border-white/20 p-8 lg:p-12">
          {ADVANTAGES.map((text, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }} className="flex items-start gap-3">
            <CheckGlowIcon />
            <p className="font-body text-sm md:text-base text-white/70 leading-relaxed">{text}</p>
          </motion.div>
          )}
        </div>
      </div>
    </section>);
}
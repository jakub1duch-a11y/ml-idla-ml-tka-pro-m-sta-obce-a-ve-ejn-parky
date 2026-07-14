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
"Vhodné pro vnitřní i venkovní použití"];

const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png";

export default function MinimalOasis() {
  return (
    <section className="relative bg-teal-50/40 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs tracking-[0.3em] uppercase text-teal-600 mb-4">Adiabatické chlazení</p>
            <h2 className="text-3xl md:text-5xl text-slate-900 font-heading font-extralight tracking-tight mb-5">Chladivá oáza bez elektřiny.</h2>
            <p className="font-body text-lg text-slate-500 leading-relaxed text-measure">Ochlazení až o 10 °C — bez klimatizace a bez elektrické spotřeby.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <img src={DEVICE_IMG} alt="Mlžidlo v provozu" className="w-full rounded-[2.5rem]" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-24">
          {APPLICATIONS.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}>
                <Icon />
                <p className="font-body text-xs text-teal-600 tracking-widest mt-4 mb-1">{app.num}</p>
                <h3 className="font-heading font-medium text-lg text-slate-900 mb-2">{app.title}</h3>
                <p className="font-body text-sm leading-relaxed text-slate-500">{app.desc}</p>
              </motion.div>);
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 bg-white rounded-[2rem] p-8 lg:p-14">
          {ADVANTAGES.map((text, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="flex items-start gap-3">
            <CheckGlowIcon />
            <p className="font-body text-sm md:text-base text-slate-600 leading-relaxed">{text}</p>
          </motion.div>
          )}
        </div>
      </div>
    </section>);
}
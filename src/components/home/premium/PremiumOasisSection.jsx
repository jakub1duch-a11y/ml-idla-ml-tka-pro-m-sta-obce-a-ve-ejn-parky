import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { HumidifyIcon, DustIcon, ShieldIcon, FrostIcon, SparkleIcon, CheckGlowIcon } from "./MistIcons";
import CircleDrawIcon from "@/components/common/CircleDrawIcon";
import AnimatedCounter from "@/components/common/AnimatedCounter";

const APPLICATIONS = [
{ icon: HumidifyIcon, num: "01", title: "Zvlhčení vzduchu", desc: "Ideální pro suché prostředí, skleníky a průmyslové provozy s citlivými procesy." },
{ icon: DustIcon, num: "02", title: "Odprašování", desc: "Mikrokapky vážou prach ve vzduchu — snížení prašnosti až o 85 %." },
{ icon: ShieldIcon, num: "03", title: "Odpuzování hmyzu", desc: "Vlhká clona snižuje výskyt komárů a much v okolí zahrádek a teras." },
{ icon: FrostIcon, num: "04", title: "Protimrazová ochrana", desc: "V zemědělství chrání citlivé květy před jarními mrazíky." },
{ icon: SparkleIcon, num: "05", title: "Efektní vzhled", desc: "Atmosférický oblak jako architektonický prvek — pro festivaly a event catering." }];


const ADVANTAGES = [
"Ochlazuje vzduch, snižuje teplotu až o 5–10 °C bez použití ventilátorů",
"Váže prach a zlepšuje kvalitu vzduchu a prostředí (např. v halách, dílnách, na stavbách)",
"Zvyšuje komfort uživatelů, nízká spotřeba vody",
"Bezúdržbový provoz, dlouhá životnost komponent, snadná údržba a demontáž",
"Snadná demontáž a přesun – vhodné i jako mobilní zařízení",
"Variabilita tvaru i rozměrů – přizpůsobení danému prostoru (stojanové, rámové, nástěnné řešení)",
"Vhodné pro vnitřní i venkovní použití"];


const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png";

export default function PremiumOasisSection() {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-34, 34]);
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 55, damping: 24, mass: 0.5 });

  return (
    <section className="relative bg-[#F8F9FA] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl text-slate-900 tracking-tight mb-5 [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal">Vzduch se právě proměnil v chladivou oázu</h2>
            <p className="font-body text-lg text-slate-500 leading-relaxed text-measure mb-6">Adiabatické chlazení odparem — bez klimatizace a bez elektrické spotřeby.</p>
            <p className="font-heading text-6xl md:text-7xl text-slate-900 tracking-tight">
              <AnimatedCounter to={10} prefix="-" suffix="°C" />
            </p>
            <p className="font-body text-xs text-slate-400 tracking-widest uppercase mt-2">Maximální ochlazení prostoru</p>
          </motion.div>
          <div ref={imgRef} className="relative overflow-hidden rounded-2xl">
            <motion.img
              style={{ y: smoothParallaxY, scale: 1.12 }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
              src={DEVICE_IMG} alt="Mlžidlo v provozu" className="w-full rounded-2xl shadow-xl" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-24">
          {APPLICATIONS.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <CircleDrawIcon delay={i * 0.08} size={56}>
                  <Icon />
                </CircleDrawIcon>
                <p className="font-body text-xs text-slate-400 tracking-widest mt-4 mb-1">{app.num}</p>
                <h3 className="font-heading text-lg text-slate-900 mb-2">{app.title}</h3>
                <p className="font-body text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{app.desc}</p>
              </motion.div>);

          })}
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 bg-white rounded-3xl border border-slate-200 p-8 lg:p-12">
          {ADVANTAGES.map((text, i) =>
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="flex items-start gap-3">
              <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 + 0.1, duration: 0.4 }}>
                <CheckGlowIcon />
              </motion.div>
              <p className="font-body text-sm md:text-base text-slate-600 leading-relaxed">{text}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
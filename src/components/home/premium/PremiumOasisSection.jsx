import React from "react";
import { motion } from "framer-motion";
import { CheckGlowIcon } from "./MistIcons";
import { NoPumpIcon, TemperatureDropIcon, MistMotionIcon, GroundScrewIcon, AtmosphereIcon, SmartAutomationIcon } from "./BenefitIcons";

const APPLICATIONS = [
  { icon: NoPumpIcon, num: "01", title: "Bez čerpadel", desc: "Přímé napojení na běžný vodovodní řad — bez vysokotlaké technologie." },
  { icon: TemperatureDropIcon, num: "02", title: "Ochlazení až o 10 °C", desc: "Jemná voda odebírá teplo ze vzduchu a rychle zpříjemní venkovní prostor." },
  { icon: MistMotionIcon, num: "03", title: "Mlha bez mokrého povrchu", desc: "Mikrokapky se odpaří ve vzduchu a zanechají po sobě příjemný chlad." },
  { icon: GroundScrewIcon, num: "04", title: "Zemní vrut do 30 min", desc: "Rychlé mobilní kotvení bez betonování a s možností snadného přesunu." },
  { icon: AtmosphereIcon, num: "05", title: "Efektní vzhled", desc: "Atmosférický oblak jako architektonický prvek pro terasy, festivaly a catering." },
  { icon: SmartAutomationIcon, num: "06", title: "Smart automatizace", desc: "Scénáře podle teploty, času i pohybu lidí šetří vodu a starosti." }];


const ADVANTAGES = [
"Ochlazuje vzduch, snižuje teplotu až o 5–10 °C bez použití ventilátorů",
"Jemná mlha se odpaří ve vzduchu a nezanechává mokrý povrch,",
"Zvyšuje komfort uživatelů, nízká spotřeba vody",
"Bezúdržbový provoz, dlouhá životnost komponent, snadná údržba a demontáž",
"Snadná demontáž a přesun – vhodné i jako mobilní zařízení",
"Variabilita tvaru i rozměrů – přizpůsobení danému prostoru (stojanové, rámové, nástěnné řešení)",
"Vhodné pro vnitřní i venkovní použití"];


const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png";

export default function PremiumOasisSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight mb-5">Ochlazení navržené jako součást prostoru.</h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed text-measure">Jemná mlha snižuje pocitovou teplotu až o 10 °C. Bez klimatizace, bez elektrické spotřeby a bez mokrého povrchu.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative">
            <img src={DEVICE_IMG} alt="Mlžidlo v provozu" className="w-full rounded-2xl shadow-xl" />
          </motion.div>
        </div>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {APPLICATIONS.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className="border-t border-border pt-6">
                <motion.div initial={{ opacity: 0, scale: 0.6, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.1, duration: 0.55 }} className="text-secondary">
                  <Icon />
                </motion.div>
                <p className="font-mono text-xs text-muted-foreground tracking-widest mt-5 mb-1">{app.num}</p>
                <h3 className="font-heading text-xl text-foreground mb-2">{app.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{app.desc}</p>
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
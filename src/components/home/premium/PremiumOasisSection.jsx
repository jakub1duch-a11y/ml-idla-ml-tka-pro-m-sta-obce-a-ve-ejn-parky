import React from "react";
import { motion } from "framer-motion";
import { NoPumpIcon, TemperatureDropIcon, MistMotionIcon, GroundScrewIcon, AtmosphereIcon, SmartAutomationIcon } from "./BenefitIcons";

const APPLICATIONS = [
{ icon: NoPumpIcon, num: "01", title: "Bez vysokotlakého čerpadla", desc: "Nízkotlaká mlha přímo z běžného vodovodního řadu — bez samostatné vysokotlaké technologie." },
{ icon: TemperatureDropIcon, num: "02", title: "Pocitové ochlazení až o 5–10 °C", desc: "Jemná mlha pomáhá v horkých dnech snížit tepelnou zátěž a zpříjemnit pobyt v okolí mlžítka." },
{ icon: MistMotionIcon, num: "03", title: "Jemná mlha s minimálním smáčením", desc: "Správně navržené mikrokapky se rychle odpařují a ochlazují vzduch dříve, než dopadnou na okolní povrchy." },
{ icon: GroundScrewIcon, num: "04", title: "Zemní vrut do 30 min", desc: "Rychlé mobilní kotvení bez betonování s možností snadného přesunu." },
{ icon: AtmosphereIcon, num: "05", title: "Součást architektury", desc: "Mlžný oblak jako funkční prvek pro městská prostranství, terasy, hotely i zahrady." },
{ icon: SmartAutomationIcon, num: "06", title: "Smart řízení provozu", desc: "Spouštění podle času, teploty nebo provozního režimu pomáhá omezit zbytečnou spotřebu vody." }];


const ADVANTAGES = [
"Ochlazuje vzduch, snižuje teplotu až o 5–10 °C bez použití ventilátorů",
"Jemná mlha se odpaří ve vzduchu a nezanechává mokrý povrch",
"Zvyšuje komfort uživatelů, nízká spotřeba vody",
"Bezúdržbový provoz, dlouhá životnost komponent, snadná údržba a demontáž",
"Snadná demontáž a přesun – vhodné i jako mobilní zařízení",
"Variabilita tvaru i rozměrů – přizpůsobení danému prostoru",
"Vhodné pro vnitřní i venkovní použití"];


const DEVICE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png';

export default function PremiumOasisSection() {
  return (
    <section className="relative overflow-hidden bg-background pb-14 pt-16 sm:pb-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-16 grid items-center gap-8 sm:mb-20 sm:gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="mb-4 font-heading text-[clamp(2rem,8vw,2.6rem)] leading-[1.08] tracking-[-0.035em] text-foreground sm:mb-5 md:text-4xl">Ochlazení, které do prostoru patří.</h2>
            <p className="text-measure font-body text-base leading-7 text-muted-foreground sm:text-lg sm:leading-relaxed">Jemná mlha snižuje pocitovou teplotu až o 10 °C. Nízkotlaké řešení na běžný vodovodní řad, bez čerpadla, s chytrým řízením provozu.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative">
            <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/542c4e977_mlzitka-mesto-polna.webp" alt="Moderní nerezová mlžná brána instalovaná na náměstí" className="w-full rounded-2xl shadow-xl" />
          </motion.div>
        </div>

        <div className="grid gap-x-8 gap-y-8 sm:gap-y-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
          {APPLICATIONS.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.48 }} className="border-t border-border pt-5 sm:pt-6">
                <div className="mb-2 text-secondary"><Icon /></div>
                
                <h3 className="mb-2 text-xl font-bold leading-tight text-foreground [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] sm:text-2xl">{app.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{app.desc}</p>
              </motion.div>);

          })}
        </div>

        






        
      </div>
    </section>);

}
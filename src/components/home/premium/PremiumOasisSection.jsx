import React from "react";
import { motion } from "framer-motion";
import { CheckGlowIcon } from "./MistIcons";
import { NoPumpIcon, TemperatureDropIcon, MistMotionIcon, GroundScrewIcon, AtmosphereIcon, SmartAutomationIcon } from "./BenefitIcons";

const APPLICATIONS = [
{ icon: NoPumpIcon, num: "01", title: "Bez čerpadel", desc: "Přímé napojení na běžný vodovodní řad — bez vysokotlaké technologie." },
{ icon: TemperatureDropIcon, num: "02", title: "Ochlazení až o 10 °C", desc: "Jemn\xE1 voda odeb\xEDr\xE1 teplo ze vzduchu rychle zp\u0159\xEDjemn\xED venkovn\xED prostor." },
{ icon: MistMotionIcon, num: "03", title: "Mlha bez mokrého povrchu", desc: "Mikrokapky se odpa\u0159\xED ve vzduchu zanechaj\xED po sob\u011B p\u0159\xEDjemn\xFD chlad." },
{ icon: GroundScrewIcon, num: "04", title: "Zemní vrut do 30 min", desc: "Rychl\xE9 mobiln\xED kotven\xED bez betonov\xE1n\xED s mo\u017Enost\xED snadn\xE9ho p\u0159esunu." },
{ icon: AtmosphereIcon, num: "05", title: "Součást architektury", desc: "Ml\u017En\xFD oblak jako funk\u010Dn\xED prvek pro m\u011Bstsk\xE1 prostranstv\xED, terasy, hotely zahrady." },
{ icon: SmartAutomationIcon, num: "06", title: "Smart automatizace", desc: "Sc\xE9n\xE1\u0159e podle teploty, \u010Dasu i pohybu lid\xED \u0161et\u0159\xED vodu starosti." }];


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
    <section className="relative overflow-hidden bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-24 grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="mb-5 font-heading text-4xl tracking-tight text-foreground md:text-5xl">Ochlazení navržené jako součást prostoru.</h2>
            <p className="text-measure font-body text-lg leading-relaxed text-muted-foreground">Jemná mlha snižuje pocitovou teplotu až o 10 °C. Bez klimatizace, bez elektrické spotřeby a bez mokrého povrchu.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative">
            <img src={DEVICE_IMG} alt="Moderní nerezová mlžná brána instalovaná na náměstí" className="w-full rounded-2xl shadow-xl" />
          </motion.div>
        </div>

        <div className="mb-24 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {APPLICATIONS.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.div key={app.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.6 }} className="border-t border-border pt-6">
                <div className="text-secondary px-6 sizex1"><Icon /></div>
                <p className="mb-1 mt-5 tracking-widest text-[#a8a8a8] [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-light text-2xl">{app.num}</p>
                <h3 className="mb-2 text-foreground [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold text-2xl">{app.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{app.desc}</p>
              </motion.div>);

          })}
        </div>

        






        
      </div>
    </section>);

}
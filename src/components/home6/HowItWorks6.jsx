import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const STEPS = [
  { n: '01', title: 'Konzultace a návrh', points: ['Probereme vaše potřeby a prostor.', 'Navrhneme optimální řešení mlžení.', 'Připravíme cenovou nabídku do 24 h.'] },
  { n: '02', title: 'Zakázková výroba', points: ['Sochy vyrábíme na míru z nerezi.', 'Kontrola kvality na každém kroku.', 'Výroba trvá 6–8 týdnů.'] },
  { n: '03', title: 'Instalace a servis', points: ['Montáž provede certifikovaný technik.', 'Zprovoznění a zaškolení na místě.', 'Servis a údržba i po instalaci.'] },
];

const IMG = 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop';

export default function HowItWorks6() {
  return (
    <section className="bg-slate-50 py-24 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-sm font-semibold text-violet-600 mb-4">Jak to funguje</p>
            <h2 className="font-heading font-light text-slate-900 tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Od nápadu k realizaci<br />bez kompromisů.
            </h2>
          </div>
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full w-fit transition-colors">
            Nezávazná poptávka
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-7">
              <p className="text-xs font-semibold text-violet-600 mb-3">{s.n}</p>
              <h3 className="font-heading font-medium text-lg text-slate-900 mb-4">{s.title}</h3>
              <ul className="space-y-2.5">
                {s.points.map((pt) => (
                  <li key={pt} className="text-sm text-slate-500 leading-relaxed flex gap-2">
                    <span className="w-1 h-1 rounded-full bg-violet-400 mt-2 shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-14 relative rounded-3xl overflow-hidden aspect-[21/9]">
          <img src={IMG} alt="Mlžení pro každý prostor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-white text-xl font-heading font-medium">Mlžení pro každý prostor</p>
            <p className="text-white/60 text-sm mt-1">Zahrady, terasy, eventy i průmyslové haly.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Jak se stavíme k dílu',
    subtitle: 'Každá socha je originál',
    desc: 'Vycházíme z vašeho prostoru a vaší představy. Navrhujeme tvar, výšku, rozmístění trysek. Kresba na papíře se mění v přesný technický výkres. Spolupracujeme s architekty, urbanisty i soukromými zákazníky.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/cd4514b7c_kontura-mlzitko.png',
  },
  {
    num: '02',
    title: 'Kvalita materiálů',
    subtitle: 'Nerezová ocel AISI 304',
    desc: 'Broušený saténový povrch. Odolné vůči korozí, UV záření a mrazu. Materiál třídy AISI 304, standardně používaný v potravinářském průmyslu — maximální hygienická bezpečnost.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/f617f917e_img-3531.jpeg',
  },
  {
    num: '03',
    title: 'Zaručená spokojenost',
    subtitle: 'Testování a kontrola',
    desc: 'Každá socha je testována před dodáním. Tlakový test, vizuální kontrola, nastavení trysek. 100 % spokojených klientů — kladné hodnocení všech dokončených instalací.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/9408bab1c_img-3558.jpeg',
  },
  {
    num: '04',
    title: 'Instalace & zprovoznění',
    subtitle: 'Montáž za jeden den',
    desc: 'Standardní instalace trvá jeden den. Zemní vrut nebo chemické kotvy, přivedení vody, nastavení tlaku a trysek. Předáme vás s plně funkčním systémem.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/99b1a09ec_img-5153.jpeg',
  },
  {
    num: '05',
    title: 'Zábava a osvěžení',
    subtitle: 'Výsledek, který přitahuje lidi',
    desc: 'Mlžná socha přitahuje lidi. Děti, rodiny, návštěvníci — všichni hledají osvěžení v horkých dnech. Váš prostor se stane místem, kam se lidé vrací.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/92361308a_img-3531.jpeg',
  },
];

const faqs = [
  { q: 'Kolik mlžítko stojí?', a: 'Cena závisí na modelu a velikosti instalace. Mlhoviště START začíná od 48 000 Kč, individuální mlžné sochy od 15 000 Kč. Kontaktujte nás pro přesnou nabídku.' },
  { q: 'Jaká je spotřeba vody?', a: 'Při provozu 5 trysek je spotřeba méně než 10 l/h. Pro srovnání — standardní zahradní hadice spotřebuje 600–1000 l/h. Mlžítko je extrémně úsporné.' },
  { q: 'Funguje i bez elektřiny?', a: 'Základní varianta funguje pouze na vodovodní tlak bez elektřiny. Smart Control modul vyžaduje 230V nebo bateriové napájení pro WiFi řízení.' },
  { q: 'Co potřebuji k instalaci?', a: 'Přípojka vody G3/4" s tlakem 2–6 bar a možnost kotvení (trávník = zemní vrut, beton = chemické kotvy). To je vše. Vše ostatní zajistíme my.' },
  { q: 'Kam se mlžítko hodí?', a: 'Parky, zahrady, náměstí, dětská hřiště, zoo, koupaliště, terasy restaurací, festivaly. Kdekoliv, kde lidé tráví čas v horkém počasí.' },
];

export default function JakToFunguje() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="relative bg-ink py-20 lg:py-32 overflow-hidden">
        <img src="https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/2f6b1e705_videoframe_7589.png"
          alt="Mlžná socha" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Technologie mlžení</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight leading-tight">
            Jak jemné trysky<br />tvoří mlhovinu
          </h1>
          <p className="mt-5 text-white/40 max-w-xl">
            Nerezové mlžítko v provozu — mikrotrysky vytvářejí souvislou vodní tříšť a chladivou mlhovinu.
          </p>
        </div>
      </div>

      {/* Physics */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Fyzika mlžení</p>
              <h2 className="font-heading font-light text-3xl lg:text-5xl text-ink tracking-tight">
                Evaporace — přirozené chlazení
              </h2>
              <p className="mt-6 text-ink/50 text-base leading-relaxed">
                Mikrotrysky produkují kapky 10–50 μm. Tak malé kapky se odpařují okamžitě ve vzduchu — absorbují teplo z okolí a ochlazují prostor až o 10 °C.
              </p>
              <div className="mt-10 space-y-5">
                {[
                  { title: 'Kapky 10–50 μm', desc: 'Odpařují se dříve, než dopadnou na zem. Žádný mokrý povrch.' },
                  { title: 'Ochlazení –10 °C', desc: 'Evaporace absorbuje teplo z okolního vzduchu.' },
                  { title: 'Čistší vzduch', desc: 'Snižuje prach a pylové částice v okolí.' },
                ].map(f => (
                  <div key={f.title} className="border-l-2 border-hydro pl-5">
                    <p className="font-heading text-ink font-medium">{f.title}</p>
                    <p className="text-sm text-ink/50 mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src="https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/a94dc72e7_img-4513.jpeg"
                alt="Detail mikrotrysky" className="w-full aspect-square object-cover" />
              <p className="font-mono text-[9px] text-ink/30 tracking-widest uppercase mt-2">
                Detail mikrotrysky · Nízkotlaká tryska · kapky 10–50 μm · průtok 0,05 l/min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="bg-fog py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Proces</p>
          <h2 className="font-heading font-light text-3xl lg:text-5xl text-ink mb-14">Od nápadu k instalaci</h2>

          <div className="space-y-1">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-0 bg-white border border-steel/30">
                <div className="md:col-span-1 p-8 border-b md:border-b-0 md:border-r border-steel/30 flex items-start">
                  <span className="font-mono text-5xl text-ink/10 font-bold">{step.num}</span>
                </div>
                <div className="md:col-span-2 p-8">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-2">{step.subtitle}</p>
                  <h3 className="font-heading text-xl text-ink font-light">{step.title}</h3>
                  <p className="text-sm text-ink/50 mt-3 leading-relaxed">{step.desc}</p>
                </div>
                <div className="md:col-span-2 overflow-hidden">
                  <img src={step.image} alt={step.title} className="w-full h-48 md:h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart app */}
      <div className="bg-ink text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Smart řízení</p>
            <h2 className="font-heading font-light text-4xl lg:text-5xl tracking-tight leading-tight">
              Inteligentní řízení<br />podle teploty.
            </h2>
            <p className="mt-5 text-white/40 text-sm leading-relaxed">
              Mobilní aplikace HolmTec (iOS & Android). Automatické scénáře — mlha se spustí sama, když je nejpotřebnější. Sdílení přístupu pro správce areálu.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-5">
              {[
                { val: 'WiFi + BT', label: 'Připojení' },
                { val: 'Automaticky', label: 'Spouštění' },
                { val: 'iOS & Android', label: 'Aplikace' },
                { val: 'Teplota / Vlhkost', label: 'Snímače' },
              ].map(s => (
                <div key={s.val} className="border-l border-white/10 pl-4">
                  <p className="font-heading text-white text-lg font-light">{s.val}</p>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <img src="https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/35fb7e76f_ht-display2.jpg"
            alt="HolmTec Smart App" className="w-full aspect-[4/3] object-cover" />
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Časté otázky</p>
          <h2 className="font-heading font-light text-3xl text-ink mb-10">FAQ</h2>
          <div className="divide-y divide-steel/40">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4">
                  <span className="font-heading text-ink font-light">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-ink/30 flex-shrink-0" /> : <ChevronDown size={16} className="text-ink/30 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-ink/50 mt-3 leading-relaxed">
                    {faq.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/kontakt" className="inline-block px-10 py-4 bg-ink text-white text-xs font-mono tracking-widest uppercase hover:bg-ink/80 transition-all">
              Napište nám
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Jak se stavíme k dílu',
    subtitle: 'Každé mlžítko je originál',
    desc: 'Vycházíme z vašeho prostoru a vaší představy. Navrhujeme tvar, výšku, rozmístění trysek. Kresba na papíře se mění v přesný technický výkres. Spolupracujeme s architekty, urbanisty i soukromými zákazníky.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/d738bb441_holmtec_DPSvizualizace-1.jpg',
  },
  {
    num: '02',
    title: 'Kvalita materiálů',
    subtitle: 'Nerezová ocel AISI 304',
    desc: 'Broušený saténový povrch. Odolné vůči korozí, UV záření a mrazu. Materiál třídy AISI 304, standardně používaný v potravinářském průmyslu — maximální hygienická bezpečnost.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/39c506f5b_891c5179a_Social_Media_Video_Ads_A_curved_metallic_pipe_speckled_with_glistening_1_-N3ABn.png',
  },
  {
    num: '03',
    title: 'Zaručená spokojenost',
    subtitle: 'Testování a kontrola',
    desc: 'Každé mlžítko je testováno před dodáním. Tlakový test, vizuální kontrola, nastavení trysek. 100 % spokojených klientů — kladné hodnocení všech dokončených instalací.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg',
  },
  {
    num: '04',
    title: 'Instalace & zprovoznění',
    subtitle: 'Montáž mlžítka za jeden den',
    desc: 'Standardní instalace trvá jeden den. Zemní vrut nebo chemické kotvy, přivedení vody, nastavení tlaku a trysek. Mlžítko předáme s plně funkčním systémem.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
  },
  {
    num: '05',
    title: 'Zábava a osvěžení',
    subtitle: 'Výsledek, který přitahuje lidi',
    desc: 'Mlžná socha přitahuje lidi. Děti, rodiny, návštěvníci — všichni hledají osvěžení v horkých dnech. Váš prostor se stane místem, kam se lidé vrací.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
];

const faqs = [
  { q: 'Kolik mlžítko stojí?', a: 'Cena závisí na modelu a velikosti instalace. Mlhoviště START začíná od 48 000 Kč, individuální mlžné sochy od 15 000 Kč. Kontaktujte nás pro přesnou nabídku.' },
  { q: 'Kolik mlžítko spotřebuje vody?', a: 'Průměrná spotřeba je 6–10 litrů za hodinu pro standardní mlžné sochy a 8–20 litrů pro mlhoviště. To je přibližně 8–15× méně než klimatizace.' },
  { q: 'Potřebuji stavební povolení?', a: 'Pro dočasné instalace mlžítka (zemní vrut) zpravidla není potřeba. Pro trvalé instalace do betonového základu doporučujeme konzultaci s místním stavebním úřadem.' },
  { q: 'Jak funguje Smart ovládání mlžítek?', a: 'WiFi modul se připojí k vaší domácí síti. Přes aplikaci SUPLA (iOS/Android) nastavíte automatické spouštění podle teploty, časovače nebo manuálně odkudkoli.' },
  { q: 'Jaká je záruka?', a: 'Na konstrukci z nerezové oceli poskytujeme záruku. Servis a náhradní díly zajišťujeme dlouhodobě.' },
];

export default function JakToFunguje() {
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { setSEO(SEO_PAGES.jakToFunguje); }, []);

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Hero */}
      <div className="relative overflow-hidden bg-slate-900">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
          <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f17970686_video_20260619_162927.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-3">Technologie mlžení</p>
            <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-4">
              Jak to funguje
            </h1>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              Věda za mlhou. Fyzika evaporace v praxi — nejpřirozenější chlazení na světě.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Physics section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Fyzika za mlhou</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-6">
              Mikromlha.<br />Maximální efekt.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Tlaková mlha bez mokrého povrchu. Mikrotrysky produkují kapky 10–50 μm, které se odpařují okamžitě ve vzduchu — absorbují teplo z okolí a ochlazují prostor až o 9 °C.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Evaporace', desc: 'Kapky 10–50 μm se odpařují dříve, než dopadnou na zem. Žádný mokrý povrch.' },
                { title: 'Inteligentní řízení', desc: 'Automatické scénáře — mlha se spustí sama při 28 °C. Aplikace iOS & Android.' },
                { title: 'Tichý provoz', desc: 'Nízkotlaké trysky. Průtok 0,05 l/min na trysku. Provoz je přirozený a nenásilný.' },
                { title: 'Čistší vzduch', desc: 'Mlha snižuje prach a pylové částice v okolí. Zdravé prostředí.' },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-0.5 bg-slate-900 flex-shrink-0 rounded-full" />
                  <div>
                    <p className="font-bold text-slate-900">{f.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png"
              alt="Detail mikrotrysky" className="w-full aspect-square object-cover rounded-2xl border border-slate-200" />
            <div className="mt-3 p-6 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-6">
              {[
                { val: '93%', label: 'Provozní efektivita' },
                { val: '100%', label: 'Spokojení klienti' },
                { val: '< 10 l/h', label: 'Spotřeba vody' },
                { val: '10+ let', label: 'Životnost oceli' },
              ].map(s => (
                <div key={s.val}>
                  <p className="font-black text-2xl text-slate-900">{s.val}</p>
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="font-heading font-light text-3xl text-slate-900 mb-12">Od návrhu k instalaci</h2>
        <div className="space-y-5">
          {steps.map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="lg:col-span-1 flex items-center gap-4">
                  <span className="font-black text-4xl text-slate-200 font-mono">{step.num}</span>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1">{step.subtitle}</p>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                <div className="lg:col-span-2">
                  <img src={step.image} alt={step.title} className="w-full aspect-[16/9] object-cover rounded-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart App */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Smart aplikace</p>
            <h2 className="font-heading font-light text-3xl text-slate-900 mb-4">Mlžení z mobilu</h2>
            <p className="text-slate-500 mb-6">WiFi+Bluetooth ovládání mlžítka dálkově přes aplikaci. Automatická aktivace mlžení dle teploty, skupinové scény, vodní monitoring.</p>
            <Link to="/kontakt"
              className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
              Zjistit více <ArrowRight size={16} />
            </Link>
          </div>
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png"
            alt="Smart App - mlžítka" className="w-full aspect-[4/3] object-cover rounded-2xl border border-slate-200" />
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="font-heading font-light text-3xl text-slate-900 mb-8 text-center">Časté dotazy</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-slate-100 transition-all">
                <span className="font-bold text-slate-900">{faq.q}</span>
                <ChevronDown size={18} className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-6 pb-6">
                  <p className="text-slate-500 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/kontakt"
            className="btn-metallic-mist px-8 py-4 text-sm font-bold">
            Napsat nám <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
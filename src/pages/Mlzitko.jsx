import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, Thermometer, Layers, Waves, Wrench, Wifi, Shield, CheckCircle2, Download, FileText } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const TECH_SPECS = [
  { label: 'Materiál', value: 'Nerezová ocel AISI 316L', icon: Layers },
  { label: 'Trysky', value: 'AISI 316L, kapičky 10–50 μm', icon: Waves },
  { label: 'Provozní tlak', value: '2–7 bar', icon: Gauge },
  { label: 'Spotřeba vody', value: '4–15 l/h dle modelu', icon: Droplets },
  { label: 'Ochlazení prostoru', value: 'až −9 °C', icon: Thermometer },
  { label: 'Smart ovládání', value: 'Wi-Fi / Bluetooth App', icon: Wifi },
];

const BENEFITS = [
  { title: 'Potravinářská nerezová ocel', desc: 'Veškeré mlžítka jsou vyráběna z nerezové oceli AISI 316L — odolné vůči korozi, UV záření a mrazu. Bez nátěrů, bez chemikálií.' },
  { title: 'Evaporativní chlazení', desc: 'Mikrotrysky rozprašují kapičky 10–50 μm, které se okamžitě odpařují ve vzduchu. Žádné mokré chodníky — jen příjemný chlad.' },
  { title: 'Zakázková výroba na míru', desc: 'Každé mlžítko vzniká na zakázku. Tvar, výška, počet trysek, povrchová úprava — vše přizpůsobíme vašemu prostoru a projektu.' },
  { title: 'Chytré Smart ovládání', desc: 'Volitelný Wi-Fi / Bluetooth modul umožňuje ovládání z mobilní aplikace, automatizaci dle teploty, vlhkosti a denní doby.' },
  { title: 'Jednoduchos instalace', desc: 'Standardní instalace chemickými kotvami nebo zemním vrutem za jeden den. Napojení na běžný vodovodní řad (min. 2–3 bar).' },
  { title: '24 měsíců záruka', desc: 'Na všechny mlžné sochy a mlžítka poskytujeme standardní záruční dobu s rychlým záručním i pozáručním servisem.' },
];

const GALLERY_IMAGES = [
  '/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/72a6bb588_mlnprvek-mrak-mlzidla02.png',
  'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e7273f60a_bendy60-mlitkozahradn.png',
  '/media/optimized/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.webp',
  '/media/optimized/fbcf274b1_FB_IMG_1782148331764.webp',
];

const INSTALL_STEPS = [
  { num: '01', title: 'Příprava podkladu', desc: 'Výkop min. 70×50×50 cm, zhutněná vrstva štěrku, betonová deska C25/30. Příprava rozvodu vody a případné elektroinstalace.' },
  { num: '02', title: 'Osazení patky', desc: 'Nerezová patka kotevními závitovými tyčemi M12–M16 do chemických kotev. Vyrovnání vodováhou ve všech směrech.' },
  { num: '03', title: 'Napojení vody', desc: 'Napojení na vodovodní řad (zahradní hadice nebo potrubí do 1"). Minimální tlak 2–3 bar. Filtr proti nečistotám.' },
  { num: '04', title: 'Instalace mlžítka', desc: 'Upevnění mlžítka na patku nerezovými šrouby, nastavení trysek, tlakový test. Standardně za jeden den.' },
];

const DOCS = [
  { title: 'Přípravné práce pro instalaci', desc: 'Kompletní průvodce stavební přípravou, výkopy, betonáží a rozvodem vody.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/b704ccfab_Ppravnprceproinstalacimltka.pdf', category: 'Instalace' },
  { title: 'Detaily ocelového mlžítka', desc: 'Technické výkresy pat, průřezů a šachet. DET.1–3, měřítko 1:10.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/f23bec143_DETAILY_OCELOVEHO_MLZITKA.pdf', category: 'Výkres' },
  { title: 'Manuál údržby trysky typ M', desc: 'Postup čištění a demontáže mlžící trysky. 5 komponentů, klíč č. 14.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/6fcaf7525_tryska.pdf', category: 'Manuál' },
  { title: 'Chytré ovládání — prospekt', desc: 'Funkce Smart App řízení, automatizace, senzory, Supla Cloud integrace.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/681f0619c_Chytreovladani.pdf', category: 'Smart' },
];

const CATEGORY_COLORS = {
  'Instalace': 'text-amber-600 bg-amber-50 border-amber-200',
  'Výkres': 'text-blue-600 bg-blue-50 border-blue-200',
  'Manuál': 'text-slate-600 bg-slate-100 border-slate-200',
  'Smart': 'text-violet-600 bg-violet-50 border-violet-200',
};

export default function Mlzitko() {
  useEffect(() => {
    setSEO({
      title: 'Mlžítko — designová mlžná socha z nerezové oceli | Mlžidla.cz',
      description: 'Mlžítka a mlžné sochy z nerezové oceli AISI 316L. Zakázková výroba, Smart Wi-Fi ovládání, ochlazení až −9 °C. Pro náměstí, parky, zahrady a eventy.',
      keywords: 'mlžítko, mlžná socha, mlžné sochy, nerezová ocel, mlžení, ochlazení, mlžidla',
      canonicalPath: '/mlzitko',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <div className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp"
            alt="Mlžná socha OSTEV v parku"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-36 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/25 text-white text-xs font-mono tracking-widest uppercase rounded-full mb-6">
              Zakázková výroba z nerezové oceli AISI 316L
            </span>
            <h1 className="font-heading font-light text-5xl sm:text-6xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-6">
              Mlžítko
            </h1>
            <p className="text-white/70 text-xl font-light leading-relaxed max-w-xl mb-8">
              Designové mlžné sochy, brány a mlhoviště z nerezové oceli. Ochlazení až −9 °C, chytré ovládání, zakázková výroba.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Nezávazná poptávka <ArrowRight size={16} />
              </Link>
              <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all">
                Zobrazit celou kolekci
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { val: 'AISI 316L', label: 'Materiál' },
              { val: '10–50 μm', label: 'Kapičky mlhy' },
              { val: '2–7 bar', label: 'Provozní tlak' },
              { val: '−9 °C', label: 'Ochlazení prostoru' },
              { val: '4–15 l/h', label: 'Spotřeba vody' },
              { val: '6–8 týdnů', label: 'Výroba na míru' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <p className="font-heading font-light text-xl lg:text-2xl text-slate-900 mb-1">{s.val}</p>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Co je to mlžítko</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-5">
              Designová mlžná socha,<br /><span className="text-slate-400 italic font-extralight">která chladí i okouzluje.</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Mlžítko je architektonický prvek z nerezové oceli s integrovanými mlžícími tryskami. Pomocí principu evaporace (odpařování) vytváří jemnou mlhovou clonu, která ochlazuje okolní vzduch až o 9 °C bez mokrého povrchu.
            </p>
            <p className="text-slate-500 leading-relaxed mb-6">
              Tlak 2–7 bar rozptyluje vodu na mikrokapičky 10–50 μm, které se okamžitě odpařují ve vzduchu — absorbují teplo z okolí. Výsledkem je přirozené, ekologické a esteticky přitažlivé chlazení veřejného prostoru.
            </p>
            <ul className="space-y-2">
              {['Bez chemikálií — pouze čistá voda', 'Tichý provoz, žádný hluk', 'Potravinářská nerez — bezpečné pro děti', 'Nízká spotřeba vody vs. klimatizace'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={15} className="text-slate-700 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-2 gap-3">
              {GALLERY_IMAGES.slice(0, 4).map((img, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-square'}`}>
                  <img src={img} alt={`Mlžítko ukázka ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* TECH SPECS */}
      <div className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Technické parametry</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Specifikace mlžítek</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TECH_SPECS.map((spec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                  <spec.icon size={20} className="text-slate-700" />
                </div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                <p className="font-heading font-medium text-slate-900 text-lg">{spec.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Proč mlžítko</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Výhody mlžení</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-sm transition-all">
              <h3 className="font-heading font-medium text-slate-900 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* INSTALLATION */}
      <div className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Instalace</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Jak probíhá instalace</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INSTALL_STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200">
                <p className="text-4xl font-black text-slate-100 font-mono mb-4">{step.num}</p>
                <h3 className="font-heading font-medium text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
            <Wrench size={18} className="text-slate-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500 leading-relaxed">
              <strong className="text-slate-900">Rozvod vody:</strong> napojení na vodovodní řad (zahradní hadice nebo potrubí do 1"), min. tlak 2–3 bar. Pro Smart ventil zajistěte 230 V AC nebo 12 V DC poblíž patky, voděodolnou krabičku IP65.
            </p>
          </div>
        </div>
      </div>

      {/* VIDEO */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Mlžítka v akci</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Videa z reálných instalací</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/bdb338033_EFC9FCE8-7138-44C3-AAE6-246F88644813.MOV',
            'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/b0171e69d_AF599DD3-EFF1-43AB-B6AB-40C8B869039F.MOV',
            'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/66dd73724_1283CEC3-EA3F-42B3-9E58-3788630B07A6.MOV',
            'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/1d1271290_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.MOV',
          ].map((url, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <video src={url} controls playsInline className="w-full aspect-video bg-black" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* DOWNLOADS */}
      <div className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Ke stažení</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Technická dokumentace</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOCS.map((doc, i) => (
              <motion.a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border mb-1 ${CATEGORY_COLORS[doc.category]}`}>{doc.category}</span>
                  <p className="text-slate-900 font-medium text-sm">{doc.title}</p>
                  <p className="text-slate-400 text-xs font-light truncate">{doc.desc}</p>
                </div>
                <Download size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 mb-4">Váš prostor si zaslouží mlžítko</h2>
          <p className="text-slate-500 font-light leading-relaxed mb-8">
            Konzultace zdarma, 3D vizualizace do 48 h, odpovídáme do 24 h.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/poptavka" className="btn-metallic-mist px-8 py-4 text-sm font-bold">
              Nezávazná poptávka <ArrowRight size={16} />
            </Link>
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-100 transition-all">
              Celá kolekce mlžítek
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
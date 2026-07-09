import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Mail, Phone, Shield, Zap, Award, Factory, Droplets, Palette } from 'lucide-react';
import { useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';

const IMAGES = {
  mlzitko: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7f4a5f5e4_mlznsloup-sprh.png',
  vyroba: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9e7f44e1b_zdilnymlzitek.png',
  mlzitek: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a246fd133_zvyrobymlzitek.png',
  mlzitka: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/d0e6e1a1a_mlzitka-mlzicizonyhriste.jpg',
  playground: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8860437ac_bc30fe8d-c09c-49a2-9023-0795b982f456.png',
  mrak: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/22ead7299_Mrak-oblak-mlzitko.jpeg',
  hvezda: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3e92a8289_mlzitkovetvruhvezdy.jpg'
};

export default function ONas() {
  useEffect(() => {setSEO(SEO_PAGES.oNas);}, []);
  return (
    <div className="min-h-screen bg-ink">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <video src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/7b873e727_Hero_Video.mp4"
          className="w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">O SPOLEČNOSTI</p>
              <h1 className="font-heading text-4xl lg:text-6xl text-white leading-tight mb-0" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
                Příběh HolmTec
              </h1>
              <p className="text-white/60 text-lg mt-3 max-w-xl font-light">
                Od precizní výroby pro automotive k umění, které osvěží města - Mlžítka, Mlžidla.cz.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── SEKCE 1: KOŘENY ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <Factory size={18} className="text-cyan" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/40">Naše kořeny</p>
            </div>
            <h2 className="text-white mb-6" style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Průmyslová přesnost<br />
              <span style={{ fontStyle: 'italic' }}>a automotive</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-light mb-6">
              Začátky naší společnosti jsou pevně spjaty s náročnou strojírenskou výrobou. Již více než 22 let se věnujeme preciznímu zpracování a 3D CNC ohýbání nerezových trubek. Naše technologie a hluboké know-how původně sloužily především automobilovému průmyslu.
            </p>
            <p className="text-white/60 text-base leading-relaxed font-light">
              Vyráběli jsme množství specializovaných nástrojů pro automobilové hadice a přesně tvarované nerezové trubky pro klimatizační a chladicí systémy vozidel. Během těchto let jsme se naučili pracovat s naprostou přesností a klást maximální důraz na kvalitu, odolnost a dlouhou životnost materiálů.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src={IMAGES.vyroba} alt="Výroba HolmTec" className="w-full aspect-[3/4] object-cover rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── SEKCE 2: ZROZENÍ MYŠLENKY ────────────────────── */}
      <section className="bg-surface border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={IMAGES.sdileny} alt="Sdílené mlžítko" className="w-full aspect-[4/3] object-cover rounded-2xl" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <Droplets size={18} className="text-cyan" />
                </div>
                <p className="text-xs font-mono tracking-widest uppercase text-white/40">Zrození myšlenky</p>
              </div>
              <h2 className="text-white mb-6" style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                Know-how ve službách<br />
                <span style={{ fontStyle: 'italic' }}>veřejného prostoru</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed font-light mb-6">
                S postupným nárůstem letních teplot a přehříváním městských aglomerací jsme si položili klíčovou otázku: Jak bychom mohli naši technologii ohýbání nerezu využít k tomu, abychom pomohli lidem a oživili rozpálené ulice?
              </p>
              <p className="text-white/60 text-base leading-relaxed font-light">
                Rozhodli jsme se naše bohaté zkušenosti s chladicími systémy z automotive přetavit do zcela nového a užitečného konceptu. Tak vznikla naše funkční nerezová mlžítka — „mlžné sochy - Mlžidla.cz".
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SEKCE 3: STATS ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
          { val: '22+', label: 'let zkušeností' },
          { val: '20+', label: 'realizací v ČR a SR' },
          { val: '−9 °C', label: 'max. ochlazení' },
          { val: '1 Rok', label: 'záruka na konstrukci' }].
          map((s) =>
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-6 rounded-2xl bg-card_bg border border-white/10 text-center">
              <p className="font-heading text-3xl text-cyan mb-1" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>{s.val}</p>
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase">{s.label}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── SEKCE 4: AKTIVNÍ OCHLAZENÍ ───────────────────── */}
      <section className="bg-surface border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <Zap size={18} className="text-cyan" />
                </div>
                <p className="text-xs font-mono tracking-widest uppercase text-white/40">Aktivní ochlazení</p>
              </div>
              <h2 className="text-white mb-6" style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                Pro města, městské parky<br />
                <span style={{ fontStyle: 'italic' }}>a zahrady</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed font-light mb-6">
                Dnes naše mlžítka aktivně bojují proti městským tepelným ostrovům a ochlazují rozpálená náměstí, parky, školní a reziudenční domací zahrady, nemocniční areály, domovy seniorů a jiné městské prostory.
              </p>
              <p className="text-white/60 text-base leading-relaxed font-light">
                Díky integrovaným mikrotryskám a fyzikálnímu mlžnému principu evaporativního chlazení dokáží tyto prvky snížit lokální teplotu okolí o 5 až 10 °C — s minimální spotřebou vody a úsporným provozem mlžítka.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/585985745_smartaplikacepromlzutka-nova.png" alt="Mlžítka na hřišti" className="w-full aspect-video object-cover rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <img src={IMAGES.playground} alt="Děti u mlžítka" className="w-full aspect-[4/3] object-cover rounded-xl" />
                <img src={IMAGES.mrak} alt="Mrak mlžítko" className="w-full aspect-[4/3] object-cover rounded-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SEKCE 5: ESTETIKA ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6bb07dfb6_Image_20260630_124518_112.webp" alt="Mlžítko . Mlžný MRAK" className="w-full aspect-[3/4] object-cover rounded-2xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <Palette size={18} className="text-cyan" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/40">Estetika a identita</p>
            </div>
            <h2 className="text-white mb-6" style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Místo, kde se<br />
              <span style={{ fontStyle: 'italic' }}>lidé potkávají</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-light mb-6">Od počátku nám bylo jasné, že do veřejného prostoru nechceme dodávat jen strohé technické trubky. Naše mlžítka působí nenásilně, avšak plní přidaný estetický účel — fungují jako moderní mlžná díla, která citlivě doplňují architekturu daného místa.

            </p>
            <p className="text-white/60 text-base leading-relaxed font-light mb-6">Díky našim výrobním mlžným technologiím, bohatým zkušenostem a velkému množství tvářecích nástrojů dokážeme nerez tvarovat podle specifických přání zákazníků do organických i abstraktních linií — ať už jde o stylizované zvířecí mlžné motivy, stromy či mraky.

            </p>
            <blockquote className="border-l-2 border-cyan/40 pl-5">
              <p className="text-white/50 italic text-base font-light">"Setkáme se u mrkve." — Naše realizace mlžítek se stávají přirozenými orientačními body a místy k setkávání.</p>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── SEKCE 6: HODNOTY ─────────────────────────────── */}
      <section className="bg-surface border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Proč mlžidla.cz</p>
            <h2 className="text-white" style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em' }}>
              Průmyslová preciznost<br /><span style={{ fontStyle: 'italic' }}>ve funkčním designu</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
            { icon: Shield, title: 'Certifikované materiály', desc: 'Nerez AISI 304/316L — potravinářská kvalita, mlžítka vhodné pro veřejné prostory a dětská hřiště. Bez chemie, bez biocidů.' },
            { icon: Award, title: '20+ mlžných realizací', desc: 'Více než dvě dekády zkušeností s projekty po celé České republice a Slovensku.' },
            { icon: Zap, title: 'Instalace mlžítka na klíč', desc: 'Od prvního skici přes 3D vizualizaci po montáž a servisní smlouvu mlžítka — vše pod jednou střechou.' }].
            map(({ icon: Icon, title, desc }) =>
            <div key={title} className="p-7 rounded-2xl bg-card_bg border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center mb-4 border border-cyan/20">
                  <Icon size={18} className="text-cyan" />
                </div>
                <h3 className="text-white font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── KONTAKT CTA ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="p-10 rounded-2xl bg-cyan/5 border border-cyan/20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>V HolmTec - Mlžidla.cz jsme hrdí na to, co děláme.</h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 text-sm text-white/50 font-mono">
              <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-cyan transition-colors"><Phone size={13} className="text-cyan" /> +420 774 700 390</a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 hover:text-cyan transition-colors"><Mail size={13} className="text-cyan" /> obchod1@holmtec.cz</a>
              <span className="flex items-center gap-2"><MapPin size={13} className="text-cyan" /> Trutnov, Horní staré město 698</span>
            </div>
          </div>
          <Link to="/poptavka"
          className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 whitespace-nowrap">
            Nezávazná poptávka mlžítka <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

    </div>);

}
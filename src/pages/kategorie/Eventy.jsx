import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tent, CheckCircle, Loader, Phone, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';

const EVENT_SCENES = [
  { title: 'Festivaly', kicker: 'Chill-out / vstupní zóna', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b68df5d31_Gemini_Generated_Image_5gclad5gclad5gcl.png' },
  { title: 'Veletrhy', kicker: 'Expozice / stánek', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/47ca0affa_veletrh.PNG' },
  { title: 'Firemní akce', kicker: 'Letní event / hospitality', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/83e0506f1_generated_fd2118cd.png' },
  { title: 'Oslavy a rodinné dny', kicker: 'Pobytová zóna', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.jpg' },
];

const USE_CASES = [
  { emoji: '🎶', title: 'Hudební festivaly', desc: 'Ochlazení před stage i v chill-out zónách. Stane se součástí vizuálního konceptu akce.' },
  { emoji: '🌞', title: 'Letní terasy', desc: 'Sezónní instalace pro restaurace a food festivaly — pronájem nebo koupě.' },
  { emoji: '🏅', title: 'Sportovní akce', desc: 'Ochlazení zázemí, trhu a diváckých zón při venkovních sportovních událostech.' },
  { emoji: '🎪', title: 'Veletrhy a výstavy', desc: 'Mobilní mlžné prvky jako atrakce stánku nebo designový prvek expozice.' },
];

const RENTAL_BENEFITS = [
  'Dodání a odvoz v ceně pronájmu',
  'Montáž a demontáž naším týmem',
  'Technická podpora po dobu akce',
  'Flexibilní délka pronájmu (1 den – celá sezóna)',
  'Pojištění instalace zahrnuto',
];

export default function Eventy() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.eventy);
    base44.entities.Product.list().catch(() => []).then(p => {
      const preferred = ['mlzna-brana-gate', 'brana-bendy', 'aura-city-duo', 'linea-gate'];
      const all = (p || []).filter((item) => item?.slug && !String(item.name || '').startsWith('ARCHIV'));
      const curated = preferred.map((slug) => all.find((item) => item.slug === slug)).filter(Boolean);
      setProducts(curated.length ? curated : all.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <video src="/media/optimized/f0ba17112_generated_video.webm"
          className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Tent size={18} className="text-white" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/70">Eventy & festivaly</p>
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Mlžítko jako součást<br /><span style={{ fontStyle: 'italic' }}>atmosféry a provozu akce.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-8">
              Mobilní mlžné prvky dodáváme pro festivaly, letní terasy a krátkodobé akce formou pronájmu i prodeje. Zajistíme instalaci, technickou podporu a rozmístění podle provozu akce.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Poptávka pronájmu <ArrowRight size={15} />
              </Link>
              <a href="tel:+420774700390" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white text-sm rounded-full hover:bg-white/10 transition-all">
                <Phone size={14} /> +420 774 700 390
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pronájem výhody */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-4">Pronájem na akci</p>
              <h2 className="text-slate-900 text-3xl mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
                Stará se o vás<br /><span style={{ fontStyle: 'italic' }}>náš tým.</span>
              </h2>
              <ul className="space-y-3">
                {RENTAL_BENEFITS.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-600 font-light">
                    <CheckCircle size={15} className="text-slate-900 shrink-0 mt-0.5" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '1 den', label: 'Min. pronájem' },
                { val: '<4 hod', label: 'Instalace' },
                { val: '−9 °C', label: 'Ochlazení' },
                { val: '24/7', label: 'Podpora na akci' },
              ].map(s => (
                <div key={s.label} className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
                  <p className="font-heading text-2xl text-slate-900 mb-1" style={{ fontWeight: 700 }}>{s.val}</p>
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Eventové náhledy</p>
          <h2 className="text-slate-900 text-3xl lg:text-4xl" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Jak může mlžení fungovat přímo v atmosféře akce.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-500">Samostatné inspirační fotografie pro festivaly, oslavy, veletrhy a firemní eventy. Finální rozmístění vždy přizpůsobíme průchodu lidí, zónám sezení a dostupnému napojení.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {EVENT_SCENES.map((scene, index) => (
            <motion.article key={scene.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
              <img src={scene.image} alt={`${scene.title} — mlžení MLŽIDLA`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[.16em] text-white/60">{scene.kicker}</p>
                <h3 className="mt-1 font-heading text-2xl">{scene.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {USE_CASES.map((u, i) => (
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-white border border-slate-200">
              <span className="text-2xl mb-3 block">{u.emoji}</span>
              <h3 className="text-slate-900 font-medium text-sm mb-2">{u.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">{u.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Vhodné modely k pronájmu / zakoupení</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Mobilní kolekce.</h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/produkt/${p.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-slate-900 font-medium">{p.name}</p>
                      {p.short_description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.short_description}</p>}
                    </div>
                    <ArrowRight size={15} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Proberme termín a provoz vaší akce.</h3>
            <div className="flex flex-col sm:flex-row gap-4 mt-3 mb-6 text-sm font-mono text-slate-500">
              <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Phone size={13} className="text-slate-900" /> +420 774 700 390</a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Mail size={13} className="text-slate-900" /> obchod1@holmtec.cz</a>
            </div>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Eventy & festivaly" projectScope="event" />
        </div>
      </section>
      <B2BPortfolioNavigation current="Eventy & festivaly" />
    </div>
  );
}
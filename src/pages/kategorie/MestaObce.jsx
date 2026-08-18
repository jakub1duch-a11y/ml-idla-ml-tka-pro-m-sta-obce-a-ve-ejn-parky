import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';
import SegmentReferenceShowcase from '@/components/kategorie/SegmentReferenceShowcase';
import { trackFunnelStep } from '@/lib/ga4';

const BENEFITS = [
'Pocitové ochlazení v horkých dnech typicky v řádu několika stupňů podle podmínek',
'Jemná vodní mlha bez chemických přísad',
'Smart řízení podle teploty, času a provozního režimu',
'Nerezové provedení navržené pro dlouhodobý venkovní provoz',
'Zakázková výroba a konfigurace podle identity místa',
'Projektová podpora, instalace a servis pro veřejný prostor'];


const USE_CASES = [
{ emoji: '🏛️', title: 'Náměstí a pěší zóny', desc: 'Dominantní mlžné prvky, které ochladí stovky procházejících a stávají se ikonou místa.' },
{ emoji: '🚌', title: 'Zastávky MHD', desc: 'Kompaktní mlžné stojany u čekáren snižují pocit tepla při čekání na spoj.' },
{ emoji: '🌳', title: 'Revitalizace prostranství', desc: 'Mlžné sochy jako součást nového urbanistického konceptu — funkce i estetika v jednom.' },
{ emoji: '🏃', title: 'Sportovní areály', desc: 'Ochlazení tribun, hřišť a běžeckých zón pro komfort sportovců i diváků.' }];


export default function MestaObce() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.mestOobce);
    trackFunnelStep('cities', 'landing_view', 'Města a obce');
    const preferredSlugs = ['city-cooling-zone', 'bendy-alej', 'aura-city-duo', 'mlzna-brana-gate', 'linea-avenue', 'ostrev-city-m'];
    base44.entities.Product.list().catch(() => []).then((p) => {
      const all = p || [];
      const selected = preferredSlugs
        .map((slug) => all.find((product) => product.slug === slug))
        .filter(Boolean);
      setProducts(selected.length ? selected : all.filter((product) => product.featured).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pt-0">

      {/* Hero */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/cb467bdec_mlznesochyproobceamesta.mp4"
        className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute bg-gradient-to-t from-slate-900 via-slate-900/20 to-slate-900/60 inset-0" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/70">Mlžítka pro Města a Obce</p>
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Ochlazení pro města,<br /><span style={{ fontStyle: 'italic' }}>která pečují o veřejný prostor.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-8">
              Mlžítka a mlžné zóny zvyšují tepelný komfort na náměstích, promenádách, v parcích, pěších zónách i u veřejných budov. Řešení kombinujeme s úsporným Smart řízením podle teploty, času a skutečného provozu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#poptavka" onClick={() => trackFunnelStep('cities', 'consultation_click', 'hero')} className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Navrhnout řešení pro město <ArrowRight size={15} />
              </a>
              <a href="tel:+420774700390" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white text-sm rounded-full hover:bg-white/10 transition-all">
                Zavolat (+420774700390)
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Konverzní cesta pro města a obce */}
      <section className="border-b border-slate-200 bg-white" data-analytics-section="cities-funnel">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['01', 'Popište místo', 'Lokalita, typ veřejného prostoru, přibližná plocha a co chcete zlepšit během horkých dnů.'],
              ['02', 'Navrhneme variantu', 'Vybereme vhodnou konfiguraci, připravíme orientační rozmístění a doporučení pro Smart řízení.'],
              ['03', 'Doplníme podklady', 'Technické řešení, stavební připravenost, nabídka, instalace a následný servis v jednom toku.'],
            ].map(([number, heading, text]) => (
              <div key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="font-mono text-[11px] tracking-widest text-slate-400">{number}</span>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 font-light">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/ai-vizualizace" onClick={() => trackFunnelStep('cities', 'visualizer_click', 'funnel')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
              Vytvořit vizualizaci záměru <ArrowRight size={14} />
            </Link>
            <Link to="/reference" onClick={() => trackFunnelStep('cities', 'references_all_click', 'funnel')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
              Prohlédnout realizace
            </Link>
          </div>
        </div>
      </section>

      {/* Výhody */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Proč MLŽIDLA® pro obce</p>
              <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
                Řešení, které<br /><span style={{ fontStyle: 'italic' }}>funguje a vydrží.</span>
              </h2>
              <ul className="space-y-3">
                {BENEFITS.map((b) =>
                <li key={b} className="flex items-start gap-3 text-sm text-slate-600 font-light">
                    <CheckCircle size={15} className="text-slate-900 shrink-0 mt-0.5" />{b}
                  </li>
                )}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
              { val: 'Smart', label: 'Automatické řízení' },
              { val: 'Nerez', label: 'Odolné provedení' },
              { val: 'Na míru', label: 'Projektové řešení' },
              { val: '0%', label: 'Chemické přísady' }].
              map((s) =>
              <div key={s.label} className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
                  <p className="font-heading text-slate-900 mb-1 text-4xl" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>{s.val}</p>
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">{s.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Kde se hodí */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Kde mlžítka instalujeme</p>
        <h2 className="text-slate-900 text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          Typická místa<br /><span style={{ fontStyle: 'italic' }}>ve vaší obci.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((u, i) =>
          <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
          className="p-6 rounded-2xl bg-white border border-slate-200">
              <span className="mb-3 block text-4xl">{u.emoji}</span>
              <h3 className="text-slate-900 font-medium mb-2 text-base">{u.title}</h3>
              <p className="leading-relaxed font-light text-slate-900 text-sm">{u.desc}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Video - Smart řízení */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/cb467bdec_mlznesochyproobceamesta.mp4"
        className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/30" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 w-full max-w-2xl">
            <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Smart řízení pro obce</p>
            <h2 className="text-white text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
              Automatický start/stop<br /><span style={{ fontStyle: 'italic' }}>dle teploty a vlhkosti.</span>
            </h2>
            <p className="text-white/70 leading-relaxed font-light max-w-xl">Smart řízení umožňuje nastavit provoz podle teploty, času a potřeb konkrétní lokality. Správce tak může omezit zbytečný chod systému a mít provoz pod kontrolou přes dostupné ovládání a automatizaci.</p>
          </motion.div>
        </div>
      </section>

      <SegmentReferenceShowcase
        segment="cities"
        eyebrow="Ověřené realizace"
        title="Veřejný prostor od náměstí po ZOO Praha."
        referenceIds={['6a71d1ff57598752eed27bfb', '6a42491409abbf575447aaeb', '6a450e035aef0b45b2a8728f']}
      />

      {/* Produkty */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Doporučené produkty</p>
          <h2 className="text-slate-900 text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Vhodné modely pro obce.</h2>
          {loading ?
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div> :

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {products.map((p, i) =>
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
            )}
            </div>
          }
          <div className="mt-8 text-center">
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors font-mono">
              Zobrazit celý katalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="poptavka" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 scroll-mt-24">
        <div className="p-10 rounded-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-50">
          <div>
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Připravíme nabídku pro vaši obec.</h3>
            <p className="text-slate-500 mb-6 text-sm">Pošlete lokalitu a stručný záměr. Připravíme první doporučení vhodného typu řešení, konfigurace a dalšího technického postupu.</p>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference realizací <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Města a obce" projectScope="urban" analyticsSegment="cities" />
        </div>
      </section>
      <B2BPortfolioNavigation current="Města a obce" />
    </div>);

}
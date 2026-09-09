import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Box, Ruler, FileText, Layers, PenTool, Mail } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';
import SegmentReferenceShowcase from '@/components/kategorie/SegmentReferenceShowcase';
import { trackFunnelStep } from '@/lib/ga4';

const GEOMETRIES = [
  { title: 'BENDY', desc: 'Organický ohýbaný tvar — od kompaktního solitéru po alej. Výška 1 800–2 000 mm.', tag: 'Ohýbání trubek' },
  { title: 'AURA', desc: 'Vertikální skulptura 120–220 cm pro atria, lobby a reprezentativní prostory.', tag: 'Svařovaná konstrukce' },
  { title: 'GATE70', desc: 'Monumentální mlžná brána — vstupní portál pro náměstí a veřejné budovy.', tag: 'Zakázková geometrie' },
  { title: 'LINEA', desc: 'Liniový prvek pro promenády, aleje a pěší trasy ve veřejném prostoru.', tag: 'Modulová řada' },
  { title: 'OSTREV', desc: 'Vertikální mlžící stéblo — minimalistický prvek pro parky a kompozice.', tag: 'Slim profile' },
  { title: 'MRKEV', desc: 'Zakázkový tvar navržený pro Město Polná — ukázka vlastní geometrie.', tag: 'Výroba na míru' },
];

const DOWNLOADS = [
  { icon: Box, title: 'Katalog geometrií', desc: 'Přehled tvarů, výšek a konfigurací s technickými parametry pro návrh.', tag: 'PDF katalog' },
  { icon: Ruler, title: 'Technické listy', desc: 'Rozměry, kotvení, přípojky, provozní tlak a požadavky na stavební přípravu.', tag: 'DWG · PDF' },
  { icon: Layers, title: 'Kotvení a detaily', desc: 'Varianty kotvení patkou do betonu, zemním vrutem i do revizní šachty.', tag: 'Stavební detaily' },
];

export default function Architekti() {
  useEffect(() => {
    setSEO({
      title: 'Podklady pro projektanty — MLŽIDLA.cz',
      description: 'Katalog geometrií, technické listy, DWG/PDF kotvení a zakázkové tvary nerezových mlžících soch pro architekty a projektanty.',
      robots: 'index, follow',
    });
    trackFunnelStep('architects', 'landing_view', 'Podklady pro projektanty');
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-[#0D2F4F] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#7FC4E8]">Podklady pro projektanty</p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.08] lg:text-5xl xl:text-6xl">
            Nástroj pro návrh veřejného prostoru s mlhou.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 lg:text-lg">
            Katalog geometrií, technické listy, kotvení a zakázkové tvary. Vše, co potřebujete od studie po realizační dokumentaci.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/ke-stazeni" onClick={() => trackFunnelStep('architects', 'downloads_click', 'hero')}
              className="inline-flex items-center gap-2 bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]">
              Stáhnout podklady <Download size={16} />
            </Link>
            <Link to="/ai-vizualizace" onClick={() => trackFunnelStep('architects', 'visualizer_click', 'hero')}
              className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10">
              Vizualizace do projektu
            </Link>
          </div>
        </div>
      </section>

      {/* Katalog geometrií */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Katalog geometrií</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">Tvary a velikosti pro každý kontext.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GEOMETRIES.map((g, i) => (
              <motion.div key={g.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="border border-[#EAF5FB] bg-white p-6">
                <span className="font-mono text-[10px] uppercase tracking-wide text-[#0B5EA8]">{g.tag}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-[#0D2F4F]">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#0D2F4F]/60">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ke stažení */}
      <section className="bg-[#EAF5FB] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Technické podklady</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">Od studie po realizační dokumentaci.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DOWNLOADS.map((d) => (
              <div key={d.title} className="border border-[#0B5EA8]/15 bg-white p-7">
                <d.icon size={26} className="text-[#0B5EA8]" />
                <span className="mt-4 block font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/45">{d.tag}</span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-[#0D2F4F]">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#0D2F4F]/60">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/ke-stazeni" className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0D2F4F]">
              Stáhnout podklady <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Zakázkové tvary — MRKEV Polná */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Zakázkové tvary</p>
            <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
              Geometrie navržená na míru projektu.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#0D2F4F]/60">
              Pro Město Polná jsme navrhli a vyrobili mlžící mrkev — unikátní tvar, který vznikl ohýbáním nerezové trubky a TIG svařováním v naší dílně v Trutnově. Každou geometrii dokážeme přizpůsobit autorskému konceptu i identitě místa.
            </p>
            <Link to="/reference/mesto-polna-mlzitko-mrkev" className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0D2F4F]">
              Zobrazit realizaci MRKEV Polná <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-[#EAF5FB]">
            <img src="https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/5c7fc888a_realizace-IMG_5035.jpg" alt="MRKEV Polná — zakázková mlžící mrkev" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Vizualizace do projektu */}
      <section className="bg-[#EAF5FB] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Vizualizace do projektu</p>
              <h2 className="mt-4 max-w-2xl font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
                Produkt ve vašem prostoru do 48 hodin.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#0D2F4F]/60">
                Pošlete půdorys nebo fotografie místa. Připravíme vizualizaci produktu přímo ve vašem kontextu — pro studii, prezentaci klientovi nebo realizační dokumentaci.
              </p>
            </div>
            <Link to="/ai-vizualizace" onClick={() => trackFunnelStep('architects', 'visualizer_click', 'vizualizace')}
              className="inline-flex items-center gap-2 self-start bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]">
              Otevřít vizualizaci <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SegmentReferenceShowcase
        segment="architects"
        eyebrow="Reference pro projektanty"
        title="Od autorského konceptu po provozní detail."
        referenceIds={['6a42491409abbf575447aaeb', '6a450e035aef0b45b2a8728f', '6a480c0da87022c6c9559115']}
      />

      {/* Kontakt na projektovou podporu */}
      <section id="projektova-podpora" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 scroll-mt-24">
        <div className="grid gap-10 border border-[#EAF5FB] bg-[#EAF5FB]/50 p-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Projektová podpora</p>
            <h2 className="mt-4 font-heading text-2xl leading-tight text-[#0D2F4F] lg:text-3xl">Konzultace od studie po realizaci.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#0D2F4F]/60">
              Technická konzultace, koordinace profesí, podklady pro stavební připravenost i návrh smart řízení. Spolupracujeme od první skice.
            </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:obchod1@holmtec.cz?subject=Projektová podpora" className="flex items-center gap-2 text-sm font-medium text-[#0B5EA8] hover:text-[#0D2F4F]">
                <Mail size={16} /> obchod1@holmtec.cz
              </a>
              <p className="text-sm text-[#0D2F4F]/60">+420 774 700 390</p>
            </div>
          </div>
          <CategoryInquiryForm category="Architekti" projectScope="private" analyticsSegment="architects" />
        </div>
      </section>

      <B2BPortfolioNavigation current="Pro architekty" />
    </div>
  );
}
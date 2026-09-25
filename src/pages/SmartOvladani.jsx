import React, { useEffect, useState } from 'react';
import { setSEO } from '@/lib/seo';
import SmartHero from '@/components/smart-ovladani/SmartHero';
import SmartBenefits from '@/components/smart-ovladani/SmartBenefits';
import SmartSensorsSection from '@/components/smart-ovladani/SmartSensorsSection';
import SmartAutomationFlow from '@/components/smart-ovladani/SmartAutomationFlow';
import SmartCTA from '@/components/smart-ovladani/SmartCTA';
import SmartOfferSection from '@/components/smart-ovladani/SmartOfferSection';
import SmartValveMediaSection from '@/components/smart-ovladani/SmartValveMediaSection';
import SmartCoolingConcept from '@/components/smart-ovladani/SmartCoolingConcept';
import SmartCoolingCityUseCases from '@/components/smart-ovladani/SmartCoolingCityUseCases';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';
import ContextLinks from '@/components/common/ContextLinks';

export default function SmartOvladani() {
  const [mobileSection, setMobileSection] = useState('prehled');
  const jumpTo = (id) => {
    setMobileSection(id);
    document.getElementById(`smart-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setSEO({
      title: 'Automatizace MLŽIDLA® — chytré řízení městského ochlazování | mlzidla.cz',
      description: 'Automatizace MLŽIDLA® propojuje designová mlžítka, chytré ventily, senzory, provozní scénáře a data. Řízené ochlazování pro města, parky, náměstí a sportoviště.',
      keywords: 'smart cooling, chytré městské ochlazování, smart city mlžítka, automatizace mlžení, chytré senzory mlžítka, řízení mlžného systému, PEVEKO ventil',
      canonicalPath: '/smart-ovladani',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: 'Automatizace MLŽIDLA® — chytré městské ochlazování',
            provider: { '@type': 'Organization', name: 'HolmTec' },
            areaServed: 'CZ',
            serviceType: 'Řízené ochlazování veřejného prostoru pomocí mlžných systémů, senzorů a automatizace',
            url: 'https://mlzidla.cz/smart-ovladani'
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Co je Smart Cooling?', acceptedAnswer: { '@type': 'Answer', text: 'Smart Cooling propojuje mlžítko, hydrauliku, senzory, chytré ventily, provozní scénáře a podle konfigurace také data a vzdálenou správu.' } },
              { '@type': 'Question', name: 'Lze řídit více mlžítek samostatně?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. Projekt lze rozdělit do více samostatných zón s vlastním časovým a provozním režimem.' } },
              { '@type': 'Question', name: 'Je možné automatické spuštění podle teploty?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. U varianty s teplotním řízením lze nastavit aktivační teplotu a další podmínky, například časové okno.' } },
              { '@type': 'Question', name: 'Je Smart Cooling vhodný pro města a veřejný prostor?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. Řešení je určeno pro náměstí, parky, školy, hřiště, sportoviště, koupaliště a další veřejné prostory.' } }
            ]
          }
        ]
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div id="smart-prehled" className="scroll-mt-28"><SmartHero /></div>
      <div className="lg:hidden sticky top-16 z-30 mx-auto max-w-md px-4 py-3">
        <div className="rounded-[20px] border border-slate-200/80 bg-white/85 p-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
          <nav className="flex gap-1" aria-label="Navigace automatizace">
            {[['prehled','Přehled'],['automatizace','Automatizace'],['senzory','Senzory']].map(([id,label]) => (
              <button type="button" key={id} aria-pressed={mobileSection === id} onClick={() => jumpTo(id)}
                className={`min-h-11 flex-1 rounded-[14px] px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${mobileSection === id ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <SmartCoolingConcept />
      <SmartCoolingCityUseCases />
      <div id="smart-automatizace" className="scroll-mt-32"><SmartAutomationFlow /></div>
      <SmartBenefits />
      <div id="smart-senzory" className="scroll-mt-32"><SmartSensorsSection /></div>
      <SmartValveMediaSection />
      <SmartOfferSection />
      <section className="bg-primary py-20 lg:py-24"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Kalkulačka provozu</p><h2 className="mt-4 max-w-3xl font-heading text-3xl leading-[1.08] tracking-[-.02em] text-primary-foreground sm:text-4xl lg:text-5xl">Spočítejte orientační spotřebu vody.</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">Spočítejte orientační provoz vody podle počtu trysek, průtoku a denní doby provozu. Automatizace pak pomáhá omezit zbytečné spuštění systému podle nastavených podmínek.</p><div className="mt-10"><MlzeniKalkulator /></div></div></section>
      <ContextLinks eyebrow="Související obsah" title="Automatizace je jedna část celého řešení." items={[
        { path: '/jak-to-funguje', kicker: 'Princip', title: 'Jak mlžítka fungují', text: 'Technický princip mlžení, napojení a provozní souvislosti.' },
        { path: '/mestske-mlzitka', kicker: 'Produkty', title: 'Městská mlžítka', text: 'Vyberte konkrétní systém, který lze doplnit o automatizaci.' },
        { path: '/ochrana-zdravi', kicker: 'Hygiena', title: 'Ochrana zdraví', text: 'Provozní režim, voda, proplach a servis u veřejných instalací.' },
        { path: '/vyhody', kicker: 'Přínosy', title: 'Výhody a benefity', text: 'Jak automatizace přispívá ke komfortu, správě a efektivnímu provozu.' },
        { path: '/kalkulacka', kicker: 'Náklady', title: 'Kalkulačka provozu', text: 'Samostatná kalkulačka orientační spotřeby vody pro aktivní produkty.' },
        { path: '/reference', kicker: 'Praxe', title: 'Reference', text: 'Reálné instalace a ukázky řešení v provozu.' }
      ]} />
      <SmartCTA />
    </div>);

}
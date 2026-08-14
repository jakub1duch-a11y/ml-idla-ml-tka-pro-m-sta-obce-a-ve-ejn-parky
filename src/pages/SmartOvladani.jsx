import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SmartHero from '@/components/smart-ovladani/SmartHero';
import SmartBenefits from '@/components/smart-ovladani/SmartBenefits';
import SmartSensorsSection from '@/components/smart-ovladani/SmartSensorsSection';
import SmartAutomationFlow from '@/components/smart-ovladani/SmartAutomationFlow';
import SmartCTA from '@/components/smart-ovladani/SmartCTA';
import SmartOfferSection from '@/components/smart-ovladani/SmartOfferSection';
import SmartValveMediaSection from '@/components/smart-ovladani/SmartValveMediaSection';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';
import ContextLinks from '@/components/common/ContextLinks';

export default function SmartOvladani() {
  useEffect(() => {
    setSEO({
      title: 'Smart ovládání mlžítek — aplikace a automatizace | mlzidla.cz',
      description: 'Smart řízení mlžítek podle času, teploty a provozních podmínek. Vzdálené ovládání, více zón, senzory a automatizační scénáře pro města i soukromé instalace.',
      keywords: 'smart ovládání mlžítek, automatizace mlžení, chytré senzory mlžítka, řízení mlžného systému, SUPLA mlžení, PEVEKO ventil',
      canonicalPath: '/smart-ovladani',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SmartHero />
      <SmartAutomationFlow />
      <SmartBenefits />
      <SmartSensorsSection />
      <SmartValveMediaSection />
      <SmartOfferSection />
      <section className="bg-primary py-20 lg:py-24"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Kalkulačka provozu</p><h2 className="mt-4 max-w-3xl font-heading text-3xl leading-[1.08] tracking-[-.02em] text-primary-foreground sm:text-4xl lg:text-5xl">Spočítejte orientační spotřebu vody.</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">Spočítejte orientační provoz vody podle počtu trysek, průtoku a denní doby provozu. Smart řízení pak pomáhá omezit zbytečné spuštění systému podle nastavených podmínek.</p><div className="mt-10"><MlzeniKalkulator /></div></div></section>
      <ContextLinks eyebrow="Související obsah" title="Smart řízení je jedna část celého řešení." items={[
        { path: '/jak-to-funguje', kicker: 'Princip', title: 'Jak mlžítka fungují', text: 'Technický princip mlžení, napojení a provozní souvislosti.' },
        { path: '/mestske-mlzitka', kicker: 'Produkty', title: 'Městská mlžítka', text: 'Vyberte konkrétní systém, který lze doplnit o chytré řízení.' },
        { path: '/ochrana-zdravi', kicker: 'Hygiena', title: 'Ochrana zdraví', text: 'Provozní režim, voda, proplach a servis u veřejných instalací.' },
        { path: '/vyhody', kicker: 'Přínosy', title: 'Výhody a benefity', text: 'Jak automatizace přispívá ke komfortu, správě a efektivnímu provozu.' },
        { path: '/kalkulacka', kicker: 'Náklady', title: 'Kalkulačka provozu', text: 'Samostatná kalkulačka orientační spotřeby vody pro aktivní produkty.' },
        { path: '/reference', kicker: 'Praxe', title: 'Reference', text: 'Reálné instalace a ukázky řešení v provozu.' }
      ]} />
      <SmartCTA />
    </div>);

}
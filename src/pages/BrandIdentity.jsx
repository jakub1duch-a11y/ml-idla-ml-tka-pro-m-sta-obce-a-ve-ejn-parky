import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import BrandManualHero from '@/components/brand/BrandManualHero';
import BrandManualNav from '@/components/brand/BrandManualNav';
import BrandCoreSection from '@/components/brand/BrandCoreSection';
import BrandVoiceSection from '@/components/brand/BrandVoiceSection';
import BrandVisualSystem from '@/components/brand/BrandVisualSystem';
import BrandAdvertisingGuide from '@/components/brand/BrandAdvertisingGuide';
import BrandApplicationGallery from '@/components/brand/BrandApplicationGallery';
import '@/components/brand/brand-print.css';

export default function BrandIdentity() {
  useEffect(() => setSEO({ title: 'Brand manuál | MLŽIDLA®', description: 'Praktický brand manuál MLŽIDLA®: mise, hlas značky, vizuální pravidla, reklamní šablony a ukázky použití.', canonicalPath: '/brand-identity' }), []);
  return <main className="pulselab-theme brand-manual-print bg-background pt-16 text-foreground">
    <BrandManualHero />
    <BrandManualNav />
    <BrandCoreSection />
    <BrandVoiceSection />
    <BrandVisualSystem />
    <section aria-label="Aktuální logo MLŽIDLA" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-widest text-secondary">Aktuální vizuální reference</p>
      <h2 className="mt-4 font-heading text-3xl">Logo s kapkou</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-8"><img src="/brand/mlzidla-drop-dark-master.png" alt="MLŽIDLA – logo s kapkou a petrolejovým textem" className="h-24 w-full object-contain" /></div>
        <div className="rounded-2xl border bg-white p-8"><img src="/brand/mlzidla-drop-symbol-master.png" alt="Symbol kapky MLŽIDLA" className="h-24 w-full object-contain" /></div>
      </div>
      <p className="mt-5 max-w-2xl">Originální podklady zachováváme bez změny geometrie. Petrolejový text patří na světlé pozadí. Pro tmavé pozadí ponecháváme dosavadní světlou variantu do ověření odpovídajícího originálu.</p>
    </section>
    <BrandAdvertisingGuide />
    <BrandApplicationGallery />
    <section className="bg-secondary text-secondary-foreground"><div className="mx-auto grid max-w-7xl items-end gap-10 px-6 py-20 lg:grid-cols-[1fr_auto] lg:px-10 lg:py-24"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Závěrečné doporučení</p><h2 className="mt-4 max-w-4xl font-heading text-4xl lg:text-6xl">Konzistence není omezení. Je to způsob, jak značku poznat na první pohled.</h2></div><Link to="/kontakt" className="brand-no-print inline-flex items-center gap-2 border border-secondary-foreground/40 px-6 py-3 text-sm font-semibold">Probrat použití značky <ArrowRight size={16}/></Link></div></section>
  </main>;
}
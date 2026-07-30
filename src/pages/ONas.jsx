import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import BrandManifesto from '@/components/brand/BrandManifesto';
import AboutStory from '@/components/brand/AboutStory';

export default function ONas() {
  useEffect(() => setSEO(SEO_PAGES.oNas), []);
  return <main className="bg-background pt-16"><section className="bg-primary text-primary-foreground"><div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">MLŽIDLA® / český výrobce</p><h1 className="mt-5 max-w-4xl font-heading text-5xl lg:text-7xl">Navrhujeme místa, kde se lépe dýchá.</h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75">Architektonické mlžicí systémy z nerezové oceli pro města, parky, hotely i soukromé prostory.</p></div></section><AboutStory/><BrandManifesto/><section className="max-w-7xl mx-auto px-6 lg:px-10 py-20"><div className="grid gap-10 border-t border-[#b9c3c8] pt-12 lg:grid-cols-[1fr_auto]"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Společně pro váš prostor</p><h2 className="mt-4 max-w-3xl font-heading text-4xl lg:text-5xl text-foreground">Od prvního návrhu až po instalaci a dlouhodobý servis.</h2></div><Link to="/poptavka" className="self-end inline-flex h-fit items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-secondary">Nezávazná poptávka <ArrowRight size={16}/></Link></div></section></main>;
}
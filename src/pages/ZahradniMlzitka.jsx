import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import GardenHero from '@/components/garden/GardenHero';
import GardenBenefits from '@/components/garden/GardenBenefits';
import GardenGallery from '@/components/garden/GardenGallery';

export default function ZahradniMlzitka() { useEffect(() => { setSEO({ title: 'Zahradní mlžítka pro terasy a pergoly | HolmTec', description: 'Zahradní mlžítka pro pergoly, terasy a venkovní posezení. Jemná mikromlha, nerezové provedení a chytré řízení.', canonicalPath: '/zahradni-mlzitka' }); }, []); return <main className="min-h-screen bg-white"><GardenHero /><GardenBenefits /><GardenGallery /><section className="bg-slate-950 py-16 text-white"><div className="site-container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan">Návrh na míru</p><h2 className="mt-3 text-3xl text-white">Připravíme řešení pro vaši zahradu.</h2></div><Link to="/poptavka?produkt=Zahradn%C3%AD%20ml%C5%BE%C3%ADtko" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">Nezávazná konzultace <ArrowRight size={16} /></Link></div></section></main>; }
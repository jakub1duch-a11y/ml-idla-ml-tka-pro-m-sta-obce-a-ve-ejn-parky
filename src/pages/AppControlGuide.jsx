import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import AppDownloadCards from '@/components/apps/AppDownloadCards';
import MistingAppGuide from '@/components/apps/MistingAppGuide';

const APP_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5fb86c3f0_generated_image.png';

export default function AppControlGuide() {
  useEffect(() => { setSEO({ title: 'Aplikace pro ovládání mlžítek | mlzidla.cz', description: 'Krátký návod pro Tuya Smart a Smart Life: párování ventilu, denní plán a ovládání mlžítka.', canonicalPath: '/aplikace-ovladani-mlzitek' }); }, []);
  return <main className="min-h-screen bg-white pt-24"><section className="site-container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20"><div><p className="content-eyebrow mb-4">Mobilní ovládání</p><h1 className="content-title">Mlžítko MRAK ve vašem telefonu.</h1><p className="content-lead mt-5">Spuštění jedním tlačítkem, denní interval od–do, přehled zóny a provozních údajů.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/chytre-ventily-mlzitka" className="btn-metallic-mist px-6 py-3 text-sm font-bold">Kompatibilní ventily <ArrowRight size={15} /></Link><Link to="/poptavka?produkt=Smart%20ovládání%20mlžítka" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800">Poptat zapojení</Link></div></div><img src={APP_IMAGE} alt="Návrh mobilní aplikace MLŽÍTKO MRAK" className="mx-auto max-h-[650px] w-full object-contain" /></section><section className="bg-slate-50 py-16 lg:py-20"><div className="site-container"><p className="content-eyebrow mb-4">Dostupné aplikace</p><h2 className="content-title mb-8 max-w-3xl">Tuya Smart nebo Smart Life.</h2><AppDownloadCards /></div></section><section className="bg-slate-950 py-16 lg:py-20"><div className="site-container"><p className="content-eyebrow mb-4 text-cyan">Rychlý návod</p><h2 className="content-title mb-8 max-w-3xl text-white">Od párování k dennímu mlžení.</h2><MistingAppGuide /></div></section></main>;
}
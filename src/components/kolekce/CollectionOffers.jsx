import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AllProductsImageCard from '@/components/common/AllProductsImageCard';

const OFFERS = [
{ slug: 'mestske-mlzitka', title: 'Městská kolekce', eyebrow: 'Města a veřejný prostor', text: 'Nerezová mlžítka a mlžné brány pro náměstí, parky a pěší zóny.', image: "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ccf06b29a_mlzidla-mlzitka-pro-mesta-obce.webp" },
{ slug: 'zahradni-mlzitka', title: 'Zahradní kolekce', eyebrow: 'Zahrady a terasy', text: 'Čisté nerezové mlžítko pro soukromé zahrady, hotelové a restaurační terasy.', image: "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/eb03ffe38_file_00000000db9072469c9f2e9b61c49933.png" },
{ slug: 'zakazkova-mlzitka', title: 'Zakázková mlžítka', eyebrow: 'Řešení na míru', text: 'Mlžné skulptury a atypické instalace navržené podle identity konkrétního místa.', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/68953132b_IMG_3524.jpg' }];


export default function CollectionOffers() {
  return <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
    <div className="mb-10 max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Kolekce MLŽIDLA®</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Vyberte řešení podle charakteru místa.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">Městský prostor, zahrada nebo atypická instalace. Každá kolekce vychází z jiného způsobu používání, ale drží stejný standard materiálu a zpracování.</p></div>
    <div className="mb-5"><AllProductsImageCard to="#catalog" image="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png" /></div>
    <div className="grid gap-5 lg:grid-cols-3">{OFFERS.map((offer) => <Link key={offer.title} to={`/${offer.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
      <div className="p-6"><p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-secondary">{offer.eyebrow}</p><h3 className="font-heading text-2xl text-foreground">{offer.title}</h3><p className="mt-3 text-base leading-relaxed text-muted-foreground">{offer.text}</p></div>
    </Link>)}</div>
  </section>;
}
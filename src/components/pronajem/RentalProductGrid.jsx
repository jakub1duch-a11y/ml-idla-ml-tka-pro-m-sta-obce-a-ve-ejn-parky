import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GoIcon from '@/components/pronajem/GoIcon';

const rentalOrder = (product) => {
  if (product.slug === 'mlzna-brana-gate') return 0;
  if (product.slug === 'bendy-brana' || product.slug === 'brana-bendy') return 1;
  if (product.slug === 'aura-duo' || product.slug === 'aura-mlzitko') return 2;
  if (product.slug === 'mlzici-tryska') return 9;
  return 3;
};

const EVENT_THUMBNAILS = {
  'mlzna-brana-gate': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b68df5d31_Gemini_Generated_Image_5gclad5gclad5gcl.png',
  'brana-bendy': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.jpg',
  'aura-duo': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/83e0506f1_generated_fd2118cd.png',
  'aura-mlzitko': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/83e0506f1_generated_fd2118cd.png',
};

const eventThumb = (product) => EVENT_THUMBNAILS[product.slug] || product.gallery_urls?.[1] || product.gallery_urls?.[0] || product.image_url;

export default function RentalProductGrid({ products }) {
  const sortedProducts = [...products].sort((a, b) => rentalOrder(a) - rentalOrder(b));
  return <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">{sortedProducts.map((product) => {
    const displayName = product.name.replace(/\s+GO$/i, '');
    return <article key={product.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">{eventThumb(product) && <img src={eventThumb(product)} alt={`${displayName} na eventu`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" loading="lazy"/>}<div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"/><GoIcon /></div>
      <div className="p-6"><p className="font-mono text-[10px] tracking-[.16em] text-secondary">PRONÁJEM</p><h3 className="mt-2 font-heading text-2xl text-foreground">{displayName}</h3><p className="mt-3 line-clamp-2 text-sm text-muted-foreground">Mobilní provedení připravené pro eventy, festivaly, letní večírky a rodinné dny.</p><Link to={`/pronajem?produkt=${encodeURIComponent(product.name)}#poptavka`} className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-secondary transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:shadow-md">Poptat cenu pronájmu <ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/></Link></div>
    </article>;
  })}</div>;
}
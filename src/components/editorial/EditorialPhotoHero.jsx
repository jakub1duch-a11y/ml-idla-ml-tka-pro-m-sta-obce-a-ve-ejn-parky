import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ImageOptimized from '@/components/ImageOptimized';

export default function EditorialPhotoHero({ eyebrow, title, description, image, imageAlt, credit = 'Ilustrační vizualizace', cta = 'Prohlédnout mlžítka', href = '/katalog' }) {
  return <section className="relative isolate min-h-[440px] overflow-hidden bg-[#073142] text-white">
    <div className="absolute inset-0">
      <ImageOptimized src={image} alt={imageAlt} width="100%" height="100%" sizes="100vw" loading="eager" fetchPriority="high" className="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#062b39]/95 via-[#062b39]/75 to-[#062b39]/10" aria-hidden="true" />
    </div>
    <div className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[.24em] text-cyan-200">{eyebrow}</p>
      <h2 className="max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h2>
      {description && <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{description}</p>}
      <Link to={href} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{cta}<ArrowUpRight size={17}/></Link>
    </div>
    <span className="absolute bottom-4 right-5 rounded bg-[#062b39]/75 px-2 py-1 text-[10px] text-white/85">{credit}</span>
  </section>;
}

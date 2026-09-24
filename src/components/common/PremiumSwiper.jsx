import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function PremiumSwiper({ items = [], ariaLabel = 'MLŽIDLA galerie', className = '' }) {
  if (!items.length) return null;
  return (
    <Carousel opts={{ align: 'start' }} className={`mlzidla-premium-swiper pb-12 ${className}`} aria-label={ariaLabel}>
      <CarouselContent className="-ml-4">
        {items.map((item, index) => (
          <CarouselItem key={item.id || item.href || item.src || index} className="basis-[92%] pl-4 sm:basis-[64%] min-[900px]:basis-[45%] min-[1180px]:basis-1/3">
            <article className="group h-full overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,.08)]">
              {item.src && (
                <Link to={item.href || '#'} className="block aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={item.src} alt={item.alt || item.title || ''} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.035]" />
                </Link>
              )}
              <div className="p-5 sm:p-6">
                {item.eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-cyan-700">{item.eyebrow}</p>}
                {item.title && <h3 className="text-xl font-semibold tracking-[-.02em] text-slate-900">{item.title}</h3>}
                {item.text && <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>}
                {item.href && <Link to={item.href} className="mt-5 inline-flex text-sm font-semibold text-slate-900 hover:text-cyan-700">{item.cta || 'Zobrazit detail'} →</Link>}
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-0 right-12 flex gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
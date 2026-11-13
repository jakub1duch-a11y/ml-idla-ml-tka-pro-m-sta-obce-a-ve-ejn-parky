import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets } from 'lucide-react';

/**
 * Sdílená hero sekce pro města, školy, architekty a odborné podklady.
 * Vizuální systém dle BRAND_MANUAL: Montserrat, Inter, antracit a ledová modrá.
 * Pouze skutečné obrázky správné produktové řady; náhledy prostředí vždy označit.
 */
export default function PremiumSegmentHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageCaption = 'Ilustrační produktová vizualizace. Umístění a provedení stanovíme pro konkrétní projekt.',
  highlights = [],
  primary = { label: 'Poptat řešení', to: '/poptavka' },
  secondary = { label: 'Prohlédnout produkty', to: '/katalog-mlzitek' },
  onPrimaryClick,
  onSecondaryClick,
  compact = false
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#081B33] text-white" aria-labelledby="segment-heading">
      <div className="pointer-events-none absolute -right-24 -top-32 h-[32rem] w-[32rem] rounded-full bg-[#00B4D8]/15 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true"
        style={{ backgroundImage: 'linear-gradient(135deg, transparent 48%, rgba(255,255,255,.10) 49%, transparent 50%)', backgroundSize: '88px 88px' }} />
      <div className={`relative mx-auto grid max-w-[1500px] items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,.98fr)] lg:gap-16 lg:px-12 ${compact ? 'lg:pb-20 lg:pt-28' : 'lg:min-h-[680px] lg:py-28'}`}>
        <div className="relative z-10 max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.19em] text-[#8CE5F3]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#8CE5F3]/25 bg-[#00B4D8]/10">
              <Droplets size={18} aria-hidden="true" />
            </span>
            {eyebrow}
          </p>
          <h1 id="segment-heading" className="font-heading text-4xl font-bold leading-[1.09] tracking-[-.035em] sm:text-5xl lg:text-[clamp(2.65rem,4.2vw,4.75rem)]">
            {title}
          </h1>
          <div className="mt-6 h-1 w-20 rounded-full bg-[#00B4D8]" aria-hidden="true" />
          <p className="mt-7 max-w-xl font-sans text-base leading-8 text-white/80 sm:text-lg">{description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to={primary.to} onClick={onPrimaryClick}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#00B4D8] px-6 py-3.5 font-sans text-sm font-bold text-[#081B33] transition hover:bg-[#8CE5F3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {primary.label} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to={secondary.to} onClick={onSecondaryClick}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/35 bg-white/5 px-6 py-3.5 font-sans text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {secondary.label}
            </Link>
          </div>
          {highlights.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2" aria-label="Přínosy a možnosti">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/[.07] px-4 py-2 text-xs font-medium text-white/85">{item}</span>
              ))}
            </div>
          )}
        </div>
        {image && (
          <figure className="relative min-w-0 overflow-hidden rounded-[1.6rem] border border-white/20 bg-[#12344A] shadow-[0_24px_90px_rgba(0,0,0,.24)]">
            <div className={`relative ${compact ? 'aspect-[5/4] lg:aspect-[4/5]' : 'aspect-[5/4] lg:aspect-[4/5]'}`}>
              <img src={image} alt={imageAlt || 'Nerezové mlžítko MLŽIDLA.cz'} decoding="async" loading="eager"
                className="h-full w-full object-contain" />
            </div>
            <figcaption className="border-t border-white/15 bg-[#081B33]/95 px-5 py-3 text-xs leading-5 text-white/70">{imageCaption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

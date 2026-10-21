import React, { useMemo } from 'react';
import { Droplets, Layers3, ShieldCheck, Wrench } from 'lucide-react';
import AnchorMotionPreview from '@/components/installation/AnchorMotionPreview';

const TECHNICAL_MEDIA_RE = /(1000008748|technick|schema|schéma|edraw|vykres|výkres|montaz|montáž|instalac)/i;

export default function PdInstallationPrep({ product }) {
  const technicalMedia = useMemo(
    () => (product.gallery_urls || []).filter((url) => typeof url === 'string' && TECHNICAL_MEDIA_RE.test(url)).slice(0, 3),
    [product.gallery_urls]
  );

  const isSeasonal = product.slug === 'teepee';
  const items = [
    {
      icon: ShieldCheck,
      title: 'Materiál a povrch',
      text: product.material || 'Materiál, povrch a odolnost ověřujeme podle konkrétního výrobního provedení.',
    },
    {
      icon: Droplets,
      title: 'Přívod vody',
      text: isSeasonal ? 'Přívod vody a rychlost přípravy se řeší podle místa dočasného nasazení.' : 'Trasa přívodu vody a připojovací bod se navrhují podle místa instalace.',
    },
    {
      icon: Layers3,
      title: isSeasonal ? 'Umístění a stabilita' : 'Kotvení podle místa',
      text: isSeasonal ? 'Stabilní osazení se volí podle povrchu, provozu a podmínek konkrétní akce.' : 'Typ patky, kotvení a návaznost na povrch se potvrzují podle výrobku a projektové dokumentace.',
    },
    {
      icon: Wrench,
      title: 'Trysky a servis',
      text: 'Typ, počet trysek i servisní přístup se řídí ověřenou specifikací konkrétního produktu.',
    },
  ];

  return (
    <section id="priprava-instalace" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">
              Příprava a instalace
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">
              {isSeasonal ? 'Připravené pro sezónní nasazení.' : 'Promyšlená instalace do konkrétního prostoru.'}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#0D2F4F]/62 sm:text-base">
            {isSeasonal ? 'U mobilního řešení se příprava, přívod vody a stabilní umístění plánují podle konkrétní akce a podmínek na místě.' : 'Způsob kotvení, přívod vody a servisní přístup se navrhují podle skutečné konstrukce produktu a podmínek místa. Neověřené instalační detaily nezobrazujeme jako garantované vlastnosti.'}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          {isSeasonal ? (
            <div className="flex min-h-64 flex-col justify-center rounded-[28px] border border-[#D8E8F0] bg-[linear-gradient(145deg,#F8FCFE,#EAF6F9)] p-7 sm:p-9">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0B97E8]">Sezónní řešení</p>
              <h3 className="mt-3 max-w-md font-heading text-2xl font-bold leading-tight text-[#0A2342] sm:text-3xl">Místo, přívod vody a provoz v jednom plánu.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#365366]">Před nasazením ověříme povrch, dostupnost vody, stabilní umístění a podmínky obsluhy.</p>
            </div>
          ) : <AnchorMotionPreview />}
          <div className="grid gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl bg-[#F0F7FA] p-5 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F6FC] text-[#0B5EA8]">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-[#0A2342]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#365366]">{text}</p>
            </article>
          ))}
          </div>
        </div>

        {technicalMedia.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-heading text-xl font-bold text-[#0A2342]">Technické schéma a montážní logika</h3>
              <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#0D2F4F]/40">Odděleno od lifestyle galerie</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technicalMedia.map((url, index) => (
                <figure key={url} className="overflow-hidden border border-[#D8E8F0] bg-[#F7FBFD]">
                  <img src={url} alt={`${product.name} — technické schéma ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full object-contain" />
                  <figcaption className="border-t border-[#D8E8F0] px-4 py-3 text-xs font-semibold text-[#0D2F4F]/65">
                    Technický podklad {index + 1}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

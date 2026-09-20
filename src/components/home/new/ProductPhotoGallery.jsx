import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Droplets } from 'lucide-react';
import { UPLOADED_PRODUCT_PHOTOS } from '@/lib/uploadedProductPhotos';

export default function ProductPhotoGallery() {
  const photos = UPLOADED_PRODUCT_PHOTOS;

  if (!photos?.length) return null;

  return (
    <section className="bg-[#F4F8FA] py-16 lg:py-24" aria-labelledby="product-photo-gallery-title">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#0B8EC5]">// Produktové fotografie</p>
            <h2 id="product-photo-gallery-title" className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight tracking-[-.045em] text-[#07131D] sm:text-4xl lg:text-5xl">
              Reálné produkty, nerez, jemná mlha a konkrétní prostředí.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#516574]">
              Fotografie a vizualizace používáme jako podklad pro návrh umístění, cenovou nabídku a klientskou sekci projektu.
            </p>
          </div>
          <Link to="/poptavka" className="inline-flex items-center gap-2 self-start rounded-full bg-[#07131D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B8EC5] sm:self-auto">
            Chci návrh do prostoru <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <article className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#07131D] shadow-[0_24px_80px_rgba(7,19,29,.14)] lg:min-h-[480px]">
            <img src={photos[0].src} alt={photos[0].alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/24 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/28 px-4 py-2 text-[11px] font-bold uppercase tracking-[.16em] backdrop-blur-md">
                <Camera size={15} className="text-[#26C6E9]" /> Stéblo / produktový hero
              </div>
              <h3 className="font-heading text-3xl font-bold tracking-[-.045em] sm:text-5xl">Štíhlé mlžítko inspirované přírodou.</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
                Přirozený tvar pro parky, zahrady a veřejné prostory, kde má technologie působit lehce a nenápadně.
              </p>
            </div>
          </article>

          <div className="grid gap-5">
            {photos.slice(1).map((photo) => (
              <article key={photo.key} className="overflow-hidden rounded-[1.5rem] border border-[#DDEAF0] bg-white shadow-[0_18px_50px_rgba(7,19,29,.08)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#07131D]">
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-md">
                    <Droplets size={13} className="text-[#26C6E9]" /> Produkt
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold tracking-[-.035em] text-[#07131D]">Sloupové mlžítko</h3>
                  <p className="mt-2 text-sm leading-6 text-[#516574]">{photo.alt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

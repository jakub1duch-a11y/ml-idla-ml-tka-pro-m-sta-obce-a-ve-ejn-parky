import React from 'react';
import ImageOfferGallery from '@/components/offers/ImageOfferGallery';

export default function ObrazoveNabidky() {
  const orderId = new URLSearchParams(window.location.search).get('order') || '6ac8e5a9b4c159319cfb8925';
  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Interní · obrazové nabídky</p>
        <h1 className="mt-2 font-heading text-3xl lg:text-5xl">Obrazová nabídka z poptávky</h1>
        <p className="mb-8 mt-3 max-w-2xl text-muted-foreground">Vícestránková grafická nabídka (A4, PNG) podle šablony MLŽIDLA.cz. Produktové listy používají originální fotografie bez AI úprav konstrukce; fotorealistické vizualizace v prostoru se přidávají až po vašem schválení.</p>
        <ImageOfferGallery projectOrderId={orderId} />
      </div>
    </main>
  );
}
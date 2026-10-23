import React from 'react';

const CHANNEL_URL = 'https://www.youtube.com/@mlzidla';
const UPLOADS_PLAYLIST = 'UUeoTnyULIx5fW-71fhkG1uA';

export default function YouTubeChannelVideos({ product, compact = false }) {
  const productText = [product?.name, product?.title, product?.slug, product?.category]
    .filter(Boolean).join(' ').toLowerCase();
  const matches = /mrak|bendy|linea/.test(productText);
  if (product && !matches) return null;

  const title = product
    ? `Videa MLŽIDLA.cz k produktu ${product.name || product.title || product.slug}`
    : 'Videa z oficiálního kanálu MLŽIDLA.cz';

  return (
    <section className={compact ? 'my-8' : 'mx-auto my-12 max-w-7xl px-5 sm:px-7 lg:px-10'} aria-labelledby="youtube-channel-videos-title">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_.75fr]">
          <div className="aspect-video bg-slate-950">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/videoseries?list=${UPLOADS_PLAYLIST}`}
              title={title}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-700">Oficiální YouTube · MLŽIDLA.cz</p>
            <h2 id="youtube-channel-videos-title" className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Přehrávač načítá videa z oficiálního kanálu. Vyberte konkrétní video v seznamu přehrávače; obsah kanálu se může průběžně měnit.</p>
            <a className="mt-5 inline-flex min-h-11 w-fit items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2" href={CHANNEL_URL} target="_blank" rel="noreferrer">Otevřít celý YouTube kanál ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
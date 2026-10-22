import React, { useEffect, useRef } from 'react';

function ReelVideo({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} muted loop playsInline preload="none" className="h-full w-full object-cover" />;
}

export default function VideoReel({ eyebrow, title, videos }) {
  return (
    <section className="bg-ink py-16 text-white lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-white">{title}</h2>
      </div>
      <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:px-10">
        {videos.map((v) => (
          <figure key={v.src} className="relative aspect-[9/16] w-[62vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl bg-surface">
            <ReelVideo src={v.src} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-sm font-semibold">{v.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
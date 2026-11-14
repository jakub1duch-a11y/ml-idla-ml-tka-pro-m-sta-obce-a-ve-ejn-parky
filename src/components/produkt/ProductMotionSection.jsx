import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

export default function ProductMotionSection({ product }) {
  const video = useRef(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const url = product?.motion_video_url || product?.video_url;
  useEffect(() => {
    const element = video.current;
    if (!element || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) element.pause(); });
    observer.observe(element);
    return () => observer.disconnect();
  }, [url, failed]);
  if (!url || failed) return null;
  return (
    <section id="mlzeni-v-pohybu" className="bg-[#071A2A] py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-7 lg:grid-cols-[.75fr_1.25fr] lg:px-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">Prohlédněte si produkt</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{product.name} v pohybu</h2>
          <p className="mt-4 leading-7 text-white/80">Pusťte si video a prohlédněte si provedení produktu. Zvuk záznamu můžete zapnout podle potřeby.</p>
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-cyan-100 px-5 py-3 font-semibold text-[#071A2A]">Poptat tento produkt</Link>
        </div>
        <div className="min-w-0">
          <video ref={video} src={url} poster={product.image_url} controls muted={muted} playsInline preload="none" onError={() => setFailed(true)} onVolumeChange={() => setMuted(video.current?.muted ?? true)} aria-label={`Video produktu ${product.name}`} className="aspect-video w-full rounded-2xl bg-black object-contain" />
          <button type="button" onClick={() => { if(video.current) { video.current.muted = !muted; setMuted(!muted); } }} aria-pressed={!muted} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}{muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}</button>
        </div>
      </div>
    </section>
  );
}

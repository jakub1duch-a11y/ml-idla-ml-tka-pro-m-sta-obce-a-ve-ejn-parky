import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollHeroVideoSlide({ product, categoryName, onScrollNext }) {
  const containerRef = useRef(null);
  const mistRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mist background parallax — drifts slower than the pinned content
      gsap.to(mistRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      if (product.video_url && videoRef.current) {
        gsap.timeline({
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '+=100%', scrub: true, pin: true },
        })
          .to(textRef.current, { opacity: 0, y: -40, duration: 0.3 }, 0)
          .to(imageRef.current, { opacity: 0, duration: 0.3 }, 0.15)
          .to(videoRef.current, { opacity: 1, duration: 0.3 }, 0.15);
      }
    }, containerRef);
    return () => ctx.revert();
  }, [product]);

  useEffect(() => {
    if (product.video_url && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [product]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div ref={mistRef} className="absolute inset-0 opacity-70 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(77,168,255,0.12), transparent 70%)' }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-28 pb-16 text-center">
        <div ref={textRef} className="max-w-3xl">
          {categoryName && <p className="text-sm font-semibold tracking-wide text-techblue mb-4">{categoryName}</p>}
          <h1 className="font-heading font-light text-slate-900 leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
            {product.name}
          </h1>
          {product.short_description &&
            <p className="text-slate-500 text-lg mt-6 max-w-xl mx-auto">{product.short_description}</p>
          }
        </div>

        <div className="relative w-full max-w-4xl mt-12 rounded-3xl overflow-hidden bg-slate-100 aspect-[16/10]">
          {product.image_url &&
            <img ref={imageRef} src={product.image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          }
          {product.video_url &&
            <video ref={videoRef} src={product.video_url} muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0" />
          }
        </div>
      </div>

      <button onClick={onScrollNext} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
        <span className="text-[11px] tracking-widest uppercase">Zjistit více</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}
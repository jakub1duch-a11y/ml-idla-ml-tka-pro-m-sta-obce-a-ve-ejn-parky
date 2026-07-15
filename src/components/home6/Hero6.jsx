import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PHOTO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/95479d1d6_Screenshot_20260712_231547.jpg';
const VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/5a4e7b95e_MlzitkavarealuZOOPraha-zivaukazka.mov';

const TAGS = ['Precizní mlžení', 'Chytré ovládání', 'Nerez 316L'];

export default function Hero6() {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=100%', scrub: true, pin: true },
      })
        .to(photoRef.current, { opacity: 0, duration: 0.4 }, 0.1)
        .to(videoRef.current, { opacity: 1, duration: 0.4 }, 0.1)
        .to(contentRef.current, { opacity: 0.15, y: -30 }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-black">
      <img ref={photoRef} src={PHOTO_URL} alt="Mlžná socha v mlze" className="absolute inset-0 w-full h-full object-cover" />
      <video ref={videoRef} src={VIDEO_URL} muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      <div ref={contentRef} className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-16 pt-32 pb-24 max-w-3xl">
        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map((t) => (
            <span key={t} className="px-4 py-1.5 rounded-full border border-white/25 text-white/80 text-xs">{t}</span>
          ))}
        </div>

        <h1 className="font-heading font-light text-white leading-[1.05] tracking-tight mb-6" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
          Mlžení<br />Bez Hranic
        </h1>

        <p className="text-white/60 text-lg max-w-lg mb-8 font-light">
          Zakázkové mlžné sochy z nerezové oceli. Ochlazují vzduch až o 9 °C bez pocitu mokra — pro zahrady, eventy i veřejné prostory.
        </p>

        <div className="flex items-center gap-4 mb-10">
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full transition-colors">
            Nezávazná poptávka <ArrowUpRight size={16} />
          </Link>
          <Link to="/video-ukazky" aria-label="Přehrát video ukázku" className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <Play size={16} className="ml-0.5" />
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <p className="text-2xl font-heading font-semibold text-white">500+</p>
            <p className="text-xs text-white/50">Realizací</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-2xl font-heading font-semibold text-white">15 000+</p>
            <p className="text-xs text-white/50">Spokojených klientů</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 z-10 flex-col items-end gap-6">
        <div className="px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
          <p className="text-xs text-white/50 mb-1">Ochlazení vzduchu</p>
          <p className="text-3xl font-heading font-semibold text-violet-300">−9 °C</p>
        </div>
        <Link to="/mlzidla-mlzitka" className="text-right text-white/70 hover:text-white transition-colors">
          <p className="text-xs uppercase tracking-widest mb-1">Produktová řada</p>
          <span className="inline-flex items-center gap-1 text-sm">Zobrazit více <ChevronDown size={13} className="-rotate-90" /></span>
        </Link>
      </div>
    </section>
  );
}
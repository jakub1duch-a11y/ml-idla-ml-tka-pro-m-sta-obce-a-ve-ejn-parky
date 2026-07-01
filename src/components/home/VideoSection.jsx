import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause } from 'lucide-react';

export default function VideoSection() {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (paused) { videoRef.current.play(); setPaused(false); }
    else { videoRef.current.pause(); setPaused(true); }
  };

  return (
    <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
      {/* Video background */}
      <video ref={videoRef} autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105">
        <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/c7c9d3e68_video_20260619_164025.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/80" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-5">Technologie v praxi</p>
          <h2 className="font-heading font-extralight text-5xl lg:text-7xl text-white tracking-tight leading-[1.05] mb-6">
            Mlha, která<br />mění prostor
          </h2>
          <p className="text-white/50 font-light text-lg max-w-xl mx-auto mb-10">
            Každá instalace je jedinečná. Navrhujeme systémy přesně pro vaše místo — od intimní zahrady po veřejné náměstí.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/kolekce"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-medium rounded-full hover:bg-white/90 transition-all">
              Prohlédnout kolekci <ArrowRight size={16} />
            </Link>
            <Link to="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur text-white text-sm font-light rounded-full border border-white/20 hover:bg-white/15 transition-all">
              Nezávazná konzultace
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Play/Pause control */}
      <button onClick={togglePlay}
        className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all">
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </section>
  );
}
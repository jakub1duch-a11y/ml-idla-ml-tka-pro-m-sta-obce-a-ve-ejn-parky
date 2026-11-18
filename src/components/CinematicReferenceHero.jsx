import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowDown, Volume2, VolumeX, Play, Pause, Share2 } from 'lucide-react';

const nativeVideo = (url) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || '');

export default function CinematicReferenceHero({ project, videos = [], description, isTechnicalVisual = false }) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [active, setActive] = useState(0);
  const playable = videos.filter(nativeVideo);
  const source = playable[active] || null;
  useEffect(() => { setActive(0); setMuted(true); setPlaying(true); }, [project.id]);
  useEffect(() => { if (!videoRef.current || !source || reducedMotion) return; videoRef.current.play().catch(() => setPlaying(false)); }, [source, reducedMotion]);
  const togglePlay = () => { if (!videoRef.current) return; if (videoRef.current.paused) videoRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); else { videoRef.current.pause(); setPlaying(false); } };
  return <section aria-label={`Úvod realizace ${project.name}`} className="relative isolate flex min-h-[680px] h-[100svh] max-h-[1100px] overflow-hidden bg-[#061f2b] text-white">
    {project.image_url && <img src={project.image_url} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full ${isTechnicalVisual ? 'object-contain' : 'object-cover'}`} />}
    {source && !reducedMotion && <video ref={videoRef} key={source} src={source} autoPlay muted={muted} loop playsInline preload="metadata" poster={project.image_url || undefined} aria-label={`Video realizace ${project.name}`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className="absolute inset-0 h-full w-full object-cover" />}
    <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/95 via-[#041c28]/65 to-[#041c28]/10" /><div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/90 via-transparent to-[#041c28]/20" />
    <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-10 pt-24 lg:px-10 lg:pb-16 lg:pt-32">
      <Link to="/reference" className="inline-flex w-fit items-center gap-2 text-sm text-white/85 hover:text-white"><ArrowLeft size={16} /> Všechny realizace</Link>
      <motion.div initial={reducedMotion ? false : {opacity:0,y:34}} animate={{opacity:1,y:0}} transition={{duration:.85,ease:'easeOut'}} className="max-w-5xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[.28em] text-cyan-200">MLŽIDLA® · REALIZACE · BY HOLMTEC</p>
        <h1 className="font-heading text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">{project.name}</h1>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl">{description}</p>
        {isTechnicalVisual && <span className="mt-4 inline-flex bg-black/40 px-4 py-2 text-xs">Technický podklad · nejde o fotografii realizace</span>}
      </motion.div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5 text-sm">
        <a href="#reference-story" className="inline-flex items-center gap-3 hover:text-cyan-200"><ArrowDown size={18} /> Prozkoumat projekt</a>
        <div className="flex flex-wrap items-center gap-2">
          {source && <><button type="button" onClick={togglePlay} className="rounded-full border border-white/40 bg-black/20 px-4 py-3" aria-label={playing ? 'Pozastavit video' : 'Přehrát video'}>{playing ? <Pause size={18}/> : <Play size={18}/>}</button><button type="button" onClick={() => {setMuted(v=>!v); if(videoRef.current) videoRef.current.muted=!muted;}} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-4 py-3">{muted ? <VolumeX size={18}/> : <Volume2 size={18}/>} {muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}</button></>}
          {playable.length > 1 && <button type="button" onClick={()=>setActive(v=>(v+1)%playable.length)} className="rounded-full border border-white/40 px-4 py-3">Další záběr ({active+1}/{playable.length})</button>}
          <button type="button" onClick={()=>{if(navigator.share) navigator.share({title:project.name,url:location.href}).catch(()=>{});else navigator.clipboard?.writeText(location.href).catch(()=>{});}} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-3"><Share2 size={17}/> Sdílet</button>
        </div>
      </div>
    </div>
  </section>;
}

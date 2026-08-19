import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX, Wind } from 'lucide-react';

// Scroll-driven brand manifesto adapted to the MLŽIDLA brand.
// The atmosphere button intentionally requires user interaction because browsers
// block autoplay with sound. The visual mist remains automatic and silent.
const VIDEO_URL = '/media/optimized/c7c9d3e68_video_20260619_164025.webm';

export default function ManifestScrollSection() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef(null);
  const audioNodesRef = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const stopCoolingSound = () => {
    audioNodesRef.current.forEach((node) => {
      try { node.stop?.(); } catch {}
      try { node.disconnect?.(); } catch {}
    });
    audioNodesRef.current = [];

    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }

    setSoundOn(false);
  };

  const startCoolingSound = async () => {
    if (soundOn) {
      stopCoolingSound();
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.055;
    master.connect(ctx.destination);

    // Filtered air noise creates a soft fine-mist / breeze impression.
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.value = 1800;
    airFilter.Q.value = 0.35;

    const airGain = ctx.createGain();
    airGain.gain.value = 0.32;
    noise.connect(airFilter).connect(airGain).connect(master);

    // Very low tonal bed adds depth without becoming musical or intrusive.
    const tone = ctx.createOscillator();
    tone.type = 'sine';
    tone.frequency.value = 174;
    const toneGain = ctx.createGain();
    toneGain.gain.value = 0.028;
    tone.connect(toneGain).connect(master);

    // Slow modulation makes the ambience breathe naturally.
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.09;
    lfo.connect(lfoGain).connect(airGain.gain);

    noise.start();
    tone.start();
    lfo.start();

    audioNodesRef.current = [noise, tone, lfo, airFilter, airGain, toneGain, lfoGain, master];
    setSoundOn(true);
  };

  useEffect(() => () => stopCoolingSound(), []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.55', 'end end'],
  });

  const videoY = useTransform(scrollYProgress, [0, 0.04, 0.34], ['105vh', '105vh', '0vh']);
  const videoLeft = useTransform(scrollYProgress, [0.22, 0.52], isMobile ? ['50%', '50%'] : ['50%', '25%']);
  const videoWidth = useTransform(scrollYProgress, [0.22, 0.52], isMobile ? ['88vw', '88vw'] : ['78vw', '38vw']);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.04, 0.78], [0, 1, 1]);

  const title1Op = useTransform(scrollYProgress, [0, 0.05, 0.24, 0.31], [0, 1, 1, 0]);
  const title1Y = useTransform(scrollYProgress, [0, 0.05, 0.24, 0.31], [50, 0, 0, -50]);

  const title2Op = useTransform(scrollYProgress, [0.28, 0.41, 0.53, 0.65], [0, 1, 1, 0]);
  const title2Y = useTransform(scrollYProgress, [0.28, 0.41, 0.53, 0.65], [50, 0, 0, -50]);

  const title3Op = useTransform(scrollYProgress, [0.60, 0.72, 0.84, 0.91], [0, 1, 1, 0]);
  const title3Y = useTransform(scrollYProgress, [0.60, 0.72, 0.84, 0.91], [50, 0, 0, -50]);

  const washY = useTransform(scrollYProgress, [0.84, 1], ['100%', '0%']);
  const mistOpacity = useTransform(scrollYProgress, [0.08, 0.26, 0.72, 0.92], [0, 0.72, 0.62, 0]);
  const mistScale = useTransform(scrollYProgress, [0.08, 0.72], [0.9, 1.16]);

  return (
    <section ref={ref} className="relative h-[430vh] bg-[#f6f9fb]" aria-label="Manifest značky MLŽIDLA">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#f6f9fb]">
        {/* Cooling atmosphere: layered mist, soft cyan light and slow drift. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ opacity: mistOpacity, scale: mistScale }}
        >
          <div className="absolute -left-[12vw] top-[16vh] h-[52vw] w-[52vw] rounded-full bg-cyan-100/45 blur-[90px]" />
          <div className="absolute right-[-8vw] top-[28vh] h-[42vw] w-[42vw] rounded-full bg-sky-100/40 blur-[100px]" />
          <motion.div
            className="absolute left-[12%] top-[34%] h-40 w-[62%] rounded-full bg-white/60 blur-[34px]"
            animate={{ x: [0, 34, -12, 0], y: [0, -8, 10, 0], opacity: [0.25, 0.58, 0.34, 0.25] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-[25%] top-[48%] h-28 w-[54%] rounded-full bg-cyan-50/70 blur-[28px]"
            animate={{ x: [0, -42, 18, 0], opacity: [0.18, 0.48, 0.28, 0.18] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* User-triggered sound control. */}
        <div className="absolute right-5 top-5 z-40 md:right-8 md:top-8">
          <button
            type="button"
            onClick={startCoolingSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Vypnout atmosféru ochlazení' : 'Zapnout atmosféru ochlazení'}
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium backdrop-blur-xl transition-all duration-300 ${soundOn ? 'border-cyan-300/70 bg-white/85 text-slate-900 shadow-[0_12px_40px_rgba(14,165,233,0.18)]' : 'border-white/70 bg-white/60 text-slate-700 hover:bg-white/85'}`}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundOn ? 'Atmosféra zapnutá' : 'Zapnout atmosféru'}</span>
            <Wind size={15} className={soundOn ? 'text-cyan-600' : 'text-slate-400'} />
          </button>
        </div>

        <motion.div
          className="absolute top-1/2 z-10 -translate-x-1/2"
          style={{
            left: videoLeft,
            y: videoY,
            translateY: isMobile ? '-62%' : '-50%',
            width: videoWidth,
            opacity: videoOpacity,
          }}
        >
          <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] md:rounded-[36px]">
            <video
              src={VIDEO_URL}
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              className="block h-auto w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(246,249,251,0.84)_100%)]" />
          </div>
        </motion.div>

        <motion.div
          className="absolute left-0 top-[11%] z-20 flex w-full justify-center px-6"
          style={{ opacity: title1Op, y: title1Y }}
        >
          <p className="max-w-5xl text-center text-[30px] font-light leading-[1.08] tracking-[-0.035em] text-slate-950 md:text-[48px] lg:text-[58px]">
            Nevyrábíme jen mlžítka. Navrhujeme pocit úlevy.
          </p>
        </motion.div>

        <motion.div
          className="absolute z-20 -translate-y-1/2"
          style={{
            opacity: title2Op,
            y: title2Y,
            top: isMobile ? '73%' : '45%',
            left: isMobile ? '50%' : '51%',
            width: isMobile ? '88vw' : '39vw',
            translateX: isMobile ? '-50%' : '0%',
          }}
        >
          <p className={`${isMobile ? 'text-center' : 'text-left'} text-[30px] font-light leading-[1.08] tracking-[-0.035em] text-slate-950 md:text-[42px]`}>
            Horký prostor se během chvíle<br />mění v místo, kde chcete zůstat.
          </p>
        </motion.div>

        <motion.div
          className="absolute z-20 -translate-y-1/2"
          style={{
            opacity: title3Op,
            y: title3Y,
            top: isMobile ? '73%' : '45%',
            left: isMobile ? '50%' : '51%',
            width: isMobile ? '88vw' : '40vw',
            translateX: isMobile ? '-50%' : '0%',
          }}
        >
          <p className={`${isMobile ? 'text-center' : 'text-left'} text-[30px] font-light leading-[1.08] tracking-[-0.035em] text-slate-950 md:text-[42px]`}>
            Jemná mlha. Lehčí vzduch.<br />
            <span className="text-slate-500">Okamžitý pocit ochlazení.</span>
          </p>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 h-screen bg-[#dff6ff]"
          style={{ translateY: washY }}
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 z-40 flex h-screen flex-col justify-center bg-[#dff6ff] px-6 md:px-12 lg:px-[6vw]"
          style={{ translateY: washY }}
        >
          <p className="mb-4 text-[28px] font-light tracking-[-0.03em] text-slate-800 md:text-[38px]">Tohle jsou</p>
          <div className="flex items-end gap-3 md:gap-5">
            <span className="text-[clamp(64px,14vw,190px)] font-semibold leading-[0.8] tracking-[-0.07em] text-slate-950">MLŽIDLA</span>
            <span className="mb-1 text-[18px] font-medium text-sky-700 md:mb-3 md:text-[30px]">by HolmTec</span>
          </div>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-600 md:text-xl">
            Architektonické mlžné prvky pro města, veřejný prostor i zahrady — navržené tak, aby ochlazovaly místo a současně do něj přirozeně patřily.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

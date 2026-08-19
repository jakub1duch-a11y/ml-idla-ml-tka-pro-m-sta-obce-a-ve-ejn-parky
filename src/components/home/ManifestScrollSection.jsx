import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Scroll-driven brand manifesto inspired by the interaction pattern
// of the referenced Base44 landing page, adapted to the MLŽIDLA brand.
const VIDEO_URL = '/media/optimized/c7c9d3e68_video_20260619_164025.webm';

export default function ManifestScrollSection() {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

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

  return (
    <section ref={ref} className="relative h-[430vh] bg-[#f6f9fb]" aria-label="Manifest značky MLŽIDLA">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#f6f9fb]">
        <motion.div
          className="absolute top-1/2 -translate-x-1/2"
          style={{
            left: videoLeft,
            y: videoY,
            translateY: isMobile ? '-62%' : '-50%',
            width: videoWidth,
            opacity: videoOpacity,
          }}
        >
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
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
          className="absolute left-0 top-[11%] flex w-full justify-center px-6"
          style={{ opacity: title1Op, y: title1Y }}
        >
          <p className="max-w-5xl text-center text-[30px] font-light leading-[1.08] tracking-[-0.035em] text-slate-950 md:text-[48px] lg:text-[58px]">
            Nevyrábíme jen mlžítka.
          </p>
        </motion.div>

        <motion.div
          className="absolute -translate-y-1/2"
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
            Řešíme každý detail<br />městského mikroklimatu.
          </p>
        </motion.div>

        <motion.div
          className="absolute -translate-y-1/2"
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
            Čisté v prostoru.<br />
            <span className="text-slate-500">Úsporné v provozu.</span>
          </p>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 h-screen bg-[#dff6ff]"
          style={{ translateY: washY }}
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 flex h-screen flex-col justify-center bg-[#dff6ff] px-6 md:px-12 lg:px-[6vw]"
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

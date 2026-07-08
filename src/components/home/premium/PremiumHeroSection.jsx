import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DrawPath } from "./DrawIcon";

const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1c96c5e64_spiralvoemlzitko-rezidencni.png";

function MistDrawIcon() {
  return (
    <motion.svg
      width="52" height="52" viewBox="0 0 48 48" fill="none" className="text-sky-500 mx-auto mb-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
    >
      <DrawPath d="M24 6C16 16 12 22 12 28a12 12 0 0024 0c0-6-4-12-12-22z" />
      <DrawPath d="M18 34c1 2 3 3 6 3" transition={{ delay: 0.4, duration: 0.6 }} />
    </motion.svg>
  );
}

function Droplet({ left, delayRange, speed, size = 3, height = 26 }) {
  const y = useTransform(delayRange.progress, [0, 1], [0, speed]);
  const opacity = useTransform(delayRange.progress, delayRange.fade, [0, 1, 1, 0.2]);
  return (
    <motion.span
      style={{ left: `${left}%`, y, opacity, width: size, height }}
      className="absolute top-[10%] rounded-full bg-gradient-to-b from-sky-200/80 to-white/10 blur-[0.5px]"
    />
  );
}

export default function PremiumHeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const mistLayer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const mistLayer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const mistLayer3Y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], [0.2, 0.8, 0.9, 0.5]);

  const deviceScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3]);
  const deviceY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.2, 0.32, 0.45, 0.55], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);

  const droplets = [
    { left: 8, speed: 260, size: 3, height: 22 },
    { left: 18, speed: 340, size: 2, height: 30 },
    { left: 30, speed: 200, size: 3, height: 18 },
    { left: 62, speed: 300, size: 2, height: 26 },
    { left: 74, speed: 380, size: 3, height: 20 },
    { left: 86, speed: 240, size: 2, height: 34 },
    { left: 92, speed: 320, size: 3, height: 16 },
  ];

  return (
    <section ref={ref} style={{ height: "400vh" }} className="relative bg-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-[#F8F9FA]">
        {/* Soft parallax mist layers */}
        <motion.div style={{ y: mistLayer1Y, opacity: mistOpacity }} className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-white/70 blur-[90px] rounded-full pointer-events-none" />
        <motion.div style={{ y: mistLayer2Y, opacity: mistOpacity }} className="absolute top-[20%] left-[10%] w-[60%] h-[50%] bg-sky-50/80 blur-[70px] rounded-full pointer-events-none" />
        <motion.div style={{ y: mistLayer3Y, opacity: mistOpacity }} className="absolute bottom-0 right-[5%] w-[50%] h-[40%] bg-white/60 blur-[80px] rounded-full pointer-events-none" />

        {/* Parallax droplets */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {droplets.map((d, i) => (
            <Droplet key={i} left={d.left} speed={d.speed} size={d.size} height={d.height} delayRange={{ progress: scrollYProgress, fade: [0, 0.2, 0.7, 1] }} />
          ))}
        </div>

        {/* Device */}
        <motion.div style={{ scale: deviceScale, y: deviceY }} className="relative w-[220px] md:w-[340px] aspect-[3/4] z-10">
          <img src={DEVICE_IMG} alt="Prémiové nerezové mlžidlo" className="w-full h-full object-contain drop-shadow-2xl" />
        </motion.div>

        <motion.div style={{ opacity: text1Opacity }} className="absolute inset-x-0 top-[13%] text-center px-6 z-20">
          <MistDrawIcon />
          <h1 className="font-sans font-light text-4xl md:text-6xl text-slate-900 tracking-tight">Prémiová nerezová mlžidla</h1>
        </motion.div>

        <motion.div style={{ opacity: text2Opacity }} className="absolute inset-x-0 bottom-[16%] text-center px-6 max-w-xl mx-auto z-20">
          <p className="font-sans font-light text-lg md:text-2xl text-slate-700">Spojení čistého minimalistického tvaru s vysokotlakým mikro-chlazením.</p>
        </motion.div>

        <motion.div style={{ opacity: text3Opacity }} className="absolute inset-x-0 bottom-[14%] text-center px-6 max-w-xl mx-auto z-20">
          <p className="font-sans font-light text-lg md:text-2xl text-slate-700">Navrženo jako exkluzivní prvek pro moderní zahrady, terasy a atria.</p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          style={{ opacity: text1Opacity }}
        >
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-slate-400">Scroll</span>
          <motion.div
            className="w-[1px] h-8 bg-slate-300"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
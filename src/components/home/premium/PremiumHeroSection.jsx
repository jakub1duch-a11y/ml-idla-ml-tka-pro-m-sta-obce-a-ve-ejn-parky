import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { DrawPath } from "./DrawIcon";

const DEVICE_VIDEO = "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2c4b0efa9_animatediconmist.mp4";

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

function Droplet({ left, top, speed, size, height, progress }) {
  const y = useTransform(progress, [0, 1], [0, speed]);
  const smoothY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.6 });
  const opacity = useTransform(progress, [0, 0.25, 0.75, 1], [0, 0.5, 0.5, 0.15]);
  return (
    <motion.span
      style={{ left: `${left}%`, top: `${top}%`, y: smoothY, opacity, width: size, height }}
      className="absolute rounded-full bg-gradient-to-b from-sky-100/60 to-white/0 blur-[1px]"
    />
  );
}

export default function PremiumHeroSection() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 22, mass: 0.7 });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = v * video.duration;
    }
  });

  const mistLayer1Y = useTransform(smoothProgress, [0, 1], ["0%", "-12%"]);
  const mistLayer2Y = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);
  const mistLayer3Y = useTransform(smoothProgress, [0, 1], ["0%", "8%"]);
  const mistOpacity = useTransform(smoothProgress, [0, 0.3, 0.65, 1], [0.15, 0.45, 0.55, 0.35]);

  const deviceScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const deviceY = useTransform(smoothProgress, [0, 1], ["0%", "-5%"]);

  const text1Opacity = useTransform(smoothProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const text2Opacity = useTransform(smoothProgress, [0.2, 0.32, 0.45, 0.55], [0, 1, 1, 0]);
  const text3Opacity = useTransform(smoothProgress, [0.78, 0.9, 1], [0, 1, 1]);

  const droplets = [
    { left: 8, top: 8, speed: 140, size: 2, height: 16 },
    { left: 18, top: 4, speed: 190, size: 2, height: 20 },
    { left: 30, top: 12, speed: 110, size: 2, height: 14 },
    { left: 62, top: 6, speed: 170, size: 2, height: 18 },
    { left: 74, top: 10, speed: 210, size: 2, height: 15 },
    { left: 86, top: 5, speed: 130, size: 2, height: 22 },
    { left: 92, top: 14, speed: 180, size: 2, height: 12 },
  ];

  return (
    <section ref={ref} style={{ height: "400vh" }} className="relative bg-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-[#F8F9FA]">
        {/* Background video */}
        <video
          autoPlay muted loop playsInline
          src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/621b949b8_Terrace_Mist_Hero_Video.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
        />
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />

        {/* Soft parallax mist layers */}
        <motion.div style={{ y: mistLayer1Y, opacity: mistOpacity }} className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-white/60 blur-[110px] rounded-full pointer-events-none" />
        <motion.div style={{ y: mistLayer2Y, opacity: mistOpacity }} className="absolute top-[20%] left-[10%] w-[60%] h-[50%] bg-sky-50/60 blur-[90px] rounded-full pointer-events-none" />
        <motion.div style={{ y: mistLayer3Y, opacity: mistOpacity }} className="absolute bottom-0 right-[5%] w-[50%] h-[40%] bg-white/50 blur-[100px] rounded-full pointer-events-none" />

        {/* Gentle parallax droplets */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {droplets.map((d, i) => (
            <Droplet key={i} {...d} progress={smoothProgress} />
          ))}
        </div>

        {/* Animated device — scroll-scrubbed */}
        <motion.div style={{ scale: deviceScale, y: deviceY }} className="relative w-[220px] md:w-[340px] aspect-square z-10">
          <video ref={videoRef} src={DEVICE_VIDEO} muted preload="auto" className="w-full h-full object-contain drop-shadow-2xl" />
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
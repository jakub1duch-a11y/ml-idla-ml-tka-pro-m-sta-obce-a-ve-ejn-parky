import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { DrawPath } from "./DrawIcon";

const MIST_VIDEO = "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/952d27811_mlzitkobendy-mlzudla.mp4";

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

export default function PremiumHeroSection() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = v * video.duration;
    }
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.55, 0.3, 0.15, 0.3, 0.5]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.2, 0.32, 0.45, 0.55], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);

  return (
    <section ref={ref} style={{ height: "400vh" }} className="relative bg-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-[#F8F9FA]">
        <motion.video
          ref={videoRef}
          src={MIST_VIDEO}
          muted
          preload="auto"
          style={{ scale: videoScale }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-white" />

        <motion.div style={{ opacity: text1Opacity }} className="absolute inset-x-0 top-[15%] text-center px-6">
          <MistDrawIcon />
          <h1 className="font-sans font-light text-4xl md:text-6xl text-slate-900 tracking-tight">Prémiová nerezová mlžidla</h1>
        </motion.div>

        <motion.div style={{ opacity: text2Opacity }} className="absolute inset-x-0 bottom-[16%] text-center px-6 max-w-xl mx-auto">
          <p className="font-sans font-light text-lg md:text-2xl text-slate-700">Spojení čistého minimalistického tvaru s vysokotlakým mikro-chlazením.</p>
        </motion.div>

        <motion.div style={{ opacity: text3Opacity }} className="absolute inset-x-0 bottom-[14%] text-center px-6 max-w-xl mx-auto">
          <p className="font-sans font-light text-lg md:text-2xl text-slate-700">Navrženo jako exkluzivní prvek pro moderní zahrady, terasy a atria.</p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const DEVICE_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1c96c5e64_spiralvoemlzitko-rezidencni.png";

export default function PremiumHeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.55, 0.8, 1], [1, 1.9, 1.9, 0.85, 0.85]);
  const x = useTransform(scrollYProgress, [0, 0.3, 0.55, 0.8, 1], ["0%", "-8%", "-8%", "0%", "0%"]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.55, 0.8, 1], ["0%", "-10%", "-10%", "0%", "0%"]);

  const mistOpacity = useTransform(scrollYProgress, [0.35, 0.55, 0.75, 0.95], [0, 1, 1, 0.3]);
  const condensationOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.85], [0, 1, 0.4]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);

  return (
    <section ref={ref} style={{ height: "400vh" }} className="relative bg-[#F8F9FA]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ scale, x, y }} className="relative w-[280px] md:w-[420px] aspect-[3/4]">
          <img src={DEVICE_IMG} alt="Prémiové nerezové mlžidlo" className="w-full h-full object-contain drop-shadow-2xl" />
          <motion.div style={{ opacity: mistOpacity }} className="absolute -top-10 left-1/2 -translate-x-1/2 w-[220%] h-[60%] pointer-events-none">
            <div className="w-full h-full bg-white/70 blur-3xl rounded-full" />
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: condensationOpacity }} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-[2px] rounded-full bg-slate-300/70"
              style={{
                left: `${(i * 7 + 4) % 100}%`,
                top: `${(i * 13) % 40}%`,
                height: `${20 + (i % 5) * 10}px`,
                animation: "drip 3.5s linear infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: text1Opacity }} className="absolute inset-x-0 top-[12%] text-center px-6">
          <h1 className="font-serif text-4xl md:text-6xl text-slate-900 tracking-tight">Prémiová nerezová mlžidla</h1>
        </motion.div>

        <motion.div style={{ opacity: text2Opacity }} className="absolute inset-x-0 bottom-[14%] text-center px-6 max-w-xl mx-auto">
          <p className="font-sans text-lg md:text-2xl text-slate-700">Spojení čistého minimalistického tvaru s vysokotlakým mikro-chlazením.</p>
        </motion.div>

        <motion.div style={{ opacity: text3Opacity }} className="absolute inset-x-0 bottom-[12%] text-center px-6 max-w-xl mx-auto">
          <p className="font-sans text-lg md:text-2xl text-slate-700">Navrženo jako exkluzivní prvek pro moderní zahrady, terasy a atria.</p>
        </motion.div>
      </div>
    </section>
  );
}
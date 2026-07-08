import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { DrawPath } from "./DrawIcon";

const DEVICE_VIDEO = "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2c4b0efa9_animatediconmist.mp4";

function MistDrawIcon() {
  return (
    <motion.svg
      width="52" height="52" viewBox="0 0 48 48" fill="none" className="text-white mx-auto mb-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      
      <DrawPath d="M24 6C16 16 12 22 12 28a12 12 0 0024 0c0-6-4-12-12-22z" />
      <DrawPath d="M18 34c1 2 3 3 6 3" transition={{ delay: 0.4, duration: 0.6 }} />
    </motion.svg>);

}

function Droplet({ left, top, speed, size, height, progress }) {
  const y = useTransform(progress, [0, 1], [0, speed]);
  const smoothY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.6 });
  const opacity = useTransform(progress, [0, 0.25, 0.75, 1], [0, 0.5, 0.5, 0.15]);
  return (
    <motion.span
      style={{ left: `${left}%`, top: `${top}%`, y: smoothY, opacity, width: size, height }}
      className="absolute rounded-full bg-gradient-to-b from-sky-100/60 to-white/0 blur-[1px]" />);


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
  { left: 92, top: 14, speed: 180, size: 2, height: 12 }];


  return null;























































}
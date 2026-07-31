import React from "react";
import { motion } from "framer-motion";
import { DrawPath } from "./DrawIcon";

const Wrap = ({ children }) =>
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="h-12 w-12 text-secondary">
    {children}
  </svg>;


export function HumidifyIcon() {
  return (
    <Wrap>
      <DrawPath d="M24 6C16 16 12 22 12 28a12 12 0 0024 0c0-6-4-12-12-22z" />
      <DrawPath d="M18 34c1 2 3 3 6 3" transition={{ delay: 0.4, duration: 0.6 }} />
    </Wrap>);

}

export function DustIcon() {
  return (
    <Wrap>
      <DrawPath d="M8 24h6M14 16h5M18 32h6M26 12h6M30 24h8M24 36h7" />
    </Wrap>);

}

export function ShieldIcon() {
  return (
    <Wrap>
      <DrawPath d="M24 6l14 6v10c0 10-6 17-14 20-8-3-14-10-14-20V12l14-6z" />
      <DrawPath d="M17 24l5 5 9-11" transition={{ delay: 0.5, duration: 0.5 }} />
    </Wrap>);

}

export function FrostIcon() {
  return (
    <Wrap>
      <DrawPath d="M24 6v36M10 14l28 20M38 14L10 34" />
      <DrawPath d="M24 6l-4 6m4-6l4 6M24 42l-4-6m4 6l4-6" transition={{ delay: 0.5, duration: 0.5 }} />
    </Wrap>);

}

export function SparkleIcon() {
  return (
    <Wrap>
      <DrawPath d="M24 6l3 12 12 3-12 3-3 12-3-12-12-3 12-3z" />
    </Wrap>);

}

export function CheckGlowIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="flex-shrink-0 mt-0.5">
      <motion.circle
        cx="13" cy="13" r="11" stroke="#22c55e" strokeWidth="1.4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ filter: "drop-shadow(0 0 3px rgba(34,197,94,0.6))" }} />
      
      <motion.path
        d="M8 13l3.5 3.5L18 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }} />
      
    </svg>);

}
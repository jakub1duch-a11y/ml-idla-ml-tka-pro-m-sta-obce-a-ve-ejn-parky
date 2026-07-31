import React from "react";
import { motion } from "framer-motion";

export function DrawPath({ d, ...props }) {
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.1, ease: "easeInOut" }}
      {...props}
    />
  );
}
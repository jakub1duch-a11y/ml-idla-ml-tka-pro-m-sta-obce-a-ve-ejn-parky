import React from 'react';
import { motion } from 'framer-motion';

const DEMO_VIDEO = "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/621b949b8_Terrace_Mist_Hero_Video.mp4";

export default function VideoTab({ product }) {
  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">VIDEO</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            {product.name} <span className="text-slate-400">v provozu.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Podívejte se, jak jemný nízkotlaký mlžný oblak vytváří příjemné mikroklima v reálném provozu.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
          <video src={DEMO_VIDEO} controls playsInline className="w-full aspect-video object-cover" />
        </motion.div>
      </div>
    </section>);

}
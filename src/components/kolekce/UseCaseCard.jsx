import React from 'react';
import { motion } from 'framer-motion';

export default function UseCaseCard({ item, index, reduceMotion }) {
  const { icon: Icon, code, title, text, image } = item;
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden border border-[#D3E2E8] bg-[#0A1628] p-6 transition-shadow duration-300 hover:shadow-[0_22px_54px_rgba(10,22,40,.22)]"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,.10)_0%,rgba(10,22,40,.55)_52%,rgba(10,22,40,.92)_100%)] transition-opacity duration-500 group-hover:opacity-95" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={reduceMotion ? undefined : { rotate: -6, scale: 1.08 }}
            className="flex h-11 w-11 items-center justify-center border border-white/25 bg-white/12 text-white backdrop-blur-md"
          >
            <Icon size={20} strokeWidth={1.6} />
          </motion.div>
          <span className="font-mono text-[11px] tracking-[.16em] text-[#22D3EE]">// {code}</span>
        </div>
        <h3 className="mt-14 font-heading text-xl font-semibold tracking-[-.02em] text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/75">{text}</p>
        <div className="mt-5 h-px w-10 bg-[#22D3EE] transition-all duration-500 group-hover:w-24" />
      </div>
    </motion.article>
  );
}
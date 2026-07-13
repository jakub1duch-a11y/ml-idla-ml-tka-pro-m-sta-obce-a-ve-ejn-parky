import React from 'react';
import { motion } from 'framer-motion';

const ITEMS = [
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f436db8ab_generated_image.png', label: 'Městský park' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/0549d625f_generated_image.png', label: 'Zoo Praha' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f6eb8b2ea_generated_image.png', label: 'Gastro terasa' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/91ce94feb_MlzitkoAURA.JPG', label: 'Soukromá zahrada' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png', label: 'Vstupní portál' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg', label: 'Školní dvůr' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7016348c6_generated_image.png', label: 'Náměstí' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/56eb29c84_generated_image.png', label: 'Nábřeží' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4ba44ac78_generated_image.png', label: 'Firemní areál' },
];

export default function MlzidlaRealizace() {
  return (
    <section className="bg-black py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brushed/60 mb-3">06 — Realizace</p>
        <h2 className="font-heading font-black text-3xl lg:text-4xl text-white uppercase tracking-tight mb-14">Vybrané instalace</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-brushed/25">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label + i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden border-brushed/25 border-b sm:border-r [&:nth-child(3n)]:sm:border-r-0"
            >
              <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const HERO_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/5a2af0f9e_Efektmlhy-mlznabrana-zivynahled.mov';

const CLIPS = [
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/bc59d4ed7_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.MOV', caption: 'Mlžení v akci' },
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2dbc1232d_EFC9FCE8-7138-44C3-AAE6-246F88644813.MOV', caption: 'Mlžení v akci' },
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/858a3a3f3_1283CEC3-EA3F-42B3-9E58-3788630B07A6.MOV', caption: 'Mlžení v akci' },
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ce13ff8ac_AF599DD3-EFF1-43AB-B6AB-40C8B869039F.MOV', caption: 'Mlžení v akci' },
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/8148cb378_instalace-mlzitka-mrak.MOV', caption: 'Instalace mlžítka Mrak' },
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2d9d98473_Svaovnukzkazive.mov', caption: 'Svařování u zákazníka' },
  { url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/b8e2893af_Ukazkasvarovanikotvicihptek.mov', caption: 'Svařování kotvících patek' },
];

export default function MistVideoShowcase() {
  return (
    <section className="bg-slate-900 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/25 text-white text-xs font-mono tracking-widest uppercase rounded-full mb-5">
            <Play size={11} /> Ukázky mlhy
          </span>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-white tracking-tight">
            Mlha, výroba a instalace — v reálném provozu.
          </h2>
        </motion.div>

        {/* Hero clip */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-white/10 mb-5">
          <video src={HERO_VIDEO} autoPlay muted loop playsInline className="w-full aspect-video object-cover bg-black" />
        </motion.div>

        {/* Grid of clips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLIPS.map((c, i) => (
            <motion.div key={c.url} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-xl overflow-hidden border border-white/10 bg-black">
              <video src={c.url} controls playsInline className="w-full aspect-video bg-black" />
              <p className="px-3 py-2.5 text-xs font-mono text-white/50 tracking-widest uppercase">{c.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
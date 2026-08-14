import React from 'react';
import { motion } from 'framer-motion';

const HERO_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/5a2af0f9e_Efektmlhy-mlznabrana-zivynahled.mov';

const CLIPS = [
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/bc59d4ed7_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.MOV', caption: 'Mlžení zblízka' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2dbc1232d_EFC9FCE8-7138-44C3-AAE6-246F88644813.MOV', caption: 'Jemná mlha v provozu' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/858a3a3f3_1283CEC3-EA3F-42B3-9E58-3788630B07A6.MOV', caption: 'Mlžná brána v akci' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ce13ff8ac_AF599DD3-EFF1-43AB-B6AB-40C8B869039F.MOV', caption: 'Chladivý efekt naživo' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/8148cb378_instalace-mlzitka-mrak.MOV', caption: 'Instalace mlžítka Mrak' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2d9d98473_Svaovnukzkazive.mov', caption: 'Svařování u zákazníka' },
{ url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/b8e2893af_Ukazkasvarovanikotvicihptek.mov', caption: 'Svařování kotvících patek' }];


export default function MistVideoShowcase() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Mlžení naživo</p>
            <h2 className="max-w-lg font-heading tracking-tight text-foreground text-3xl md:text-3xl">Od svařování nerezu po první mlhu na místě</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">Krátké záběry přímo z dílny a instalací — tak, jak to u nás skutečně vypadá.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 overflow-hidden rounded-3xl border border-border shadow-xl">
          <video src={HERO_VIDEO} autoPlay muted loop playsInline className="aspect-video w-full object-cover" />
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CLIPS.map((clip, i) =>
          <motion.div
            key={clip.url}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-border">
            
              <video
              src={clip.url}
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
              className="aspect-square w-full object-cover" />
            
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-xs font-medium text-white">{clip.caption}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}
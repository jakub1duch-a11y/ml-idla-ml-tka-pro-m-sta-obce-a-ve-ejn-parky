import React from 'react';
import { motion } from 'framer-motion';

export default function MlzidlaHero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-black">
      <img
        src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7016348c6_generated_image.png"
        alt="Mlžná socha MRÁK — nerezová instalace"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Hard light contrast overlay + dry fog grain */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: 'url(https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png)', backgroundSize: 'cover' }} />

      <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-12 items-end pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-12 lg:col-span-7 bg-brushed/90 border border-white/40 p-8 lg:p-10"
          style={{ backgroundImage: 'linear-gradient(135deg, #d8d8d8 0%, #b8b8b8 45%, #e8e8e8 55%, #c0c0c0 100%)' }}
        >
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-black/60 mb-4">HolmTec — Mlžné systémy</p>
          <h1 className="font-heading font-black text-3xl lg:text-5xl text-black leading-[1.05] tracking-tight uppercase" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.3)' }}>
            Interaktivní mlžné<br />instalace pro<br />městské prostory
          </h1>
          <div className="w-24 h-[2px] bg-black/70 my-6" />
          <p className="text-black/70 text-sm lg:text-base max-w-md font-medium">
            Nerezové mlžné sochy, brány a linie. Precizní CNC výroba, suchá mlha, teplotní efekt až −9 °C.
          </p>
          <a href="/kontakt" className="inline-block mt-8 px-8 py-3.5 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition-colors">
            Nezávazná poptávka
          </a>
        </motion.div>
      </div>
    </section>
  );
}
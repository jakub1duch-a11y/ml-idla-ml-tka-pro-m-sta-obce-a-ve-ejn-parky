import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PRODUCTS = [
  { name: 'Mlžná brána', img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png', slug: 'gate70' },
  { name: 'Mlžná linie', img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/56eb29c84_generated_image.png', slug: '' },
  { name: 'Mlžná socha MRÁK', img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7016348c6_generated_image.png', slug: '' },
  { name: 'Mobilní mlžítko', img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/855eabcfb_generated_image.png', slug: '' },
  { name: 'Mlžná zóna', img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg', slug: '' },
  { name: 'Nerezový sloup', img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4ba44ac78_generated_image.png', slug: '' },
];

export default function MlzidlaCatalog() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-black/40 mb-3">03 — Katalog</p>
        <h2 className="font-heading font-black text-3xl lg:text-4xl text-black uppercase tracking-tight mb-14">Katalog produktů</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-black/10">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative border-black/10 border-b md:border-r [&:nth-child(3n)]:md:border-r-0"
            >
              <Link to={p.slug ? `/produkt/${p.slug}` : '/kontakt'} className="block">
                <div className="aspect-square overflow-hidden relative bg-black">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wide">{p.name}</h3>
                    <ArrowRight size={16} className="text-techblue group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
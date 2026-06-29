import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GalleryLightbox from '../GalleryLightbox';

const fallbackPhotos = [
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e508e04b9_img-4513.jpeg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/1e2e816a4_ker-mlzitko.png',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/af3c01f8d_3695-fullsizerender-1.jpeg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/a01ebd4e8_volnytvar-motorkar-apli.png',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/6bcee1127_kontinent-mlzitko.png',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/d6618acdb_cd290d8c-b544-42b4-9823-9661da467f33.jpg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/0b7f23005_3734-fullsizerender.jpg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/c9de9fd45_img-3558.jpeg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f8370e628_573bb0e8-cd2d-4509-9b8f-738084ea3b2b.webp',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f01bc8d2c_img-4587.jpeg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/9e50cca6a_573bb0e8-cd2d-4509-9b8f-738084ea3b2b1.webp',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/38d5a8482_Mlzitko-do-zahrady-tvar-mrak-VDMA.webp',
];

export default function RealizaceSection() {
  const [realizace, setRealizace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    base44.entities.Realizace.list()
      .then(items => {
        setRealizace((items || []).filter(r => r.published));
      })
      .catch(() => {
        // fallback photos are shown when realizace is empty
      })
      .finally(() => setLoading(false));
  }, []);

  const allPhotos = realizace.flatMap(r => r.gallery_urls || []).filter(Boolean);
  const photosToShow = allPhotos.length > 0 ? allPhotos : fallbackPhotos;

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Naše realizace</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
            Fotografie z terénu
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size={24} className="animate-spin text-cyan/40" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photosToShow.map((src, i) => {
              // Find which realizace this photo belongs to
              const sourceProject = realizace.find(r => r.gallery_urls?.includes(src));
              return (
                <motion.button
                  key={i}
                  onClick={() => setLightbox({
                    images: photosToShow,
                    initialIndex: i,
                    location: sourceProject?.location,
                    productUsed: sourceProject?.product_used,
                  })}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="aspect-square overflow-hidden rounded-xl bg-card_bg group cursor-pointer"
                >
                  <img src={src} alt={`Realizace ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </motion.button>
              );
            })}
          </div>
        )}

        {lightbox && (
          <GalleryLightbox
            images={lightbox.images}
            initialIndex={lightbox.initialIndex}
            location={lightbox.location}
            productUsed={lightbox.productUsed}
            onClose={() => setLightbox(null)}
          />
        )}

        <div className="mt-8 text-center">
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 hover:border-cyan/40 transition-all">
            <MapPin size={15} /> Mapa naších instalací
          </Link>
        </div>
      </div>
    </section>
  );
}
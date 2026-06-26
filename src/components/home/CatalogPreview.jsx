import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    title: 'Veřejné prostory',
    subtitle: 'Plazas & Parks',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bf20c5485_generated_02071575.png',
    slug: 'verejne-prostory',
  },
  {
    title: 'Průmyslové chlazení',
    subtitle: 'Industrial Cooling',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f2a05a7ea_generated_23c47c5e.png',
    slug: 'prumyslove-chlazeni',
  },
  {
    title: 'Rezidenční mlžení',
    subtitle: 'Residential Misting',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a03b14a07_generated_54f692da.png',
    slug: 'rezidencni-mlzeni',
  },
  {
    title: 'Eventy & Gastronomie',
    subtitle: 'Events & Hospitality',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/83e0506f1_generated_fd2118cd.png',
    slug: 'eventy',
  },
];

export default function CatalogPreview() {
  return (
    <section id="katalog-preview" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <p className="text-hydro text-sm font-mono tracking-widest uppercase mb-3">Katalog řešení</p>
            <h2 className="text-3xl lg:text-5xl font-heading font-light text-tectonic tracking-tight">
              Od problému k řešení
            </h2>
          </div>
          <Link
            to="/katalog"
            className="flex items-center gap-2 text-sm font-medium text-tectonic/60 hover:text-hydro transition-colors tracking-wide uppercase"
          >
            Celý katalog <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                to={`/katalog?category=${cat.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-tectonic"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tectonic/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-hydro text-xs font-mono tracking-widest uppercase mb-2">{cat.subtitle}</p>
                  <h3 className="text-white text-xl lg:text-2xl font-heading font-light">{cat.title}</h3>
                  <div className="mt-4 flex items-center gap-2 text-white/60 text-sm group-hover:text-hydro transition-colors">
                    Prozkoumat <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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
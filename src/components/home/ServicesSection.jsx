import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Wrench, Settings, HeadphonesIcon } from 'lucide-react';

const SERVICES_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/eddd3147c_generated_d4832d58.png";

const services = [
  {
    icon: Compass,
    title: 'Návrh & Projektování',
    description: 'Komplexní projektová dokumentace a 3D vizualizace mlžných systémů přizpůsobených vašemu prostoru.',
  },
  {
    icon: Wrench,
    title: 'Realizace & Instalace',
    description: 'Profesionální montáž s certifikovanými techniky. Od přípojek po finální kalibraci systému.',
  },
  {
    icon: Settings,
    title: 'Servis & Údržba',
    description: 'Pravidelný servis, výměna trysek a filtrů, zimní konzervace a jarní zprovoznění.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Konzultace & Poradenství',
    description: 'Bezplatná vstupní konzultace. Posoudíme vaše potřeby a navrhneme optimální řešení.',
  },
];

export default function ServicesSection() {
  return (
    <section id="sluzby" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src={SERVICES_IMG}
              alt="Mist cooling system installation"
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-hydro text-white px-8 py-4 hidden lg:block">
              <p className="text-3xl font-heading font-light">15+</p>
              <p className="text-xs tracking-wider uppercase">let zkušeností</p>
            </div>
          </motion.div>

          {/* Services List */}
          <div>
            <p className="text-hydro text-sm font-mono tracking-widest uppercase mb-3">Naše služby</p>
            <h2 className="text-3xl lg:text-5xl font-heading font-light text-tectonic tracking-tight mb-12">
              Komplexní řešení od A do Z
            </h2>

            <div className="space-y-8">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-5"
                >
                  <div className="flex-shrink-0 w-12 h-12 border border-steel flex items-center justify-center">
                    <service.icon size={20} className="text-hydro" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-medium text-tectonic mb-1">{service.title}</h3>
                    <p className="text-sm text-tectonic/60 leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
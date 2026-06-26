import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const products = [
  {
    slug: 'steblo',
    category: 'Zahradní socha',
    name: 'Stéblo',
    desc: 'Minimalistický nerezový prut s integrovanou mlžící tryskou. Bez viditelných hadic, bez kompromisů v designu. Výška 80–160 cm.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/dec576b4e_upscaled_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
  {
    slug: 'gate',
    category: 'Veřejný prostor',
    name: 'GATE brána',
    desc: 'Průchozí mlžná brána pro náměstí, parky a vstupy do budov. Ochlazení −9 °C v průchozí zóně. Záruka 5 let.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/10d7399ee_Mlzitko-mlzici-brana-hranata-na-namesti-VDMA.webp',
  },
  {
    slug: 'mlhoviste',
    category: 'Hřiště & parky',
    name: 'Mlžiště pro děti',
    desc: 'Interaktivní mlžné prvky pro dětská hřiště a mateřské školy. Atraktivní tvar, bezpečné materiály, radost na celý den.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
  },
];

export default function ProductsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Naše produkty</p>
          <h2 className="font-heading font-black text-4xl lg:text-5xl text-white tracking-tight">
            Co umíme vytvořit
          </h2>
          <p className="mt-3 text-white/50 max-w-lg">
            Od zahradní skulptury po průmyslovou mlžnou bránu — každý produkt je navržen jako dílo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to="/kolekce" className="group block bg-card_bg rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/40 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">{p.category}</p>
                  <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-cyan font-medium">
                    Více <ArrowRight size={14} />
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
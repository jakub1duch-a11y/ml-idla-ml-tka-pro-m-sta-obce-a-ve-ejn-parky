import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const posts = [
  {
    tag: 'Technologie',
    date: 'Červen 2026',
    readTime: '4 min',
    title: 'Jak evaporace mění mikroklima veřejných prostorů',
    excerpt: 'Věda za mlhou: kapky 10–50 μm se odpařují ještě ve vzduchu a absorbují teplo z okolí. Vysvětlujeme fyziku, která stojí za ochlazením až 9 °C.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
  },
  {
    tag: 'Instalace',
    date: 'Květen 2026',
    readTime: '6 min',
    title: 'Dětské hřiště a mlhoviště: vše co potřebujete vědět',
    excerpt: 'Bezpečnost, certifikace, materiály. Kompletní průvodce pro obce a správce hřišť, kteří zvažují instalaci mlžného systému pro děti.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
  {
    tag: 'Design',
    date: 'Duben 2026',
    readTime: '5 min',
    title: 'AURA: nerezový kruh, který ovládl náměstí',
    excerpt: 'Příběh vzniku modelu AURA — od skici přes technický výkres po instalaci na Náměstí Republiky. Rozhovor s projektovým inženýrem.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  },
  {
    tag: 'Udržitelnost',
    date: 'Březen 2026',
    readTime: '3 min',
    title: 'Mlžení vs. klimatizace: srovnání spotřeby a dopadu',
    excerpt: 'Porovnáváme energetickou náročnost, spotřebu vody a uhlíkovou stopu obou technologií. Výsledky překvapí.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/39c506f5b_891c5179a_Social_Media_Video_Ads_A_curved_metallic_pipe_speckled_with_glistening_1_-N3ABn.png',
  },
];

export default function BlogSection() {
  const [featured, ...rest] = posts;

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Blog & znalosti</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              O mlžení do hloubky
            </h2>
            <Link to="/kontakt" className="inline-flex items-center gap-2 text-sm text-cyan font-light hover:gap-3 transition-all">
              Všechny články <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured post */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-3 group cursor-pointer">
            <div className="rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all h-full flex flex-col bg-card_bg">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-cyan tracking-widest uppercase">{featured.tag}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1 text-xs font-mono text-white/30"><Clock size={10} />{featured.readTime}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-xs font-mono text-white/30">{featured.date}</span>
                </div>
                <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-3 leading-snug group-hover:text-cyan/90 transition-colors">{featured.title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed flex-1">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-cyan font-light group-hover:gap-3 transition-all">
                  Číst článek <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side posts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post, i) => (
              <motion.div key={post.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all flex gap-0 bg-card_bg h-full">
                  <div className="w-28 flex-shrink-0 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-cyan tracking-widest uppercase">{post.tag}</span>
                        <span className="flex items-center gap-1 text-xs font-mono text-white/25"><Clock size={9} />{post.readTime}</span>
                      </div>
                      <h4 className="font-light text-white text-sm leading-snug group-hover:text-cyan/90 transition-colors line-clamp-2">{post.title}</h4>
                    </div>
                    <p className="text-xs font-mono text-white/30 mt-2">{post.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Building2, GraduationCap, Trees, Home as HomeIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_LINKS = [
  { slug: 'mesta-obce', path: '/kategorie/mesta-obce', icon: Building2, benefit: 'Ochlazení náměstí, ulic a veřejných prostorů pro občany i návštěvníky.' },
  { slug: 'skoly-skolky-deti', path: '/kategorie/skoly-skolky-deti', icon: GraduationCap, benefit: 'Jemná mlha na hřištích a dvorech chrání děti před přehřátím v horkých dnech.' },
  { slug: 'parky-hriste', path: '/kategorie/parky-hriste', icon: Trees, benefit: 'Chladivá oáza v parcích a na hřištích — prodlouží dobu pobytu venku.' },
  { slug: 'outdoor-zahrady', path: '/kategorie/outdoor-zahrady', icon: HomeIcon, benefit: 'Nerezové mlžítko do zahrady nebo na terasu — ticho, design a ochlazení.' },
];

export default function WhoForSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ProductCategory.list('order')
      .then((items) => setCategories(items || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const getImage = (slug) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat?.image_url || '';
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 sm:mb-10">
          <p className="font-mono tracking-widest uppercase text-slate-400 mb-2 text-xs">PRO KOHO</p>
          <h2 className="font-heading font-medium tracking-tight text-slate-900 text-[clamp(1.75rem,5vw,2.5rem)]">
            Řešení pro každý prostor
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_LINKS.map((cat, i) => {
              const Icon = cat.icon;
              const img = getImage(cat.slug);
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link to={cat.path} className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#0b4860]/30 hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {img ? (
                        <img src={img} alt={cat.benefit} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                          <Icon size={40} className="text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                        <Icon size={16} className="text-cyan-300" />
                        <span className="text-sm font-semibold">{cat.path.split('/').pop().replace(/-/g, ' ')}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{cat.benefit}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4860] group-hover:gap-2.5 transition-all">
                        Prohlédnout <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
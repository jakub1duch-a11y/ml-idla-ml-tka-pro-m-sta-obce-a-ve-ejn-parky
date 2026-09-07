import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, GraduationCap, Home as HomeIcon, Loader, Trees, Waves } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_LINKS = [
  {
    slug: 'mesta-obce',
    path: '/kategorie/mesta-obce',
    icon: Building2,
    title: 'Města a obce',
    benefit: 'Náměstí, parky, pěší zóny a veřejná prostranství, kde lidé v létě opravdu tráví čas.',
  },
  {
    slug: 'skoly-skolky-deti',
    path: '/kategorie/skoly-skolky-deti',
    icon: GraduationCap,
    title: 'Školy a dětské prostory',
    benefit: 'Dvoře, hřiště a čekací zóny, kde má jemná mlha přinést úlevu bez mokrého povrchu.',
  },
  {
    slug: 'parky-hriste',
    path: '/kategorie/parky-hriste',
    icon: Trees,
    title: 'Parky, ZOO a areály',
    benefit: 'Pobytové trasy, odpočinkové body a místa s vyšší návštěvností během horkých dnů.',
  },
  {
    slug: 'koupaliste-aquaparky',
    path: '/kategorie/koupaliste-aquaparky',
    icon: Waves,
    title: 'Koupaliště a gastro',
    benefit: 'Fronty, terasy, občerstvení a čekací zóny, kde ochlazení zvyšuje komfort návštěvníků.',
  },
  {
    slug: 'outdoor-zahrady',
    path: '/kategorie/outdoor-zahrady',
    icon: HomeIcon,
    title: 'Rezidence a zahrady',
    benefit: 'Tiché ochlazení teras, pergol a zahradních pobytových míst s důrazem na design.',
  },
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
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono tracking-[.2em] uppercase text-[#0b7280] mb-3 text-[11px] font-semibold">Kde dává mlžení smysl</p>
            <h2 className="font-heading font-semibold tracking-[-.045em] text-slate-950 text-[clamp(2rem,5vw,4rem)] leading-[.98]">
              Různé prostory. Různé nároky. Jeden princip: navrhnout příjemnější mikroklima.
            </h2>
          </div>
          <Link to="/kategorie/mesta-obce" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50">
            Projít použití <ArrowRight size={15} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : (
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
            {CATEGORY_LINKS.map((cat, i) => {
              const Icon = cat.icon;
              const img = getImage(cat.slug);
              return (
                <motion.article
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-auto"
                >
                  <Link to={cat.path} className="group block h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/5">
                    <div className="relative aspect-[4/4.3] overflow-hidden bg-slate-100">
                      {img ? (
                        <img src={img} alt={cat.benefit} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#eef7f6]">
                          <Icon size={42} className="text-[#0b7280]/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/12 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/16 bg-white/12 backdrop-blur-md">
                          <Icon size={18} className="text-cyan-200" />
                        </div>
                        <h3 className="font-heading text-xl font-semibold leading-tight">{cat.title}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-slate-600 leading-7">{cat.benefit}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4860] transition-all group-hover:gap-2.5">
                        Detail použití <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

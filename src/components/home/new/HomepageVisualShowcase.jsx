import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trees, Home, Landmark, Sparkles, Droplets } from 'lucide-react';

const useCases = [
  {
    icon: Landmark,
    title: 'LINEA',
    text: 'Sloupové mlžítko pro čistou architekturu náměstí, promenád a veřejných vstupů.',
    image: '/media/optimized/bcb5c5f4d_C-MlzitkoLINEA_CE70_single.webp',
    link: '/produkt/linea-mlzitko',
  },
  {
    icon: Sparkles,
    title: 'STÉBLO',
    text: 'Organický nerezový prvek pro jemnou vodní mlhu v zahradách, parcích a pobytových zónách.',
    image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp',
    link: '/produkt/mlzitko-steblo',
  },
  {
    icon: Trees,
    title: 'MLŽNÉ HŘIŠTĚ',
    text: 'Osvěžení na sportovištích, školních zahradách a veřejných herních místech.',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    link: '/kategorie/skoly-skolky-deti',
  },
  {
    icon: Home,
    title: 'AURA',
    text: 'Kruhové mlžítko pro rezidenční zahrady, terasy a reprezentativní klidové zóny.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    link: '/zahradni-mlzitka',
  },
];

const products = [
  {
    name: 'MRAK',
    label: 'Hravé mlžítko',
    text: 'Výrazný prvek pro školy, školky, hřiště a pobytové zóny s dětmi.',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    link: '/kategorie/skoly-skolky-deti',
  },
  {
    name: 'LINEA',
    label: 'Sloupové mlžítko',
    text: 'Minimalistické sloupové mlžítko pro náměstí, promenády a moderní veřejný prostor.',
    image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp',
    link: '/produkt/linea-mlzitko',
  },
  {
    name: 'MLŽNÉ HŘIŠTĚ',
    label: 'Vodní mlha pro děti',
    text: 'Osvěžení na sportovištích, školních zahradách a veřejných herních zónách.',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    link: '/kategorie/skoly-skolky-deti',
  },
  {
    name: 'MLŽNÁ BRÁNA',
    label: 'Průchozí ochlazení',
    text: 'Chytré mlžné brány pro ochlazování náměstí, eventy, nábřeží a pěší tahy.',
    image: '/media/optimized/a2d77392e_Mlnbranyaportaly.webp',
    link: '/mlzne-brany',
  },
  {
    name: 'STÉBLO',
    label: 'Organický tvar',
    text: 'Jemná vertikální linie pro zahrady, parky a komornější odpočinkové zóny.',
    image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp',
    link: '/produkt/mlzitko-steblo',
  },
  {
    name: 'BENDY',
    label: 'Pobytová zóna',
    text: 'Měkká nerezová linie pro vodní mlhu na veřejná prostranství i rezidenční zahrady.',
    image: '/media/optimized/31478e4b3_bendymlzitko02.webp',
    link: '/produkt/mlzitko-bendy',
  },
  {
    name: 'AURA',
    label: 'Kruhové mlžení',
    text: 'Elegantní nerezový prvek pro parky, promenády a klidové zóny.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    link: '/produkt/aura-mlzitko',
  },
];

export default function HomepageVisualShowcase() {
  return (
    <>
      <section className="bg-white py-8 sm:py-12 lg:py-16" aria-labelledby="usecases-title">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#0B8EC5]">Mlžítka podle charakteru místa</p>
              <h2 id="usecases-title" className="mt-3 font-heading text-3xl font-bold tracking-[-.045em] text-[#07131D] sm:text-4xl lg:text-5xl">Osvěžení, které zapadne do vašeho prostoru.</h2>
            </div>
            <Link to="/poptavka" className="inline-flex items-center gap-2 self-start rounded-full bg-[#07131D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B8EC5] sm:self-auto">
              Navrhnout řešení <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map(({ icon: Icon, title, text, image, link }, index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} whileTap={{ scale: 0.985 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Link to={link} className="group relative block min-h-[360px] overflow-hidden rounded-[1.6rem] bg-[#07131D] shadow-[0_24px_70px_rgba(7,19,29,.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]">
                  <img src={image} alt={`${title} — produkt MLŽIDLA.CZ`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/26 to-transparent" />
                  <motion.span className="absolute left-5 right-5 top-5 h-px origin-left rounded-full bg-gradient-to-r from-[#26C6E9] via-white/60 to-transparent opacity-0 group-hover:opacity-100" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.72, delay: 0.12 + index * 0.04 }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-black/28 text-[#26C6E9] backdrop-blur-md transition group-hover:scale-105">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-heading text-2xl font-bold tracking-[-.04em]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/76">{text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] transition group-hover:translate-x-1">
                      Zobrazit řešení <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#071A2F] py-20 text-white lg:py-28" aria-labelledby="products-title">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#26C6E9]">// Produktové kolekce</p>
              <h2 id="products-title" className="mt-4 max-w-[11ch] font-heading text-4xl font-bold leading-[.98] tracking-[-.055em] sm:text-5xl lg:text-6xl">Vodní mlha jako součást architektury.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/68">Kombinujeme nerezovou konstrukci, jemnou vodní mlhu a chytré řízení. Výsledkem jsou ochlazovací body, mlžné brány a pobytové zóny pro reálný městský provoz.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 rounded-full bg-[#26C6E9] px-5 py-3 text-sm font-bold text-[#071A2F]">Zobrazit produkty <ArrowRight size={16} /></Link>
                <Link to="/reference" className="inline-flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 text-sm font-bold text-white">Realizace</Link>
              </div>
            </div>

            <div className="-mx-5 flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
              {products.map((product, index) => (
                <motion.div key={product.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} whileTap={{ scale: 0.985 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.48, delay: index * 0.035 }} className="w-[78vw] shrink-0 snap-start sm:w-auto">
                  <Link to={product.link} className="group relative block h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[.045] transition duration-500 hover:border-[#26C6E9]/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#0B2034]">
                      <img src={product.image} alt={`${product.name} — ${product.label}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-transparent to-transparent" />
                      <motion.span className="absolute inset-y-8 right-5 w-px origin-bottom rounded-full bg-gradient-to-t from-transparent via-[#26C6E9] to-transparent opacity-0 group-hover:opacity-100" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ duration: 0.72, delay: 0.1 + index * 0.025 }} />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/82 backdrop-blur-md"><Sparkles size={13} className="text-[#26C6E9]" /> {product.label}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-2xl font-bold tracking-[-.04em]">{product.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/64">{product.text}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] transition group-hover:translate-x-1">
                        Detail produktu <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div className="flex items-start gap-3"><Droplets className="mt-1 text-[#26C6E9]" size={20} /><p className="text-sm leading-6 text-white/66"><strong className="block text-white">Cílené osvěžení zóny</strong>Podle provozu, mikroklimatu a konkrétního nastavení.</p></div>
            <div className="flex items-start gap-3"><Droplets className="mt-1 text-[#26C6E9]" size={20} /><p className="text-sm leading-6 text-white/66"><strong className="block text-white">Přímo z vodovodního řadu</strong>Nízkotlaké řešení navržené podle přívodu vody a místa instalace.</p></div>
            <div className="flex items-start gap-3"><Droplets className="mt-1 text-[#26C6E9]" size={20} /><p className="text-sm leading-6 text-white/66"><strong className="block text-white">Nerez + smart řízení</strong>Odolná konstrukce a provoz podle teploty nebo času.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

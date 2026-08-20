import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, ShieldCheck, Gauge, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ORDER = ['aura-mlzitko', 'aura-garden-duo', 'aura-city-single', 'aura-city-duo'];

const fallbackProducts = [
  {
    name: 'AURA Garden Single®',
    slug: 'aura-mlzitko',
    short_description: 'Samostatné designové mlžítko pro terasy, zahrady a rezidenční venkovní prostory.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.jpg',
    material: 'Nerezová ocel AISI 316L',
    pressure: '2–5 bar',
    coverage_area: 'zahrada / terasa / rezidence',
  },
  {
    name: 'AURA Garden Duo®',
    slug: 'aura-garden-duo',
    short_description: 'Dvojice mlžítek AURA pro širší ochlazení terasy, zahrady nebo rezidenčního prostoru.',
    image_url: '/media/optimized/db-858b838106-91ce94feb_MlzitkoAURA.webp',
    material: 'Nerezová ocel AISI 316L',
    pressure: '2–5 bar',
    coverage_area: 'zahrada / terasa / rezidence',
  },
  {
    name: 'AURA City Single®',
    slug: 'aura-city-single',
    short_description: 'Samostatná městská varianta pro náměstí, parky, promenády a veřejné pobytové zóny.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.jpg',
    material: 'Nerezová ocel AISI 316L',
    pressure: '2–5 bar',
    coverage_area: 'město / park / promenáda',
  },
  {
    name: 'AURA City Duo®',
    slug: 'aura-city-duo',
    short_description: 'Dvojitá městská sestava pro průchozí zóny, promenády a větší veřejné plochy.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/91ce94feb_MlzitkoAURA.JPG',
    material: 'Nerezová ocel AISI 316L',
    pressure: '2–5 bar',
    coverage_area: 'město / promenáda / veřejná zóna',
  },
];

function MistLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70 blur-3xl"
          style={{
            width: `${220 + i * 90}px`,
            height: `${120 + i * 45}px`,
            left: `${10 + i * 20}%`,
            top: `${28 + (i % 2) * 22}%`,
          }}
          animate={{
            x: [0, 40 + i * 8, -12, 0],
            y: [0, -18, 10, 0],
            opacity: [0.08, 0.32, 0.18, 0.08],
            scale: [0.92, 1.14, 1.04, 0.92],
          }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ProductStory({ product, index }) {
  const reverse = index % 2 === 1;
  const isDuo = /duo/i.test(product.name);
  const context = /city/i.test(product.name) ? 'Městská řada' : 'Zahradní řada';

  return (
    <section className="border-t border-slate-200 bg-[#f7f8f6]">
      <div className={`mx-auto grid max-w-[1500px] items-stretch lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="relative min-h-[520px] overflow-hidden bg-[#eef2f3] md:min-h-[680px]"
        >
          <img
            src={product.image_url}
            alt={`${product.name} – designové nerezové mlžítko AURA`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-white/5" />
          <MistLayer />
          <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-slate-800 backdrop-blur-md md:left-8 md:top-8">
            {context} · {isDuo ? 'Duo' : 'Single'}
          </div>
        </motion.div>

        <div className="flex min-h-[520px] flex-col justify-between bg-[#f7f8f6] px-6 py-10 sm:px-10 md:min-h-[680px] md:py-14 lg:px-14 xl:px-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-sky-700">AURA® / {String(index + 1).padStart(2, '0')}</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-medium leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-5xl xl:text-7xl">
              {product.name}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              {product.short_description}
            </p>
          </div>

          <div className="mt-12">
            <div className="grid gap-0 border-y border-slate-300 sm:grid-cols-3 sm:divide-x sm:divide-slate-300">
              <div className="py-5 sm:px-5 sm:first:pl-0">
                <p className="text-[10px] uppercase tracking-[.18em] text-slate-400">Materiál</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{product.material || 'AISI 316L'}</p>
              </div>
              <div className="border-t border-slate-300 py-5 sm:border-t-0 sm:px-5">
                <p className="text-[10px] uppercase tracking-[.18em] text-slate-400">Provozní tlak</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{product.pressure || '2–5 bar'}</p>
              </div>
              <div className="border-t border-slate-300 py-5 sm:border-t-0 sm:px-5">
                <p className="text-[10px] uppercase tracking-[.18em] text-slate-400">Použití</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{product.coverage_area || 'zahrada / město'}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/produkt/${product.slug}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-800">
                Detail produktu <ArrowRight size={16} />
              </Link>
              <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-500">
                Nezávazná poptávka
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AuraCollectionLanding() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    let active = true;
    base44.entities.Product.list()
      .then((items) => {
        if (!active) return;
        const ordered = ORDER.map((slug) => items.find((item) => item.slug === slug)).filter(Boolean);
        if (ordered.length) setProducts(ordered);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const hero = useMemo(() => products.find((p) => p.slug === 'aura-mlzitko') || products[0] || fallbackProducts[0], [products]);

  return (
    <main className="bg-[#f7f8f6] pt-16 text-slate-950">
      <section className="relative min-h-[92vh] overflow-hidden border-b border-slate-200 bg-[#eef4f5]">
        <div className="mx-auto grid min-h-[92vh] max-w-[1600px] items-center lg:grid-cols-[.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 px-6 py-16 sm:px-10 lg:px-14 xl:px-20"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-sky-700">Kolekce AURA® · HolmTec</p>
            <h1 className="mt-6 max-w-[720px] text-[clamp(3.5rem,8vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.075em]">
              Kruh,<br />který ochladí prostor.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Jedna čistá geometrie pro zahradu i město. AURA® kombinuje nerezovou konstrukci, nízkotlakou vodní mlhu a čtyři základní konfigurace Single / Duo.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#modely" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-800">
                Prohlédnout kolekci <ArrowRight size={16} />
              </a>
              <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-900 backdrop-blur transition hover:border-slate-500">
                Navrhnout AURA pro váš prostor
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative h-[56vh] min-h-[460px] lg:h-[92vh]"
          >
            <img
              src={hero.image_url}
              alt="AURA Garden Single – hlavní vizuál kolekce AURA"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eef4f5] via-transparent to-transparent lg:from-[#eef4f5]/80 lg:via-transparent" />
            <MistLayer />
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/70 bg-white/75 px-5 py-4 backdrop-blur-xl md:bottom-10 md:right-10">
              <p className="text-[10px] uppercase tracking-[.18em] text-slate-500">AURA system</p>
              <p className="mt-1 text-sm font-medium text-slate-900">Garden · City · Single · Duo</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1500px] gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, title: 'Čistá kruhová geometrie', text: 'Jednotný výraz napříč zahradní i městskou řadou.' },
            { icon: Droplets, title: 'Nízkotlaká mlha', text: 'Provoz přímo z vodovodního řádu bez vysokotlakého čerpadla.' },
            { icon: ShieldCheck, title: 'AISI 316L', text: 'Nerezové provedení pro dlouhodobé venkovní použití.' },
            { icon: Gauge, title: '2–5 bar', text: 'Projektové nastavení podle konfigurace a podmínek instalace.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white px-6 py-8 md:px-8 md:py-10">
              <Icon size={22} strokeWidth={1.45} className="text-sky-700" />
              <h2 className="mt-6 text-xl font-medium tracking-[-0.03em] text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f8f6] px-6 py-20 sm:px-10 lg:px-14 lg:py-32" id="modely">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-sky-700">Čtyři konfigurace</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <h2 className="max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
              Jedna forma. Dvě prostředí. Single nebo Duo.
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Konstrukce AURA zůstává vizuálně konzistentní. Volba Garden / City určuje provozní kontext; Single / Duo určuje počet prvků a prostorovou kompozici.
            </p>
          </div>
        </div>
      </section>

      {products.map((product, index) => <ProductStory key={product.slug} product={product} index={index} />)}

      <section className="relative overflow-hidden bg-[#0f2633] px-6 py-24 text-white sm:px-10 lg:px-14 lg:py-32">
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_78%_30%,rgba(98,210,255,.34),transparent_30%),radial-gradient(circle_at_20%_85%,rgba(255,255,255,.09),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-sky-300">AURA® pro váš projekt</p>
            <h2 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
              Vybereme správnou konfiguraci pro konkrétní místo.
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-base leading-7 text-white/70 md:text-lg">
              Pošlete nám fotografii nebo základní rozměry prostoru. Doporučíme vhodnou variantu AURA, počet prvků, rozmístění a způsob napojení.
            </p>
            <Link to="/poptavka" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100">
              Nezávazná poptávka <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

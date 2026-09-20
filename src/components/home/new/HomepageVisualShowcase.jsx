import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Home, Landmark, Sparkles, Droplets } from 'lucide-react';

const useCases = [
  {
    icon: Trees,
    title: 'Parky',
    text: 'Příjemnější mikroklima pro odpočinek, lavičky a pěší trasy.',
    image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    link: '/poptavka',
  },
  {
    icon: Landmark,
    title: 'Náměstí',
    text: 'Ochlazení pobytových zón, městských akcí a míst, kde se lidé setkávají.',
    image: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    link: '/mestske-mlzitka',
  },
  {
    icon: Building2,
    title: 'Restaurace a areály',
    text: 'Komfort pro hosty, venkovní provoz a čekací zóny.',
    image: '/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp',
    link: '/chytre-reseni-pro-prostor',
  },
  {
    icon: Home,
    title: 'Soukromé zahrady',
    text: 'Diskrétní mlžení pro terasy, posezení a rezidenční zahrady.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    link: '/zahradni-mlzitka',
  },
];

const products = [
  {
    name: 'AURA',
    label: 'Kruhové mlžení',
    text: 'Elegantní nerezový prvek pro parky, promenády a klidové zóny.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
  },
  {
    name: 'BENDY',
    label: 'Hravá linie',
    text: 'Organický tvar pro veřejný prostor, školy, parky a rezidenční zahrady.',
    image: '/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp',
  },
  {
    name: 'MLŽNÉ BRÁNY',
    label: 'Průchozí ochlazení',
    text: 'Silný vizuální efekt pro náměstí, eventy, nábřeží a pěší tahy.',
    image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
  },
];

export default function HomepageVisualShowcase() {
  return (
    <>
      <section className="bg-white py-8 sm:py-12 lg:py-16" aria-labelledby="usecases-title">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#0B8EC5]">// Kde mlžení pomáhá</p>
              <h2 id="usecases-title" className="mt-3 font-heading text-3xl font-bold tracking-[-.045em] text-[#07131D] sm:text-4xl lg:text-5xl">Prostor, kde se lidé chtějí zdržet.</h2>
            </div>
            <Link to="/poptavka" className="inline-flex items-center gap-2 self-start rounded-full bg-[#07131D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B8EC5] sm:self-auto">
              Navrhnout řešení <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map(({ icon: Icon, title, text, image, link }) => (
              <Link key={title} to={link} className="group relative min-h-[360px] overflow-hidden rounded-[1.6rem] bg-[#07131D] shadow-[0_24px_70px_rgba(7,19,29,.14)]">
                <img src={image} alt={`${title} — využití mlžítek MLŽIDLA.CZ`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/26 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-black/28 text-[#26C6E9] backdrop-blur-md">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading text-2xl font-bold tracking-[-.04em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/76">{text}</p>
                </div>
              </Link>
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

            <div className="grid gap-4 sm:grid-cols-3">
              {products.map((product) => (
                <article key={product.name} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[.045]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={product.image} alt={`${product.name} — ${product.label}`} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/82 backdrop-blur-md"><Sparkles size={13} className="text-[#26C6E9]" /> {product.label}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-2xl font-bold tracking-[-.04em]">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/64">{product.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div className="flex items-start gap-3"><Droplets className="mt-1 text-[#26C6E9]" size={20} /><p className="text-sm leading-6 text-white/66"><strong className="block text-white">Pocitové ochlazení 5–10 °C</strong>Podle provozu, mikroklimatu a konkrétního nastavení.</p></div>
            <div className="flex items-start gap-3"><Droplets className="mt-1 text-[#26C6E9]" size={20} /><p className="text-sm leading-6 text-white/66"><strong className="block text-white">Prach a pyl</strong>Jemná mlha pomáhá vázat částice v bezprostředním okolí.</p></div>
            <div className="flex items-start gap-3"><Droplets className="mt-1 text-[#26C6E9]" size={20} /><p className="text-sm leading-6 text-white/66"><strong className="block text-white">Nerez + smart řízení</strong>Odolná konstrukce a provoz podle teploty nebo času.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

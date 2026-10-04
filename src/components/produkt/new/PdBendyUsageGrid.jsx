import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Home, Trees, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const BENDY_SLUGS = new Set(['mlzitko-bendy', 'bendy-60', 'bendy-radius-s', 'bendy-radius-m', 'bendy-radius-l']);

const USE_CASES = [
  {
    key: 'single',
    label: 'BENDY SINGLE',
    eyebrow: 'Kompaktní ochlazovací bod',
    text: 'Jeden prvek pro terasu, zahradu, menší pobytovou zónu nebo lokální ochlazení.',
    image: '/media/optimized/18399510e_generated_image.webp',
    icon: Home,
    span: 'lg:col-span-7',
    variant: 'single',
  },
  {
    key: 'duo',
    label: 'BENDY DUO',
    eyebrow: 'Dvojice pro širší pobytovou zónu',
    text: 'Dva identické prvky BENDY. Mění se pouze počet kusů a jejich rozmístění.',
    image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg',
    icon: Users,
    span: 'lg:col-span-5',
    variant: 'duo',
  },
  {
    key: 'back-to-back',
    label: 'BENDY BACK-TO-BACK',
    eyebrow: 'Oboustranné využití prostoru',
    text: 'Dva stejné prvky zády k sobě pro pobytové plochy, parky a veřejný prostor.',
    image: '/media/optimized/31478e4b3_bendymlzitko02.webp',
    icon: Trees,
    span: 'lg:col-span-5',
    variant: 'back-to-back',
  },
  {
    key: 'alej',
    label: 'BENDY ALEJ',
    eyebrow: 'Rytmus pro městský prostor',
    text: 'Více identických prvků v linii pro náměstí, pěší trasy, promenády a větší mlžiště.',
    image: '/media/optimized/f948bad15_generated_image.webp',
    icon: Building2,
    span: 'lg:col-span-7',
    variant: 'alej',
  },
];

export default function PdBendyUsageGrid({ product }) {
  if (!BENDY_SLUGS.has(product?.slug)) return null;

  return (
    <section id="bendy-vyuziti" className="relative overflow-hidden bg-[#07131D] py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,.14),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(11,94,168,.18),transparent_34%)]" />
      <div className="relative mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.24em] text-[#22D3EE]">BENDY® · jeden produkt, více sestav</p>
            <h2 className="mt-4 max-w-[12ch] font-heading text-4xl font-black leading-[.95] tracking-[-.045em] sm:text-5xl lg:text-6xl">
              Jeden tvar. Různé způsoby použití.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/62 lg:justify-self-end lg:text-lg">
            BENDY sjednocujeme do jednoho produktu. Geometrie, ohyb, profil a charakter mlžítka zůstávají stejné; podle prostoru se volí pouze počet kusů a jejich rozmístění.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(360px,48vw)] gap-4 lg:grid-cols-12 lg:auto-rows-[480px]">
          {USE_CASES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.key}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.035] ${item.span}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .18 }}
                transition={{ duration: .65, delay: index * .06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
              >
                <motion.img
                  src={item.image}
                  alt={`${item.label} – vizualizace použití mlžítka BENDY`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ scale: 1.035 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07131D] via-[#07131D]/26 to-transparent" />
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_70%_25%,rgba(34,211,238,.18),transparent_32%)]" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/16 bg-black/28 px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-white/76 backdrop-blur-xl">
                  <Icon size={13} className="text-[#22D3EE]" /> {item.eyebrow}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <h3 className="font-heading text-2xl font-black tracking-[-.035em] sm:text-3xl">{item.label}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/66 sm:text-base">{item.text}</p>
                    </div>
                    <Link
                      to={`/poptavka?produkt=mlzitko-bendy&varianta=${encodeURIComponent(item.variant)}`}
                      aria-label={`Poptat ${item.label}`}
                      className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:border-[#22D3EE] hover:bg-[#22D3EE] hover:text-[#07131D] sm:flex"
                    >
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="product-glass mt-8 flex flex-col gap-4 rounded-[1.75rem] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-heading text-xl font-bold">Nevybíráte nový produkt. Vybíráte vhodnou sestavu BENDY.</p>
            <p className="mt-2 text-sm leading-6 text-white/55">Pro konkrétní místo navrhneme počet kusů, rozestupy a řízení podle provozu a charakteru prostoru.</p>
          </div>
          <Link to="/ai-vizualizace?produkt=BENDY&slug=mlzitko-bendy" className="product-sweep inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-5 text-sm font-extrabold text-[#07131D] transition hover:-translate-y-0.5 hover:bg-white">
            Navrhnout BENDY do prostoru <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

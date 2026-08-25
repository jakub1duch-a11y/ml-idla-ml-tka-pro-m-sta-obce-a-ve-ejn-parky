import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CircleDot,
  CloudFog,
  Droplets,
  Leaf,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trees,
  UsersRound,
  Wifi,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackQuickInquiryClick } from '@/lib/ga4';

// Konverzní sekce pouze pro signature sestavu OÁZA®.
// Geometrie produktu se nemění: vždy 1× AURA Single + 2× BENDY Single.
export default function OazaSignatureSection({
  product,
  allImages = [],
  onOpenLightbox,
  onPoptat,
  onShowSmart,
}) {
  const [aura, setAura] = useState(null);
  const [bendy, setBendy] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      base44.entities.Product.filter({ slug: 'aura-mlzitko' }).catch(() => []),
      base44.entities.Product.filter({ slug: 'mlzitko-bendy' }).catch(() => []),
    ]).then(([auraResults, bendyResults]) => {
      if (!active) return;
      setAura(auraResults?.[0] || null);
      setBendy(bendyResults?.[0] || null);
    });

    return () => {
      active = false;
    };
  }, []);

  const gallery = useMemo(() => Array.from(new Set(allImages.filter(Boolean))).slice(0, 3), [allImages]);
  const auraImage = aura?.image_url || gallery[0];
  const bendyImage = bendy?.image_url || gallery[1] || gallery[0];

  const componentCards = [
    {
      key: 'bendy-left',
      eyebrow: '1. boční prvek',
      title: 'MLŽÍTKO BENDY®',
      description: 'Cílené mlžení podél pěší trasy, lavičky nebo okraje pobytové zóny.',
      image: bendyImage,
      alt: 'MLŽÍTKO BENDY – zakřivené nerezové mlžítko HolmTec',
      badge: '1×',
    },
    {
      key: 'aura-center',
      eyebrow: 'střed sestavy',
      title: 'MLŽÍTKO AURA®',
      description: 'Kruhová hlavice tvoří vizuální střed a rovnoměrně rozprostírá jemnou mlhu kolem centrálního bodu.',
      image: auraImage,
      alt: 'MLŽÍTKO AURA – kruhové nerezové mlžítko HolmTec',
      badge: '1×',
      featured: true,
    },
    {
      key: 'bendy-right',
      eyebrow: '2. boční prvek',
      title: 'MLŽÍTKO BENDY®',
      description: 'Druhý obloukový prvek rozšiřuje ochlazovací zónu a vyvažuje celou kompozici.',
      image: bendyImage,
      alt: 'Druhé MLŽÍTKO BENDY v sestavě OÁZA',
      badge: '1×',
    },
  ];

  const benefits = [
    { icon: CircleDot, title: '1 + 2 prvky', text: 'Jedna AURA uprostřed a dva identické BENDY po stranách.' },
    { icon: Droplets, title: 'Bez vysokotlakého čerpadla', text: 'Nízkotlaký princip s napojením přímo na vodovodní řad.' },
    { icon: ShieldCheck, title: 'Nerez AISI 316L', text: 'Materiál pro dlouhodobý venkovní provoz a veřejné instalace.' },
    { icon: Wifi, title: 'Smart-ready', text: 'Volitelné časové a vzdálené řízení vodní větve podle provozu.' },
  ];

  const environments = [
    { icon: UsersRound, title: 'Domovy seniorů', text: 'Klidové zahrady a venkovní pobytové zóny.' },
    { icon: Trees, title: 'Parkové zahrady', text: 'Odpočinková místa, pěší trasy a lavičky.' },
    { icon: Leaf, title: 'Rezidenční areály', text: 'Prémiové zahrady a společné venkovní prostory.' },
    { icon: Sparkles, title: 'Menší veřejné plochy', text: 'Parky, dvory a komornější náměstí.' },
  ];

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-[linear-gradient(180deg,#f8fbfc_0%,#ffffff_42%,#f8fafc_100%)] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(14,116,144,.08),transparent_68%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-900/10 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0b4860] shadow-sm">
            <CloudFog size={14} /> Signature sestava HolmTec
          </span>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Jedna OÁZA. Tři nerezové prvky.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            OÁZA® kombinuje <strong className="font-semibold text-slate-900">1× MLŽÍTKO AURA®</strong> a <strong className="font-semibold text-slate-900">2× MLŽÍTKO BENDY®</strong> do jednoho čitelného ochlazovacího bodu pro zahrady, parky a pobytové zóny.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_32px_rgba(15,23,42,.04)]"
            >
              <Icon size={19} className="text-[#0b4860]" strokeWidth={1.8} />
              <h3 className="mt-4 text-sm font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-800">Složení systému</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Přesně 1× AURA + 2× BENDY</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Konstrukce jednotlivých produktů zůstává stejná. OÁZA® je prostorová kompozice tří reálných produktů, nikoli nový odlišný tvar.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {componentCards.map((item, index) => (
              <motion.article
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
                className={`overflow-hidden rounded-3xl border bg-white ${item.featured ? 'border-[#0b4860]/25 shadow-[0_18px_55px_rgba(11,72,96,.12)] lg:-translate-y-3' : 'border-slate-200 shadow-[0_12px_38px_rgba(15,23,42,.05)]'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {item.image ? (
                    <img src={item.image} alt={item.alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300"><CloudFog size={36} /></div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{item.badge}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-400">{item.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-800">Kde OÁZA dává smysl</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Ochlazení tam, kde lidé skutečně pobývají.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Rozteč a orientace tří prvků se navrhují podle pěšího provozu, posezení a konkrétní dispozice místa. Díky tomu lze mlhu soustředit do prostoru, kde má reálný přínos.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {environments.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Icon size={18} className="text-[#0b4860]" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-950">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {gallery.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {gallery.slice(0, 2).map((url, index) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => onOpenLightbox?.(index)}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 text-left ${index === 0 ? 'sm:row-span-2 sm:min-h-[420px]' : 'min-h-[200px]'}`}
                  aria-label={`Otevřít fotografii sestavy OÁZA ${index + 1}`}
                >
                  <img
                    src={url}
                    alt={index === 0 ? 'OÁZA – AURA Single a dvě BENDY Single v zahradní pobytové zóně' : 'OÁZA – mlžicí sestava HolmTec ve veřejném nebo parkovém prostoru'}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    loading="lazy"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-5 pt-16 text-sm font-semibold text-white">
                    {index === 0 ? 'OÁZA v pobytové zahradě' : 'OÁZA v parkovém prostoru'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 rounded-[2rem] border border-cyan-900/10 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,.06)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-800">
                <Wifi size={13} /> Smart řízení
              </span>
              <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">OÁZA může mlžit jen tehdy, když to dává smysl.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Sestavu lze doplnit chytrým řízením vodní větve. Provozní režim se nastavuje podle lokality, času a způsobu používání prostoru, aby se mlžení nespouštělo zbytečně.
              </p>
              <button
                type="button"
                onClick={onShowSmart}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#0b4860]/20 px-5 py-2.5 text-sm font-semibold text-[#0b4860] transition-colors hover:bg-cyan-50"
              >
                Zobrazit Smart konfiguraci <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Časové režimy', 'Provozní okna pro běžný den, víkend nebo sezónní režim.'],
                ['Vzdálené ovládání', 'Možnost správy vodní větve podle zvolené chytré konfigurace.'],
                ['Úspornější provoz', 'Voda se používá jen v časech, kdy má ochlazování skutečný význam.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#0b4860]/15 bg-[#0b4860] p-6 text-white shadow-[0_24px_70px_rgba(11,72,96,.18)] sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-200">Další krok</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">Navrhneme OÁZU podle vašeho prostoru.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Pošlete fotografii nebo půdorys místa. Připravíme doporučené rozmístění AURA + 2× BENDY, variantu řízení a podklady pro nezávaznou kalkulaci.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <button
                type="button"
                onClick={() => {
                  trackQuickInquiryClick(product?.name, 'oaza_signature_section');
                  onPoptat?.();
                }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0b4860] transition-transform hover:-translate-y-0.5"
              >
                Nezávazná kalkulace projektu <ArrowRight size={15} />
              </button>
              <Link
                to={`/ai-vizualizace?produkt=${encodeURIComponent(product?.name || 'OÁZA')}&slug=${encodeURIComponent(product?.slug || 'oaza-aura-bendy')}`}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Vizualizovat prostor <ScanLine size={15} />
              </Link>
              <button
                type="button"
                onClick={onShowSmart}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Smart řízení <Wifi size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

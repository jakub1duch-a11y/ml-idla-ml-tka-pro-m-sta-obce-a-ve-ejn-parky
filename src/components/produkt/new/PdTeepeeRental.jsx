import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Wrench, PlayCircle, ArrowRight, Droplets, Truck, ShieldCheck } from 'lucide-react';
import { TEEPEE_NOZZLE_URL } from '@/components/produkt/new/PdTeepeeStudio';

const FALLBACKS = [
  'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/f0a31cb3f_08_teepee_brno_landscape.jpg',
  'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/ebbd577b1_07_teepee_brno_portrait.jpg',
];

export default function PdTeepeeRental({ product }) {
  if (product?.slug !== 'teepee') return null;

  const gallery = [product?.hero_background_url, product?.image_url, ...(product?.gallery_urls || []), ...FALLBACKS]
    .filter(Boolean)
    .filter((url, index, all) => all.indexOf(url) === index);
  const eventWide = gallery.find((u) => /landscape/i.test(u)) || gallery[0];
  const eventPortrait = gallery.find((u) => /portrait/i.test(u)) || gallery[1] || gallery[0];
  const detailSource = gallery[2] || eventPortrait;

  const uses = [
    { title: 'Městské slavnosti', text: 'Dočasné ochlazovací místo pro náměstí, jarmark, kulturní program nebo městskou slavnost.', icon: CalendarDays, image: eventWide },
    { title: 'Letní akce a festivaly', text: 'Samostojící mlžiště do návštěvnické zóny, gastro části nebo odpočinkového prostoru bez trvalého zabudování.', icon: MapPin, image: eventPortrait },
    { title: 'Pronájem na klíč', text: 'Dopravu, instalaci, uvedení do provozu, technický dohled i následnou deinstalaci lze zajistit jako jednu službu.', icon: Truck, image: detailSource },
  ];

  const steps = [
    ['01', 'Dovezeme', 'TEEPEE dopravíme na místo podle termínu akce a přístupových podmínek.'],
    ['02', 'Instalujeme', 'Sestavu umístíme, napojíme a ověříme správnou konfiguraci mlžení.'],
    ['03', 'Zajistíme provoz', 'Podle dohody zajistíme spuštění, nastavení režimu a technický dohled.'],
    ['04', 'Deinstalujeme', 'Po skončení akce zařízení odpojíme, demontujeme a odvezeme.'],
  ];

  return (
    <section className="bg-[#061f2b] text-white" data-analytics-section="teepee-rental-use-cases">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-300">TEEPEE · sezónní využití a pronájem</p>
            <h2 className="mt-4 max-w-4xl font-heading text-4xl leading-[1.03] tracking-[-.025em] sm:text-5xl lg:text-6xl">Mobilní mlžiště pro akce, které nemusí zůstat na místě celý rok.</h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-xl text-base leading-7 text-white/65">TEEPEE je vhodné pro městské slavnosti, letní kulturní program, festivaly a dočasné veřejné instalace. Konkrétní počet trysek, provozní režim, napojení a umístění se vždy potvrzují podle místa a podmínek akce.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/poptavka?produkt=TEEPEE&typ=pronajem" className="inline-flex items-center gap-2 rounded-full bg-[#61D5E5] px-5 py-3 text-sm font-bold text-[#082936] transition hover:bg-white">Poptat pronájem TEEPEE <ArrowRight size={16} /></Link>
              {product?.video_url && <a href={product.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><PlayCircle size={16} /> Video v provozu</a>}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {uses.map(({ title, text, icon: Icon, image }) => (
            <article key={title} className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[.04]">
              <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                <img src={image} alt={`${product.name} – ${title.toLowerCase()}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#082936]/75 backdrop-blur"><Icon size={18} className="text-cyan-200" /></div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[.035] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[420px] overflow-hidden bg-white">
            <img src={TEEPEE_NOZZLE_URL} alt={`${product.name} – detail mlžné hlavy a trysek na vrcholu konstrukce`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061f2b]/80 to-transparent p-6 pt-24">
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200">Detail mlžné hlavy</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/75">Vizualizace vrcholu konstrukce podle ověřené fotografie. Finální provedení trysky a její počet se řídí konkrétní konfigurací TEEPEE.</p>
            </div>
          </div>
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3 text-cyan-200"><Droplets size={20} /><span className="font-mono text-[11px] uppercase tracking-[.18em]">Mlžicí hlava a trysky</span></div>
            <h3 className="mt-5 font-heading text-3xl leading-tight sm:text-4xl">Jemná mlha bez vymýšlení neověřených parametrů.</h3>
            <p className="mt-5 text-base leading-7 text-white/65">Pro TEEPEE uvádíme ověřený rozsah jemnosti mlhy 50–100 μm a provozní tlak 2–8 bar dle konfigurace. Přesný typ trysky, počet, orientace a průtok potvrzujeme až podle konkrétního projektu nebo pronájmu.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4"><ShieldCheck size={18} className="text-cyan-200"/><p className="mt-3 text-sm font-semibold">Geometrie podle reference</p><p className="mt-1 text-xs leading-5 text-white/45">Vizualizace nesmí měnit konstrukci, proporce ani rozmístění prvků TEEPEE.</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4"><Wrench size={18} className="text-cyan-200"/><p className="mt-3 text-sm font-semibold">Projektové nastavení</p><p className="mt-1 text-xs leading-5 text-white/45">Napojení, řízení a provozní režim se nastavují podle akce a dostupné infrastruktury.</p></div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-white/40">Pronájem TEEPEE · kompletní služba</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([n, title, text]) => <div key={n}><span className="font-mono text-xs text-cyan-300">{n}</span><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{text}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
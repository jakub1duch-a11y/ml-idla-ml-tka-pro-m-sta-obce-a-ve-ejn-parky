import React, { useEffect, useState } from 'react';
import { Cloud, Construction, Smartphone, Thermometer, Wifi, Wind } from 'lucide-react';
import GateFeatureCard from '@/components/home/GateFeatureCard';
import GateActivePreview from '@/components/home/GateActivePreview';
import GateVideoHud from '@/components/home/GateVideoHud';

const VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/0d9a4e147_mlznabranaGATE70-video.mp4';
const features = [
{ icon: Smartphone, title: 'Mobilní aplikace', text: 'Zóny, spotřeba a denní plán.', detail: 'Tuya Smart nebo Smart Life umožní spustit mlžení, nastavit interval od–do a zkontrolovat aktivní zónu.' },
{ icon: Thermometer, title: 'Ochlazení', text: 'Teploměr ukazuje pokles teploty.', detail: 'Jemná vodní mlha odebírá teplo z okolního vzduchu. Výsledný účinek závisí na teplotě, vlhkosti a proudění.' },
{ icon: Wind, title: 'Vítr', text: 'Ovlivňuje směr mlžného proudu.', detail: 'Směr a rychlost větru určují posun mlžného závoje a pomáhají zvolit správné umístění brány.' },
{ icon: Cloud, title: 'Mlžný závoj', text: 'Viditelný dosah ochlazení.', detail: 'HUD znázorňuje orientační plochu ochlazení kolem GATE. Skutečný dosah upravíme podle prostoru a počtu trysek.' },
{ icon: Construction, title: 'Konstrukce a materiál', text: 'Nerez AISI 316L, Ø 60–76 mm.', detail: 'Nosné tělo GATE tvoří svařovaná nerezová trubka s integrovaným vedením vody a servisním přístupem u patky.' },
{ icon: Wifi, title: 'Smart ventil', text: 'Přesné řízení průtoku.', detail: 'Ventil propojuje aplikaci, senzory a mlžnou větev do jedné samostatně ovládané zóny.' }];


export default function SmartMicroclimateHero() {
  const [active, setActive] = useState(0);
  useEffect(() => {const timer = window.setInterval(() => setActive((current) => (current + 1) % features.length), 5000);return () => window.clearInterval(timer);}, []);
  return <section className="relative overflow-hidden bg-slate-950 py-20 text-white lg:py-28">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,.14),transparent_34%),linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:auto,36px_36px,36px_36px]" />
    <div className="site-container relative"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="content-eyebrow mb-4 text-cyan">Smart systém · GATE</p><h2>Chytrá správa řízení mlžítek.</h2><p className="mt-5 text-lg text-white/60">Účinné ochlazení pro města, terasy a veřejný prostor.</p></div>
      <div className="grid gap-5 lg:grid-cols-[.78fr_1.35fr_.78fr] lg:items-center"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{features.slice(0, 3).map((item, index) => <GateFeatureCard key={item.title} item={item} active={active === index} onClick={() => setActive(index)} side="left" />)}</div>
        <div className="overflow-hidden border border-cyan/25 bg-black shadow-2xl shadow-cyan/10"><div className="relative"><video src={VIDEO_URL} autoPlay muted loop playsInline className="aspect-[16/10] w-full object-cover" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/15" /><GateVideoHud active={active} /><p className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-[.18em] text-cyan">Mlžná brána GATE · živý provoz</p></div><GateActivePreview item={features[active]} active={active} /></div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{features.slice(3).map((item, index) => <GateFeatureCard key={item.title} item={item} active={active === index + 3} onClick={() => setActive(index + 3)} side="right" />)}</div></div>
    </div>
  </section>;
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, Wifi, ShieldCheck, Droplets, BatteryCharging } from 'lucide-react';

const IMG_VALVE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const IMG_PANEL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e1a4488cb_PEVEKO-SKPB-panel-Jabloshop-800x640.png';
const PEVEKO_VIDEO_PAGE = 'https://eshop.peveko.cz/chytry-ventil/chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet/?parameterValueId=467';

const FEATURES = [
  { icon: Wifi, title: 'Vzdálené ovládání', text: 'U vhodné konfigurace lze ventil ovládat přes internet a aplikaci SUPLA.' },
  { icon: Droplets, title: 'Řízení vodní větve', text: 'Ventil otevírá a uzavírá přívod vody podle nastaveného scénáře nebo ručního povelu.' },
  { icon: ShieldCheck, title: 'Kontrola stavu', text: 'Řešení lze podle konkrétní sestavy doplnit o dohled, senzory a bezpečnostní logiku.' },
  { icon: BatteryCharging, title: 'Záložní provoz', text: 'Vybrané sestavy PEVEKO mají vlastní záložní napájení pro bezpečné uzavření vody.' }
];

export default function SmartValveMediaSection() {
  return <section className="border-y border-slate-200 bg-white py-20 lg:py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Chytrý ventil PEVEKO</p>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-[1.08] tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Ventil, který propojí vodu s chytrým řízením.</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">U vybraných instalací lze smart řízení MLŽIDLA® doplnit o ventilovou sestavu PEVEKO. Konkrétní model, dimenzi a způsob ovládání volíme podle hydrauliky projektu, počtu zón a požadované automatizace.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <a href={PEVEKO_VIDEO_PAGE} target="_blank" rel="noreferrer" className="btn-metallic-mist px-6 py-3 text-sm font-bold"><PlayCircle size={17}/> Video výrobce</a>
          <Link to="/blog/chytry-ventil-peveko-pro-ovladani-mlzitek" className="btn-secondary-outline rounded-full px-6 py-3 text-sm font-semibold text-foreground">Jak funguje v mlžném systému <ArrowRight size={15}/></Link>
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"><img src={IMG_VALVE} alt="Chytrý ventil PEVEKO s Wi-Fi ovládáním" className="aspect-[5/4] h-full w-full object-contain p-4 sm:p-6" loading="lazy" decoding="async"/><figcaption className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">Ventilová sestava PEVEKO pro řízený přívod vody.</figcaption></figure>
        <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"><img src={IMG_PANEL} alt="Ovládací panel chytrého ventilu PEVEKO" className="aspect-[5/4] h-full w-full object-contain p-4 sm:p-6" loading="lazy" decoding="async"/><figcaption className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">Ovládací a stavový panel ventilové sestavy.</figcaption></figure>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{FEATURES.map(({icon:Icon,title,text})=><div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><Icon size={22} className="text-secondary" strokeWidth={1.6}/><h3 className="mt-4 font-heading text-xl text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</div>
    </div>
  </section>;
}

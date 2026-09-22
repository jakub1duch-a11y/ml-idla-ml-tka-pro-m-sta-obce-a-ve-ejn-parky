import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, Wifi, ShieldCheck, Droplets, BatteryCharging, Smartphone } from 'lucide-react';
import PevekoValveFlow from '@/components/smart-ovladani/PevekoValveFlow';

const IMG_VALVE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const IMG_PANEL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e1a4488cb_PEVEKO-SKPB-panel-Jabloshop-800x640.png';
const PEVEKO_VIDEO_PAGE = 'https://eshop.peveko.cz/chytry-ventil/chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet/?parameterValueId=467';

const FEATURES = [
  { icon: Wifi, title: 'Ovládání na dálku', text: 'Stav a provozní scénář máte pod kontrolou z telefonu.' },
  { icon: Droplets, title: 'Řízený přívod vody', text: 'Ventil otevírá vodní větev podle nastavených podmínek.' },
  { icon: ShieldCheck, title: 'Bezpečnější provoz', text: 'Konfiguraci lze doplnit o dohled, senzory a uzavření při nestandardním stavu.' },
  { icon: BatteryCharging, title: 'Připraveno pro projekt', text: 'Model a zapojení volíme podle hydrauliky, zón a režimu instalace.' }
];

export default function SmartValveMediaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071A2F] py-20 text-white lg:py-28" aria-labelledby="peveko-hero-title">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-cyan-200">
              <Wifi size={14} /> PEVEKO + SUPLA
            </div>
            <p className="mt-7 font-mono text-[11px] uppercase tracking-[.2em] text-cyan-300">Chytré řízení vodní větve</p>
            <h2 id="peveko-hero-title" className="mt-4 max-w-xl font-heading text-4xl font-bold leading-[1.02] tracking-[-.045em] sm:text-5xl lg:text-6xl">
              Mlha podle podmínek. Voda pod kontrolou.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              Chytrý ventil PEVEKO propojuje přívod vody s automatizací SUPLA. Mlžítka mohou reagovat na teplotu, časový plán, stav zóny nebo ruční povel z aplikace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/poptavka?tema=peveko-supla" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold">
                Navrhnout řízení pro prostor <ArrowRight size={16} />
              </Link>
              <a href={PEVEKO_VIDEO_PAGE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/10">
                <PlayCircle size={17} /> Video ventilu
              </a>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-5 text-white/48">
              Konkrétní model, dimenzi a způsob zapojení ověřujeme podle přívodu vody, počtu zón a požadovaného provozu.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-400/10 blur-2xl" />
            <div className="relative grid grid-cols-[1.25fr_.75fr] items-end gap-3">
              <figure className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.07] shadow-2xl shadow-cyan-950/30">
                <img src={IMG_VALVE} alt="Chytrý ventil PEVEKO s Wi-Fi ovládáním" className="aspect-[5/4] h-full w-full object-contain p-5 sm:p-8" loading="eager" decoding="async" />
                <figcaption className="border-t border-white/10 px-5 py-3 text-xs text-white/58">Ventilová sestava PEVEKO</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-[1.5rem] border border-cyan-300/25 bg-cyan-300/10">
                <img src={IMG_PANEL} alt="Ovládací panel chytrého ventilu PEVEKO" className="aspect-[4/5] h-full w-full object-contain p-3 sm:p-5" loading="lazy" decoding="async" />
                <figcaption className="border-t border-cyan-300/15 px-3 py-3 text-[11px] text-cyan-100/70">Stavový panel</figcaption>
              </figure>
            </div>
            <div className="absolute -bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#071A2F]/90 px-4 py-2 text-xs font-semibold text-cyan-100 shadow-lg backdrop-blur-md">
              <Smartphone size={15} className="text-cyan-300" /> Ovládání podle scénáře
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/12 bg-white/[.055] p-5 transition hover:border-cyan-300/45 hover:bg-white/[.08]">
              <Icon size={21} className="text-cyan-300" strokeWidth={1.7} />
              <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/[.07] p-4 sm:p-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200">Jak pracuje řízení</p>
          <PevekoValveFlow />
        </div>
      </div>
    </section>
  );
}

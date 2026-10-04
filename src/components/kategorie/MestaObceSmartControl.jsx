import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Wifi, Droplets, ShieldCheck, BatteryCharging, Smartphone, Cloud, Radio, Gauge, Clock3, Thermometer, Activity, MapPin, ExternalLink } from 'lucide-react';

const VALVE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const PANEL_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e1a4488cb_PEVEKO-SKPB-panel-JABLOSHOP-800x640.png';
const PEVEKO_URL = 'https://www.peveko.cz/';
const SUPLA_URL = 'https://supla.org/';

const PEVEKO_FEATURES = [
  { icon: Wifi, title: 'Vzdálené ovládání', text: 'Ventil ovládáte z telefonu přes Wi-Fi — otevřít, uzavřít nebo nastavit scénář z kanceláře radnice.' },
  { icon: ShieldCheck, title: 'Ochrana proti úniku', text: 'Při detekci nechtěného úniku vody ventil automaticky uzavře přívod a ochrání majetek i rozpočet.' },
  { icon: BatteryCharging, title: 'Záložní napájení', text: 'Integrovaná baterie zajistí bezpečné uzavření vody i při výpadku proudu.' },
  { icon: Droplets, title: 'Certifikace pitné vody', text: 'Potravinářská certifikace a odolnost do 90 °C — bezpečné i pro veřejné vodovodní řady.' },
];

const SUPLA_FEATURES = [
  { icon: Smartphone, title: 'Mobilní aplikace', text: 'Správa z telefonu přes iOS i Android — přehledný stav všech zón na jedné obrazovce.' },
  { icon: Cloud, title: 'Cloud i lokální server', text: 'Open-source platforma s cloudem zdarma nebo vlastním serverem pro plnou kontrolu nad daty.' },
  { icon: Activity, title: 'Otevřené API', text: 'Integrace do stávajících obecních informačních systémů a možnost napojení dalších senzorů.' },
  { icon: Radio, title: 'Centrální správa', text: 'Jedno rozhraní pro náměstí, park, hřiště i sportoviště — každá zóna samostatně řízená.' },
];

const FLOW = [
  { Icon: Thermometer, label: 'SENZOR', value: '28,6 °C', note: 'teplota aktivuje' },
  { Icon: Clock3, label: 'ŘÍZENÍ', value: 'AUTO', note: 'pravidla zóny' },
  { Icon: Gauge, label: 'PEVEKO VENTIL', value: 'OTEVŘEN', note: 'přívod vody' },
  { Icon: Droplets, label: 'MLŽÍTKO', value: 'AKTIVNÍ', note: 'jemná mlha' },
];

const ZONES = [
  { place: 'Náměstí', desc: 'Mlžná brána · Zóna 01', temp: '31 °C' },
  { place: 'Park', desc: 'Bendy mlžiště · Zóna 02', temp: '28 °C' },
  { place: 'Hřiště', desc: 'Mlžné body · Zóna 03', temp: '30 °C' },
  { place: 'Sportoviště', desc: 'Ochladicí zóna · Zóna 04', temp: '33 °C' },
];

export default function MestaObceSmartControl() {
  return (
    <section className="bg-slate-950 py-20 lg:py-28 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-400 mb-4">Smart řízení pro obce</p>
          <h2 className="font-heading text-3xl lg:text-5xl leading-[1.05] tracking-[-.03em]">
            Voda jen tehdy,<br /><span className="italic text-cyan-400">když ji prostor opravdu potřebuje.</span>
          </h2>
          <p className="mt-6 text-base lg:text-lg leading-relaxed text-white/65 max-w-2xl">
            Chytrý ventil <strong className="text-white">PEVEKO</strong> a platforma <strong className="text-white">SUPLA</strong> propojují mlžítka s teplotními senzory, časovým plánem a vzdálenou správou. Obyvatelé dostanou ochlazení, obec úsporný a kontrolovatelný provoz.
          </p>
        </div>

        {/* Automation flow */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map(({ Icon, label, value, note }, i) => (
              <React.Fragment key={label}>
                <div className="relative rounded-2xl border border-white/10 bg-white/[.05] p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <Icon size={22} className="text-cyan-400" />
                    <span className="font-mono text-[10px] tracking-[.16em] text-white/40">0{i + 1}</span>
                  </div>
                  <p className="mt-5 font-mono text-[10px] tracking-[.16em] text-white/45">{label}</p>
                  <p className="mt-1 text-lg font-semibold">{value}</p>
                  <p className="mt-1 text-xs leading-snug text-white/45">{note}</p>
                  {i < 3 && <ArrowRight size={16} className="absolute -right-[10px] top-1/2 z-10 hidden -translate-y-1/2 text-cyan-400 lg:block" />}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="mt-5 text-xs text-white/45 leading-relaxed">
            Příklad: je-li dosažena nastavená teplota a běží povolené časové okno, řídicí systém aktivuje PEVEKO ventil příslušné zóny. Po skončení podmínky se zóna automaticky uzavře — bez zbytečné spotřeby vody.
          </p>
        </div>

        {/* PEVEKO section */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-400 mb-3">Chytrý ventil PEVEKO</p>
            <h3 className="font-heading text-2xl lg:text-3xl leading-tight tracking-tight">
              Ventil, který propojí vodu s ochranou i automatizací.
            </h3>
            <p className="mt-4 text-sm lg:text-base leading-relaxed text-white/60 max-w-xl">
              PEVEKO je český chytrý ventil s Wi-Fi ovládáním, který otevírá a uzavírá přívod vody podle nastaveného scénáře nebo ručního povelu. Konkrétní model a dimenzi volíme podle hydrauliky projektu a počtu zón.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PEVEKO_FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                  <Icon size={20} className="text-cyan-400" />
                  <h4 className="mt-3 font-semibold text-sm text-white">{title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{text}</p>
                </div>
              ))}
            </div>
            <a href={PEVEKO_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Více o PEVEKO <ExternalLink size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04]">
              <img src={VALVE_IMG} alt="Chytrý ventil PEVEKO s Wi-Fi ovládáním" className="aspect-[4/5] w-full object-contain p-3" loading="lazy" />
              <figcaption className="border-t border-white/10 px-3 py-2 text-[11px] text-white/50">Ventilová sestava PEVEKO</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04]">
              <img src={PANEL_IMG} alt="Ovládací panel chytrého ventilu PEVEKO" className="aspect-[4/5] w-full object-contain p-3" loading="lazy" />
              <figcaption className="border-t border-white/10 px-3 py-2 text-[11px] text-white/50">Řídicí panel PEVEKO</figcaption>
            </figure>
          </div>
        </div>

        {/* SUPLA section */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950/40 to-slate-950 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 ring-1 ring-cyan-400/30">
                  <Smartphone size={24} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-400/80">SUPLA aplikace</p>
                  <p className="font-heading text-lg text-white">Jedna aplikace, více lokalit</p>
                </div>
              </div>
              <div className="space-y-2">
                {ZONES.map(({ place, desc, temp }, i) => (
                  <div key={place} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3">
                    <span className="flex items-center gap-2 text-sm text-white/85">
                      <MapPin size={14} className="text-cyan-400" />
                      {place}
                    </span>
                    <span className="hidden sm:block text-[11px] text-white/40 font-mono">{desc}</span>
                    <span className={`font-mono text-xs ${i < 3 ? 'text-cyan-400' : 'text-white/40'}`}>{temp}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-white/40 leading-relaxed">Stav všech zón v reálném čase — aktivní, čekající nebo uzavřené. Ovládání jedním kliknutím.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-400 mb-3">Platforma SUPLA</p>
            <h3 className="font-heading text-2xl lg:text-3xl leading-tight tracking-tight">
              Otevřená IoT platforma pro správu obecní infrastruktury.
            </h3>
            <p className="mt-4 text-sm lg:text-base leading-relaxed text-white/60 max-w-xl">
              SUPLA je open-source platforma, která sjednotí řízení ventilů PEVEKO, teplotních senzorů i dalších zařízení do jedné mobilní aplikace. Správce vidí stav instalace v reálném čase a může reagovat okamžitě.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SUPLA_FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                  <Icon size={20} className="text-cyan-400" />
                  <h4 className="mt-3 font-semibold text-sm text-white">{title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{text}</p>
                </div>
              ))}
            </div>
            <a href={SUPLA_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Více o SUPLA <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Stats / savings for municipalities */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: '−70%', label: 'Méně zbytečné spotřeby vody' },
            { val: '24/7', label: 'Vzdálený dohled a kontrola' },
            { val: '1 app', label: 'Správa všech lokalit obce' },
            { val: 'AUTO', label: 'Zavření při úniku vody' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[.04] p-5 text-center">
              <p className="font-heading text-3xl lg:text-4xl text-cyan-400" style={{ fontWeight: 700, letterSpacing: '-.03em' }}>{s.val}</p>
              <p className="mt-2 text-[11px] font-mono text-white/45 tracking-widest uppercase leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
            Navrhnout Smart řízení pro naši obec <ArrowRight size={15} />
          </Link>
          <Link to="/smart-ovladani" className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white text-sm rounded-full hover:bg-white/10 transition-all">
            Detail Smart ovládání <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Thermometer, Clock, Activity, Cloud,
  Smartphone, Shield, Cpu, Gauge, ArrowRight, CheckCircle2, Zap,
} from 'lucide-react';

const IMG_VALVE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const IMG_PANEL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e1a4488cb_PEVEKO-SKPB-panel-Jabloshop-800x640.png';

const SUPLA_COMPONENTS = [
  {
    code: 'ROW-02',
    name: 'SUPLA ROW-02',
    category: 'Řídicí jednotka',
    icon: Cpu,
    spec: 'Wi-Fi 2.4 GHz · 2× relé NO/NC · napájení 12–24 V DC/AC',
    function: 'Hlavní kontrolér — spíná ventily, čte senzory, komunikuje se SUPLA Cloud',
    standard: true,
    premium: true,
  },
  {
    code: 'LIW-01',
    name: 'SUPLA LIW-01',
    category: 'Monitoring spotřeby vody',
    icon: Droplets,
    spec: 'Pulsní vstup · napájení z řadiče · DIM 22 × 90 mm',
    function: 'Počítá impulsy z elektronického vodoměru, reportuje průtok a celkovou spotřebu',
    standard: true,
    premium: true,
  },
  {
    code: 'THW-01',
    name: 'SUPLA THW-01',
    category: 'Teplotní senzor',
    icon: Thermometer,
    spec: '1-Wire DS18B20 · přesnost ±0.5 °C · rozsah -10 až +85 °C · IP65',
    function: 'Měří stínovou teplotnu pro automatickou aktivaci mlžení při nastavené hodnotě',
    standard: false,
    premium: true,
  },
  {
    code: 'NC-VALVE',
    name: 'Servomotorický ventil NC',
    category: 'Ventil — Standard',
    icon: Gauge,
    spec: 'DN15–DN50 · napájení 230 V AC · NC (normally closed) · IP54',
    function: 'Spíná přívod vody do mlžného okruhu, ovládaný relé z ROW-02',
    standard: true,
    premium: false,
  },
  {
    code: 'PEVEKO',
    name: 'Chytrý ventil PEVEKO',
    category: 'Ventil — Premium',
    icon: Zap,
    spec: 'DN15–DN50 · Wi-Fi · záložní baterie · vlastní ovládání · IP54',
    function: 'Ventil s vlastní inteligencí — funguje i při výpadku řadiče, záložní napájení pro bezpečné uzavření',
    standard: false,
    premium: true,
  },
  {
    code: 'WATER-METER',
    name: 'Elektronický vodoměr',
    category: 'Měření průtoku',
    icon: Activity,
    spec: 'Pulsní výstup (reed/kontakt) · průtok 0.5–15 m³/h · Q3/Q1 ≥ 100 · IP68',
    function: 'Fyzické měření průtoku s pulsním výstupem propojeným s LIW-01',
    standard: true,
    premium: true,
  },
];

const SCENARIOS = [
  { icon: Thermometer, title: 'Automatická aktivace při teplotě', text: 'Mlžení se spustí samo při překročení nastavené teploty (např. 25 °C) měřené senzorem THW-01.' },
  { icon: Clock, title: 'Časové plány', text: 'Nezávislé režimy pro ráno, odpoledne a večer — zvlášť pro pracovní dny a víkendy.' },
  { icon: Smartphone, title: 'Dálkové ovládání', text: 'Zapnutí, vypnutí a změna scénáře přes SUPLA Cloud mobilní aplikaci z jakéhokoliv místa.' },
  { icon: Droplets, title: 'Monitoring spotřeby vody', text: 'LIW-01 a elektronický vodoměr sledují průtok a celkovou spotřebu vody v reálném čase.' },
  { icon: Activity, title: 'Predikce údržby', text: 'Analýza tlaku a průtoku napoví, kdy je potřeba servis trysek nebo výměna filtru.' },
  { icon: Cloud, title: 'API počasí', text: 'Prediktivní řízení — mlžení se připraví před očekávaným horkem na základě předpovědi.' },
];

export default function PdSmartControl({ product }) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Chytré řízení SUPLA</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight tracking-[-.03em] text-[#0D2F4F] lg:text-4xl">
            Technické parametry chytrého ovládání
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[#0D2F4F]/60 sm:text-base">
            Každé mlžítko lze doplnit o automatizaci SUPLA. Úředníkům a projektantům poskytujeme přesné
            hodnoty komponent, varianty vybavení a provozní scénáře přímo u produktu.
          </p>
        </div>

        {/* Variant comparison */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#EAF5FB] bg-[#F8FCFE] p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5FB] text-[#0B5EA8]">
                <Shield size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/45">Standard</p>
                <h3 className="font-heading text-lg text-[#0D2F4F]">Základní automatizace</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#0D2F4F]/65">
              NC servoventil + SUPLA ROW-02 + LIW-01 + elektronický vodoměr. Spínání vody podle
              času a teploty, dálkové ovládání, monitoring spotřeby.
            </p>
            <ul className="mt-4 space-y-2">
              {['Servomotorický ventil NC', 'SUPLA ROW-02 (Wi-Fi)', 'SUPLA LIW-01 (spotřeba)', 'Elektronický vodoměr'].map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-[#0D2F4F]/75">
                  <CheckCircle2 size={15} className="shrink-0 text-[#0B5EA8]" /> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl border-2 border-[#0B5EA8] bg-white p-6 shadow-[0_12px_36px_rgba(11,94,168,.08)]">
            <span className="absolute -top-3 right-6 rounded-full bg-[#0B5EA8] px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-white">
              Doporučeno pro obce
            </span>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B5EA8] text-white">
                <Zap size={20} strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wide text-[#0B5EA8]">Premium</p>
                <h3 className="font-heading text-lg text-[#0D2F4F]">Plně chytré řešení</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#0D2F4F]/65">
              Chytrý ventil PEVEKO s vlastní inteligencí + teplotní senzor THW-01. Funguje i při
              výpadku řadiče, má záložní napájení a automaticky reaguje na teplotu.
            </p>
            <ul className="mt-4 space-y-2">
              {['Chytrý ventil PEVEKO (Wi-Fi + baterie)', 'SUPLA ROW-02 (Wi-Fi)', 'SUPLA LIW-01 (spotřeba)', 'SUPLA THW-01 (teplota)', 'Elektronický vodoměr'].map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-[#0D2F4F]/75">
                  <CheckCircle2 size={15} className="shrink-0 text-[#0B5EA8]" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PEVEKO visualization */}
        <div className="mb-12 grid gap-5 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-[#EAF5FB] bg-[#F8FCFE]">
            <img src={IMG_VALVE} alt="Chytrý ventil PEVEKO s Wi-Fi ovládáním" className="aspect-[5/4] h-full w-full object-contain p-4 sm:p-6" loading="lazy" decoding="async" />
            <figcaption className="border-t border-[#EAF5FB] px-5 py-3 text-sm text-[#0D2F4F]/55">
              Ventilová sestava PEVEKO — Wi-Fi ovládání, záložní baterie, vlastní inteligence
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-[#EAF5FB] bg-[#F8FCFE]">
            <img src={IMG_PANEL} alt="Ovládací panel chytrého ventilu PEVEKO" className="aspect-[5/4] h-full w-full object-contain p-4 sm:p-6" loading="lazy" decoding="async" />
            <figcaption className="border-t border-[#EAF5FB] px-5 py-3 text-sm text-[#0D2F4F]/55">
              Ovládací a stavový panel ventilové sestavy PEVEKO
            </figcaption>
          </figure>
        </div>

        {/* Technical parameters table */}
        <div className="mb-12">
          <h3 className="mb-6 font-heading text-xl text-[#0D2F4F] lg:text-2xl">Technická specifikace komponent</h3>
          <div className="overflow-x-auto rounded-2xl border border-[#EAF5FB]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0D2F4F] text-white">
                  <th className="px-4 py-4 font-mono text-[10px] uppercase tracking-wide font-semibold">Komponenta</th>
                  <th className="px-4 py-4 font-mono text-[10px] uppercase tracking-wide font-semibold">Kategorie</th>
                  <th className="px-4 py-4 font-mono text-[10px] uppercase tracking-wide font-semibold">Technická specifikace</th>
                  <th className="px-4 py-4 font-mono text-[10px] uppercase tracking-wide font-semibold text-center">Standard</th>
                  <th className="px-4 py-4 font-mono text-[10px] uppercase tracking-wide font-semibold text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {SUPLA_COMPONENTS.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <tr key={c.code} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFE]'}>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF5FB] text-[#0B5EA8]">
                            <Icon size={16} strokeWidth={1.6} />
                          </span>
                          <div>
                            <p className="font-heading text-sm font-semibold text-[#0D2F4F]">{c.name}</p>
                            <p className="mt-0.5 text-xs leading-snug text-[#0D2F4F]/55">{c.function}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex items-center rounded-full border border-[#EAF5FB] bg-white px-2.5 py-1 text-xs font-medium text-[#0D2F4F]/65">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="text-sm leading-relaxed text-[#0D2F4F]/75">{c.spec}</p>
                      </td>
                      <td className="px-4 py-4 text-center align-top">
                        {c.standard ? (
                          <CheckCircle2 size={18} className="mx-auto text-[#0B5EA8]" />
                        ) : (
                          <span className="text-[#0D2F4F]/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center align-top">
                        {c.premium ? (
                          <CheckCircle2 size={18} className="mx-auto text-[#0B5EA8]" />
                        ) : (
                          <span className="text-[#0D2F4F]/20">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#0D2F4F]/45">
            Konkrétní dimenze ventilu (DN) a počet zón se volí podle hydrauliky projektu. SUPLA Cloud a mobilní aplikace nemají povinné předplatné.
          </p>
        </div>

        {/* Scenarios */}
        <div className="mb-10">
          <h3 className="mb-6 font-heading text-xl text-[#0D2F4F] lg:text-2xl">Provozní scénáře</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCENARIOS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-2xl border border-[#EAF5FB] bg-[#F8FCFE] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B5EA8] shadow-sm">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h4 className="mt-4 font-heading text-base text-[#0D2F4F]">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#0D2F4F]/60">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#0D2F4F] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="font-heading text-lg text-white sm:text-xl">Chytré řízení pro {product?.name || 'váš projekt'}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Připravíme návrh automatizace s přesnou specifikací komponent, scénářů a cenou — včetně vizualizace v prostoru.
            </p>
          </div>
          <Link
            to={`/poptavka?produkt=${product?.slug || ''}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0B5EA8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#094d8a]"
          >
            Poptat s chytrým řízením <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
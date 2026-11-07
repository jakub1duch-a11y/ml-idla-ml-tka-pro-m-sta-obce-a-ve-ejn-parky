import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Droplets, Gauge, ShieldCheck, Smartphone, ThermometerSun, Wifi, Workflow } from 'lucide-react';

/**
 * Shared, product-specific smart-control presentation.
 * This is an educational interactive demo, not a live SUPLA interface.
 */
export default function PdSuplaControl({ product }) {
  const [demoActive, setDemoActive] = useState(true);
  const productName = product?.name || 'mlžítko';
  const productSlug = product?.slug || '';

  const workflow = [
    { icon: Clock3, name: 'Časový plán', detail: 'Kdy má mlžení pracovat' },
    { icon: ThermometerSun, name: 'Podmínky', detail: 'Teplota / vlhkost s čidly' },
    { icon: Workflow, name: 'SUPLA + ventil', detail: 'Řízení přívodu vody' },
    { icon: Droplets, name: 'Mlžítko', detail: 'Mlžení v nastaveném režimu' },
  ];

  return (
    <section id="chytre-rizeni" aria-labelledby="pd-supla-title" className="scroll-mt-36 overflow-hidden bg-[#071A2A] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#74DAEA]/25 bg-[#74DAEA]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#91E5F1]">
              <Wifi size={15} aria-hidden="true" /> Volitelný doplněk · chytré řízení
            </div>
            <h2 id="pd-supla-title" className="mt-6 max-w-xl font-heading text-[clamp(2.1rem,5vw,3.7rem)] font-bold leading-[1.04] tracking-[-.045em]">
              SUPLA. Mlžení pod kontrolou.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
              Pro {productName} lze podle zvoleného technického řešení navrhnout dálkové a automatické spínání mlžení. Z mobilu nastavíte provozní čas, případně scénář podle údajů z osazených čidel.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ['Ovládání z mobilu', 'Ruční zapnutí a vypnutí přes podporovaný SUPLA modul.'],
                ['Časové scénáře', 'Mlžení běží jen v nastavených obdobích.'],
                ['Teplota a vlhkost', 'Automatizace je možná po doplnění příslušných čidel.'],
                ['Řešení v šachtě', 'Ventil, napájení a rozvaděč podle místních podmínek.'],
              ].map(([heading, desc]) => (
                <div key={heading} className="rounded-2xl border border-white/10 bg-white/[.055] p-4 backdrop-blur-sm">
                  <CheckCircle2 size={18} className="text-[#72DDEB]" aria-hidden="true" />
                  <h3 className="mt-3 font-heading text-base font-bold text-white">{heading}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={`/poptavka?produkt=${encodeURIComponent(productSlug)}&rizeni=supla`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8EE7F2] px-5 py-3 text-sm font-bold text-[#071A2A] transition hover:bg-white">
                Poptat s řízením SUPLA <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/smart-ovladani" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8EE7F2] hover:bg-white/10">
                Jak funguje smart řízení
              </Link>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_40%,rgba(71,210,232,.19),transparent_65%)]" />
            <div className="relative rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,#153B4A,#0A1F30)] p-5 shadow-[0_35px_100px_rgba(0,0,0,.28)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8DE2EF]">Princip ovládání</p>
                  <h3 className="mt-2 font-heading text-xl font-bold">Ukázka SUPLA scénáře</h3></div>
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-medium text-white/65">Ilustrace · bez připojení</span>
              </div>

              <div className="mt-6 rounded-[1.7rem] border border-white/20 bg-white p-5 text-[#0A2837] shadow-xl sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F7FA] text-[#087EA0]"><Smartphone size={22} aria-hidden="true" /></span>
                    <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#426374]">SUPLA · ilustrační režim</p><p className="truncate font-heading text-lg font-bold">{productName}</p></div>
                  </div>
                  <button type="button" onClick={() => setDemoActive((value) => !value)} aria-pressed={demoActive}
                    aria-label={demoActive ? 'Vypnout ilustrační mlžení' : 'Zapnout ilustrační mlžení'}
                    className={`relative h-9 w-[62px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007EA3] ${demoActive ? 'bg-[#087E9D]' : 'bg-[#B8CBD4]'}`}>
                    <span className={`absolute top-[5px] h-[26px] w-[26px] rounded-full bg-white shadow-md transition-transform ${demoActive ? 'translate-x-[7px]' : 'translate-x-[-20px]'}`} aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-5 rounded-2xl bg-[#F0FAFC] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#244758]">Ukázkový stav</span>
                    <span className={`inline-flex items-center gap-2 text-xs font-bold ${demoActive ? 'text-[#087D99]' : 'text-[#617987]'}`}>
                      <span className={`h-2 w-2 rounded-full ${demoActive ? 'bg-[#04B5CB] motion-safe:animate-pulse' : 'bg-[#93AAB3]'}`} />
                      {demoActive ? 'Mlžení zapnuto' : 'Mlžení vypnuto'}
                    </span>
                  </div>
                  <div className="mt-5 flex items-end justify-center gap-2" aria-hidden="true">
                    {[2, 5, 3, 7, 4, 6, 2].map((height, index) => (
                      <span key={index} style={{ height: `${height * 8}px` }}
                        className={`w-4 rounded-t-full transition-colors duration-300 ${demoActive ? 'bg-gradient-to-t from-[#087E9D] to-[#89E7F0]' : 'bg-[#D4E5EA]'}`} />
                    ))}
                  </div>
                  <p className="mt-4 text-center text-xs text-[#557482]">V ukázce přepněte stav vypnuto / zapnuto. Nejde o skutečné ovládání zařízení.</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#DCECF1] p-3"><Clock3 size={16} className="text-[#087E9D]" aria-hidden="true" /><strong className="mt-2 block">Časový režim</strong><span className="mt-1 block text-[#53727E]">Nastavitelný plán</span></div>
                  <div className="rounded-xl border border-[#DCECF1] p-3"><Gauge size={16} className="text-[#087E9D]" aria-hidden="true" /><strong className="mt-2 block">Podmínky</strong><span className="mt-1 block text-[#53727E]">Dle osazených čidel</span></div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {workflow.map(({ icon: Icon, name, detail }, index) => (
                  <div key={name} className="relative rounded-xl border border-white/10 bg-white/5 p-3">
                    <Icon size={19} className="text-[#8DE2EF]" aria-hidden="true" />
                    <p className="mt-3 text-xs font-bold text-white">{name}</p>
                    <p className="mt-1 text-[11px] leading-4 text-white/65">{detail}</p>
                    {index < workflow.length - 1 && <ArrowRight size={13} className="absolute -right-2 top-4 z-10 hidden text-[#8DE2EF] sm:block" aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/65"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#8DE2EF]" aria-hidden="true" /> Dostupné funkce a zapojení se potvrzují podle konfigurace výrobku, vody, napájení a signálu Wi-Fi. Ilustrace neznamená, že je SUPLA součástí základní dodávky.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

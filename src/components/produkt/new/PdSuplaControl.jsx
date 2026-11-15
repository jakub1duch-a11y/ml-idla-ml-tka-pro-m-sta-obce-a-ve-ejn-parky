import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Droplets, Gauge, ShieldCheck, ThermometerSun, Wifi, Workflow } from 'lucide-react';

/**
 * Shared, product-specific smart-control presentation.
 * This is an educational interactive demo, not a live SUPLA interface.
 */
export default function PdSuplaControl({ product }) {
  const [mode, setMode] = useState('time');
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
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
          <div className="min-w-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#74DAEA]/25 bg-[#74DAEA]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#91E5F1]">
              <Wifi size={15} aria-hidden="true" /> Volitelný doplněk · chytré řízení
            </div>
            <h2 id="pd-supla-title" className="mx-auto mt-6 max-w-xl font-heading lg:mx-0 text-[clamp(2.1rem,5vw,3.7rem)] font-bold leading-[1.04] tracking-[-.045em]">
              SUPLA. Mlžení pod kontrolou.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base lg:mx-0 leading-7 text-white/80">
              Pro {productName} lze podle zvoleného technického řešení navrhnout dálkové a automatické spínání mlžení. Z mobilu nastavíte provozní čas, případně scénář podle údajů z osazených čidel.
            </p>

            <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
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

          <div className="relative mx-auto w-full min-w-0 max-w-xl">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_40%,rgba(71,210,232,.19),transparent_65%)]" />
            <div className="relative rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,#153B4A,#0A1F30)] p-5 shadow-[0_35px_100px_rgba(0,0,0,.28)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8DE2EF]">Princip ovládání</p>
                  <h3 className="mt-2 font-heading text-xl font-bold">Jak nastavit mlžení</h3></div>

              </div>

              <div className="mt-6 min-w-0 rounded-[1.7rem] bg-white p-5 text-[#0A2837] shadow-xl sm:p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#426374]">Možnosti řízení SUPLA</p>
                <p className="mt-2 break-words font-heading text-xl font-bold">{productName}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Způsob řízení">
                  {[
                    { id: 'time', icon: Clock3, label: 'Časový režim', detail: 'Plán a cykly mlžení' },
                    { id: 'conditions', icon: Gauge, label: 'Podmínky', detail: 'Reakce na osazená čidla' },
                  ].map(({ id, icon: Icon, label, detail }) => (
                    <button key={id} type="button" aria-pressed={mode === id} aria-controls="supla-mode-detail" onClick={() => setMode(id)}
                      className={`min-h-28 rounded-2xl border-2 p-4 text-left transition-colors duration-200 motion-safe:transition-transform motion-safe:active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087E9D] ${mode === id ? 'border-[#087E9D] bg-[#E8F7FA]' : 'border-[#DCECF1] bg-white hover:border-[#087E9D]'}`}>
                      <Icon size={24} className="text-[#087E9D]" aria-hidden="true" />
                      <strong className="mt-3 block text-lg">{label}</strong>
                      <span className="mt-1 block text-sm leading-5 text-[#426374]">{detail}</span>
                    </button>
                  ))}
                </div>
                <div id="supla-mode-detail" aria-live="polite" className="mt-5 min-h-44 rounded-2xl bg-[#F0FAFC] p-5">
                  <h4 className="font-bold">{mode === 'time' ? 'Mlžení podle vašeho plánu' : 'Mlžení podle podmínek'}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#426374]">{mode === 'time' ? 'Zvolíte provozní dny, čas spuštění a ukončení. Podle řídicí sestavy lze nastavit také délku mlžení a přestávky mezi cykly.' : 'S odpovídajícími čidly lze navázat spuštění na teplotu nebo vlhkost. Dostupné podmínky a jejich kombinace navrhneme podle osazeného systému.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    {(mode === 'time' ? ['Provozní dny', 'Čas od–do', 'Mlžení / pauza'] : ['Teplota', 'Vlhkost', 'Volitelná čidla']).map(label => <span key={label} className="rounded-full border border-[#B8DCE5] bg-white px-3 py-2">{label}</span>)}
                  </div>
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
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/65"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#8DE2EF]" aria-hidden="true" /> Dostupné funkce a zapojení se potvrzují podle konfigurace výrobku, vody, napájení a signálu Wi-Fi. Řízení SUPLA je volitelný doplněk.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
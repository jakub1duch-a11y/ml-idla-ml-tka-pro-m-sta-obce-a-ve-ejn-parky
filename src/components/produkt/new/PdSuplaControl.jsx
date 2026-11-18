import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Wifi } from 'lucide-react';
import PdSuplaCityShowcase from './PdSuplaCityShowcase';

/**
 * Shared, product-specific smart-control presentation.
 * This is an educational interactive demo, not a live SUPLA interface.
 */
export default function PdSuplaControl({ product }) {
  const productName = product?.name || 'mlžítko';
  const productSlug = product?.slug || '';



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

          <PdSuplaCityShowcase />
        </div>
      </div>
    </section>
  );
}
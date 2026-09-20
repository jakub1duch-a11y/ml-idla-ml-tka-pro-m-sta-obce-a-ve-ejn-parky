import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const POINTS = [
  'Zónový návrh podle prostoru a provozu',
  'Modulární mlžítka a mlžné brány',
  'Pilotní sezóna + servis',
  'Postupné rozšíření bez změny konceptu',
];

// Sekce hned pod hero. Záměrně bez animací „při zobrazení“ (whileInView / opacity 0),
// aby obsah byl vždy viditelný. Barvy jsou pevně dané, protože v tailwind.config.js je
// `cyan` definován jako jedna barva (ne škála), takže třídy cyan-300 / cyan-400 neexistují.
export default function CityNetworkSection() {
  return (
    <section
      aria-labelledby="city-network"
      className="relative overflow-hidden bg-[#06101F] py-16 text-white sm:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2BBFCF]/15 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2BBFCF]">
            Pro města a obce
          </p>
          <h2
            id="city-network"
            className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            Městská síť ochlazovacích míst. Od prvního pilotu po celé území.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Spojíme návrh zón, modulární produkty, pilotní sezónu, servis a možnost rozšíření do
            jednoho srozumitelného řešení. Mlha zůstává tam, kde má: v prostoru, ne na zemi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/poptavka"
              className="inline-flex items-center gap-2 rounded-full bg-[#2BBFCF] px-5 py-3 text-sm font-semibold text-[#06101F] transition hover:bg-white"
            >
              Navrhnout síť ochlazovacích míst <ArrowRight size={16} />
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Popsat konkrétní prostor
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {POINTS.map((item, index) => (
            <div
              key={item}
              className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 transition-colors hover:border-[#2BBFCF]/50 hover:bg-white/[0.11]"
            >
              <span className="font-mono text-xs font-semibold text-[#2BBFCF]">0{index + 1}</span>
              <p className="mt-2 font-medium text-white">{item}</p>
              <span className="mt-3 block h-px w-10 bg-[#2BBFCF]/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

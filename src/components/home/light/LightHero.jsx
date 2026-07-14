import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
{ image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png' },
{ image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png' },
{ image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84805a215_mlnprvek-mrak-mlzidla02.png' }];

const BADGES = ['Chlazení až -10 °C', 'Nízký tlak 2-7 BAR', 'Chytré ovládání (WIFI)', 'Nízká spotřeba vody'];

export default function LightHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-slate-50 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center mb-10">
        <div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight mb-3">
            Mlžné systémy pro města, parky a komerční plochy
          </h1>
          <p className="text-sm font-medium text-slate-500 mb-4">Veřejné a komerční prostory</p>
          <p className="text-slate-500 leading-relaxed mb-7">
            Ochlazení náměstí, hřišť a event prostor až o 10 °C. Nízkotlaká technologie 2–7 BAR, certifikace ČSN EN 1176.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/poptavka" className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-700 transition-colors">
              Poptat systém
            </Link>
            <Link to="/kategorie/mesta-obce" className="px-6 py-3 border border-slate-300 text-slate-700 text-sm font-semibold rounded-full hover:border-slate-500 transition-colors">
              Kategorie: města a obce
            </Link>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
          <img src={SLIDES[index].image} alt="Mlžný systém ve městě" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {BADGES.map((b) => (
            <div key={b} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 text-center">
              {b}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Snímek ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
import React, { useEffect } from 'react';
import { Droplet, Wind, Gauge, Thermometer } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: Droplet, title: 'Jemnost mlhy 10–50 μm', text: 'Vysokotlaké trysky rozprašují vodu na mikroskopické kapičky, které se rychle odpaří ve vzduchu — proto zůstávají povrchy i lidé suší.' },
  { icon: Thermometer, title: 'Ochlazení evaporací', text: 'Odpařující se voda odebírá teplo z okolního vzduchu. Výsledkem je pokles teploty o 5–9 °C bez vlhkých ploch.' },
  { icon: Gauge, title: 'Provozní tlak', text: 'Systémy pracují s tlakem přibližně 60–100 barů, který je nutný k dosažení dostatečně jemné mlhy.' },
  { icon: Wind, title: 'Nízká spotřeba vody', text: 'Díky jemnosti mlhy je spotřeba vody minimální ve srovnání s klasickým zavlažováním nebo klimatizací.' },
];

export default function Technologie() {
  useEffect(() => {
    setSEO({
      title: 'Technologie mlžení',
      description: 'Jak fungují mlžné systémy HolmTec: princip evaporace, spotřeba vody a proč je klíčová jemnost mlhy pro efektivní ochlazení.',
      keywords: 'technologie mlžení, jak funguje mlžný systém, spotřeba vody mlžení, jemnost mlhy mikrony',
      canonicalPath: '/technologie',
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Jak to funguje</p>
        <h1 className="text-4xl lg:text-5xl font-light text-white mb-6">Technologie mlžení</h1>
        <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-2xl">
          Naše mlžné systémy využívají princip evaporačního chlazení. Voda je pod vysokým tlakem rozprášena na
          extrémně jemné kapičky, které se odpaří dříve, než dopadnou na zem — a právě tento proces prostor efektivně ochlazuje.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-card_bg border border-white/10 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-cyan" />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-card_bg border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-light text-white mb-4">Proč je jemnost mlhy důležitá</h2>
          <p className="text-white/60 leading-relaxed">
            Čím jemnější kapička, tím větší je její povrch vzhledem k objemu — a tím rychleji se odpaří. Hrubší
            kapičky naopak nestihnou odpařit a dopadají na zem jako voda, což znamená mokré plochy a plýtvání vodou
            bez odpovídajícího chladicího efektu. Proto klademe důraz na precizně vyrobené trysky a vysoký provozní tlak.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/poptavka" className="inline-block px-8 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            Nezávazná poptávka
          </Link>
        </div>
      </div>
    </div>
  );
}
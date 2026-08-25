import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, QrCode, ScanLine, Smartphone } from 'lucide-react';

const AR_PRODUCTS = {
  'mlzitko-bendy': {
    label: 'MLŽÍTKO BENDY®',
    qr: '/qr/bendy-single-ar.svg',
    url: '/ar/bendy-single',
    status: 'AR 1:1',
    title: 'Zobrazit BENDY ve vašem prostoru',
    text: 'Naskenujte QR mobilem. Otevře se 3D model MLŽÍTKA BENDY® a na podporovaném telefonu jej můžete umístit do prostoru v měřítku 1:1.',
    ready: true,
  },
  'mlzna-brana-gate': {
    label: 'BRÁNA GATE',
    qr: '/qr/brana-gate-ar.svg',
    url: '/ar/gate',
    status: 'AR příprava',
    title: 'Připravujeme BRÁNU GATE pro AR',
    text: 'QR otevře mobilní 3D/AR projekt GATE a rychlou foto-vizualizaci. Živé měřítko 1:1 aktivujeme po potvrzení skutečného rozponu brány.',
    ready: false,
  },
};

export default function ProductARQR({ product }) {
  const config = AR_PRODUCTS[product?.slug];
  if (!config) return null;

  return (
    <section className="mt-7 overflow-hidden rounded-[24px] border border-slate-200 bg-[#f7fafb]">
      <div className="grid items-center gap-5 p-5 sm:grid-cols-[1fr_148px] sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0b4860]/15 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#0b4860]">
              <ScanLine size={13}/> {config.status}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[.14em] text-slate-400">{config.label}</span>
          </div>
          <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900">{config.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{config.text}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link to={config.url} className="inline-flex items-center gap-2 rounded-full bg-[#0b4860] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#08394c]">
              {config.ready ? <Box size={15}/> : <Smartphone size={15}/>} Otevřít {config.ready ? '3D / AR' : 'mobilní náhled'} <ArrowRight size={14}/>
            </Link>
            <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:border-slate-300">
              <ScanLine size={15}/> Vyfotit místo
            </Link>
          </div>
        </div>

        <div className="mx-auto w-[148px] rounded-[20px] border border-slate-200 bg-white p-3 text-center shadow-[0_12px_32px_rgba(15,23,42,.05)] sm:mx-0">
          <img src={config.qr} alt={`QR kód pro ${config.label}`} className="aspect-square w-full" loading="lazy"/>
          <span className="mt-2 inline-flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-[.1em] text-slate-500"><QrCode size={12}/> Skenovat mobilem</span>
        </div>
      </div>
    </section>
  );
}

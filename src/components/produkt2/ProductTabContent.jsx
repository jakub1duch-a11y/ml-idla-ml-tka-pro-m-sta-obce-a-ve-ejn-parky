import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import SpecTable from '@/components/produkt2/SpecTable';

const BENEFITS = [
  'Ochlazení okolního vzduchu až o 9 °C bez pocitu mokra',
  'Mikro-kapky 5–10 μm se odpaří dřív, než dopadnou na zem',
  'Nerezová ocel AISI 316L — bez koroze, celoroční provoz',
  'Volitelné Wi-Fi Smart řízení, senzory a časovače',
];

export default function ProductTabContent({ tab, product, specRows }) {
  if (tab === 'o-produktu') {
    return (
      <>
        {product.description && <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xl">{product.description}</p>}
        {(product.gallery_urls || []).length > 0 &&
          <div className="grid grid-cols-3 gap-2">
            {product.gallery_urls.map((g, i) => (
              <div key={i} className="border border-white/10 aspect-square overflow-hidden">
                <img src={g} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        }
      </>
    );
  }

  if (tab === 'technicke') {
    return <SpecTable title="Systémové parametry" rows={specRows} />;
  }

  if (tab === 'benefity') {
    return (
      <div className="border border-white/15">
        <div className="px-4 py-2.5 border-b border-white/15">
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">Benefity a přínosy</span>
        </div>
        {BENEFITS.map((b, i) => (
          <div key={i} className="px-4 py-3 border-b border-white/10 last:border-b-0 text-sm text-white/70">— {b}</div>
        ))}
      </div>
    );
  }

  if (tab === 'instalace') {
    return (
      <div className="border border-white/15">
        <div className="px-4 py-2.5 border-b border-white/15">
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">Kotvení a instalace</span>
        </div>
        <p className="px-4 py-4 text-sm text-white/60 leading-relaxed">
          Skryté kotvící patky, chemické kotvy do betonu. Rozměry a napojení na vodní řad upravitelné dle projektové dokumentace. Instalaci provádí certifikovaný technik HolmTec.
        </p>
      </div>
    );
  }

  if (tab === 'video') {
    return product.video_url ? (
      <video src={product.video_url} controls playsInline className="w-full aspect-video border border-white/15" />
    ) : (
      <p className="text-white/40 text-sm font-mono">[Video zatím není k dispozici]</p>
    );
  }

  return null;
}
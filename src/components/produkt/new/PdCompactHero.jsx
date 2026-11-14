import React, { useEffect, useState } from 'react';
import { ArrowRight, Droplets, ExternalLink, Gauge, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFamily, getLine } from '@/lib/productFamilies';
import { isProductMediaAllowed } from '@/lib/productMediaGuard';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { base44 } from '@/api/base44Client';

import { eightHourWaterCost, eightHourWaterConsumption, WATER_PRICE_CZK_M3 } from '@/lib/waterCost';

function cleanText(value = '') {
  return String(value).
  replace(/<[^>]*>/g, ' ').
  replace(/\s+/g, ' ').
  trim();
}

export default function PdCompactHero({ product }) {
  const family = getFamily(product);
  const line = getLine(product);
  const [imageIndex, setImageIndex] = useState(0);
  const [approvedMedia, setApprovedMedia] = useState([]);
  useEffect(() => setImageIndex(0), [product.slug]);
  useEffect(() => {
    let active = true;
    setApprovedMedia([]);
    base44.entities.MediaFile.filter({ product_slug: product.slug }, '-sort_order', 160)
      .then((rows = []) => {
        if (!active) return;
        setApprovedMedia((rows || [])
          .filter((row) => row.product_slug === product.slug && row.media_role === 'render' &&
            typeof row.file_url === 'string' &&
            (/\.(avif|gif|jpe?g|png|webp)([?#]|$)/i.test(row.file_url) || /drive\.google\.com\/thumbnail/i.test(row.file_url)) &&
            isProductMediaAllowed(product, row.file_url, row.file_name, row.media_group))
          .sort((a, b) => Number(Boolean(b.visualization_is_primary)) - Number(Boolean(a.visualization_is_primary)))
        );
      }).catch(() => { if (active) setApprovedMedia([]); });
    return () => { active = false; };
  }, [product.slug]);
  const imageCandidates = [...new Set([
    product.hero_visual_verified ? product.hero_product_image_url : '',
    product.image_url,
    ...approvedMedia.map((media) => media.file_url),
    ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : []),
    ...getCuratedProductMedia(product).map((item) => item.url),
  ].filter((url) => typeof url === 'string' && (/\.(avif|gif|jpe?g|png|svg|webp)(\?|#|$)/i.test(url) || /drive\.google\.com\/thumbnail/i.test(url)) && isProductMediaAllowed(product, url, product.name)))];
  const image = imageCandidates[imageIndex] || '';
  const intro = cleanText(product.short_description || product.description || '');
  const cost = eightHourWaterCost(product.water_consumption);
  const litres = eightHourWaterConsumption(product.water_consumption);
  const facts = [
    { icon: ShieldCheck, label: 'Materiál', value: product.material || 'Upřesníme v nabídce' },
    { icon: Gauge, label: 'Tlak', value: product.pressure || 'Upřesníme v nabídce' },
    { icon: Droplets, label: 'Voda', value: product.water_consumption || 'Průtok upřesníme v nabídce' },
  ];

  return (
    <section id="prehled" className="scroll-mt-28 bg-[#F7FBFD] !px-0">
      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 pb-8 pt-4 sm:gap-7 sm:px-8 sm:pt-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-stretch lg:px-12 lg:pb-14 lg:pt-12 xl:px-20">
        <div className="order-2 min-w-0 flex flex-col justify-center lg:order-1">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.17em] text-[#0B8EC5]">
            <span>{family.label}</span>
            <span className="text-[#A4B4BC]">·</span>
            <span>{line.label}</span>
          </div>

          <h1 className="mt-3 max-w-[14ch] font-heading break-words text-[clamp(2rem,9vw,5rem)] sm:mt-4 sm:max-w-[12ch] font-black leading-[1.02] tracking-[-.06em] text-[#07131D]">
            {product.name}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#5A6B78] sm:mt-5 sm:text-base sm:leading-7">
            {intro || 'Designové mlžítko pro konkrétní prostor. Přesné provedení a technické parametry se řídí ověřenými daty produktu.'}
          </p>



          
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }) =>
            <div key={label} className="min-w-0 rounded-[18px] border border-[#D8E8ED] bg-white p-2.5 last:col-span-2 sm:p-3.5 sm:last:col-span-1">
                  <Icon size={16} strokeWidth={1.6} className="text-[#0B8EC5]" />
                  <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-slate-600">{label}</p>
                  <p className="mt-1 break-words text-[12px] font-semibold leading-5 text-[#0A2342]">{value}</p>
                  {label === 'Voda' && <p className="mt-1 text-xs leading-5 text-slate-700">
                    {cost ? <>Za 8 h nepřetržitého mlžení <strong>{litres} l vody</strong>, cca <strong>{cost} Kč</strong> při modelové sazbě {WATER_PRICE_CZK_M3.toLocaleString('cs-CZ')} Kč/m³ (vodné a stočné). Pouze voda, bez servisu a případné spotřeby řízení; průtok závisí na tlaku.</> : 'Cenu za 8 h mlžení upřesníme podle průtoku.'}
                  </p>}
                </div>
            )}
            </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap [&>a]:px-3 sm:[&>a]:px-5">
            <Link
              to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#07131D] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#153863]">
              
              Návrh a cena <ArrowRight size={15} />
            </Link>
            <Link
              to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#CBE4EE] bg-white px-5 py-3 text-sm font-bold text-[#07131D] transition hover:-translate-y-0.5 hover:border-[#7CCBD8]">
              
              Vizualizovat v prostoru <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        <div className="relative order-1 min-w-0 aspect-[4/3] lg:order-2 lg:aspect-auto lg:min-h-[520px] overflow-hidden rounded-[2rem] border border-[#D8E8ED] bg-[radial-gradient(circle_at_70%_18%,#FFFFFF_0%,#EDF8FA_44%,#DCEFF3_100%)]">
          {image ?
          <img
            src={image}
            alt={product.image_alt || `${product.name} — produkt`}
            className="absolute inset-0 h-full w-full object-contain object-center"
            fetchPriority={imageIndex === 0 ? 'high' : 'auto'}
            onError={() => setImageIndex((current) => Math.min(current + 1, imageCandidates.length))} /> :


          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_70%_18%,#FFFFFF_0%,#EDF8FA_44%,#DCEFF3_100%)] px-6 text-center">
            <Droplets size={28} className="text-[#0B8EC5]" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-[#0A2342]">Produktové fotografie připravujeme</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-[#5A6B78]">Technické informace a možnost poptávky zůstávají dostupné.</p>
          </div>
          }

          {imageCandidates.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/65 bg-white/90 p-2 shadow-[0_8px_30px_rgba(10,35,66,.08)] backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-auto">
              {imageCandidates.slice(0, 5).map((candidate, index) => (
                <button key={candidate} type="button" onClick={() => setImageIndex(index)}
                  aria-label={`Zobrazit produktový snímek ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  className={`h-12 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-[#ECF7FA] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007EA3] ${imageIndex === index ? 'border-[#0B8EC5]' : 'border-transparent hover:border-[#A3D9E7]'}`}>
                  <img src={candidate} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>);

}
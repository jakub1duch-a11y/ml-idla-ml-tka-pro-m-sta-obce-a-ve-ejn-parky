import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, getProductSEO } from '@/lib/seo';
import DarkHero from '@/components/produkt3/DarkHero';
import DarkFeatureRow from '@/components/produkt3/DarkFeatureRow';
import DarkSpecs from '@/components/produkt3/DarkSpecs';
import DarkFinalCta from '@/components/produkt3/DarkFinalCta';

export default function ProduktDetail3() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    base44.entities.Product.filter({ slug }).then((results) => {
      if (!results || results.length === 0) { setNotFound(true); return; }
      setProduct(results[0]);
      setSEO(getProductSEO(results[0]));
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader size={28} className="animate-spin text-white/30" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-white/40 mb-4 text-lg">Produkt nenalezen</p>
        <Link to="/mlzidla-mlzitka" className="text-white hover:underline text-sm">← Zpět na mlžítka</Link>
      </div>
    </div>
  );

  const materials = Array.from(new Set((product.nozzle_variants || []).map((v) => v.material).filter(Boolean)));
  const gallery = product.gallery_urls || [];

  const specRows = [
    product.material && { label: 'Materiál', value: product.material },
    product.micron_size && { label: 'Velikost trysky', value: `${product.micron_size} μm` },
    product.pressure && { label: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product.coverage_area && { label: 'Pokrytí', value: product.coverage_area },
    product.power_supply && { label: 'Napájení', value: product.power_supply },
    product.spray_angle && { label: 'Úhel rozstřiku', value: product.spray_angle },
    { label: 'Cena od', value: product.price_from ? `${product.price_from.toLocaleString('cs-CZ')} Kč` : 'Na vyžádání' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-black">
      <DarkHero product={product} materials={materials} />

      <DarkFeatureRow
        tag="Výkon mlžení"
        title="Jemná mlha, dokonalý chlad."
        desc={`Precizní tryskání s velikostí kapek ${product.micron_size ? product.micron_size + ' μm' : 'v mikrometrech'} zajišťuje okamžité odpaření a ochlazení okolí bez pocitu mokra.`}
        image={gallery[0] || product.image_url}
      />

      <DarkFeatureRow
        tag="Materiál a odolnost"
        title="Odolná konstrukce pro celoroční provoz."
        desc={`${product.material || 'Nerezová ocel'} zaručuje odolnost proti korozi a dlouhou životnost i v náročných venkovních podmínkách.`}
        image={gallery[1] || product.image_url}
        reverse
      />

      <DarkFeatureRow
        tag="Chytré ovládání"
        title="Řízeno z mobilu, kdekoliv jste."
        desc="Wi-Fi Smart modul umožňuje plánování, automatizaci dle počasí a sledování spotřeby vody v reálném čase."
        image={gallery[2] || product.image_url}
      />

      <DarkSpecs rows={specRows} />
      <DarkFinalCta product={product} />
    </div>
  );
}
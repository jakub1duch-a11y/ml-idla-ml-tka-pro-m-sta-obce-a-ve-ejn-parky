import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';
import GateCore from '@/components/gate70/GateCore';
import GateThermal from '@/components/gate70/GateThermal';
import GateEngineering from '@/components/gate70/GateEngineering';
import GateAtlas from '@/components/gate70/GateAtlas';
import GateSmart from '@/components/gate70/GateSmart';
import GateOffer from '@/components/gate70/GateOffer';
import { PHOTOS } from '@/components/gate70/gateConfig';
import '@/components/gate70/gate70.css';

export default function GateExperience({ renderForm }) {
  const [params, setParams] = useSearchParams();
  const variant = params.get('varianta') === 'V' ? 'V' : 'U';
  const onVariant = (v) => {
    const next = new URLSearchParams(params);
    next.set('varianta', v);
    setParams(next, { replace: true });
  };

  const { data, isPending, error } = useQuery({
    queryKey: ['gate70-catalog'],
    queryFn: async () => {
      const p = await base44.entities.Product.filter({ slug: 'mlzna-brana-gate' }, { limit: 1 });
      return p.items[0] || null;
    },
    staleTime: 300000,
  });

  useEffect(() => {
    document.body.classList.add('gate-page-active');
    return () => document.body.classList.remove('gate-page-active');
  }, []);

  useEffect(() => {
    setSEO({
      title: 'GATE70 | Vysokotlaká mlžná brána pro městský prostor',
      description: 'GATE70 U a V. Architektonická nerezová brána, vysokotlaké mlžení 70 bar, mikro-kapky 5–10 μm. Interaktivní 3D model a návrh pro váš veřejný prostor.',
      canonicalPath: '/gate70',
      image: PHOTOS[0].url,
      type: 'product',
    });
  }, []);

  return (
    <div className="gate-experience bg-background text-foreground font-body">
      <GateCore variant={variant} onVariant={onVariant} />

      <nav className="gate-local-nav" aria-label="Sekce GATE70">
        {[
          ['gate-jadro', '3D brána'],
          ['gate-princip', 'Princip'],
          ['gate-parametry', 'Parametry'],
          ['gate-galerie', 'Atlas'],
          ['gate-smart', 'Smart řízení'],
          ['gate-poptavka', 'Nabídka'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`}>{label}</a>
        ))}
      </nav>

      <GateThermal />
      <GateEngineering product={data} loading={isPending} error={error} />
      <GateAtlas />
      <GateSmart />

      <section className="gate-section gate-operation">
        <span className="gate-kicker">GATE / V POHYBU</span>
        <h2>Voda. Světlo. Průchod.</h2>
        <video
          controls
          playsInline
          preload="none"
          poster={PHOTOS[0].url}
          src="/media/optimized/aa11e932c_mlnbrnaGATE70.webm"
          aria-label="Video mlžné brány GATE70 v provozu"
        />
        <p>Produktové video. Animovaný 3D model výše je koncepční, nikoli náhradou technického listu.</p>
      </section>

      <GateOffer>{renderForm(`GATE70-${variant}`)}</GateOffer>
    </div>
  );
}
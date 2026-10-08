import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Ruler, ShieldCheck, Wifi } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { base44 } from '@/api/base44Client';
import { buildGateCatalog } from '@/lib/gateCatalog';
import GateProductOverview from '@/components/produkt/GateProductOverview';
import GateUseCaseTables from '@/components/produkt/GateUseCaseTables';
import PlanningZoneSection from '@/components/home/new/PlanningZoneSection';
import '@/styles/gate-overview.css';

const FEATURES = [
  { icon: Ruler, title: 'Tvar pro konkrétní místo', text: 'Průchozí rozměry, rozmístění trysek a začlenění do architektury upřesníme podle projektu.' },
  { icon: ShieldCheck, title: 'Skryté kotvení', text: 'U pevných instalací navrhneme vhodný základ a skryté vedení vody. U TEEPEE řešíme stabilitu a bezpečné umístění.' },
  { icon: Droplets, title: 'Voda a servis', text: 'Nízkotlaké mlžení lze navrhnout pro vodovodní řad. Součástí přípravy je filtrace, servisní přístup a zazimování.' },
  { icon: Wifi, title: 'Ovládání podle provozu', text: 'Volitelné řízení SUPLA doplní časové plány a vzdálené ovládání podle vybavení konkrétní instalace.' },
];

export default function MlzneBrany() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const products = useMemo(() => buildGateCatalog(records), [records]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    base44.entities.Product.list('name', 200).then((items) => {
      if (!Array.isArray(items)) throw new Error('Invalid product response');
      if (active) setRecords(items);
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  useEffect(() => {
    setSEO({ title: 'Mlžné brány GATE, vstupní portály a TEEPEE', description: 'Přehled mlžných bran GATE70-U a GATE70-V, portálů LINEA CE GATE a KRUH a samostojícího mlžítka TEEPEE. Výběr, návrh umístění a instalace pro veřejný prostor.', canonicalPath: '/mlzne-brany' });
  }, []);

  return <main className="gate-page">
    <section className="gate-hero" aria-labelledby="gate-title">
      <img src="/media/gates/gate-u.webp" alt="" aria-hidden="true" fetchPriority="high" width="960" height="640" />
      <div className="gate-shell gate-hero-content"><p className="gate-eyebrow">Mlžné brány · Vstupní portály · TEEPEE</p><h1 id="gate-title">Vstupte do<br />příjemnějšího léta.</h1><p>Průchod jemnou mlhou pro náměstí, parky i veřejné areály. Vyberte tvar, který zapadne do vašeho prostoru.</p><div className="gate-hero-actions"><a className="gate-button" href="#produkty">Prohlédnout všechny produkty <ArrowRight size={17} aria-hidden="true" /></a><Link className="gate-button gate-button-light" to="/poptavka?produkt=Ml%C5%BEn%C3%A9%20br%C3%A1ny">Získat návrh a cenu <ArrowRight size={17} aria-hidden="true" /></Link></div></div>
    </section>
    <GateProductOverview products={products} loading={loading} error={error} onRetry={() => setAttempt((value) => value + 1)} />
    <GateUseCaseTables products={products} />
    <section className="gate-shell gate-section" aria-labelledby="gate-install-title"><div className="gate-section-heading"><div><p className="gate-eyebrow">Instalace a provoz</p><h2 id="gate-install-title">Čistý detail. Promyšlené napojení.</h2></div><p>Volba produktu je začátek. Společně připravíme vodu, kotvení a způsob ovládání pro konkrétní místo.</p></div><div className="gate-features">{FEATURES.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={25} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div><div className="gate-related-links"><Link to="/jak-to-funguje">Jak funguje instalace <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/smart-ovladani">Chytré ovládání SUPLA <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
    <div className="gate-planning"><PlanningZoneSection /></div>
    <section className="gate-project"><div className="gate-shell"><div><p className="gate-eyebrow">Návrh pro váš prostor</p><h2>Pošlete místo.<br />Najdeme vhodný tvar.</h2><p>Fotografie, půdorys nebo stručný popis nám pomůže doporučit produkt, umístění a konfiguraci pro vaši realizaci.</p></div><Link className="gate-button" to="/poptavka?produkt=Ml%C5%BEn%C3%A9%20br%C3%A1ny">Poptat návrh a cenu <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
  </main>;
}

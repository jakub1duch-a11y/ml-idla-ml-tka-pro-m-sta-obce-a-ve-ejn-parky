import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const common = {
  commercial: [['Chytré řízení mlžítek', '/chytra-mlzidla'], ['Katalog mlžítek a modulů', '/katalog'], ['Řešení pro konkrétní využití', '/vyuziti'], ['Partnerství pro profesionály', '/partnerstvi']],
  information: [['Jak funguje nízkotlaké mlžení', '/jak-funguje-mlzeni'], ['Úspora vody a provozní náklady', '/prinosy-mlzitek'], ['Neplaťte stočné: jak na to', '/blog/neplatte-stocne-jak-usetrit'], ['Podpora a servis mlžítek', '/podpora']]
};

function getLinks(pathname) {
  if (pathname.startsWith('/blog')) return { commercial: [['Chytré řízení mlžítek', '/chytra-mlzidla'], ['Mlžítka pro terasy a gastro', '/vyuziti/komercni'], ['Katalog mlžítek', '/katalog'], ['Nezávazná poptávka', '/poptavka']], information: [['Všechny články a inspirace', '/blog'], ['Realizace mlžných systémů', '/reference'], ['Jak funguje nízkotlaké mlžení', '/jak-funguje-mlzeni'], ['Podpora a servis mlžítek', '/podpora']] };
  if (pathname.startsWith('/reference')) return { commercial: [['Řešení pro města a obce', '/vyuziti/mesta-obce'], ['Chytré řízení mlžítek', '/chytra-mlzidla'], ['Katalog mlžných systémů', '/katalog'], ['Poptávka řešení na míru', '/poptavka']], information: [['Inspirace a články', '/blog'], ['Přínosy mlžítek pro provoz', '/prinosy-mlzitek'], ['Jak funguje nízkotlaké mlžení', '/jak-funguje-mlzeni'], ['Podpora a servis', '/podpora']] };
  if (pathname.startsWith('/vyuziti') || pathname.startsWith('/kategorie')) return { commercial: [['Katalog mlžítek pro váš prostor', '/katalog'], ['Chytré řízení mlžítek', '/chytra-mlzidla'], ['Poptávka řešení na míru', '/poptavka'], ['Partnerství pro architekty a obce', '/partnerstvi']], information: [['Přínosy mlžítek pro provoz', '/prinosy-mlzitek'], ['Jak funguje nízkotlaké mlžení', '/jak-funguje-mlzeni'], ['Realizace mlžných systémů', '/reference'], ['Podpora a servis mlžítek', '/podpora']] };
  if (pathname.startsWith('/prinosy-mlzitek')) return { commercial: [['Chytré řízení pro nižší spotřebu', '/chytra-mlzidla'], ['Mlžítka pro města a obce', '/vyuziti/mesta-obce'], ['Katalog mlžných systémů', '/katalog'], ['Poptávka řešení na míru', '/poptavka']], information: [['Neplaťte stočné: jak na to', '/blog/neplatte-stocne-jak-usetrit'], ['Jak funguje nízkotlaké mlžení', '/jak-funguje-mlzeni'], ['Ukázky realizací', '/reference'], ['Podpora a servis mlžítek', '/podpora']] };
  return common;
}

export default function ContextualFooterLinks() {
  const { pathname } = useLocation(); const links = getLinks(pathname);
  return <aside className="border-t border-slate-200 bg-slate-50 py-12"><div className="site-container grid gap-9 md:grid-cols-2"><LinkGroup title="Mohlo by vás zajímat" text="Navazující řešení pro váš projekt." links={links.commercial} /><LinkGroup title="Užitečné informace a články" text="Technické souvislosti, inspirace a péče o systém." links={links.information} /></div></aside>;
}

function LinkGroup({ title, text, links }) { return <section><h2 className="m-0 text-xl font-medium text-slate-950">{title}</h2><p className="mt-2 text-sm text-slate-500">{text}</p><ul className="mt-5 grid gap-2 p-0">{links.map(([label, to]) => <li key={to} className="list-none"><Link to={to} className="inline-flex border-b border-slate-300 pb-0.5 text-sm font-semibold text-slate-700 transition hover:border-[#0070F3] hover:text-[#0070F3]">{label}</Link></li>)}</ul></section>; }
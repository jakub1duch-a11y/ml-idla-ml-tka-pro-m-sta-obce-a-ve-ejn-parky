import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const BASE_LINKS = {
  city: [['Městská mlžítka', '/mestske-mlzitka'], ['Města a obce', '/mlzitka-pro-mesta-obce'], ['Parky a hřiště', '/kategorie/parky-hriste']],
  garden: [['Zahradní mlžítka', '/zahradni-mlzitka'], ['Outdoor a zahrady', '/kategorie/outdoor-zahrady'], ['Chytré ovládání', '/smart-ovladani']],
  technology: [['Jak funguje vodní mlha', '/vodni-mlha'], ['Chytré ovládání', '/smart-ovladani'], ['Všechny produkty', '/mlzidla-mlzitka']],
  design: [['Zakázková mlžítka', '/zakazkova-mlzitka'], ['Architekti', '/kategorie/architekti'], ['Art instalace', '/kategorie/art-instalace']],
};

function uniqueLinks(links) {
  const seen = new Set();
  return links.filter(([, path]) => path && !seen.has(path) && seen.add(path));
}

export default function ArticleLinkMap({ post }) {
  const haystack = `${post?.title || ''} ${post?.perex || ''} ${(post?.tags || []).join(' ')} ${post?.category || ''} ${post?.audience || ''}`.toLowerCase();
  const links = [];

  if (/měst|obc|náměst|park|veřej|hřišt|koupališt/.test(haystack) || post?.audience === 'firmy') links.push(...BASE_LINKS.city);
  if (/zahrad|teras|pergol|reziden|domác/.test(haystack) || post?.audience === 'soukrome') links.push(...BASE_LINKS.garden);
  if (/techn|mlh|trysk|řízení|supla|smart|voda|teplot/.test(haystack) || post?.category === 'technika') links.push(...BASE_LINKS.technology);
  if (/architekt|design|soch|atyp|zakázk/.test(haystack) || post?.category === 'inspirace') links.push(...BASE_LINKS.design);

  const custom = Array.isArray(post?.related_links)
    ? post.related_links.filter((item) => item?.label && item?.url).map((item) => [item.label, item.url])
    : [];
  const relevant = uniqueLinks([...custom, ...links]).slice(0, 8);
  if (!relevant.length) relevant.push(['Všechny produkty', '/mlzidla-mlzitka'], ['Realizace', '/reference'], ['Blog a novinky', '/blog']);

  return <nav className="my-10 rounded-2xl bg-slate-50 px-5 py-8 sm:px-7" aria-label="Související odkazy k článku">
    <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#0B6B7A]">Související obsah</p>
    <h2 className="mt-2 mb-4 font-heading text-2xl font-medium text-slate-900">Pokračujte podle tématu článku</h2>
    <div className="flex flex-wrap gap-2">{relevant.map(([label, path]) => <Link key={path} to={path} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900">{label}<ArrowUpRight size={13} /></Link>)}</div>
  </nav>;
}
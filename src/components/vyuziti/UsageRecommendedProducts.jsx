import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import CatalogProductCard from '@/components/katalog/CatalogProductCard';

const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';
const preferences = {
  'mesta-obce': /gate|linea|aura|bendy|mrak|mrkev/i, 'parky-hriste': /aura|bendy|mrak|lízátko|spirála/i,
  'skoly-skolky-deti': /mrak|aura|lízátko/i, 'domovy-senioru': /aura|mrak/i, eventy: /gate|linea|bendy/i,
  koupaliste: /gate|linea|aura/i, architekti: /aura|bendy|ostrev|mrak/i, komercni: /gate|linea|bendy|aura/i,
  hotely: /aura|bendy|mrak/i, 'wellness-terasy': /aura|mrak|bendy/i, 'outdoor-zahrady': /mrak|aura|lízátko/i,
};

export default function UsageRecommendedProducts({ sector = 'mesta-obce' }) {
  const [products, setProducts] = useState([]);
  useEffect(() => { base44.entities.Product.list().then((items) => { const physical = items.filter((item) => item.category_id !== ACCESSORY_CATEGORY_ID && !/zemní|vrut|trysk|příslušenství/i.test(item.name || '')); const matched = physical.filter(item => (preferences[sector] || /aura|bendy|gate|mrak/i).test(`${item.name} ${item.slug}`)); setProducts((matched.length ? matched : physical).slice(0, 4)); }).catch(() => setProducts([])); }, [sector]);
  return <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20"><div className="site-container"><p className="content-eyebrow">Doporučené řešení</p><h2 className="mt-3 text-slate-950">Modely vhodné právě pro tento typ provozu.</h2><p className="mt-3 max-w-2xl text-slate-600">Výběr zohledňuje pohyb návštěvníků, požadovaný efekt, odolnost a způsob sezónního provozu.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div></div></section>;
}
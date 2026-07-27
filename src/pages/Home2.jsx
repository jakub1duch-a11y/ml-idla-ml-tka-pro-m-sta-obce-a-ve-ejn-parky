import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import CatalogHomeHero from '@/components/home/CatalogHomeHero';
import CatalogCategoryGrid from '@/components/home/CatalogCategoryGrid';
import CatalogProductGrid from '@/components/home/CatalogProductGrid';
import CatalogHomeCta from '@/components/home/CatalogHomeCta';

export default function Home2() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
    Promise.all([base44.entities.Product.list(), base44.entities.ProductCategory.list()]).then(([productItems, categoryItems]) => {
      setProducts((productItems || []).filter((item) => item.image_url).sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 6));
      setCategories((categoryItems || []).slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  return <><CatalogHomeHero productCount={products.length} /><CatalogCategoryGrid categories={categories} /><CatalogProductGrid products={products} loading={loading} /><CatalogHomeCta /></>;
}
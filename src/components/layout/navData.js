import { Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby, HelpCircle, Cpu, ShieldCheck, Wrench, Download, Calculator, PlayCircle, Leaf, FileText, Landmark, Dumbbell } from 'lucide-react';

// Produktové kategorie — řazeno podle relevance pro městskou klientelu.
export const PRODUCT_LINKS = [
  { label: 'Všechny produkty', sub: 'Kompletní katalog MLŽIDLA®', path: '/mlzidla-mlzitka#catalog', image: '/media/optimized/cfc837b23_image.webp', featured: true },
  { label: 'Mlžítka pro města', sub: 'Sloupová mlžítka do veřejného prostoru', path: '/kolekce/city', image: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp' },
  { label: 'Mlžné brány', sub: 'Průchozí zóny, vstupy a koupaliště', path: '/mlzne-brany', image: '/media/optimized/17e1fc843_MlznabranaGATE70U.webp' },
  { label: 'LINEA', sub: 'Kulatá trubka nebo hranatý jekl', path: '/linea', image: '/media/optimized/512446aa1_file_00000000ada8822fab4c3e868219c559.webp' },
  { label: 'Mlžiště a mlhoviště', sub: 'Sestavy pro pobytové plochy', path: '/mlhoviste', image: '/media/optimized/61b270214_Sportovisteamlznehristemlhoviste.webp' },
  { label: 'Autorské instalace', sub: 'Mlžné skulptury na míru', path: '/kolekce/art', image: '/media/optimized/68953132b_IMG_3524.webp' },
  { label: 'Zahradní kolekce', sub: 'Terasy, gastro a rezidence', path: '/kolekce/garden', image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp', crop: 'garden' },
  { label: 'Pronájem GO', sub: 'Eventy a festivaly', path: '/pronajem', textOnly: true }
];

export const CUSTOM_LINK = { label: 'Zakázková výroba', sub: 'Kombinace mlžítek — mlžiště na míru', path: '/poptavka' };

// Mlžné zóny podle typu místa, seskupené pro rychlou orientaci.
export const USAGE_GROUPS = [
  {
    title: 'Město a veřejný prostor',
    links: [
      { icon: Building2, label: 'Města a obce', path: '/kategorie/mesta-obce' },
      { icon: Trees, label: 'Parky a hřiště', path: '/kategorie/parky-hriste' },
      { icon: Baby, label: 'Školy a školky', path: '/kategorie/skoly-skolky-deti' },
      { icon: Palette, label: 'Pro architekty', path: '/kategorie/architekti' }
    ]
  },
  {
    title: 'Volný čas a sport',
    links: [
      { icon: Waves, label: 'Koupaliště a aquaparky', path: '/kategorie/koupaliste' },
      { icon: Dumbbell, label: 'Sportoviště a mlžiště', path: '/kategorie/parky-hriste' },
      { icon: Tent, label: 'Eventy a festivaly', path: '/kategorie/eventy' },
      { icon: Sparkles, label: 'Autorské instalace', path: '/kategorie/art-instalace' }
    ]
  },
  {
    title: 'Komerce a rezidence',
    links: [
      { icon: Factory, label: 'Gastro, wellness a hotely', path: '/kategorie/komercni' },
      { icon: Flower2, label: 'Zahrady a terasy', path: '/kategorie/outdoor-zahrady' }
    ]
  }
];

export const USAGE_LINKS = USAGE_GROUPS.flatMap((group) => group.links);

// Podklady pro městské architekty, úředníky a projektanty.
export const B2G_LINKS = [
  { icon: Landmark, label: 'Mlžení pro města a obce', path: '/kategorie/mesta-obce' },
  { icon: Palette, label: 'Podklady pro architekty', path: '/kategorie/architekti' },
  { icon: Cpu, label: 'Technologie a princip', path: '/technologie' },
  { icon: Calculator, label: 'Kalkulačka provozních nákladů', path: '/kalkulacka' },
  { icon: Leaf, label: 'Udržitelnost a spotřeba vody', path: '/udrzitelnost' },
  { icon: ShieldCheck, label: 'Ochrana zdraví a hygiena', path: '/ochrana-zdravi' },
  { icon: FileText, label: 'Obchodní nabídky a reference', path: '/reference' },
  { icon: Download, label: 'Ke stažení a manuály', path: '/ke-stazeni' }
];

export const INFO_LINKS = [
  { icon: HelpCircle, label: 'Nejčastější dotazy', path: '/podpora' },
  { icon: ShieldCheck, label: 'Výhody mlžení', path: '/vyhody' },
  { icon: Wrench, label: 'Servis a údržba', path: '/servis-udrzba' },
  { icon: Cpu, label: 'Smart ovládání', path: '/smart-ovladani' },
  { icon: PlayCircle, label: 'Videa a živé ukázky', path: '/blog?sekce=videa' },
  { icon: Palette, label: 'Brand identity', path: '/brand-identity' }
];
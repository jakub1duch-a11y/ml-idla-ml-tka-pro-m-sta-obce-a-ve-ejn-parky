export const PREMIUM_PRODUCT_VISUALS = [
  {
    slug: 'bendy',
    title: 'BENDY v reálném provozu',
    product: 'BENDY',
    space: 'Promenády, parky a pěší tahy',
    intent: 'Silná emocionální fotografie pro hero / galerii produktu BENDY.',
    image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    fallback: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    alt: 'BENDY mlžítka v městském parku s jemnou vodní mlhou',
    cta: 'Poptat BENDY',
    link: '/produkt/mlzitko-bendy'
  },
  {
    slug: 'bendy-alej',
    title: 'Mlžicí alej pro pěší zóny',
    product: 'BENDY / LINEA Avenue',
    space: 'Pěší zóny, bulváry, městské promenády',
    intent: 'Použít pro homepage sekci využití a produktové linkování.',
    image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    fallback: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    alt: 'Mlžicí alej v městské promenádě',
    cta: 'Navrhnout promenádu',
    link: '/poptavka?typ=promenada'
  },
  {
    slug: 'teepee',
    title: 'TEEPEE pro náměstí a akce',
    product: 'TEEPEE',
    space: 'Náměstí, slavnosti, eventy, školní dny',
    intent: 'Zařadit k mobilním a dočasným řešením.',
    image: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    fallback: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    alt: 'Samostojné mlžiště pro městské akce',
    cta: 'Poptat TEEPEE',
    link: '/produkt/teepee'
  },
  {
    slug: 'kvet',
    title: 'KVĚT jako mlžná socha',
    product: 'KVĚT',
    space: 'Parky, náměstí, reprezentativní veřejný prostor',
    intent: 'Zařadit k vizuálně silným mlžným sochám.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    fallback: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    alt: 'Mlžná socha Květ ve veřejném prostoru',
    cta: 'Poptat KVĚT',
    link: '/mlzidla-mlzitka#catalog'
  },
  {
    slug: 'lolli',
    title: 'LOLLI — mlžné lízátko',
    product: 'LOLLI',
    space: 'Školky, hřiště, dětské areály a hravé zóny',
    intent: 'Nový hravý produkt s kruhovým / lízátkovým tvarem.',
    image: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    fallback: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    alt: 'LOLLI mlžné lízátko pro dětské a veřejné prostory',
    cta: 'Poptat LOLLI',
    link: '/produkt/mlzitko-lizatko'
  },
  {
    slug: 'garden',
    title: 'Zahradní mlžení',
    product: 'Zahradní sloup / BENDY',
    space: 'Soukromé zahrady, terasy a rezidenční sezení',
    intent: 'Použít pro rezidenční segment.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    fallback: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    alt: 'Zahradní mlžítko pro terasu a posezení',
    cta: 'Poptat zahradu',
    link: '/zahradni-mlzitka'
  }
];

export function getPremiumVisualsForProduct(product) {
  const s = `${product?.slug || ''} ${product?.name || ''}`.toLowerCase();
  if (s.includes('bendy')) return PREMIUM_PRODUCT_VISUALS.filter((v) => ['bendy', 'bendy-alej', 'garden'].includes(v.slug));
  if (s.includes('teepee')) return PREMIUM_PRODUCT_VISUALS.filter((v) => v.slug === 'teepee');
  if (s.includes('kvet') || s.includes('květ')) return PREMIUM_PRODUCT_VISUALS.filter((v) => v.slug === 'kvet');
  if (s.includes('lizat') || s.includes('lízát') || s.includes('lolli')) return PREMIUM_PRODUCT_VISUALS.filter((v) => v.slug === 'lolli');
  return PREMIUM_PRODUCT_VISUALS.slice(0, 4);
}

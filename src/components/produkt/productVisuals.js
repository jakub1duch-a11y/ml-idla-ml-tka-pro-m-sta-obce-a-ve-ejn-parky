const BENDY = {
  eyebrow: 'Městské mlžení BENDY',
  headline: 'Jeden ohnutý nerezový profil. Celé náměstí o několik stupňů chladnější.',
  intro: 'BENDY je subtilní mlžný sloup s charakteristickým ohybem. Ve veřejném prostoru nepůsobí jako technika, ale jako městský prvek — a přitom ochladí procházející o několik stupňů, bez mokré dlažby.',
  hero: {
    url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ded6a5d3f_generated_image.png',
    alt: 'Mlžný sloup BENDY chladí lidi na městském náměstí v horkém dni',
    caption: 'Ochlazování městského prostoru',
    captionNote: 'Mlžná zóna v průchozí trase — lidé jí projdou a mlha se odpaří ve vzduchu.'
  },
  cards: [
    {
      icon: 'droplets',
      title: 'Detail mlžení',
      desc: 'Trysky rozprášují vodu na mikrokapky 50–100 μm. Ty se odpaří dřív, než dopadnou — povrch zůstává suchý a bezpečný.',
      image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bf329bbee_generated_image.png',
      alt: 'Detail nerezové mlžící trysky na profilu BENDY s jemnou mlhou'
    },
    {
      icon: 'users',
      title: 'Lidé v mlžné zóně',
      desc: 'Zóna o průměru několika metrů, do které se lidé sami vracejí. Bez chemie, bez hluku, bez rizika uklouznutí.',
      image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ded6a5d3f_generated_image.png',
      alt: 'Lidé se ochlazují v mlžné zóně na městském náměstí'
    },
    {
      icon: 'wrench',
      title: 'Instalace BENDY',
      desc: 'Skryté kotvení do betonové patky, napojení na vodovodní řad v šachtě a kompaktní řídicí box. Instalace zvládnutá v jednom dni.',
      image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/92714af00_generated_image.png',
      alt: 'Technici instalují nerezový mlžný sloup BENDY na městské promenádě'
    }
  ]
};

const OSTREV = {
  eyebrow: 'Městské mlžení OSTŘEV',
  headline: 'Skulpturální mlžný prvek, který v parku vypadá jako strom.',
  intro: 'OSTŘEV rozvádí mlhu do několika větví, takže mlžný oblak je širší a jemnější. Nerezová socha, která ochlazuje pobytové plochy parků, promenád a školních areálů.',
  hero: {
    url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2a6c23aa2_generated_image.png',
    alt: 'Skulpturální nerezové mlžítko OSTŘEV chladí lidi v městském parku',
    caption: 'Pobytová mlžná zóna',
    captionNote: 'Široký mlžný oblak nad lavičkami — chlazení tam, kde lidé skutečně sedí.'
  },
  cards: [
    {
      icon: 'droplets',
      title: 'Detail větvení',
      desc: 'Každá větev nese vlastní trysky. Mlha se rozprostře do většího objemu vzduchu a klesá pomaleji.',
      image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bf329bbee_generated_image.png',
      alt: 'Detail nerezové mlžící trysky na větvi mlžítka OSTŘEV'
    },
    {
      icon: 'users',
      title: 'Lidé pod OSTŘEVEM',
      desc: 'Přirozené místo k zastavení: rodiny, děti i senioři zůstávají v mlžné zóně delší dobu než u průchozích prvků.',
      image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2a6c23aa2_generated_image.png',
      alt: 'Lidé odpočívají v mlžné zóně pod mlžítkem OSTŘEV'
    },
    {
      icon: 'wrench',
      title: 'Instalace a napojení',
      desc: 'Zemní patka, přívod vody v šachtě a volitelné smart řízení podle teploty a času. Vše řešíme podle dokumentace místa.',
      image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/92714af00_generated_image.png',
      alt: 'Instalace nerezového mlžného prvku se skrytým kotvením'
    }
  ]
};

export const PRODUCT_VISUALS = {
  'mlzitko-bendy': BENDY,
  'bendy-field': BENDY,
  'bendy-radius-s': BENDY,
  'bendy-radius-m': BENDY,
  'bendy-radius-l': BENDY,
  'bendy-alej': BENDY,
  'bendy-back-to-back': BENDY,
  'mlzitko-bendy-field': BENDY,
  'mlzny-sloupost-ostrev': OSTREV,
  'ostrev-city': OSTREV,
  'ostrev-mlzitko': OSTREV
};

export const getProductVisuals = (slug) => PRODUCT_VISUALS[slug] || null;
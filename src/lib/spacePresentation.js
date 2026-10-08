export const SPACE_PRESENTATION = {
  city: { image: '/media/gates/gate-u.webp', alt: 'Vizualizace mlžné brány GATE na městském náměstí', label: 'Náměstí' },
  park: { image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp', alt: 'Mlžítko mezi stromy a pěšími cestami v městském parku', label: 'Park' },
  sport: { image: '/media/optimized/401d9b665_generated_image.webp', alt: 'Vizualizace mlžné brány u atletické dráhy a tribuny sportovního areálu', label: 'Sportoviště' },
  event: { image: '/media/gates/teepee.webp', alt: 'TEEPEE s jemnou mlhou na městské slavnosti', label: 'Slavnost' },
};
export const EVENT_SPACE_CARDS = [
  { ...SPACE_PRESENTATION.sport, icon: 'sport', title: 'Sportoviště a areály', text: 'Mlžná zóna u vstupu nebo odpočinkového místa pro sportovce, diváky i doprovod.' },
  { ...SPACE_PRESENTATION.park, icon: 'park', title: 'Městské parky', text: 'Jemná mlha u cest a pobytových míst navazuje na zeleň a přirozený pohyb návštěvníků.' },
  { ...SPACE_PRESENTATION.event, icon: 'event', title: 'Slavnosti a eventy', text: 'Samostojící TEEPEE jako bod osvěžení pro slavnosti a sezónní program města.' },
];
export const quoteForSpace = (title) => `/poptavka?produkt=${encodeURIComponent(`Mlžítka – ${title}`)}`;

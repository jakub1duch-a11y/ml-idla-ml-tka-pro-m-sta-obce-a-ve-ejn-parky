const root = '/media/editorial';
const asset = (name, width, height, alt) => ({
  src: `${root}/${name}-${width}.webp`,
  srcSet: [640, ...(width > 960 ? [960] : []), width].filter((v, i, a) => a.indexOf(v) === i).map(w => `${root}/${name}-${w}.webp ${w}w`).join(', '),
  width, height, alt, kind: 'visualization',
});
export const EDITORIAL_MEDIA = {
  promenade: asset('bendy-promenada-vizualizace', 1672, 941, 'Vizualizace nerezových mlžítek v letní promenádě se stromy a lavičkami'),
  flower: asset('kvet-mestsky-park', 1536, 864, 'Vizualizace mlžítka KVĚT se čtyřmi rameny v pobytové části parku'),
  flowerPortrait: asset('kvet-park-portret', 864, 1536, 'Vizualizace nerezového mlžítka KVĚT v zahradě s místy k posezení'),
  sport: asset('mlzna-alej-sportoviste', 1536, 864, 'Vizualizace mlžné aleje podél sportovní a cyklistické trasy'),
};

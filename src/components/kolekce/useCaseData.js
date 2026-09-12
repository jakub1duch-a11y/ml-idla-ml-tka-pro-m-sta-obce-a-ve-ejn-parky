import { Building2, Trees, TrainFront, Trophy, Hotel, Sparkles, HeartPulse, MapPinned, House, UtensilsCrossed, Waves, Leaf } from 'lucide-react';

const IMG = {
  station: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2cc053413_generated_image.png',
  sport: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/401d9b665_generated_image.png',
  hotel: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/90b78861c_generated_image.png',
  spa: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2dc166259_generated_image.png',
  senior: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/0c1220416_generated_image.png',
  gastro: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c9e1f85d5_generated_image.png',
  pool: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c643e53a5_generated_image.png',
  residence: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/87d7a4fe6_generated_image.png',
  institution: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c5a4bb176_generated_image.png',
};

export const CITY_ITEMS = [
  { icon: Building2, code: '01', title: 'Náměstí & centrum města', text: 'Lokální ochlazovací body pro pěší zóny, tržiště a frekventovaná pobytová místa.', image: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp' },
  { icon: Trees, code: '02', title: 'Parky & promenády', text: 'Mlžné ostrovy a liniové prvky u laviček, pěších tras, nábřeží a městské zeleně.', image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp' },
  { icon: TrainFront, code: '03', title: 'Nádraží & dopravní uzly', text: 'Ochlazení čekacích a přednádražních prostorů v místech s vysokou koncentrací lidí.', image: IMG.station },
  { icon: Trophy, code: '04', title: 'Sportoviště', text: 'Ochlazovací zóny pro sportovce, diváky a doprovod u tribun, hřišť a běžeckých tras.', image: IMG.sport },
  { icon: Hotel, code: '05', title: 'Hotely & resorty', text: 'Venkovní vstupy, nádvoří, terasy a zahrady jako příjemnější součást hospitality prostoru.', image: IMG.hotel },
  { icon: Sparkles, code: '06', title: 'Lázně & wellness', text: 'Jemná mlha pro promenády, odpočinkové zahrady a klidové zóny s důrazem na architekturu.', image: IMG.spa },
  { icon: HeartPulse, code: '07', title: 'Domovy seniorů', text: 'Klidné lokální ochlazení pobytových zahrad, teras a pěších tras v horkých dnech.', image: IMG.senior },
  { icon: MapPinned, code: '08', title: 'Veřejné instituce', text: 'Vstupy, dvory, školní zahrady a další veřejné plochy s pravidelným pohybem lidí.', image: IMG.institution },
];

export const GARDEN_ITEMS = [
  { icon: House, code: '01', title: 'Soukromé zahrady', text: 'Elegantní ochlazení integrované do zeleně, terasy nebo pobytové části zahrady.', image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp' },
  { icon: UtensilsCrossed, code: '02', title: 'Gastro & hotelové terasy', text: 'Příjemnější venkovní posezení pro restaurace, kavárny a hotely v horkých dnech.', image: IMG.gastro },
  { icon: Hotel, code: '03', title: 'Hotely & resorty', text: 'Zahrady, bazénové zóny, vstupy a odpočinkové části s prémiovým architektonickým detailem.', image: IMG.hotel },
  { icon: Sparkles, code: '04', title: 'Lázně & wellness', text: 'Mlžná atmosféra pro klidové zahrady, venkovní wellness a relaxační zóny.', image: IMG.spa },
  { icon: HeartPulse, code: '05', title: 'Domovy seniorů', text: 'Ochlazení míst k sezení a pomalých pěších tras s důrazem na klidný pobyt venku.', image: IMG.senior },
  { icon: Trees, code: '06', title: 'Parkové zahrady', text: 'Ochlazení laviček, cestiček a relaxačních míst v rezidenčních a institucionálních areálech.', image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp' },
  { icon: Waves, code: '07', title: 'Bazény & koupací zóny', text: 'Jemná mlha kolem lehátek a odpočinkových ploch mimo vodní hladinu.', image: IMG.pool },
  { icon: Leaf, code: '08', title: 'Rezidenční areály', text: 'Společné venkovní zóny bytových projektů, vil a prémiových rezidencí.', image: IMG.residence },
];
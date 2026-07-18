const mistVideo = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/16e481607_Mlzitkaostev-zivaukazkamlznystrom.mov';
const auraVideo = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/8e97972ee_mlznesystemy-aura.mp4';
const urbanVideo = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/6297e30bb_Svaovnukzkazive.mov';
const installationVideo = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2b83755fa_instalace-mlzitka-mrak1.MOV';

export const MIST_STORY_SCENES = [
  { number: '01', eyebrow: 'Tepelný ostrov', title: 'Horko mění město v prostor, kde se nechce zůstávat.', text: 'Rozpálená dlažba, ostré světlo a vzduch bez úlevy. První krok ke změně je vytvořit místo, kam lidé mohou vstoupit.', video: urbanVideo, coolingVideo: auraVideo, mode: 'heat', tags: ['Letní špička', 'Veřejný prostor'] },
  { number: '02', eyebrow: 'Aktivace mlhy', title: 'Jemný mlžný oblak spouští příjemnější mikroklima.', text: 'Nízkotlaké mlžení vytváří viditelnou mlhu, která přirozeně ochlazuje okolní vzduch bez mokré dlažby.', video: installationVideo, mode: 'mist', tags: ['Nízký tlak', 'Mlha aktivní'] },
  { number: '03', eyebrow: 'Okamžik úlevy', title: 'Úleva během vteřin.', text: 'Při vstupu do chladivé zóny se mění nejen teplota, ale i atmosféra prostoru.', video: mistVideo, mode: 'cool', tags: ['−4 až −7 °C', 'Jemné osvěžení'] },
  { number: '04', eyebrow: 'Chladivá zóna', title: 'Mikroklima, které má jasně měřitelný efekt.', text: 'Kolem konstrukce vzniká měkká aktivní zóna pro zastavení, pohyb i setkávání.', video: mistVideo, mode: 'map', tags: ['4 bar', '100–300 μm', '1,2–2,4 l/h'] },
  { number: '05', eyebrow: 'Detail technologie', title: 'Nízkotlaká atomizace v každé kapce.', text: 'Precizní tryska tvoří jemnou, viditelnou mlhu pro zvlhčení vzduchu a pohodlný pobyt venku.', video: installationVideo, mode: 'nozzle', tags: ['Viditelná mlha', 'Zvlhčení vzduchu'] },
  { number: '06', eyebrow: 'Tvar jako zážitek', title: 'Tripod, Arch, Ring, Wave, Y i Semi Arch.', text: 'Každý tvar může dát místu vlastní charakter — od tiché elegance po výrazný městský orientační bod.', video: mistVideo, mode: 'forms', tags: ['Nerez AISI 316L', 'Zakázkový návrh'] },
  { number: '07', eyebrow: 'Návrh s jistotou', title: 'Doporučeno odborníky na mikroklima.', text: 'Navrhujeme systém podle místa, pohybu lidí, zdroje vody a požadovaného efektu.', video: urbanVideo, mode: 'expert', tags: ['Technický návrh', 'Instalace a servis'] },
  { number: '08', eyebrow: 'Živé prostředí', title: 'Parky, náměstí, terasy i festivaly.', text: 'Mlha promění horký okamžik v důvod zůstat déle.', video: mistVideo, mode: 'real', tags: ['Města', 'Gastro', 'Eventy'] },
];

export const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3671a8607_generated_image.png';
export const HERO_VIDEO = mistVideo;
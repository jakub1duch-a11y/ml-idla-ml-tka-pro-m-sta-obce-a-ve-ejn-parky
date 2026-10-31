const V = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/';
const F = 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/';
const gate = '/media/optimized/60dab9091_mlnbrnaGATE70V2.webp';
const bendy = '/media/optimized/b47ae10f2_bendymlzitko.webp';
const jicin = F + 'ff7aaa73f_realizace-IMG_4974.jpg';
const zoo = F + '3824f85eb_1000005519.jpg';
export const HERO_FALLBACK = '/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp';
const leaf = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bfa8ae002_mlznymrak.jpg';
// The opening H.264 clip has its MP4 index before the picture data (fast start).
export const HERO_SLIDES = [
  { id: 'mist-photo', type: 'image', src: leaf, poster: leaf, label: 'Vodní mlha · v provozu', kind: 'Fotografie realizace' },
  { id: 'gate', type: 'video', src: F + '4d05eca71_mlzidla-gate-hero-faststart.mp4', poster: gate, label: 'GATE · mlžný průchod', kind: 'Video realizace' },
  { id: 'jicin-photo', type: 'image', src: jicin, poster: jicin, label: 'BENDY · Jičínské náměstí', kind: 'Fotografie realizace' },
  { id: 'bendy-motion', type: 'video', src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3ICzICGuGqUOkZZLkzO15YACs1y/8cfbe5d4-ba39-4917-8d58-0b59ad355c18.mp4', poster: bendy, label: 'BENDY · v prostoru', kind: 'AI animace' },
  { id: 'zoo-photo', type: 'image', src: zoo, poster: zoo, label: 'Mlžítka · ZOO Praha', kind: 'Fotografie realizace' },
  { id: 'bendy-garden', type: 'video', src: V + 'a338e77cb_mlzidla---bendy-a-zahradni-instalace.mp4', poster: bendy, label: 'BENDY · zahradní instalace', kind: 'Video realizace' },
  { id: 'linea', type: 'video', src: V + 'c37b035c2_mlzidla-linea-real-video-01.mp4', poster: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp', label: 'LINEA · v provozu', kind: 'Video realizace' },
  { id: 'aura', type: 'video', src: V + '05e74ca17_aura-mlzitko-video-03.mp4', poster: '/media/optimized/91ce94feb_MlzitkoAURA.webp', label: 'AURA · v prostoru', kind: 'AI animace' },
  { id: 'gate-installation', type: 'video', src: V + 'aa11e932c_mlnbrnaGATE70.mp4', poster: gate, label: 'GATE · realizace', kind: 'Video realizace' },
];
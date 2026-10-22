import React from 'react';
import VideoReel from '@/components/common/VideoReel';

const B = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/';
const VIDEOS = [
  { src: B + '085ddff09_Lineamlnprvekvzahrad_mlzidlacz.mp4', label: 'LINEA v zahradě' },
  { src: B + '8061094e3_262224385_1792548412831324.mp4', label: 'Jemná mlha v provozu' },
  { src: B + '208a10730_331306547_1792548476197985.mp4', label: 'Osvěžení ve veřejném prostoru' },
  { src: B + '38eaa0e4e_YTShort_18j2026_23_13_00.mp4', label: 'Mlžítko v detailu' },
  { src: B + 'aba1bc1af_18jna2026.mp4', label: 'Letní realizace' },
  { src: B + '8a661e4ea_220556392_1792547885107088.mp4', label: 'Mlha a lidé' },
  { src: B + 'c0f3bdb5e_980843427_1792548115090204.mp4', label: 'Městská mlžná zóna' },
  { src: B + 'fc85f873f_293049174_1792594531328800.mp4', label: 'Detail trysek' },
];

export default function HomeVideoReel() {
  return <VideoReel eyebrow="Mlžítka v akci" title="Podívejte se, jak mlha osvěží prostor." videos={VIDEOS} />;
}
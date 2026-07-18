import React from 'react';

const photos = [
  ['https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e77e5498d_mltkaprowellnessterasy.png', 'Mlžítko pro venkovní terasu'],
  ['https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/97adcdb67_file_000000001abc8243a41e16d7f22e87b8.png', 'Jemná mlha v zahradním prostoru'],
  ['https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.jpg', 'Ochlazení venkovního posezení']
];

export default function GardenGallery() { return <section className="site-container py-16 lg:py-20"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0070F3]">Inspirace pro zahradu</p><h2 className="mt-3 text-slate-950">Mlžení jako přirozená součást venkovního prostoru.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{photos.map(([src, alt]) => <img key={src} src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />)}</div></section>; }
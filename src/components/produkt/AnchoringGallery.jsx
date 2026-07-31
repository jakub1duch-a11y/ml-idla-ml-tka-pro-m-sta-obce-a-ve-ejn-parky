import React from 'react';

const OPTIONS = [
  {
    src: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bd29c555a_f16a9c3ea_generated_image.png',
    title: 'Kotvící patka',
    text: 'Detail skrytého a pevného kotvení pro trvalou instalaci.'
  },
  {
    src: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/150f3566d_IMG_20260623_124103.jpg',
    title: 'Možnosti instalace',
    text: 'Přehled variant pro pevné i mobilní umístění mlžidla.'
  }
];

export default function AnchoringGallery() {
  return (
    <div className="mb-16 grid gap-6 md:grid-cols-2">
      {OPTIONS.map((option) => (
        <figure key={option.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={option.src} alt={option.title} className="h-full w-full object-cover" loading="lazy" /></div>
          <figcaption className="p-5"><h3 className="font-heading text-lg text-slate-900">{option.title}</h3><p className="mt-1 text-sm text-slate-500">{option.text}</p></figcaption>
        </figure>
      ))}
    </div>
  );
}
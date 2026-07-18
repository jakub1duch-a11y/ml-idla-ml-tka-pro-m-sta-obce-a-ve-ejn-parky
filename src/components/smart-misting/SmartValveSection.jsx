import React from 'react';
import { ArrowRight, Check, Clock, Smartphone, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const studioImage = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/48878c442_generated_image.png';
const valveImage = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9be6abbe5_15224-2_pst-wv-qy-wh-tuya.jpg';
const inlineImage = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/947cd2577_232001.jpg';
const features = [{ icon: Wifi, text: 'Wi‑Fi 2,4 GHz' }, { icon: Smartphone, text: 'Tuya Smart / Smart Life' }, { icon: Clock, text: 'Časové plány a scénáře' }, { icon: Check, text: 'Ruční ovládání zachováno' }];

export default function SmartValveSection() {
  return <section className="bg-white py-20 lg:py-28">
    <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="content-eyebrow mb-4">Chytré ventily</p>
        <h2 className="content-title">Dva způsoby, jak dostat průtok pod kontrolu.</h2>
        <p className="content-lead mt-5">Pohon PST WV‑QY‑WH se montuje na stávající pákový kulový ventil bez zásahu do potrubí. Přímý 3/4″ Wi‑Fi ventil je vhodný pro novou samostatnou větev mlžítka.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{features.map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 border-t border-slate-200 py-3 text-sm font-semibold text-slate-700"><Icon size={17} className="text-techblue" />{text}</div>)}</div>
        <div className="mt-8 flex flex-wrap items-center gap-4"><span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">Cena na vyžádání</span><Link to="/poptavka?produkt=Chytrý%20ventil" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">Doporučit správný typ <ArrowRight size={15} /></Link></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <img src={studioImage} alt="Chytrý ventil napojený na nerezové mlžítko" className="col-span-2 aspect-[4/3] w-full rounded-2xl object-cover" />
        <img src={valveImage} alt="Wi-Fi pohon pákového ventilu PST WV-QY-WH" className="aspect-square w-full rounded-2xl object-cover" />
        <img src={inlineImage} alt="Přímý 3/4 palcový Wi-Fi ventil" className="aspect-square w-full rounded-2xl object-cover" />
      </div>
    </div>
  </section>;
}
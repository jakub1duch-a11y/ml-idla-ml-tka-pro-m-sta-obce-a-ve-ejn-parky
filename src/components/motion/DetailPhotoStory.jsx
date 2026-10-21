import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import useMotionPlayback from './useMotionPlayback';
import MotionHeading from './MotionHeading';
import '@/styles/content-motion.css';

export default function DetailPhotoStory({ variant = 'detail' }) {
  const { ref, playing, paused, reduced, setPaused } = useMotionPlayback();
  const spaces = variant === 'spaces';
  const name = spaces ? 'public-spaces' : 'misting-details';
  const asset = `/media/motion/${name}`;
  return <section ref={ref} className="detail-photo-story" aria-label={spaces ? 'Mlžení v různých prostorech' : 'Detail trysky a vodní mlhy'}>
    <div className="detail-photo-shell"><figure className="detail-photo-media"><picture key={playing ? 'motion' : 'poster'}>{playing && <><source type="image/webp" media="(max-width: 639px)" srcSet={`${asset}-mobile.webp`} /><source type="image/webp" srcSet={`${asset}-desktop.webp`} /></>}<source media="(max-width: 639px)" srcSet={`${asset}-mobile${playing ? '.gif' : '-poster.webp'}`} /><img src={`${asset}-desktop${playing ? '.gif' : '-poster.webp'}`} alt={spaces ? 'Postupné náhledy mlžení u sportovní dráhy, v parku a na městské slavnosti' : 'Detail mlžné trysky na nerezovém prvku, jemné vodní mlhy a povrchu nerezi'} width="720" height="480" loading="lazy" decoding="async" /></picture><div className="detail-photo-shade" aria-hidden="true" /></figure>
      <div className="detail-photo-copy"><p className="space-eyebrow">{spaces ? 'Místo má svůj rytmus' : 'Zblízka je vidět rozdíl'}</p><MotionHeading>{spaces ? 'Tři prostory. Jedna jemná mlha.' : 'Nerez. Tryska. Jemné osvěžení.'}</MotionHeading><p>{spaces ? 'Sportovní areál, klidný park i slavnost. Zvolíme vhodný produkt a provoz pro místo, kde se lidé potkávají.' : 'Prohlédněte si detail mlžení. Rozmístění trysek, napojení vody a řízení volíme podle produktu a podmínek vašeho místa.'}</p><Link className="detail-photo-link" to={spaces ? '/poptavka?produkt=Ml%C5%BEn%C3%A1%20z%C3%B3na' : '/jak-to-funguje'}>{spaces ? 'Poptat řešení pro svůj prostor' : 'Jak vzniká vodní mlha'} <ArrowRight size={17} aria-hidden="true" /></Link>
        {!reduced && <button type="button" className="detail-photo-toggle" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{paused ? 'Přehrát náhledy' : 'Zastavit náhledy'}</button>}
      </div>
    </div>
  </section>;
}

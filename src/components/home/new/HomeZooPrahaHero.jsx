import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import CinematicReferenceHero from '@/components/CinematicReferenceHero';

const ZOO_ID = '6a42491409abbf575447aaeb';
const isNativeVideo = (url = '') => /^https?:\/\//i.test(url) && /\.(mp4|webm)(\?.*)?$/i.test(url);

export default function HomeZooPrahaHero() {
  const [project, setProject] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.Realizace.get(ZOO_ID)
      .then((record) => { if (active && record) setProject(record); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (!project) {
    return <section aria-label="Úvodní prezentace MLŽIDLA.cz" className="flex min-h-[75svh] items-end bg-[#061f2b] px-6 pb-16 text-white">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-200">MLŽIDLA® / BY HOLMTEC</p>
        <h1 className="mt-5 max-w-3xl font-heading text-4xl sm:text-6xl">Mlžítka pro veřejný prostor</h1>
      </div>
    </section>;
  }

  const videos = [project.video_url, ...(project.gallery_urls || []).filter(isNativeVideo)]
    .filter(isNativeVideo).filter((video, i, all) => all.indexOf(video) === i);

  return <CinematicReferenceHero
    project={project}
    videos={videos}
    title="Mlžítka pro veřejný prostor"
    badge="Realizace ZOO Praha"
    description="Nerezové mlžné sochy pro osvěžení návštěvníků. Prohlédněte si realizaci v Zoologické zahradě hl. m. Prahy."
    homeMode
  />;
}

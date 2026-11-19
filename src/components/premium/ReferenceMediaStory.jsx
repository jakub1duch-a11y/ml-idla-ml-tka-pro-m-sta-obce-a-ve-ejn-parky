import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Pause, Play, ZoomIn } from 'lucide-react';

const isPlayable = (url) => /^https?:\/\//i.test(url || '') && /\.(mp4|webm)(\?.*)?$/i.test(url || '');
const findImage = (images, marker, fallbackIndex) =>
  images.find((url) => url.includes(marker)) || images[fallbackIndex] || images[0];

function BackgroundLoop({ src, poster, label }) {
  const holderRef = useRef(null);
  const videoRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(holderRef, { amount: 0.16, margin: '120px 0px 120px 0px' });
  const [paused, setPaused] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const [broken, setBroken] = useState(false);
  const [activated, setActivated] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const shouldPlay = Boolean(activated && inView && tabVisible && !paused && (!reducedMotion || explicitPlay) && !broken);

  useEffect(() => { if (inView) setActivated(true); }, [inView]);
  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    update();
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (shouldPlay) node.play().catch(() => setPaused(true));
    else node.pause();
  }, [shouldPlay, src]);

  return (
    <div ref={holderRef} className="group relative h-full min-h-[310px] overflow-hidden bg-[#17424d]">
      {poster && <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
      {!broken && (
        <video
          ref={videoRef}
          src={activated || explicitPlay ? src : undefined}
          muted
          autoPlay={false}
          loop
          playsInline
          preload="none"
          poster={poster || undefined}
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover"
          aria-label={label}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#021e29]/75 via-transparent to-transparent" />
      <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-black/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[.16em] text-white backdrop-blur-md">
        Video / skutečná realizace
      </span>
      {!broken && (
        <button
          type="button"
          onClick={() => {
            if (paused || (reducedMotion && !explicitPlay)) {
              setExplicitPlay(true);
              setPaused(false);
            } else setPaused(true);
          }}
          className="absolute bottom-5 right-5 inline-flex min-h-12 items-center gap-2 rounded-full border border-white/45 bg-[#041f2b]/70 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-[#052d3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={shouldPlay ? 'Pozastavit videosmyčku' : 'Přehrát videosmyčku'}
        >
          {shouldPlay ? <Pause size={17} /> : <Play size={17} />}
          {shouldPlay ? 'Pozastavit' : 'Přehrát'}
        </button>
      )}
      {broken && <span className="absolute bottom-5 left-5 text-xs text-white/85">Fotografie realizace</span>}
    </div>
  );
}

function StoryChapter({ scene, index, total, openPhoto }) {
  const reducedMotion = useReducedMotion();
  const imageFirst = index % 2 === 1;
  return (
    <motion.article
      id={`reference-chapter-${index + 1}`}
      data-reference-story-chapter={index + 1}
      initial={reducedMotion ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 border-t border-white/10 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col justify-between gap-6 lg:mb-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="text-xs font-semibold tracking-[.18em] text-cyan-200">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
              <span className="h-px w-10 bg-cyan-200/70" />
              <span className="text-xs uppercase tracking-[.19em] text-white/60">{scene.eyebrow}</span>
            </div>
            <h3 className="font-heading text-3xl leading-[1.08] tracking-tight sm:text-5xl">{scene.title}</h3>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/70 sm:text-base">{scene.description}</p>
        </div>

        <div className="grid min-h-[420px] gap-3 md:grid-cols-12 md:gap-4">
          {scene.video && (
            <div className={`relative h-[340px] overflow-hidden rounded-[20px] md:col-span-7 md:h-[520px] ${imageFirst ? 'md:order-2' : ''}`}>
              <BackgroundLoop src={scene.video} poster={scene.photo} label={`ZOO Praha – ${scene.title}`} />
            </div>
          )}
          <div className={`group relative h-[360px] overflow-hidden rounded-[20px] bg-[#305360] md:col-span-5 md:h-[520px] ${imageFirst ? 'md:order-1' : ''}`}>
            <img
              src={scene.photo}
              alt={scene.photoAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.045]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031f2a]/75 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-black/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[.16em] backdrop-blur-md">Fotografie / realizace</span>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
              <p className="max-w-[270px] text-sm leading-6 text-white/90">{scene.photoLabel}</p>
              <button
                type="button"
                onClick={() => openPhoto(scene.photo)}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/50 bg-black/40 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-[#052d3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={`Zvětšit fotografii: ${scene.photoAlt}`}
              >
                <ZoomIn size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ReferenceMediaStory({ project, images = [], videos = [], isZoo = false, onOpenPhoto }) {
  const nativeVideos = useMemo(() => [...new Set(videos.filter(isPlayable))], [videos]);
  const scenes = useMemo(() => {
    if (!images.length || !nativeVideos.length) return [];
    if (isZoo) {
      return [
        {
          eyebrow: 'Život v mlžné zóně',
          title: 'Mlha, která přirozeně přitahuje pozornost.',
          description: 'Skutečné záběry z provozu doplňují fotografie návštěvníků. Pohyb, měřítko a atmosféra místa jsou vidět přímo v prostoru.',
          photo: findImage(images, '11cdeE9PBW1wHuKys6Q-8f_hQ58DmYvXK', 1),
          photoAlt: 'ZOO Praha – návštěvníci u nerezových mlžných soch',
          photoLabel: 'Návštěvníci a vodní mlha v reálném měřítku',
          video: nativeVideos[5] || nativeVideos[0],
        },
        {
          eyebrow: 'Prostor a atmosféra',
          title: 'Podívejte se na instalaci z jiného úhlu.',
          description: 'Širší fotografie ukazuje začlenění mlžných prvků do areálu. Videosmyčka přidává pohyb, bez nutnosti spouštět samostatný přehrávač.',
          photo: findImage(images, '1hB3ZlY4bEGSnKiPfqA4WSlENj9JYZMRS', 2),
          photoAlt: 'ZOO Praha – mlžné sochy v prostředí zahrady',
          photoLabel: 'Reálné prostředí návštěvnické zóny',
          video: nativeVideos[12] || nativeVideos[1] || nativeVideos[0],
        },
        {
          eyebrow: 'Detail a provedení',
          title: 'Tvar, nerez a jemná vodní mlha.',
          description: 'V detailu vyniká povrch, geometrie i propojení mlžných soch s okolní zelení. Fotografii lze otevřít ve větším zobrazení.',
          photo: findImage(images, '1KjpfDDreK-VBO6by0J4McwzafWG78Kud', 3),
          photoAlt: 'ZOO Praha – detail instalovaných nerezových mlžných soch',
          photoLabel: 'Detail realizace a okolního prostoru',
          video: nativeVideos[21] || nativeVideos[2] || nativeVideos[0],
        },
      ];
    }
    return [{
      eyebrow: 'Záběry z realizace',
      title: 'Podívejte se na projekt v pohybu.',
      description: 'Skutečná fotografie zachycuje podobu instalace. Smyčka doplňuje krátký pohled na mlžítko v prostoru.',
      photo: images[1] || images[0],
      photoAlt: `${project.name} – skutečná fotografie realizace`,
      photoLabel: project.location || 'Fotografie realizace',
      video: nativeVideos[0],
    }];
  }, [images, isZoo, nativeVideos, project.location, project.name]);

  if (!scenes.length) return null;
  const openPhoto = (url) => {
    if (onOpenPhoto) onOpenPhoto(url);
  };

  return (
    <section id="reference-media-story" aria-labelledby="reference-media-story-title" className="overflow-hidden bg-[#051e2a] text-white" data-reference-media-story>
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 lg:px-10 lg:pt-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan-200">MLŽIDLA® / PŘÍBĚH REALIZACE</p>
            <h2 id="reference-media-story-title" className="mt-5 max-w-3xl font-heading text-3xl tracking-tight sm:text-5xl">
              {isZoo ? 'ZOO Praha. Realizace v obrazech a pohybu.' : 'Realizace ve fotografiích a videu.'}
            </h2>
          </div>
          <a href="#reference-chapter-1" className="inline-flex min-h-11 items-center gap-2 self-start border-b border-white/40 pb-2 text-sm font-medium text-white/90 hover:text-cyan-200">
            Projít obrazový příběh <ArrowDown size={17} />
          </a>
        </div>
        <nav aria-label="Obrazové kapitoly realizace" className="mt-8 flex flex-wrap gap-2">
          {scenes.map((scene, index) => (
            <a key={scene.eyebrow} href={`#reference-chapter-${index + 1}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white/85 transition hover:border-cyan-200 hover:bg-white/10 hover:text-white">
              <span className="text-cyan-200">{String(index + 1).padStart(2, '0')}</span> {scene.eyebrow} <ArrowUpRight size={13} />
            </a>
          ))}
        </nav>
      </div>
      {scenes.map((scene, index) => (
        <StoryChapter key={scene.eyebrow} scene={scene} index={index} total={scenes.length} openPhoto={openPhoto} />
      ))}
    </section>
  );
}

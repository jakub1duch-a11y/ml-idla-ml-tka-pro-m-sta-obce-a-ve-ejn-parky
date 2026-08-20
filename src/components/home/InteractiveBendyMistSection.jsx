import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Droplets, Gauge, ShieldCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';

// Interaktivní produktová prezentace BENDY SINGLE®.
// Geometrie výrobku se nemění; animujeme pouze světlo, perspektivu a jemnou mlhu.
const PRODUCT_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a73ab7232_Mltko-Bendy60-edited1.png';

const specs = [
  { icon: ShieldCheck, label: 'Materiál', value: 'Nerez AISI 316' },
  { icon: Gauge, label: 'Pracovní tlak', value: '2–8 bar' },
  { icon: Droplets, label: 'Dosah', value: '1,7–2 m' },
];

function MistCloud({ className, delay = 0, duration = 7 }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full bg-white/75 blur-3xl ${className}`}
      initial={{ opacity: 0.08, scale: 0.82, x: 0, y: 0 }}
      animate={{
        opacity: [0.08, 0.36, 0.14],
        scale: [0.82, 1.18, 1.02],
        x: [0, 28, 58],
        y: [0, -10, -30],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function MistParticle({ left, top, delay, size }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute rounded-full bg-white/80 shadow-[0_0_14px_rgba(255,255,255,0.65)]"
      style={{ left, top, width: size, height: size }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
      animate={{ opacity: [0, 0.75, 0], x: [0, 18, 42], y: [0, -8, -22], scale: [0.7, 1, 1.2] }}
      transition={{ duration: 3.2, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

export default function InteractiveBendyMistSection() {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  const [mistBoost, setMistBoost] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(smoothX, [0, 1], [-6, 6]);
  const rotateX = useTransform(smoothY, [0, 1], [5, -5]);
  const glowX = useTransform(smoothX, [0, 1], ['30%', '70%']);
  const glowY = useTransform(smoothY, [0, 1], ['28%', '72%']);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop?.();
        audioRef.current.ctx?.close?.();
      }
    };
  }, []);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const resetPointer = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  // Jemný syntetický ambience: filtrovaný broadband noise s velmi nízkou hlasitostí.
  // Spouští se až po kliknutí uživatele kvůli pravidlům autoplay v prohlížečích.
  const toggleSound = async () => {
    if (soundOn) {
      if (audioRef.current?.gain) {
        audioRef.current.gain.gain.cancelScheduledValues(audioRef.current.ctx.currentTime);
        audioRef.current.gain.gain.linearRampToValueAtTime(0, audioRef.current.ctx.currentTime + 0.35);
      }
      setTimeout(() => {
        audioRef.current?.stop?.();
        audioRef.current?.ctx?.close?.();
        audioRef.current = null;
      }, 420);
      setSoundOn(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    await ctx.resume();

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const highPass = ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 850;

    const lowPass = ctx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 4200;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.032, ctx.currentTime + 0.7);

    source.connect(highPass).connect(lowPass).connect(gain).connect(ctx.destination);
    source.start();

    audioRef.current = { ctx, gain, stop: () => source.stop() };
    setSoundOn(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#edf7fb] px-5 py-20 sm:px-6 md:py-28 lg:px-8"
      aria-labelledby="interactive-bendy-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),rgba(226,242,249,0.86)_42%,rgba(217,235,244,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">BENDY SINGLE® · interaktivní náhled</p>
            <h2 id="interactive-bendy-title" className="text-4xl font-medium leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-5xl md:text-6xl">
              Ochlazení, které je vidět.<br />Pocit, který je okamžitý.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Pohybujte kurzorem nad produktem. Jemná mlha, světlo a perspektiva reagují na váš pohyb — samotná geometrie BENDY zůstává beze změny.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            aria-pressed={soundOn}
          >
            {soundOn ? <VolumeX size={17} /> : <Volume2 size={17} />}
            {soundOn ? 'Vypnout atmosféru' : 'Zapnout atmosféru'}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
          <div
            className="relative min-h-[620px] overflow-hidden rounded-[34px] border border-white/80 bg-white/45 shadow-[0_30px_100px_rgba(46,92,116,0.15)] backdrop-blur-xl md:min-h-[720px]"
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            onPointerEnter={() => setMistBoost(true)}
            onPointerOut={() => setMistBoost(false)}
          >
            <motion.div
              aria-hidden="true"
              className="absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(123,211,244,0.34)_0%,rgba(123,211,244,0.14)_38%,transparent_72%)] blur-2xl"
              style={{ left: glowX, top: glowY, translateX: '-50%', translateY: '-50%' }}
            />

            <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-sky-100/80 via-white/10 to-transparent" />

            {/* Atmosférické vrstvy mlhy — nepřekrývají hlavní siluetu produktu. */}
            <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${mistBoost ? 'opacity-100' : 'opacity-70'}`}>
              <MistCloud className="right-[12%] top-[19%] h-28 w-52" delay={0} duration={6.5} />
              <MistCloud className="right-[4%] top-[24%] h-24 w-44" delay={1.1} duration={7.6} />
              <MistCloud className="right-[20%] top-[30%] h-20 w-40" delay={2.1} duration={8.2} />
              <MistParticle left="70%" top="26%" delay={0.3} size={5} />
              <MistParticle left="72%" top="24%" delay={1.0} size={4} />
              <MistParticle left="74%" top="28%" delay={1.7} size={6} />
              <MistParticle left="76%" top="25%" delay={2.4} size={4} />
            </div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center px-8 py-12 md:px-16"
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              whileHover={{ scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            >
              <motion.img
                src={PRODUCT_IMAGE}
                alt="Nerezové mlžítko BENDY SINGLE® HolmTec"
                className="max-h-[78%] max-w-[78%] select-none object-contain drop-shadow-[0_28px_34px_rgba(20,49,65,0.22)]"
                draggable="false"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-xs text-slate-600 backdrop-blur-md md:left-6 md:right-6">
              <span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-sky-600" /> Interaktivní režim</span>
              <span className="hidden sm:inline">Pohyb myší = světlo + perspektiva + intenzita mlhy</span>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(46,92,116,0.10)] backdrop-blur-xl md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Produkt</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">BENDY SINGLE®</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Organicky zakřivené nerezové mlžítko pro zahrady, terasy a pobytové zóny. Čistá silueta, která nechává vyniknout samotný efekt jemné vodní mlhy.
              </p>
            </div>

            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/60 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-sky-700"><Icon size={17} /></span>
                  <span className="text-sm">{label}</span>
                </div>
                <strong className="text-sm font-semibold text-slate-900">{value}</strong>
              </div>
            ))}

            <a
              href="/produkt/mlzitko-bendy"
              className="mt-1 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Prohlédnout BENDY SINGLE®
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

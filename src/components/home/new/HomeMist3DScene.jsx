import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Move3D, Sparkles, Wind } from 'lucide-react';

const LINEA_MASTER =
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/6af16b6a9_linea---rezidencni-mlzeni.jpg';

const principles = [
  { icon: Move3D, label: 'Pomalý pohyb kamery' },
  { icon: Wind, label: 'Jemná animace mlhy' },
  { icon: Sparkles, label: 'Ocelové odlesky a světlo' },
];

export default function HomeMist3DScene() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden bg-[#06111B] py-20 text-white sm:py-24 lg:py-32"
      aria-label="Animovaná produktová scéna MLŽIDLA"
      data-home-reveal
    >
      <style>{`
        @keyframes mlzAmbientDriftA {
          0%,100% { transform: translate3d(-8%, 8%, 0) scale(1); opacity: .18; }
          50% { transform: translate3d(14%, -7%, 0) scale(1.16); opacity: .34; }
        }
        @keyframes mlzAmbientDriftB {
          0%,100% { transform: translate3d(12%, -6%, 0) scale(1.08); opacity: .12; }
          50% { transform: translate3d(-14%, 8%, 0) scale(.94); opacity: .28; }
        }
        @keyframes mlzMistSweep {
          0% { transform: translate3d(-20%, 0, 0) scaleX(.8); opacity: 0; }
          18% { opacity: .24; }
          70% { opacity: .12; }
          100% { transform: translate3d(38%, -3%, 0) scaleX(1.22); opacity: 0; }
        }
        .mlz-cinematic-noise {
          background-image:
            radial-gradient(circle at 22% 35%, rgba(158,217,240,.14), transparent 24%),
            radial-gradient(circle at 72% 22%, rgba(248,250,252,.10), transparent 19%),
            linear-gradient(115deg, rgba(255,255,255,.035), transparent 42%);
        }
        @media (prefers-reduced-motion: reduce) {
          .mlz-ambient-a,.mlz-ambient-b,.mlz-mist-sweep { animation: none !important; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 mlz-cinematic-noise" />
      <div className="mlz-ambient-a pointer-events-none absolute -left-[10%] top-[5%] h-[46rem] w-[46rem] rounded-full bg-[#5BD6F5]/20 blur-[110px]" style={{ animation: 'mlzAmbientDriftA 16s ease-in-out infinite' }} />
      <div className="mlz-ambient-b pointer-events-none absolute -right-[12%] bottom-[-25%] h-[40rem] w-[40rem] rounded-full bg-white/10 blur-[120px]" style={{ animation: 'mlzAmbientDriftB 19s ease-in-out infinite' }} />

      <div className="relative mx-auto grid max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.74fr_1.26fr] lg:items-center lg:px-12 xl:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.28em] text-[#6BD8F2]">
            Produktová motion vrstva
          </p>
          <h2 className="mt-5 max-w-[10ch] font-heading text-[clamp(2.6rem,5vw,5.8rem)] font-bold leading-[.93] tracking-[-.055em] text-white">
            Nerez. Světlo. Mlha v pohybu.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            Produkt zůstává geometricky beze změny. Animujeme pouze kameru, světlo a atmosféru,
            aby vynikla skutečná konstrukce a práce jemné vodní mlhy.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {principles.map(({ icon: Icon, label }) => (
              <div key={label} className="flex min-h-14 items-center gap-3 border border-white/10 bg-white/[.045] px-4 py-3 backdrop-blur-md">
                <Icon size={18} className="shrink-0 text-[#6BD8F2]" strokeWidth={1.6} />
                <span className="text-xs font-semibold leading-5 text-white/72">{label}</span>
              </div>
            ))}
          </div>

          <a href="/produkt/linea-mlzitko" className="mt-8 inline-flex min-h-12 items-center gap-2 border border-white/18 bg-white/[.06] px-5 py-3 text-sm font-bold text-white transition hover:border-[#6BD8F2]/55 hover:bg-white/[.10]">
            Prohlédnout LINEA® <ArrowUpRight size={16} />
          </a>
        </motion.div>

        <motion.div
          className="relative min-h-[520px] overflow-hidden border border-white/10 bg-[#0A1A27] shadow-[0_40px_120px_rgba(0,0,0,.38)] sm:min-h-[620px] lg:min-h-[720px]"
          initial={reduceMotion ? false : { opacity: 0, scale: .985 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={LINEA_MASTER}
            alt="Ověřený produkt MLŽÍTKO LINEA v prostoru"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            initial={false}
            animate={reduceMotion ? undefined : { scale: [1.035, 1.085, 1.035], x: ['0%', '-1.6%', '0%'] }}
            transition={reduceMotion ? undefined : { duration: 16, ease: 'easeInOut', repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,15,.05)_0%,rgba(2,9,15,.08)_48%,rgba(2,9,15,.82)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_34%,rgba(207,243,255,.24),transparent_28%)]" />

          <div className="mlz-mist-sweep pointer-events-none absolute left-[15%] top-[24%] h-40 w-[75%] rounded-full bg-[radial-gradient(ellipse,rgba(232,250,255,.32),rgba(207,243,255,.10)_45%,transparent_72%)] blur-2xl" style={{ animation: 'mlzMistSweep 11s ease-in-out infinite' }} />
          <div className="mlz-mist-sweep pointer-events-none absolute left-[5%] top-[46%] h-28 w-[68%] rounded-full bg-[radial-gradient(ellipse,rgba(232,250,255,.24),rgba(207,243,255,.07)_48%,transparent_74%)] blur-2xl" style={{ animation: 'mlzMistSweep 13.5s 2.2s ease-in-out infinite' }} />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
            <div className="flex flex-col gap-4 border-t border-white/14 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.24em] text-[#6BD8F2]">MASTER reference · geometrie uzamčena</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold tracking-[-.035em] text-white sm:text-3xl">LINEA® — sloupové mlžítko</h3>
              </div>
              <p className="max-w-xs text-xs leading-5 text-white/58">
                Webová motion vrstva je oddělená od produktu. Žádné AI přetváření konstrukce.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

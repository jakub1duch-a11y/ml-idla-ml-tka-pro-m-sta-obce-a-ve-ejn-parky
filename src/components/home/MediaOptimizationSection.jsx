import React from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Zap, BarChart3, Award } from 'lucide-react';

/**
 * MediaOptimizationSection — Highlights MLŽIDLA's professional approach to 
 * image and video quality, positioning premium visual storytelling as a 
 * key differentiator vs. competitors.
 * 
 * Features:
 * - Professional media handling (4K video, HDR stills)
 * - Content delivery optimization (CDN, webp, lazy-load)
 * - Before/after portfolio showcase pattern
 * - Trust signals (certifications, professional standards)
 */

const CAPABILITIES = [
  {
    icon: Video,
    title: '4K & HDR Videografie',
    desc: 'Profesionální video dokumentace realizací v 4K UltraHD. Drony, stabilní kameraman, color grading — vizuální kvalita, která prodává.',
    highlight: 'Každý projekt s videem'
  },
  {
    icon: Image,
    title: 'Studio a venkovní fotografie',
    desc: 'Detailní fotografie produktů, instalací a referencí. Profesionální osvětlení, retouš, optimalizace pro web i tisk.',
    highlight: '120+ profesionálních realizací'
  },
  {
    icon: Zap,
    title: 'Optimalizace pro rychlost',
    desc: 'WebP, AVIF, lazy-loading, CDN doručení. Stránky se nahrávají pod 2 sekundy na 4G — Google SEO miluje.',
    highlight: 'PageSpeed 95+ bodů'
  },
  {
    icon: BarChart3,
    title: 'Data-driven fotografie',
    desc: 'Měříme, co funguje. A/B testování vizuálů, heatmapping kliky, optimalizace konverzních míst.',
    highlight: '+45% CTR po optimalizaci'
  },
  {
    icon: Award,
    title: 'Značka ve vizuálu',
    desc: 'Konzistentní styl — od fotografie přes grafiku až po web. Cyan & slate paleta, profesionální typografie, rozpoznatelný look.',
    highlight: 'Brand identity guidelines'
  }
];

const PORTFOLIO_EXAMPLES = [
  {
    title: 'Mlžné sochy na náměstí Trutnova',
    category: '4K Videodokumentace',
    image: '/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp',
    stats: ['3x 4K kamery', 'Drone footage', '12min. finální film']
  },
  {
    title: 'Terasa restaurace na Praze 1',
    category: 'Profesionální fotografie',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6c64ac700_mlnprvek-mrak-mlzidla03.png',
    stats: ['Studio setup', 'Retouchované', 'Použito v adv.']
  }
];

export default function MediaOptimizationSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Profesionální přístup</p>
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-slate-900" style={{ letterSpacing: '-0.04em' }}>
              Vizuální kvalita,<br />
              která <span className="text-cyan-600">prodává.</span>
            </h2>
            <p className="max-w-2xl text-lg text-slate-600 font-light leading-relaxed">
              Od 4K videografie přes profesionální fotostudio až k SEO-optimalizované doručování — vše na úrovni top e-commerce značek.
            </p>
          </motion.div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all hover:bg-cyan-50/30"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-cyan-600" />
                </div>
                <h3 className="text-slate-900 font-semibold text-base mb-2">{cap.title}</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed mb-3">{cap.desc}</p>
                <div className="inline-block px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-mono font-semibold">
                  {cap.highlight}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Portfolio Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">Případy užití</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_EXAMPLES.map((ex, i) => (
              <motion.div
                key={ex.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-2xl transition-all"
              >
                <div className="aspect-video overflow-hidden bg-slate-200">
                  <img
                    src={ex.image}
                    alt={ex.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-cyan-600 mb-2">{ex.category}</p>
                  <h3 className="text-slate-900 font-semibold text-lg mb-3">{ex.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {ex.stats.map((stat) => (
                      <span key={stat} className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-light">
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200"
        >
          <h3 className="text-slate-900 font-semibold text-lg mb-6">Technické standardy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-slate-500 text-sm font-mono uppercase tracking-wide mb-2">Video</p>
              <ul className="space-y-1 text-sm text-slate-700 font-light">
                <li>• 4K UltraHD (2160p) @ 24/30fps</li>
                <li>• HDR color grading</li>
                <li>• Drone videography</li>
                <li>• Stabilní gimbal shots</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-mono uppercase tracking-wide mb-2">Fotografie</p>
              <ul className="space-y-1 text-sm text-slate-700 font-light">
                <li>• RAW → ProPhoto RGB</li>
                <li>• Studio & venkovní osvětlení</li>
                <li>• Profesionální retouš</li>
                <li>• Konsistentní bílý bod</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-mono uppercase tracking-wide mb-2">Web</p>
              <ul className="space-y-1 text-sm text-slate-700 font-light">
                <li>• WebP + AVIF formáty</li>
                <li>• Responsive srcset</li>
                <li>• Lazy-load + LQIP</li>
                <li>• CDN doručení (Akamai)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-slate-600 mb-4 font-light max-w-2xl mx-auto">
            Chcete, aby vaš projekt vypadal stejně profesionálně? Spojte se s námi na konzultaci — připravíme plán vizuální strategie na míru vaší značce.
          </p>
          <a
            href="/poptavka"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Začít konzultaci
          </a>
        </motion.div>
      </div>
    </section>
  );
}

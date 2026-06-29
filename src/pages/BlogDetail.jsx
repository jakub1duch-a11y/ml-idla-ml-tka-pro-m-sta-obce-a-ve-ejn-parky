import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { trackBlogPostView } from '@/lib/ga4';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
};

const FALLBACK_POSTS = [
  {
    id: 'f1', slug: 'evaporace-mikroklima', category: 'technika',
    title: 'Jak evaporace mění mikroklima veřejných prostorů',
    perex: 'Věda za mlhou: kapky 10–50 μm se odpařují ještě ve vzduchu a absorbují teplo z okolí.',
    content: `## Fyzika evaporace\n\nEvaporační chlazení je přirozený jev — voda přechází z kapalné fáze do plynné a přitom absorbuje tepelnou energii z okolního prostředí. Jeden litr vody při odpařování pohltí přibližně **680 Wh energie**, což odpovídá výkonu elektrického konvektoru.\n\n### Jak fungují mlžné trysky?\n\nModerní mlžné trysky HolmTec pracují s tlakem **70 bar** a rozprašují vodu na kapičky velikosti **10–50 mikrometrů**. Ty jsou tak drobné, že se zcela odpaří ještě ve vzduchu — ještě dřív, než dopadnou na zem.\n\n**Výsledek:** okolní vzduch se ochlazuje až o **9 °C** bez pocitu mokra, bez louží a bez kapek na oděvu.\n\n### Aplikace ve veřejném prostoru\n\nMlžné sochy a chladicí systémy nacházejí uplatnění zejména:\n- Na **náměstích a v parcích** — kde je lidí nejvíce\n- Na **dětských hřištích** — bezpečné materiály, potravinářská nerez\n- Na **festivalech a eventech** — rychlá instalace, vizuální dojem\n- V **průmyslových provozech** — ochrana pracovníků před tepelnou zátěží\n\n> „Vzduch se ochladí dřív, než si uvědomíte, co se děje."\n\n### Závěr\n\nEvaporační chlazení je ekologická alternativa ke klimatizaci — bez freonu, s minimální spotřebou energie a s vizuálním efektem, který přitahuje pozornost.`,
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    published_date: '2026-06-01', published: true, tags: ['technologie', 'evaporace', 'fyzika'],
  },
  {
    id: 'f2', slug: 'detske-hriste-mlhoviste', category: 'inspirace',
    title: 'Dětské hřiště a mlhoviště: vše co potřebujete vědět',
    perex: 'Bezpečnost, certifikace, materiály. Průvodce pro obce a správce hřišť.',
    content: `## Mlhoviště na dětských hřištích\n\nInstalace mlžného systému na dětském hřišti vyžaduje specifický přístup. Bezpečnost je na prvním místě.\n\n### Certifikované materiály\n\nVšechny naše systémy pro dětské instalace jsou vyrobeny z **potravinářské nerezové oceli AISI 316L** — stejného materiálu, ze kterého se vyrábí chirurgické nástroje a nádoby na potraviny.\n\n### Bezpečnostní prvky\n- Žádné ostré hrany — všechny svary jsou broušeny a leštěny\n- Voda bez chemikálií — pouze filtrovaná voda\n- Automatické vypnutí při detekci závady\n- Certifikát dle EN 1176 pro herní prvky\n\n### Spotřeba vody\n\nTypické mlhoviště pro hřiště (6 trysek) spotřebuje přibližně **8–12 litrů za hodinu** — srovnatelné se zavlažováním malého záhonu.`,
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
    published_date: '2026-05-01', published: true, tags: ['hřiště', 'bezpečnost', 'děti'],
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    // Try by slug first, then by id
    const tryLoad = async () => {
      let found = null;
      const all = await base44.entities.BlogPost.list().catch(() => []);
      found = (all || []).find(p => p.slug === slug || p.id === slug);

      if (!found) {
        // Check fallback
        found = FALLBACK_POSTS.find(p => p.slug === slug || p.id === slug);
      }

      if (!found) { setNotFound(true); return; }

      setPost(found);
      trackBlogPostView(found.title, found.slug || found.id, found.category);
      document.title = `${found.title} | Blog HolmTec`;

      // Related: same category, not self
      const rel = (all || []).filter(p => p.published && p.category === found.category && p.id !== found.id).slice(0, 3);
      setRelated(rel);
    };

    tryLoad().catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
      <Loader size={28} className="animate-spin text-cyan/40" />
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-white/40 text-lg mb-4">Článek nenalezen.</p>
        <Link to="/blog" className="text-cyan hover:underline">← Zpět na blog</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink pt-24">
      {/* Hero image */}
      {post.image_url && (
        <div className="relative h-72 lg:h-[460px] overflow-hidden">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Meta */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="-mt-20 relative z-10 pb-4">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 bg-cyan/20 border border-cyan/30 rounded-full text-xs font-mono text-cyan tracking-widest uppercase">
              {CATEGORY_LABELS[post.category] || post.category || 'Článek'}
            </span>
            {post.published_date && (
              <span className="text-xs font-mono text-white/40">{formatDate(post.published_date)}</span>
            )}
            {(post.tags || []).map(t => (
              <span key={t} className="text-xs font-mono text-white/25 border border-white/10 rounded-full px-2.5 py-1">#{t}</span>
            ))}
          </div>

          <h1 className="font-heading font-light text-3xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          {post.perex && (
            <p className="text-white/55 text-lg leading-relaxed font-light mb-8 border-l-2 border-cyan/40 pl-5">
              {post.perex}
            </p>
          )}
        </motion.div>

        {/* Content */}
        {post.content ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none pb-16
              prose-headings:font-light prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed
              prose-li:text-white/60 prose-li:font-light
              prose-strong:text-white prose-strong:font-medium
              prose-blockquote:border-cyan/40 prose-blockquote:text-white/40 prose-blockquote:italic
              prose-code:text-cyan prose-code:bg-white/5 prose-code:px-1.5 prose-code:rounded
              prose-a:text-cyan prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </motion.div>
        ) : (
          <div className="pb-16 text-white/40 font-light italic">Obsah článku brzy.</div>
        )}

        {/* Back + CTA */}
        <div className="py-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-mono">
            <ArrowLeft size={14} /> Zpět na blog
          </Link>
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20">
            Nezávazná poptávka <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-surface border-t border-white/8 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-6">Mohlo by vás zajímat</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.slug || r.id}`}
                  className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/30 transition-all bg-card_bg">
                  {r.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-mono text-cyan tracking-widest uppercase block mb-2">{CATEGORY_LABELS[r.category] || r.category}</span>
                    <h3 className="text-white font-light text-sm leading-snug group-hover:text-cyan/90 transition-colors line-clamp-2">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MegaCollectionCard from '@/components/layout/MegaCollectionCard';
import AllProductsImageCard from '@/components/common/AllProductsImageCard';
import GoIcon from '@/components/pronajem/GoIcon';

export default function MegaCatalogMenu({ open, onEnter, onLeave, onNavigate, collections, usageGroups, b2gLinks, customLink }) {
  const featured = collections.find((item) => item.featured);
  const rental = collections.find((item) => item.textOnly);
  const cards = collections.filter((item) => !item.featured && !item.textOnly);

  return (
    <AnimatePresence>
      {open &&
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
          onMouseEnter={onEnter} onMouseLeave={onLeave}
          className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background shadow-xl shadow-primary/10">
          <div className="mx-auto grid max-w-7xl gap-9 px-6 py-8 lg:grid-cols-[1.5fr_1fr] lg:px-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Produkty MLŽIDLA®</p>
              <p className="mt-1 text-sm text-muted-foreground">Mlžítka, mlžné brány a mlžné zóny pro městské ochlazování.</p>
              {featured && <div className="mt-5"><AllProductsImageCard to={featured.path} image={featured.image} compact onClick={onNavigate} /></div>}
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {cards.map((item) => <MegaCollectionCard key={item.label} item={item} onNavigate={onNavigate} />)}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {rental &&
                  <Link to={rental.path} onClick={onNavigate} className="group relative flex items-center justify-between overflow-visible rounded-full bg-primary py-3 pl-5 pr-20 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg">
                    {rental.label}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /><GoIcon variant="button" />
                  </Link>}
                <Link to={customLink.path} onClick={onNavigate} className="group flex items-center gap-3 rounded-full border border-border px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-lg">
                  <Sparkles size={17} className="text-secondary transition-transform group-hover:rotate-12" />
                  <span className="text-sm font-semibold text-foreground">{customLink.label}</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-border pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Mlžné zóny podle místa</p>
              <div className="mt-4 space-y-5">
                {usageGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{group.title}</p>
                    <div className="mt-2 grid gap-1">
                      {group.links.map((item) => (
                        <Link key={item.label + item.path} to={item.path} onClick={onNavigate} className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted">
                          <item.icon size={15} className="shrink-0 text-secondary" />
                          <span className="text-sm text-foreground/85 group-hover:text-foreground">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Pro města a architekty</p>
                <div className="mt-2 grid gap-1">
                  {b2gLinks.slice(0, 5).map((item) => (
                    <Link key={item.label} to={item.path} onClick={onNavigate} className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted">
                      <item.icon size={15} className="shrink-0 text-accent" />
                      <span className="text-sm text-foreground/85 group-hover:text-foreground">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
}